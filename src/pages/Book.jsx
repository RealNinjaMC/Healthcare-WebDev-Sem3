import { useState } from 'react'
import FormField from '../components/FormField.jsx'
import { useToast } from '../hooks/useToast.js'
import { create } from '../lib/api.js'
import { calcTotal, formatMoney, MAX_QUANTITY } from '../lib/pricing.js'
import { isEmail, isFutureOrToday, isIntInRange, isName, isPhone, todayString, validate } from '../lib/validators.js'
import { APP } from '../config.js'

const ITEM_OPTIONS = APP.items.map((item) => ({ value: item.id, label: `${item.name} (${formatMoney(item.price)})` }))

const RULES = {
  name: [[isName, 'Name must be 2-50 letters']],
  email: [[isEmail, 'Enter a valid email address']],
  phone: [[isPhone, 'Enter a 10-digit mobile number starting with 6-9']],
  itemId: [[(value) => APP.items.some((item) => item.id === value), `Choose a ${APP.itemLabel.toLowerCase()}`]],
  date: [[isFutureOrToday, 'Choose today or a future date']],
  quantity: [[(value) => isIntInRange(value, 1, MAX_QUANTITY), `Quantity must be a whole number from 1 to ${MAX_QUANTITY}`]],
}

function findItem(itemId) {
  return APP.items.find((item) => item.id === itemId)
}

export default function Book({ user, setPage, initialItemId }) {
  const emptyForm = {
    name: user.name ?? '',
    email: user.email ?? '',
    phone: '',
    itemId: findItem(initialItemId) ? initialItemId : (APP.items[0]?.id ?? ''),
    date: '',
    quantity: '1',
    notes: '',
  }
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)
  const toast = useToast()

  const item = findItem(form.itemId)
  const { subtotal, tax, total } = calcTotal({ price: item?.price ?? 0, quantity: form.quantity, taxRate: APP.taxRate })

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
      await create(APP.entity.table, {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        itemId: item.id,
        itemName: item.name,
        date: form.date,
        quantity: Number(form.quantity),
        notes: form.notes.trim(),
        total,
        userId: user.id,
      })
      toast.show(`${APP.entity.singular} confirmed for ${form.date}`)
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
      <h1 className="text-3xl font-bold text-slate-900">New {APP.entity.singular.toLowerCase()}</h1>
      <p className="mt-1 text-slate-500">The summary on the right updates as you type.</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <form onSubmit={handleSubmit} noValidate className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:grid-cols-2 lg:col-span-2">
          <FormField label="Full name" name="name" value={form.name} onChange={handleChange} error={errors.name} />
          <FormField label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} />
          <FormField label="Phone" name="phone" type="tel" value={form.phone} onChange={handleChange} error={errors.phone} placeholder="9876543210" maxLength={10} />
          <FormField label={APP.itemLabel} name="itemId" value={form.itemId} onChange={handleChange} error={errors.itemId} options={ITEM_OPTIONS} />
          <FormField label="Date" name="date" type="date" value={form.date} onChange={handleChange} error={errors.date} min={todayString()} />
          <FormField
            label="Quantity"
            name="quantity"
            type="number"
            value={form.quantity}
            onChange={handleChange}
            error={errors.quantity}
            min={1}
            max={MAX_QUANTITY}
          />
          <div className="sm:col-span-2">
            <FormField label="Notes (optional)" name="notes" type="textarea" value={form.notes} onChange={handleChange} />
          </div>
          <div className="flex gap-3 sm:col-span-2">
            <button
              type="submit"
              disabled={busy}
              className="flex-1 rounded-lg bg-brand-600 py-2.5 font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
            >
              {busy ? 'Saving…' : `Confirm ${APP.entity.singular.toLowerCase()}`}
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
            <SummaryRow label={APP.itemLabel} value={item?.name ?? ''} />
            <SummaryRow label="Date" value={form.date} />
            <SummaryRow label="Price" value={formatMoney(item?.price)} />
            <SummaryRow label="Quantity" value={form.quantity} />
            <SummaryRow label="Subtotal" value={formatMoney(subtotal)} />
            <SummaryRow label={`GST (${Math.round(APP.taxRate * 100)}%)`} value={formatMoney(tax)} />
          </dl>
          <div className="mt-4 flex items-center justify-between border-t border-brand-200 pt-4">
            <span className="font-semibold text-slate-900">Total</span>
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
