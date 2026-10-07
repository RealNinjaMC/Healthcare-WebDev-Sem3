import { readTable, writeTable } from './db.js'

const SESSION_KEY = 'app:session'

function normalizeEmail(email) {
  return String(email).trim().toLowerCase()
}

async function hashPassword(password) {
  const bytes = new TextEncoder().encode(password)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

function startSession({ id, name, email }) {
  const user = { id, name, email }
  localStorage.setItem(SESSION_KEY, JSON.stringify(user))
  return user
}

export async function signUp({ name, email, password }) {
  const users = readTable('users')
  const cleanEmail = normalizeEmail(email)
  if (users.some((u) => u.email === cleanEmail)) {
    throw new Error('Email already registered')
  }
  const user = {
    id: crypto.randomUUID(),
    name: String(name).trim(),
    email: cleanEmail,
    passwordHash: await hashPassword(password),
  }
  writeTable('users', [...users, user])
  return startSession(user)
}

export async function signIn({ email, password }) {
  const cleanEmail = normalizeEmail(email)
  const passwordHash = await hashPassword(password)
  const user = readTable('users').find((u) => u.email === cleanEmail && u.passwordHash === passwordHash)
  if (!user) throw new Error('Invalid email or password')
  return startSession(user)
}

export async function signOut() {
  localStorage.removeItem(SESSION_KEY)
}

export async function getUser() {
  try {
    const user = JSON.parse(localStorage.getItem(SESSION_KEY))
    return typeof user?.name === 'string' ? user : null
  } catch {
    return null
  }
}
