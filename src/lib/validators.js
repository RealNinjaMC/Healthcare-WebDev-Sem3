const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE_PATTERN = /^[6-9]\d{9}$/
const NAME_PATTERN = /^[A-Za-z ]{2,50}$/
const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/
const INTEGER_PATTERN = /^\d+$/

export function isEmail(value) {
  return EMAIL_PATTERN.test(String(value).trim())
}

export function isPhone(value) {
  return PHONE_PATTERN.test(String(value).trim())
}

export function isName(value) {
  return NAME_PATTERN.test(String(value).trim())
}

export function isStrongPassword(value) {
  return PASSWORD_PATTERN.test(String(value))
}

export function todayString() {
  const now = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

export function isFutureOrToday(dateString) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return false
  return dateString >= todayString()
}

export function isIntInRange(value, min, max) {
  const text = String(value).trim()
  if (!INTEGER_PATTERN.test(text)) return false
  const number = Number(text)
  return number >= min && number <= max
}

export function validate(values, rules) {
  const errors = {}
  for (const [field, fieldRules] of Object.entries(rules)) {
    const value = values[field] ?? ''
    const isBlank = typeof value === 'string' && value.trim() === ''
    for (const [check, message] of fieldRules) {
      if (isBlank || !check(value, values)) {
        errors[field] = message
        break
      }
    }
  }
  return errors
}
