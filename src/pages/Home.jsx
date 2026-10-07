import Hero from '../components/Hero.jsx'
import Card from '../components/Card.jsx'
import { APP } from '../config.js'
import { formatMoney } from '../lib/pricing.js'

const STEPS = [
  { title: 'Create an account', text: 'Sign up once with your name and email.' },
  { title: 'Pick a doctor and time', text: 'Choose the department, a date and a free slot.' },
  { title: 'Walk in on time', text: 'Reschedule or cancel any time from My Appointments.' },
]

const TIMINGS = [
  { days: 'Monday to Saturday', hours: '9:00 am to 12:00 pm, 4:00 pm to 6:00 pm' },
  { days: 'Sunday', hours: 'Closed (emergencies only)' },
]

export default function Home({ setPage, onChooseItem }) {
  function scrollToServices() {
    document.getElementById('services')?.scrollIntoView()
  }

  return (
    <>
      <Hero
        title={APP.name}
        subtitle={APP.tagline}
        ctaLabel="Book an appointment"
        onCta={() => setPage('book')}
        secondaryLabel="See departments"
        onSecondary={scrollToServices}
      />

      <section id="services" className="scroll-mt-20 bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-3xl font-bold text-slate-900">Our departments</h2>
          <p className="mt-2 text-center text-slate-500">
            Consultation fee is paid at the clinic. Follow-up visits are {Math.round(APP.followUpDiscount * 100)}% off.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {APP.items.map((item) => (
              <Card key={item.id} title={item.name} text={item.description}>
                <p className="mt-3 text-sm font-medium text-slate-700">{item.doctor}</p>
                <p className="mt-2 text-2xl font-bold text-brand-700">{formatMoney(item.price)}</p>
                <button
                  onClick={() => onChooseItem(item.id)}
                  className="mt-4 rounded-lg bg-brand-600 px-4 py-2 font-semibold text-white transition hover:bg-brand-700"
                >
                  Book
                </button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center text-3xl font-bold text-slate-900">How it works</h2>
        <ol className="mt-10 grid gap-6 md:grid-cols-3">
          {STEPS.map((step, index) => (
            <li key={step.title} className="rounded-2xl border border-slate-200 bg-white p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 font-bold text-brand-700">
                {index + 1}
              </span>
              <h3 className="mt-4 font-semibold text-slate-900">{step.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 md:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Clinic timings</h2>
            <dl className="mt-6 space-y-4">
              {TIMINGS.map((row) => (
                <div key={row.days} className="flex flex-col border-b border-slate-200 pb-3 sm:flex-row sm:justify-between">
                  <dt className="font-semibold text-slate-800">{row.days}</dt>
                  <dd className="text-slate-600">{row.hours}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6">
            <h3 className="text-xl font-bold text-rose-800">Emergency?</h3>
            <p className="mt-2 text-rose-700">
              Don't book online. Call an ambulance on <strong>108</strong> or come straight to the clinic.
            </p>
            <p className="mt-4 text-sm text-rose-700">Front desk: {APP.contact.phone}</p>
          </div>
        </div>
      </section>
    </>
  )
}
