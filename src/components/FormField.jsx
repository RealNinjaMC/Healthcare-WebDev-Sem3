export default function FormField({ label, name, type = 'text', value, onChange, error, options, ...rest }) {
  const inputClass = `w-full rounded-lg border bg-white px-3 py-2 text-slate-900 outline-none transition focus:ring-2 ${
    error ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-300 focus:border-brand-500 focus:ring-brand-200'
  }`

  let input
  if (options) {
    input = (
      <select id={name} name={name} value={value} onChange={onChange} className={inputClass} {...rest}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    )
  } else if (type === 'textarea') {
    input = <textarea id={name} name={name} value={value} onChange={onChange} rows={3} className={inputClass} {...rest} />
  } else {
    input = <input id={name} name={name} type={type} value={value} onChange={onChange} className={inputClass} {...rest} />
  }

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="text-sm font-medium text-slate-700">
        {label}
      </label>
      {input}
      {error && <p className="text-sm text-rose-600">{error}</p>}
    </div>
  )
}
