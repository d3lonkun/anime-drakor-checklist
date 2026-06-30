import { supabase, isSupabaseReady } from './supabase'
import { MediaEntry } from '@/types'

const STORAGE_KEY = 'otaku_tracker_data'
export const SYNC_EVENT = 'otaku-data-updated'

function dispatchSyncEvent() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(SYNC_EVENT))
  }
}

export async function syncEntry(entry: MediaEntry): Promise<void> {
  if (!isSupabaseReady || !supabase) return
  try {
    const { error } = await supabase.from('media_entries').upsert({
      id: entry.id,
      mal_id: entry.mal_id ?? null,
      title: entry.title,
      title_en: entry.title_en ?? null,
      title_native: entry.title_native ?? null,
      image_url: entry.image_url ?? null,
      category: entry.category,
      subtype: entry.subtype,
      status: entry.status,
      progress: entry.progress,
      total: entry.total ?? null,
      score: entry.score ?? null,
      notes: entry.notes ?? '',
      favorite: entry.favorite ?? false,
      start_date: entry.start_date ?? null,
      end_date: entry.end_date ?? null,
      synopsis: entry.synopsis ?? null,
      genres: entry.genres ?? [],
      year: entry.year ?? null,
      mal_score: entry.mal_score ?? null,
      mal_url: entry.mal_url ?? null,
      created_at: entry.created_at,
      updated_at: entry.updated_at,
    })
    if (error) console.error('[Sync] upsert error:', error.message)
  } catch (err) {
    console.error('[Sync] syncEntry failed:', err)
  }
}

export async function deleteFromSupabase(id: string): Promise<void> {
  if (!isSupabaseReady || !supabase) return
  try {
    const { error } = await supabase.from('media_entries').delete().eq('id', id)
    if (error) console.error('[Sync] delete error:', error.message)
  } catch (err) {
    console.error('[Sync] delete failed:', err)
  }
}

export async function pullFromSupabase(): Promise<MediaEntry[] | null> {
  if (!isSupabaseReady || !supabase) return null
  try {
    const { data, error } = await supabase
      .from('media_entries')
      .select('*')
      .order('updated_at', { ascending: false })
    if (error) { console.error('[Sync] pull error:', error.message); return null }
    return (data ?? []) as MediaEntry[]
  } catch (err) {
    console.error('[Sync] pull failed:', err)
    return null
  }
}

export async function pushAllToSupabase(entries: MediaEntry[]): Promise<void> {
  if (!isSupabaseReady || !supabase || entries.length === 0) return
  try {
    const { error } = await supabase.from('media_entries').upsert(
      entries.map(e => ({
        id: e.id, mal_id: e.mal_id ?? null, title: e.title,
        title_en: e.title_en ?? null, title_native: e.title_native ?? null,
        image_url: e.image_url ?? null, category: e.category, subtype: e.subtype,
        status: e.status, progress: e.progress, total: e.total ?? null,
        score: e.score ?? null, notes: e.notes ?? '', favorite: e.favorite ?? false,
        start_date: e.start_date ?? null, end_date: e.end_date ?? null,
        synopsis: e.synopsis ?? null, genres: e.genres ?? [], year: e.year ?? null,
        mal_score: e.mal_score ?? null, mal_url: e.mal_url ?? null,
        created_at: e.created_at, updated_at: e.updated_at,
      }))
    )
    if (error) console.error('[Sync] pushAll error:', error.message)
  } catch (err) {
    console.error('[Sync] pushAll failed:', err)
  }
}

export async function syncFromSupabaseToLocal(): Promise<boolean> {
  const data = await pullFromSupabase()
  if (data === null) return false
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  dispatchSyncEvent()
  return true
}
