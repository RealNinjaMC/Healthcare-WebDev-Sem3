import { test, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import { installMemoryStorage } from './testing/memoryStorage.js'
import { signUp, signIn, signOut, getUser } from './auth.js'

const asha = { name: 'Asha', email: 'a@x.com', password: 'secret123' }

beforeEach(installMemoryStorage)

test('signUp signs the user in without exposing the password hash', async () => {
  await signUp(asha)
  const user = await getUser()
  assert.deepEqual(Object.keys(user).sort(), ['email', 'id', 'name'])
  assert.equal(user.email, 'a@x.com')
})

test('signOut clears the session', async () => {
  await signUp(asha)
  await signOut()
  assert.equal(await getUser(), null)
})

test('signUp rejects a duplicate email', async () => {
  await signUp(asha)
  await assert.rejects(signUp(asha), { message: 'Email already registered' })
})

test('signIn rejects a wrong password', async () => {
  await signUp(asha)
  await signOut()
  await assert.rejects(signIn({ email: asha.email, password: 'wrong999' }), {
    message: 'Invalid email or password',
  })
})

test('signIn ignores email case and surrounding spaces', async () => {
  await signUp(asha)
  await signOut()
  const user = await signIn({ email: ' A@X.com ', password: asha.password })
  assert.equal(user.email, 'a@x.com')
})

test('getUser returns null for a session without a name', async () => {
  localStorage.setItem('app:session', '{}')
  assert.equal(await getUser(), null)
  localStorage.setItem('app:session', '123')
  assert.equal(await getUser(), null)
})
