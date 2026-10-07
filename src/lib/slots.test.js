import { test } from 'node:test'
import assert from 'node:assert/strict'
import { isSlotTaken, isSlotPast, isSunday } from './slots.js'

const existing = [
  { id: 'a1', itemId: 'derma', date: '2026-10-10', slot: '10:00' },
  { id: 'a2', itemId: 'cardio', date: '2026-10-10', slot: '10:30' },
]

test('isSlotTaken finds a clash in the same department, date and time', () => {
  assert.equal(isSlotTaken(existing, { itemId: 'derma', date: '2026-10-10', slot: '10:00' }), true)
})

test('isSlotTaken allows the same time in another department or on another day', () => {
  assert.equal(isSlotTaken(existing, { itemId: 'general', date: '2026-10-10', slot: '10:00' }), false)
  assert.equal(isSlotTaken(existing, { itemId: 'derma', date: '2026-10-11', slot: '10:00' }), false)
})

test('isSlotTaken ignores the appointment being edited', () => {
  assert.equal(isSlotTaken(existing, { itemId: 'derma', date: '2026-10-10', slot: '10:00' }, 'a1'), false)
})

test('isSlotPast is true only for earlier times today', () => {
  const now = new Date(2026, 9, 10, 10, 15)
  assert.equal(isSlotPast('2026-10-10', '10:00', now), true)
  assert.equal(isSlotPast('2026-10-10', '10:30', now), false)
  assert.equal(isSlotPast('2026-10-11', '09:00', now), false)
})

test('isSunday spots Sundays from a yyyy-mm-dd date', () => {
  assert.equal(isSunday('2026-10-11'), true)
  assert.equal(isSunday('2026-10-10'), false)
  assert.equal(isSunday(''), false)
})
