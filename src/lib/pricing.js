import { isIntInRange } from './validators.js'

export const MAX_QUANTITY = 10

function round2(n) {
  return Math.round(n * 100) / 100
}

export function calcTotal({ price, quantity, taxRate }) {
  if (!isIntInRange(quantity, 1, MAX_QUANTITY)) {
    return { subtotal: 0, tax: 0, total: 0 }
  }
  const subtotal = round2(price * Number(quantity))
  const tax = round2(subtotal * taxRate)
  return { subtotal, tax, total: round2(subtotal + tax) }
}

export function formatMoney(amount) {
  return '₹' + Number(amount || 0).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}
