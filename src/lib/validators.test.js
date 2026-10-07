import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  isEmail,
  isPhone,
  isName,
  isStrongPassword,
  isFutureOrToday,
  isIntInRange,
  validate,
} from './validators.js'

function todayString() {
  const d = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

test('isPhone accepts 10-digit Indian mobile numbers only', () => {
  assert.equal(isPhone('9876543210'), true)
  assert.equal(isPhone('1234567890'), false)
  assert.equal(isPhone('98765'), false)
})

test('isEmail requires a domain with a dot', () => {
  assert.equal(isEmail('a@b.co'), true)
  assert.equal(isEmail('a@b'), false)
})

test('isName accepts letters and spaces, 2 to 50 chars', () => {
  assert.equal(isName('Asha Rao'), true)
  assert.equal(isName('A'), false)
  assert.equal(isName('R2D2'), false)
})

test('isStrongPassword needs 8+ chars with a letter and a digit', () => {
  assert.equal(isStrongPassword('abc12345'), true)
  assert.equal(isStrongPassword('abcdefgh'), false)
})

test('isFutureOrToday rejects past and empty dates', () => {
  assert.equal(isFutureOrToday(todayString()), true)
  assert.equal(isFutureOrToday('2000-01-01'), false)
  assert.equal(isFutureOrToday(''), false)
})

test('isIntInRange rejects empty, zero, text and decimals', () => {
  assert.equal(isIntInRange('3', 1, 10), true)
  for (const bad of ['', '0', 'abc', '2.5']) {
    assert.equal(isIntInRange(bad, 1, 10), false, `expected ${bad} to be rejected`)
  }
})

test('validate returns the first failing message per field', () => {
  const rules = { email: [[isEmail, 'Enter a valid email']] }
  assert.deepEqual(validate({ email: 'x' }, rules), { email: 'Enter a valid email' })
  assert.deepEqual(validate({ email: 'a@b.co' }, rules), {})
})

test('validate fails whitespace-only values on fields with rules', () => {
  const rules = { name: [[(v) => v.length > 0, 'Name is required']] }
  assert.deepEqual(validate({ name: '   ' }, rules), { name: 'Name is required' })
})
