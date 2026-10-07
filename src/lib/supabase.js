import { createClient } from '@supabase/supabase-js'
import { APP } from '../config.js'

let client = null

function getClient() {
  if (!APP.supabaseUrl || !APP.supabaseAnonKey) {
    throw new Error('Supabase is not configured: set supabaseUrl and supabaseAnonKey in config.js')
  }
  if (!client) client = createClient(APP.supabaseUrl, APP.supabaseAnonKey)
  return client
}

function unwrap({ data, error }) {
  if (error) throw new Error(error.message)
  return data
}

function toUser(user) {
  if (!user) return null
  return { id: user.id, name: user.user_metadata?.name ?? '', email: user.email }
}

export async function list(table) {
  return unwrap(await getClient().from(table).select('*').order('createdAt', { ascending: false }))
}

export async function create(table, data) {
  return unwrap(await getClient().from(table).insert(data).select().single())
}

export async function update(table, id, patch) {
  return unwrap(await getClient().from(table).update(patch).eq('id', id).select().single())
}

export async function remove(table, id) {
  unwrap(await getClient().from(table).delete().eq('id', id))
}

export async function signUp({ name, email, password }) {
  const data = unwrap(
    await getClient().auth.signUp({
      email: String(email).trim().toLowerCase(),
      password,
      options: { data: { name: String(name).trim() } },
    }),
  )
  return toUser(data.user)
}

export async function signIn({ email, password }) {
  const data = unwrap(
    await getClient().auth.signInWithPassword({ email: String(email).trim().toLowerCase(), password }),
  )
  return toUser(data.user)
}

export async function signOut() {
  unwrap(await getClient().auth.signOut())
}

export async function getUser() {
  const { data } = await getClient().auth.getSession()
  return toUser(data.session?.user)
}
