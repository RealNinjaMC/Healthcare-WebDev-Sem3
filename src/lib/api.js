import { APP } from '../config.js'
import * as localDb from './db.js'
import * as localAuth from './auth.js'
import * as supabase from './supabase.js'

const backend = APP.useSupabase ? supabase : { ...localDb, ...localAuth }

export const { list, create, update, remove, signUp, signIn, signOut, getUser } = backend
