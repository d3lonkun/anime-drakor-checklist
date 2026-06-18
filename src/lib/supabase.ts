import { createClient, SupabaseClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

let _supabase: SupabaseClient | null = null

if (url && key) {
  _supabase = createClient(url, key)
}

export const supabase = _supabase
export const isSupabaseReady = !!_supabase
