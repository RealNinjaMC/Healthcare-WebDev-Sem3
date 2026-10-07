import { test, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import { installMemoryStorage } from './testing/memoryStorage.js'

beforeEach(installMemoryStorage)

test('api loads with Supabase disabled and empty keys', async () => {
  await assert.doesNotReject(import('./api.js'))
})

test('api uses the localStorage implementation by default', async () => {
  const api = await import('./api.js')
  await api.create('things', { a: 1 })
  const rows = await api.list('things')
  assert.equal(rows.length, 1)
  assert.equal(localStorage.getItem('app:things') !== null, true)
})

test('supabase functions explain missing configuration', async () => {
  const supabase = await import('./supabase.js')
  await assert.rejects(supabase.list('things'), /Supabase is not configured/)
})
