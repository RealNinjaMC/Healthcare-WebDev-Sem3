import { test } from 'node:test'
import assert from 'node:assert/strict'
import { calcTotal, formatMoney } from './pricing.js'

test('calcTotal adds tax to price times quantity', () => {
  assert.deepEqual(calcTotal({ price: 500, quantity: 2, taxRate: 0.18 }), {
    subtotal: 1000,
    tax: 180,
    total: 1180,
  })
})

test('calcTotal returns zeros for invalid quantity instead of NaN', () => {
  for (const quantity of ['abc', '', 0]) {
    assert.equal(calcTotal({ price: 500, quantity, taxRate: 0.18 }).total, 0)
  }
})

test('calcTotal rounds to 2 decimals', () => {
  assert.equal(calcTotal({ price: 99.99, quantity: 3, taxRate: 0.18 }).total, 353.96)
})

test('formatMoney uses rupee symbol and Indian grouping', () => {
  assert.equal(formatMoney(1180), '₹1,180.00')
})
