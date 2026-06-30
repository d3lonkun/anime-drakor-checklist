import { supabase, isSupabaseReady } from './supabase'
import { MediaEntry } from '@/types'

const STORAGE_KEY = 'otaku_tracker_data'
export const SYNC_EVENT = 'otaku-data-updated'

function dispatchSyncEvent() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(SYNC_EVENT))
  }
}

// ─────────────────────────────────────────────
// PENJAGA RACE CONDITION
// Menandai entry yang baru saja diubah/dihapus secara lokal,
// supaya proses sinkron otomatis (polling/realtime) tidak
// menimpanya dengan data lama dari cloud sebelum proses
// kirim ke Supabase benar-benar selesai & terkonfirmasi.
// ─────────────────────────────────────────────
const pendingWrites = new Map<string, number>()
const pendingDeletes = new Map<string, number>()
const GRACE_MS = 12000 // safety net kalau request gagal diam-diam (mis. koneksi putus)

function markPending(map: Map<string, number>, id: string) {
  map.set(id, Date.now())
}
function clearPending(map: Map<string, number>, id: string) {
  map.delete(id)
}
function isStillPending(map: Map<string, number>, id: string): boolean {
  const t = map.get(id)
  if (t === undefined) return false
  if (Date.now() - t > GRACE_MS) {
    map.delete(id)
    return false
  }
  return true
}

export async function syncEntry(entry: MediaEntry): Promise<void> {
  if (!isSupabaseReady || !supabase) return
  markPending(pendingWrites, entry.id)
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
    if (error) {
      console.error('[Sync] upsert error:', error.message)
      return // biarkan tetap "pending" — jangan sampai sinkron lain menimpanya
    }
    clearPending(pendingWrites, entry.id) // sudah confirmed tersimpan di cloud, aman ditimpa pull berikutnya
  } catch (err) {
    console.error('[Sync] syncEntry failed:', err)
  }
}

export async function deleteFromSupabase(id: string): Promise<void> {
  if (!isSupabaseReady || !supabase) return
  markPending(pendingDeletes, id)
  clearPending(pendingWrites, id)
  try {
    const { error } = await supabase.from('media_entries').delete().eq('id', id)
    if (error) console.error('[Sync] delete error:', error.message)
  } catch (err) {
    console.error('[Sync] delete failed:', err)
  } finally {
    clearPending(pendingDeletes, id)
  }
}

export async function pullFromSupabase(): Promise<MediaEntry[] | null> {
  if (!isSupabaseReady || !supabase) return null
  try {
    const { data, error } = await supabase
      .from('media_entries')
      .select('*')
      .order('updated_at', { ascending: false })
    if (error) {
      console.error('[Sync] pull error:', error.message)
      return null
    }
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
        score: e.score ?? null, notes: e.notes ?? '', start_date: e.start_date ?? null,
        end_date: e.end_date ?? null, synopsis: e.synopsis ?? null,
        genres: e.genres ?? [], year: e.year ?? null,
        mal_score: e.mal_score ?? null, mal_url: e.mal_url ?? null,
        created_at: e.created_at, updated_at: e.updated_at,
      }))
    )
    if (error) console.error('[Sync] pushAll error:', error.message)
  } catch (err) {
    console.error('[Sync] pushAll failed:', err)
  }
}

// Ambil dari Supabase, GABUNGKAN dengan perubahan lokal yang masih
// dalam proses kirim (bukan timpa total), baru simpan & beritahu UI.
export async function syncFromSupabaseToLocal(): Promise<boolean> {
  const remote = await pullFromSupabase()
  if (remote === null) return false

  const localRaw = localStorage.getItem(STORAGE_KEY)
  const local: MediaEntry[] = localRaw ? JSON.parse(localRaw) : []
  const localById = new Map(local.map(e => [e.id, e]))

  const merged: MediaEntry[] = []
  const seen = new Set<string>()

  for (const r of remote) {
    if (isStillPending(pendingDeletes, r.id)) continue // lagi proses hapus, jangan dimunculkan lagi
    if (isStillPending(pendingWrites, r.id)) {
      const localVersion = localById.get(r.id)
      if (localVersion) {
        merged.push(localVersion) // pertahankan versi lokal yang lebih baru
        seen.add(r.id)
        continue
      }
    }
    merged.push(r)
    seen.add(r.id)
  }

  // Entry baru yang masih dalam proses kirim & belum sempat muncul di cloud
  for (const l of local) {
    if (!seen.has(l.id) && isStillPending(pendingWrites, l.id) && !isStillPending(pendingDeletes, l.id)) {
      merged.push(l)
      seen.add(l.id)
    }
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(merged))
  dispatchSyncEvent()
  return true
}
