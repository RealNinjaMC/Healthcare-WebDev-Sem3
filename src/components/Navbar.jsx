import { useState } from 'react'
import { APP } from '../config.js'

const LINKS = [
  { page: 'home', label: 'Home' },
  { page: 'book', label: 'Book' },
  { page: 'bookings', label: `My ${APP.entity.plural}` },
  { page: 'about', label: 'About' },
]

export default function Navbar({ page, setPage, user, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false)

  function go(target) {
    setPage(target)
    setMenuOpen(false)
  }

  function logout() {
    onLogout()
    setMenuOpen(false)
  }

  const linkClass = (target) =>
    `block rounded-lg px-3 py-2 text-left text-sm font-medium transition ${
      page === target ? 'bg-brand-100 text-brand-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <nav className="relative mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <button onClick={() => go('home')} className="text-xl font-bold text-brand-700">
          {APP.name}
        </button>

        <button
          className="rounded-lg p-2 text-2xl leading-none text-slate-700 md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? '✕' : '☰'}
        </button>

        <div
          className={`${menuOpen ? 'flex' : 'hidden'} absolute top-full right-0 left-0 flex-col gap-1 border-b border-slate-200 bg-white p-4 shadow-md md:static md:flex md:flex-row md:items-center md:border-0 md:bg-transparent md:p-0 md:shadow-none`}
        >
          {LINKS.map((link) => (
            <button key={link.page} onClick={() => go(link.page)} className={linkClass(link.page)}>
              {link.label}
            </button>
          ))}
          {user ? (
            <div className="flex items-center justify-between gap-2 md:ml-3">
              <span className="px-3 text-sm text-slate-500">Hi, {user.name.split(' ')[0]}</span>
              <button onClick={logout} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-100">
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => go('login')}
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 md:ml-3"
            >
              Login
            </button>
          )}
        </div>
      </nav>
    </header>
  )
}
