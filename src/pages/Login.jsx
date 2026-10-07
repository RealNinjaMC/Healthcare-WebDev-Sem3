import { useState } from 'react'
import FormField from '../components/FormField.jsx'
import { useToast } from '../hooks/useToast.js'
import { signIn, signUp } from '../lib/api.js'
import { isEmail, isName, isStrongPassword, validate } from '../lib/validators.js'
import { APP } from '../config.js'

const EMPTY_FORM = { name: '', email: '', password: '', confirm: '' }

const LOGIN_RULES = {
  email: [[isEmail, 'Enter a valid email address']],
  password: [[() => true, 'Password is required']],
}

const SIGNUP_RULES = {
  name: [[isName, 'Name must be 2-50 letters']],
  email: [[isEmail, 'Enter a valid email address']],
  password: [[isStrongPassword, 'At least 8 characters with a letter and a number']],
  confirm: [[(value, values) => value === values.password, 'Passwords do not match']],
}

export default function Login({ onLogin }) {
  const [isSignup, setIsSignup] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)
  const toast = useToast()

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
  }

  function switchMode() {
    setIsSignup((current) => !current)
    setErrors({})
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const foundErrors = validate(form, isSignup ? SIGNUP_RULES : LOGIN_RULES)
    setErrors(foundErrors)
    if (Object.keys(foundErrors).length > 0) return

    setBusy(true)
    try {
      const user = isSignup
        ? await signUp({ name: form.name.trim(), email: form.email, password: form.password })
        : await signIn({ email: form.email, password: form.password })
      setForm(EMPTY_FORM)
      onLogin(user)
    } catch (error) {
      toast.show(error.message, 'error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="flex justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">{isSignup ? 'Create your account' : 'Welcome back'}</h1>
        <p className="mt-1 text-sm text-slate-500">
          {isSignup ? `Join ${APP.name} to start booking.` : `Log in to manage your ${APP.entity.plural.toLowerCase()}.`}
        </p>

        <form onSubmit={handleSubmit} noValidate className="mt-6 flex flex-col gap-4">
          {isSignup && (
            <FormField label="Full name" name="name" value={form.name} onChange={handleChange} error={errors.name} autoComplete="name" />
          )}
          <FormField label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} autoComplete="email" />
          <FormField
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
            autoComplete={isSignup ? 'new-password' : 'current-password'}
          />
          {isSignup && (
            <FormField
              label="Confirm password"
              name="confirm"
              type="password"
              value={form.confirm}
              onChange={handleChange}
              error={errors.confirm}
              autoComplete="new-password"
            />
          )}
          <button
            type="submit"
            disabled={busy}
            className="rounded-lg bg-brand-600 py-2.5 font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
          >
            {busy ? 'Please wait…' : isSignup ? 'Create account' : 'Login'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          {isSignup ? 'Already have an account?' : 'New here?'}{' '}
          <button onClick={switchMode} className="font-semibold text-brand-600 hover:underline">
            {isSignup ? 'Login' : 'Create account'}
          </button>
        </p>
      </div>
    </section>
  )
}
