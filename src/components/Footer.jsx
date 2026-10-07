import { APP } from '../config.js'

const YEAR = new Date().getFullYear()

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 text-sm text-slate-600 md:grid-cols-3">
        <div>
          <p className="text-base font-bold text-brand-700">{APP.name}</p>
          <p className="mt-2">{APP.tagline}</p>
        </div>
        <address className="not-italic">
          <p className="font-semibold text-slate-800">Contact</p>
          <p className="mt-2">{APP.contact.email}</p>
          <p>{APP.contact.phone}</p>
          <p>{APP.contact.address}</p>
        </address>
        <p className="md:text-right">
          © {YEAR} {APP.name}
        </p>
      </div>
    </footer>
  )
}
