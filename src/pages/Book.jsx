import { useState } from 'react'
import FormField from '../components/FormField.jsx'
import { useToast } from '../hooks/useToast.js'
import { create, list } from '../lib/api.js'
import { calcFee, formatMoney } from '../lib/pricing.js'
import { isSlotPast, isSlotTaken, isSunday } from '../lib/slots.js'
import { isEmail, isFutureOrToday, isIntInRange, isName, isPhone, todayString, validate } from '../lib/validators.js'
import { APP } from '../config.js'

const DEPARTMENT_OPTIONS = APP.items.map((item) => ({ value: item.id, label: `${item.name} (${item.doctor})` }))
const SLOT_OPTIONS = [{ value: '', label: 'Pick a time' }, ...APP.slots.map((slot) => ({ value: slot, label: slot }))]
const GENDER_OPTIONS = [
  { value: '', label: 'Select' },
  { value: 'Female', label: 'Female' },
  { value: 'Male', label: 'Male' },
  { value: 'Other', label: 'Other' },
]
const VISIT_OPTIONS = [
  { value: 'new', label: 'New consultation' },
  { value: 'followup', label: `Follow-up (${Math.round(APP.followUpDiscount * 100)}% off)` },
]

const RULES = {
  name: [[isName, 'Name must be 2-50 letters']],
  email: [[isEmail, 'Enter a valid email address']],
  phone: [[isPhone, 'Enter a 10-digit mobile number starting with 6-9']],
  age: [[(value) => isIntInRange(value, 0, 120), 'Age must be a whole number from 0 to 120']],
  gender: [[(value) => GENDER_OPTIONS.some((option) => option.value && option.value === value), 'Select a gender']],
  itemId: [[(value) => APP.items.some((item) => item.id === value), 'Choose a department']],
  date: [
    [isFutureOrToday, 'Choose today or a future date'],
    [(value) => !isSunday(value), 'The clinic is closed on Sundays'],
  ],
  slot: [
    [(value) => APP.slots.includes(value), 'Pick a time slot'],
    [(value, values) => !isSlotPast(values.date, value), 'That time has already gone today, pick a later one'],
  ],
  symptoms: [[(value) => value.trim().length >= 5, 'Tell the doctor a little about the problem (at least 5 characters)']],
}

function findItem(itemId) {
  return APP.items.find((item) => item.id === itemId)
}

export default function Book({ user, setPage, initialItemId }) {
  const emptyForm = {
    name: user.name ?? '',
    email: user.email ?? '',
    phone: '',
    age: '',
    gender: '',
    itemId: findItem(initialItemId) ? initialItemId : (APP.items[0]?.id ?? ''),
    date: '',
    slot: '',
    visitType: 'new',
    symptoms: '',
  }
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)
  const toast = useToast()

  const item = findItem(form.itemId)
  const { fee, discount, total } = calcFee({ price: item?.price, visitType: form.visitType, followUpDiscount: APP.followUpDiscount })

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const foundErrors = validate(form, RULES)
    setErrors(foundErrors)
    if (Object.keys(foundErrors).length > 0) {
      toast.show('Please fix the highlighted fields', 'error')
      return
    }

    setBusy(true)
    try {
      const existing = await list(APP.entity.table)
      if (isSlotTaken(existing, form)) {
        setErrors({ slot: `${item.doctor} is already booked at ${form.slot} that day` })
        toast.show('That slot is taken, please pick another time', 'error')
        return
      }

      await create(APP.entity.table, {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        age: Number(form.age),
        gender: form.gender,
        itemId: item.id,
        itemName: item.name,
        doctor: item.doctor,
        date: form.date,
        slot: form.slot,
        visitType: form.visitType,
        symptoms: form.symptoms.trim(),
        total,
        userId: user.id,
      })
      toast.show(`Appointment with ${item.doctor} on ${form.date} at ${form.slot} confirmed`)
      setForm(emptyForm)
      setPage('bookings')
    } catch (error) {
      toast.show(error.message, 'error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold text-slate-900">Book an appointment</h1>
      <p className="mt-1 text-slate-500">Fill in the patient's details. You pay the fee at the clinic reception.</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <form onSubmit={handleSubmit} noValidate className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:grid-cols-2 lg:col-span-2">
          <FormField label="Patient name" name="name" value={form.name} onChange={handleChange} error={errors.name} />
          <FormField label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} />
          <FormField label="Phone" name="phone" type="tel" value={form.phone} onChange={handleChange} error={errors.phone} placeholder="9876543210" maxLength={10} />
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Age" name="age" type="number" value={form.age} onChange={handleChange} error={errors.age} min={0} max={120} />
            <FormField label="Gender" name="gender" value={form.gender} onChange={handleChange} error={errors.gender} options={GENDER_OPTIONS} />
          </div>
          <FormField label="Department" name="itemId" value={form.itemId} onChange={handleChange} error={errors.itemId} options={DEPARTMENT_OPTIONS} />
          <FormField label="Visit type" name="visitType" value={form.visitType} onChange={handleChange} options={VISIT_OPTIONS} />
          <FormField label="Date" name="date" type="date" value={form.date} onChange={handleChange} error={errors.date} min={todayString()} />
          <FormField label="Time" name="slot" value={form.slot} onChange={handleChange} error={errors.slot} options={SLOT_OPTIONS} />
          <div className="sm:col-span-2">
            <FormField
              label="Symptoms / reason for visit"
              name="symptoms"
              type="textarea"
              value={form.symptoms}
              onChange={handleChange}
              error={errors.symptoms}
              placeholder="e.g. fever and headache since 2 days"
            />
          </div>
          <div className="flex gap-3 sm:col-span-2">
            <button
              type="submit"
              disabled={busy}
              className="flex-1 rounded-lg bg-brand-600 py-2.5 font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
            >
              {busy ? 'Booking…' : 'Confirm appointment'}
            </button>
            <button
              type="button"
              onClick={() => {
                setForm(emptyForm)
                setErrors({})
              }}
              className="rounded-lg border border-slate-300 px-4 py-2.5 font-semibold text-slate-700 hover:bg-slate-100"
            >
              Reset
            </button>
          </div>
        </form>

        <aside className="h-fit rounded-2xl border border-brand-200 bg-brand-50 p-6 lg:sticky lg:top-24">
          <h2 className="text-lg font-semibold text-slate-900">Summary</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <SummaryRow label="Department" value={item?.name ?? ''} />
            <SummaryRow label="Doctor" value={item?.doctor ?? ''} />
            <SummaryRow label="Date" value={form.date} />
            <SummaryRow label="Time" value={form.slot} />
            <SummaryRow label="Consultation fee" value={formatMoney(fee)} />
            {discount > 0 && <SummaryRow label="Follow-up discount" value={`- ${formatMoney(discount)}`} />}
          </dl>
          <div className="mt-4 flex items-center justify-between border-t border-brand-200 pt-4">
            <span className="font-semibold text-slate-900">Pay at clinic</span>
            <span className="text-2xl font-bold text-brand-700">{formatMoney(total)}</span>
          </div>
        </aside>
      </div>
    </section>
  )
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-slate-500">{label}</dt>
      <dd className="text-right font-medium text-slate-800">{value}</dd>
    </div>
  )
}
