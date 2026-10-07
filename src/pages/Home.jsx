import Hero from '../components/Hero.jsx'
import Card from '../components/Card.jsx'
import { APP } from '../config.js'
import { formatMoney } from '../lib/pricing.js'

const STEPS = [
  { title: 'Create an account', text: 'Sign up with your name and email.' },
  { title: `Choose a ${APP.itemLabel.toLowerCase()}`, text: 'Pick what you need, a date and how many.' },
  { title: 'Confirm & manage', text: `See the live price, confirm, and edit or cancel from My ${APP.entity.plural}.` },
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
        ctaLabel="Book now"
        onCta={() => setPage('book')}
        secondaryLabel={`View ${APP.itemLabel.toLowerCase()}s`}
        onSecondary={scrollToServices}
      />

      <section id="services" className="scroll-mt-20 bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-3xl font-bold text-slate-900">Our {APP.itemLabel}s</h2>
          <p className="mt-2 text-center text-slate-500">Prices shown before {Math.round(APP.taxRate * 100)}% GST.</p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {APP.items.map((item) => (
              <Card key={item.id} title={item.name} text={item.description}>
                <p className="mt-4 text-2xl font-bold text-brand-700">{formatMoney(item.price)}</p>
                <button
                  onClick={() => onChooseItem(item.id)}
                  className="mt-4 rounded-lg bg-brand-600 px-4 py-2 font-semibold text-white transition hover:bg-brand-700"
                >
                  Book this
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
    </>
  )
}
