import { JikanAnime, JikanManga } from '@/types'

const JIKAN_BASE = 'https://api.jikan.moe/v4'

// Rate limit: max 3 req/sec, 60 req/min
const delay = (ms: number) => new Promise(r => setTimeout(r, ms))

export async function searchAnime(query: string, page = 1): Promise<{ data: JikanAnime[]; pagination: { has_next_page: boolean; last_visible_page: number } }> {
  await delay(400)
  const res = await fetch(`${JIKAN_BASE}/anime?q=${encodeURIComponent(query)}&page=${page}&limit=20&sfw=true`)
  if (!res.ok) throw new Error('Gagal mengambil data anime')
  return res.json()
}

export async function searchManga(query: string, page = 1, type?: string): Promise<{ data: JikanManga[]; pagination: { has_next_page: boolean; last_visible_page: number } }> {
  await delay(400)
  let url = `${JIKAN_BASE}/manga?q=${encodeURIComponent(query)}&page=${page}&limit=20&sfw=true`
  if (type) url += `&type=${type}`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Gagal mengambil data manga')
  return res.json()
}

export async function getAnimeById(id: number): Promise<{ data: JikanAnime }> {
  await delay(400)
  const res = await fetch(`${JIKAN_BASE}/anime/${id}`)
  if (!res.ok) throw new Error('Gagal mengambil detail anime')
  return res.json()
}

export async function getMangaById(id: number): Promise<{ data: JikanManga }> {
  await delay(400)
  const res = await fetch(`${JIKAN_BASE}/manga/${id}`)
  if (!res.ok) throw new Error('Gagal mengambil detail manga')
  return res.json()
}

export async function getTopAnime(page = 1): Promise<{ data: JikanAnime[] }> {
  await delay(400)
  const res = await fetch(`${JIKAN_BASE}/top/anime?page=${page}&limit=10`)
  if (!res.ok) throw new Error('Gagal mengambil top anime')
  return res.json()
}

export async function getSeasonalAnime(): Promise<{ data: JikanAnime[] }> {
  await delay(400)
  const res = await fetch(`${JIKAN_BASE}/seasons/now?limit=10`)
  if (!res.ok) throw new Error('Gagal mengambil anime musim ini')
  return res.json()
}

export async function getTopManga(page = 1, type?: string): Promise<{ data: JikanManga[] }> {
  await delay(400)
  let url = `${JIKAN_BASE}/top/manga?page=${page}&limit=10`
  if (type) url += `&type=${type}`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Gagal mengambil top manga')
  return res.json()
}
