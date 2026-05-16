'use client'
import { useState, useCallback } from 'react'
import Image from 'next/image'
import { Search, Plus, Check, Star, X } from 'lucide-react'
import { MediaCategory, MediaEntry, MediaSubtype, JikanAnime, JikanManga } from '@/types'
import { searchAnime, searchManga } from '@/lib/jikan'
import { getAllEntries, saveEntry, generateId } from '@/lib/storage'

interface Props {
  category: MediaCategory
  onAdd: () => void
  onClose: () => void
}

export default function SearchMALModal({ category, onAdd, onClose }: Props) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<(JikanAnime | JikanManga)[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [added, setAdded] = useState<Set<number>>(new Set())
  const [mangaType, setMangaType] = useState('')

  const existingMalIds = new Set(getAllEntries().filter(e => e.mal_id).map(e => e.mal_id!))

  async function handleSearch() {
    if (!query.trim()) return
    setLoading(true)
    setError('')
    try {
      let res
      if (category === 'anime') {
        res = await searchAnime(query)
      } else {
        res = await searchManga(query, 1, mangaType || undefined)
      }
      setResults(res.data || [])
      if (!res.data?.length) setError('Tidak ditemukan. Coba kata kunci lain.')
    } catch (e) {
      setError('Gagal mengambil data. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  function handleAdd(item: JikanAnime | JikanManga) {
    const isAnime = category === 'anime'
    const animeItem = item as JikanAnime
    const mangaItem = item as JikanManga

    const subtypeMap: Record<string, MediaSubtype> = {
      'Manga': 'manga',
      'Manhwa': 'manhwa',
      'Manhua': 'manhua',
      'One-shot': 'manga',
      'Doujin': 'manga',
      'Novel': 'novel',
      'Light Novel': 'novel',
    }

    const entry: MediaEntry = {
      id: generateId(),
      mal_id: item.mal_id,
      title: item.title,
      title_en: isAnime ? animeItem.title_english : mangaItem.title_english,
      title_native: isAnime ? animeItem.title_japanese : mangaItem.title_japanese,
      image_url: item.images?.jpg?.large_image_url || item.images?.jpg?.image_url,
      category,
      subtype: isAnime ? 'anime' : (subtypeMap[mangaItem.type || ''] || 'manga'),
      status: 'plan_to_watch',
      progress: 0,
      total: isAnime ? (animeItem.episodes || null) : (mangaItem.chapters || null),
      score: null,
      notes: '',
      mal_id_confirmed: true,
      synopsis: item.synopsis?.slice(0, 500),
      genres: item.genres?.map(g => g.name) || [],
      year: item.year,
      mal_score: item.score,
      mal_url: item.url,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as MediaEntry

    saveEntry(entry)
    setAdded(prev => new Set(prev).add(item.mal_id))
    onAdd()
  }

  const MANGA_TYPES = [
    { value: '', label: 'Semua' },
    { value: 'manga', label: 'Manga' },
    { value: 'manhwa', label: 'Manhwa' },
    { value: 'manhua', label: 'Manhua' },
    { value: 'novel', label: 'Novel' },
    { value: 'lightnovel', label: 'Light Novel' },
    { value: 'oneshot', label: 'One-shot' },
  ]

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()} style={{ maxHeight: '95vh' }}>
        <div className="w-10 h-1 bg-[#2a3050] rounded-full mx-auto mb-4" />

        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-base text-slate-100" style={{ fontFamily: 'Syne, sans-serif' }}>
            Cari di MyAnimeList
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-xl text-slate-500 hover:bg-white/5">
            <X size={18} />
          </button>
        </div>

        {/* Manga type filter */}
        {category === 'manga' && (
          <div className="flex gap-1.5 overflow-x-auto pb-2 mb-3" style={{ scrollbarWidth: 'none' }}>
            {MANGA_TYPES.map(t => (
              <button
                key={t.value}
                onClick={() => setMangaType(t.value)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                  mangaType === t.value
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                    : 'border-[#2a3050] text-slate-500 bg-[#1f2437]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}

        {/* Search box */}
        <div className="flex gap-2 mb-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder={`Cari ${category === 'anime' ? 'anime' : 'manga/komik'}...`}
              className="search-input"
              autoFocus
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white font-medium text-sm active:bg-blue-700 flex-shrink-0"
          >
            {loading ? '...' : 'Cari'}
          </button>
        </div>

        {error && <p className="text-center text-sm text-slate-500 py-4">{error}</p>}

        {/* Results */}
        <div className="space-y-2 overflow-y-auto" style={{ maxHeight: 'calc(95vh - 220px)' }}>
          {results.map(item => {
            const isAdded = added.has(item.mal_id) || existingMalIds.has(item.mal_id)
            const isAnime = category === 'anime'
            const animeItem = item as JikanAnime
            const mangaItem = item as JikanManga
            const detail = isAnime
              ? `${animeItem.episodes || '?'} ep · ${animeItem.type || 'Anime'}`
              : `${mangaItem.chapters || '?'} ch · ${mangaItem.type || 'Manga'}`

            return (
              <div key={item.mal_id} className="flex gap-3 bg-[#1f2437] rounded-xl p-2.5 items-start">
                {item.images?.jpg?.image_url && (
                  <div className="relative w-12 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                    <Image src={item.images.jpg.image_url} alt={item.title} fill className="object-cover" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-200 leading-tight line-clamp-2">{item.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{detail}</p>
                  {item.score && (
                    <div className="flex items-center gap-1 mt-1">
                      <Star size={10} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-xs text-slate-400">{item.score}</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => !isAdded && handleAdd(item)}
                  className={`flex-shrink-0 p-2 rounded-xl transition-all ${
                    isAdded
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-blue-500/20 text-blue-400 active:bg-blue-500/40'
                  }`}
                >
                  {isAdded ? <Check size={18} /> : <Plus size={18} />}
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
