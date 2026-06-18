'use client'
import { useEffect, useState, useCallback } from 'react'
import { Plus, Search } from 'lucide-react'
import { MediaCategory, MediaEntry, WatchStatus } from '@/types'
import { getEntriesByCategory, getStats } from '@/lib/storage'
import { SYNC_EVENT } from '@/lib/sync'
import MediaCard from '@/components/ui/MediaCard'
import MediaDetailModal from '@/components/ui/MediaDetailModal'
import AddMediaModal from '@/components/ui/AddMediaModal'
import SearchMALModal from '@/components/ui/SearchMALModal'
import StatsBar from '@/components/ui/StatsBar'

interface Props {
  category: MediaCategory
  showMALSearch?: boolean
}

const SUBTYPE_FILTERS: Record<string, Record<string, string>> = {
  manga: {
    all: 'Semua', manga: 'Manga', manhwa: 'Manhwa',
    manhua: 'Manhua', komik_indo: 'Indo', webtoon: 'Webtoon', novel: 'Novel',
  }
}

export default function MediaListPage({ category, showMALSearch = false }: Props) {
  const [entries, setEntries] = useState<MediaEntry[]>([])
  const [stats, setStats] = useState(getStats(category))
  const [filter, setFilter] = useState<WatchStatus | 'all'>('all')
  const [subtypeFilter, setSubtypeFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<MediaEntry | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [showMAL, setShowMAL] = useState(false)
  const [sortBy, setSortBy] = useState<'updated' | 'title' | 'score'>('updated')

  const load = useCallback(() => {
    setEntries(getEntriesByCategory(category))
    setStats(getStats(category))
  }, [category])

  useEffect(() => {
    load()
  }, [load])

  // Dengarkan event dari SyncProvider → reload otomatis
  useEffect(() => {
    const handler = () => load()
    window.addEventListener(SYNC_EVENT, handler)
    return () => window.removeEventListener(SYNC_EVENT, handler)
  }, [load])

  const filtered = entries
    .filter(e => filter === 'all' || e.status === filter)
    .filter(e => subtypeFilter === 'all' || e.subtype === subtypeFilter)
    .filter(e => !search || e.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title)
      if (sortBy === 'score') return (b.score ?? 0) - (a.score ?? 0)
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    })

  return (
    <div className="px-4 py-3 space-y-4 animate-fade-in">
      <StatsBar stats={stats} activeFilter={filter} onFilter={setFilter} />

      {category === 'manga' && (
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {Object.entries(SUBTYPE_FILTERS.manga).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSubtypeFilter(key)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                subtypeFilter === key
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                  : 'border-[#1e2538] text-slate-500 bg-[#1a1e2e]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari di list kamu..."
            className="search-input text-sm"
          />
        </div>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value as any)}
          className="bg-[#1a1e2e] border border-[#1e2538] rounded-xl px-3 text-xs text-slate-400 outline-none"
        >
          <option value="updated">Terbaru</option>
          <option value="title">A-Z</option>
          <option value="score">Skor</option>
        </select>
      </div>

      <div className="flex gap-2">
        {showMALSearch && (
          <button
            onClick={() => setShowMAL(true)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 text-sm font-medium"
          >
            <Search size={16} /> Cari di MAL
          </button>
        )}
        <button
          onClick={() => setShowAdd(true)}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#1a1e2e] border border-[#1e2538] text-slate-400 text-sm font-medium"
        >
          <Plus size={16} /> Tambah Manual
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">
            {category === 'anime' ? '🎌' : category === 'manga' ? '📚' : category === 'drakor' ? '💝' : '🎭'}
          </p>
          <p className="text-slate-400 font-medium text-sm">
            {search ? 'Tidak ditemukan' : filter !== 'all' ? 'Belum ada di kategori ini' : 'List masih kosong'}
          </p>
        </div>
      ) : (
        <>
          <p className="text-xs text-slate-600">{filtered.length} item</p>
          <div className="grid grid-cols-2 gap-3">
            {filtered.map(entry => (
              <MediaCard
                key={entry.id}
                entry={entry}
                onUpdate={load}
                onClick={() => setSelected(entry)}
              />
            ))}
          </div>
        </>
      )}

      {selected && (
        <MediaDetailModal
          entry={selected}
          onClose={() => setSelected(null)}
          onUpdate={() => { load(); setSelected(null) }}
          onDelete={() => { load(); setSelected(null) }}
        />
      )}
      {showAdd && <AddMediaModal category={category} onClose={() => setShowAdd(false)} onAdd={load} />}
      {showMAL && <SearchMALModal category={category} onClose={() => setShowMAL(false)} onAdd={load} />}
    </div>
  )
}
