export function isSlotTaken(appointments, { itemId, date, slot }, ignoreId) {
  return appointments.some(
    (row) => row.id !== ignoreId && row.itemId === itemId && row.date === date && row.slot === slot,
  )
}

export function isSlotPast(date, slot, now = new Date()) {
  const pad = (n) => String(n).padStart(2, '0')
  const today = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
  if (date !== today) return false
  return slot <= `${pad(now.getHours())}:${pad(now.getMinutes())}`
}

export function isSunday(date) {
  const [year, month, day] = date.split('-').map(Number)
  if (!year || !month || !day) return false
  return new Date(year, month - 1, day).getDay() === 0
}
