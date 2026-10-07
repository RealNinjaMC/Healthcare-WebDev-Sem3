import { APP } from '../config.js'

const TECH_STACK = [
  { name: 'HTML5 & semantic layout', detail: 'header, nav, main, section, article, footer' },
  { name: 'Tailwind CSS', detail: 'utility classes, Flexbox, Grid, responsive breakpoints' },
  { name: 'JavaScript (ES6+)', detail: 'modules, async/await, array methods, Regex validation' },
  { name: 'React + Vite', detail: 'components, props, useState, useEffect, custom hooks' },
  { name: 'localStorage / Supabase', detail: 'CRUD data layer with authentication' },
]

export default function About() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-3xl font-bold text-slate-900">About {APP.name}</h1>
      <p className="mt-3 max-w-3xl text-slate-600">{APP.tagline}</p>

      <h2 className="mt-12 text-2xl font-semibold text-slate-900">Our team</h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {APP.team.map((member) => (
          <div key={member.name} className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-2xl font-bold text-brand-700">
              {member.name.charAt(0)}
            </div>
            <h3 className="mt-4 font-semibold text-slate-900">{member.name}</h3>
            <p className="text-sm text-slate-500">{member.role}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-12 text-2xl font-semibold text-slate-900">Built with</h2>
      <ul className="mt-6 grid gap-4 md:grid-cols-2">
        {TECH_STACK.map((tech) => (
          <li key={tech.name} className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="font-semibold text-slate-900">{tech.name}</p>
            <p className="text-sm text-slate-500">{tech.detail}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
