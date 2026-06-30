import { MediaEntry, MediaCategory, WatchStatus, Stats } from '@/types'
import { syncEntry, deleteFromSupabase } from './sync'

const STORAGE_KEY = 'otaku_tracker_data'

export function getAllEntries(): MediaEntry[] {
  if (typeof window === 'undefined') return []
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function getEntriesByCategory(category: MediaCategory): MediaEntry[] {
  return getAllEntries().filter(e => e.category === category)
}

export function getEntryById(id: string): MediaEntry | undefined {
  return getAllEntries().find(e => e.id === id)
}

export function getFavoriteEntries(): MediaEntry[] {
  return getAllEntries().filter(e => e.favorite)
}

export function saveEntry(entry: MediaEntry): void {
  const entries = getAllEntries()
  const updated = { ...entry, updated_at: new Date().toISOString() }
  const idx = entries.findIndex(e => e.id === entry.id)
  if (idx >= 0) entries[idx] = updated
  else entries.push(updated)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  syncEntry(updated).catch(console.error)
}

export function deleteEntry(id: string): void {
  const entries = getAllEntries().filter(e => e.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  deleteFromSupabase(id).catch(console.error)
}

export function updateProgress(id: string, progress: number): void {
  const entries = getAllEntries()
  const idx = entries.findIndex(e => e.id === id)
  if (idx >= 0) {
    entries[idx].progress = progress
    entries[idx].updated_at = new Date().toISOString()
    if (entries[idx].total && progress >= entries[idx].total!) {
      entries[idx].status = 'completed'
      entries[idx].end_date = new Date().toISOString().split('T')[0]
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
    syncEntry(entries[idx]).catch(console.error)
  }
}

export function updateStatus(id: string, status: WatchStatus): void {
  const entries = getAllEntries()
  const idx = entries.findIndex(e => e.id === id)
  if (idx >= 0) {
    entries[idx].status = status
    entries[idx].updated_at = new Date().toISOString()
    if (status === 'watching' && !entries[idx].start_date) {
      entries[idx].start_date = new Date().toISOString().split('T')[0]
    }
    if (status === 'completed') {
      entries[idx].end_date = new Date().toISOString().split('T')[0]
      if (entries[idx].total) entries[idx].progress = entries[idx].total!
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
    syncEntry(entries[idx]).catch(console.error)
  }
}

export function toggleFavorite(id: string): void {
  const entries = getAllEntries()
  const idx = entries.findIndex(e => e.id === id)
  if (idx >= 0) {
    entries[idx].favorite = !entries[idx].favorite
    entries[idx].updated_at = new Date().toISOString()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
    syncEntry(entries[idx]).catch(console.error)
  }
}

export function getStats(category?: MediaCategory): Stats {
  const entries = category ? getEntriesByCategory(category) : getAllEntries()
  return {
    total: entries.length,
    watching: entries.filter(e => e.status === 'watching').length,
    completed: entries.filter(e => e.status === 'completed').length,
    on_hold: entries.filter(e => e.status === 'on_hold').length,
    dropped: entries.filter(e => e.status === 'dropped').length,
    plan_to_watch: entries.filter(e => e.status === 'plan_to_watch').length,
    episodes_watched: entries
      .filter(e => e.category === 'anime' || e.category === 'drakor' || e.category === 'dorama')
      .reduce((sum, e) => sum + e.progress, 0),
    chapters_read: entries
      .filter(e => e.category === 'manga')
      .reduce((sum, e) => sum + e.progress, 0),
  }
}

export function exportData(): string {
  return JSON.stringify(getAllEntries(), null, 2)
}

export function importData(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString)
    if (!Array.isArray(data)) return false
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    return true
  } catch {
    return false
  }
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export const STATUS_LABELS: Record<WatchStatus, string> = {
  watching: 'Sedang Ditonton',
  completed: 'Selesai',
  on_hold: 'Ditunda',
  dropped: 'Dihentikan',
  plan_to_watch: 'Mau Nonton',
}

export const STATUS_COLORS: Record<WatchStatus, string> = {
  watching: 'text-accent-blue',
  completed: 'text-accent-green',
  on_hold: 'text-accent-yellow',
  dropped: 'text-red-500',
  plan_to_watch: 'text-accent-purple',
}

export const STATUS_BG: Record<WatchStatus, string> = {
  watching: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  completed: 'bg-green-500/20 text-green-400 border-green-500/30',
  on_hold: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  dropped: 'bg-red-500/20 text-red-400 border-red-500/30',
  plan_to_watch: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
}
