function round2(n) {
  return Math.round(n * 100) / 100
}

export function calcFee({ price, visitType, followUpDiscount }) {
  const fee = round2(Number(price) || 0)
  const discount = visitType === 'followup' ? round2(fee * followUpDiscount) : 0
  return { fee, discount, total: round2(fee - discount) }
}

export function formatMoney(amount) {
  return '₹' + Number(amount || 0).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}
