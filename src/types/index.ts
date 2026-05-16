export type MediaCategory = 'anime' | 'manga' | 'drakor' | 'dorama'
export type MediaSubtype = 
  | 'anime' 
  | 'manga' 
  | 'manhwa' 
  | 'manhua' 
  | 'komik_indo' 
  | 'novel' 
  | 'webtoon'
  | 'drakor' 
  | 'dorama'

export type WatchStatus = 'watching' | 'completed' | 'on_hold' | 'dropped' | 'plan_to_watch'

export interface MediaEntry {
  id: string
  mal_id?: number
  title: string
  title_en?: string
  title_native?: string
  image_url?: string
  category: MediaCategory
  subtype: MediaSubtype
  status: WatchStatus
  progress: number        // episode/chapter yang sudah ditonton/baca
  total: number | null    // total episode/chapter (null = ongoing/unknown)
  score: number | null    // 1-10
  notes: string
  start_date?: string
  end_date?: string
  created_at: string
  updated_at: string
  // MAL data
  synopsis?: string
  genres?: string[]
  year?: number
  mal_score?: number
  mal_url?: string
}

export interface JikanAnime {
  mal_id: number
  title: string
  title_english?: string
  title_japanese?: string
  images: {
    jpg: { image_url: string; large_image_url?: string }
    webp?: { image_url: string; large_image_url?: string }
  }
  synopsis?: string
  episodes?: number
  chapters?: number
  volumes?: number
  score?: number
  year?: number
  genres?: Array<{ name: string }>
  url?: string
  type?: string
  status?: string
  aired?: { string?: string }
  published?: { string?: string }
}

export interface JikanManga {
  mal_id: number
  title: string
  title_english?: string
  title_japanese?: string
  images: {
    jpg: { image_url: string; large_image_url?: string }
    webp?: { image_url: string; large_image_url?: string }
  }
  synopsis?: string
  chapters?: number
  volumes?: number
  score?: number
  year?: number
  genres?: Array<{ name: string }>
  url?: string
  type?: string
  status?: string
  published?: { string?: string }
}

export interface Stats {
  total: number
  watching: number
  completed: number
  on_hold: number
  dropped: number
  plan_to_watch: number
  episodes_watched: number
  chapters_read: number
}
