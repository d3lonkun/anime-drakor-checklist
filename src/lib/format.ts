/**
 * Format waktu relatif dalam Bahasa Indonesia, contoh: "2 jam yang lalu"
 */
export function timeAgo(dateString: string): string {
  const now = Date.now()
  const then = new Date(dateString).getTime()
  const diffMs = Math.max(0, now - then)

  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour
  const week = 7 * day
  const month = 30 * day

  if (diffMs < minute) return 'Baru saja'
  if (diffMs < hour) return `${Math.floor(diffMs / minute)} menit yang lalu`
  if (diffMs < day) return `${Math.floor(diffMs / hour)} jam yang lalu`
  if (diffMs < week) {
    const d = Math.floor(diffMs / day)
    return d === 1 ? 'Kemarin' : `${d} hari yang lalu`
  }
  if (diffMs < month) return `${Math.floor(diffMs / week)} minggu yang lalu`
  return `${Math.floor(diffMs / month)} bulan yang lalu`
}

// Estimasi rata-rata durasi per episode (menit). Boleh disesuaikan.
const MINUTES_PER_EP: Record<string, number> = {
  anime: 24,
  dorama: 24,
  drakor: 62,
  // manga sengaja tidak dihitung karena chapter bukan satuan waktu
}

/**
 * Estimasi total jam tontonan berdasarkan progress episode.
 * Ini perkiraan kasar, bukan angka pasti.
 */
export function estimateDurationHours(entries: { category: string; progress: number }[]): number {
  const totalMinutes = entries.reduce((sum, e) => {
    const perEp = MINUTES_PER_EP[e.category]
    if (!perEp) return sum
    return sum + e.progress * perEp
  }, 0)
  return Math.round(totalMinutes / 60)
}
