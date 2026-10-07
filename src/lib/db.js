function storageKey(table) {
  return `app:${table}`
}

export function readTable(table) {
  try {
    const rows = JSON.parse(localStorage.getItem(storageKey(table)))
    return Array.isArray(rows) ? rows : []
  } catch {
    return []
  }
}

export function writeTable(table, rows) {
  localStorage.setItem(storageKey(table), JSON.stringify(rows))
}

export async function list(table) {
  return [...readTable(table)].sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
}

export async function create(table, data) {
  const row = { id: crypto.randomUUID(), createdAt: new Date().toISOString(), ...data }
  writeTable(table, [row, ...readTable(table)])
  return row
}

export async function update(table, id, patch) {
  const rows = readTable(table)
  const index = rows.findIndex((row) => row.id === id)
  if (index === -1) throw new Error('Record not found')
  rows[index] = { ...rows[index], ...patch, id }
  writeTable(table, rows)
  return rows[index]
}

export async function remove(table, id) {
  writeTable(table, readTable(table).filter((row) => row.id !== id))
}
