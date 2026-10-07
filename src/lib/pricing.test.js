import { test } from 'node:test'
import assert from 'node:assert/strict'
import { calcFee, formatMoney } from './pricing.js'

test('calcFee charges the full fee for a new visit', () => {
  assert.deepEqual(calcFee({ price: 600, visitType: 'new', followUpDiscount: 0.5 }), {
    fee: 600,
    discount: 0,
    total: 600,
  })
})

test('calcFee takes the follow-up discount off', () => {
  assert.deepEqual(calcFee({ price: 600, visitType: 'followup', followUpDiscount: 0.5 }), {
    fee: 600,
    discount: 300,
    total: 300,
  })
})

test('calcFee rounds to 2 decimals', () => {
  assert.equal(calcFee({ price: 499.99, visitType: 'followup', followUpDiscount: 0.3 }).total, 349.99)
})

test('calcFee treats a missing price as zero', () => {
  assert.equal(calcFee({ price: undefined, visitType: 'new', followUpDiscount: 0.5 }).total, 0)
})

test('formatMoney uses rupee symbol and Indian grouping', () => {
  assert.equal(formatMoney(1180), '₹1,180.00')
})
