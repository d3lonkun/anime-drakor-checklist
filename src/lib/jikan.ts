import { JikanAnime, JikanManga } from '@/types'

const JIKAN_BASE = 'https://api.jikan.moe/v4'

const delay = (ms: number) => new Promise(r => setTimeout(r, ms))

// Fetch dengan retry otomatis (sampai 3x)
async function fetchWithRetry(url: string, retries = 3): Promise<Response> {
  let lastError: Error = new Error('Unknown error')

  for (let attempt = 0; attempt < retries; attempt++) {
    // Delay makin lama tiap percobaan: 800ms, 1600ms, 2400ms
    await delay(800 * (attempt + 1))

    try {
      const res = await fetch(url)

      // Rate limited → tunggu lebih lama lalu coba lagi
      if (res.status === 429) {
        await delay(3000)
        continue
      }

      // Server error → coba lagi
      if (res.status >= 500) {
        lastError = new Error(`Server error: ${res.status}`)
        continue
      }

      if (!res.ok) {
        throw new Error(`HTTP error: ${res.status}`)
      }

      return res
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err))
      if (attempt < retries - 1) continue
    }
  }

  throw lastError
}

export async function searchAnime(
  query: string,
  page = 1
): Promise<{ data: JikanAnime[]; pagination: { has_next_page: boolean; last_visible_page: number } }> {
  const url = `${JIKAN_BASE}/anime?q=${encodeURIComponent(query)}&page=${page}&limit=20&sfw=true`
  const res = await fetchWithRetry(url)
  return res.json()
}

export async function searchManga(
  query: string,
  page = 1,
  type?: string
): Promise<{ data: JikanManga[]; pagination: { has_next_page: boolean; last_visible_page: number } }> {
  let url = `${JIKAN_BASE}/manga?q=${encodeURIComponent(query)}&page=${page}&limit=20&sfw=true`
  if (type) url += `&type=${type}`
  const res = await fetchWithRetry(url)
  return res.json()
}

export async function getAnimeById(id: number): Promise<{ data: JikanAnime }> {
  const res = await fetchWithRetry(`${JIKAN_BASE}/anime/${id}`)
  return res.json()
}

export async function getMangaById(id: number): Promise<{ data: JikanManga }> {
  const res = await fetchWithRetry(`${JIKAN_BASE}/manga/${id}`)
  return res.json()
}

export async function getTopAnime(page = 1): Promise<{ data: JikanAnime[] }> {
  const res = await fetchWithRetry(`${JIKAN_BASE}/top/anime?page=${page}&limit=10`)
  return res.json()
}

export async function getSeasonalAnime(): Promise<{ data: JikanAnime[] }> {
  const res = await fetchWithRetry(`${JIKAN_BASE}/seasons/now?limit=10`)
  return res.json()
}

export async function getTopManga(page = 1, type?: string): Promise<{ data: JikanManga[] }> {
  let url = `${JIKAN_BASE}/top/manga?page=${page}&limit=10`
  if (type) url += `&type=${type}`
  const res = await fetchWithRetry(url)
  return res.json()
}
