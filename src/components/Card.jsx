export default function Card({ title, text, children }) {
  return (
    <article className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      {text && <p className="mt-2 flex-1 text-sm text-slate-600">{text}</p>}
      {children}
    </article>
  )
}
