import { test, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import { installMemoryStorage } from './testing/memoryStorage.js'
import { list, create, update, remove } from './db.js'

beforeEach(installMemoryStorage)

test('create adds a row with id and createdAt that list returns', async () => {
  const row = await create('bookings', { name: 'Asha' })
  const rows = await list('bookings')
  assert.equal(rows.length, 1)
  assert.equal(rows[0].name, 'Asha')
  assert.equal(rows[0].id, row.id)
  assert.ok(rows[0].createdAt)
})

test('list returns newest rows first', async () => {
  await create('bookings', { name: 'first', createdAt: '2026-01-01T00:00:00.000Z' })
  await create('bookings', { name: 'second', createdAt: '2026-02-01T00:00:00.000Z' })
  const rows = await list('bookings')
  assert.deepEqual(rows.map((r) => r.name), ['second', 'first'])
})

test('update changes fields and list reflects it', async () => {
  const row = await create('bookings', { slot: '09:00' })
  const updated = await update('bookings', row.id, { slot: '10:30' })
  assert.equal(updated.slot, '10:30')
  assert.equal((await list('bookings'))[0].slot, '10:30')
})

test('update rejects an unknown id', async () => {
  await assert.rejects(update('bookings', 'missing', { a: 1 }), { message: 'Record not found' })
})

test('remove deletes the row', async () => {
  const row = await create('bookings', { name: 'x' })
  await remove('bookings', row.id)
  assert.deepEqual(await list('bookings'), [])
})

test('list treats corrupt stored JSON as empty', async () => {
  localStorage.setItem('app:bookings', '{not json')
  assert.deepEqual(await list('bookings'), [])
})
