'use client'
import { useState, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { getAllEntries, STATUS_LABELS } from '@/lib/storage'
import { MediaEntry, WatchStatus } from '@/types'
import MediaDetailModal from '@/components/ui/MediaDetailModal'

const CATEGORY_META: Record<string, { emoji: string; color: string }> = {
  anime: { emoji: '🎌', color: 'text-violet-400' },
  manga: { emoji: '📚', color: 'text-amber-400' },
  drakor: { emoji: '💝', color: 'text-pink-400' },
  dorama: { emoji: '🎭', color: 'text-cyan-400' },
}

const STATUS_CLASS: Record<WatchStatus, string> = {
  watching: 'status-watching', completed: 'status-completed', on_hold: 'status-on_hold',
  dropped: 'status-dropped', plan_to_watch: 'status-plan_to_watch',
}

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<MediaEntry[]>([])
  const [selected, setSelected] = useState<MediaEntry | null>(null)
  const [allEntries, setAllEntries] = useState<MediaEntry[]>([])

  useEffect(() => {
    setAllEntries(getAllEntries())
    // Ambil query yang dikirim dari kotak cari di topbar (jika ada)
    const pending = localStorage.getItem('pending_search_query')
    if (pending) {
      setQuery(pending)
      localStorage.removeItem('pending_search_query')
    }
  }, [])

  useEffect(() => {
    if (!query.trim()) { setResults([]); return }
    const q = query.toLowerCase()
    setResults(
      allEntries.filter(e =>
        e.title.toLowerCase().includes(q) ||
        (e.title_en?.toLowerCase().includes(q)) ||
        (e.notes?.toLowerCase().includes(q))
      )
    )
  }, [query, allEntries])

  function handleUpdate() {
    setAllEntries(getAllEntries())
    setSelected(null)
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Cari semua list kamu..."
          className="search-input pl-11 text-base py-3.5"
          autoFocus
        />
        {query && (
          <button onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
            <X size={16} />
          </button>
        )}
      </div>

      {!query && (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-slate-300 font-medium">Cari di seluruh list kamu</p>
          <p className="text-slate-600 text-sm mt-1">Anime, drakor, komik, dan dorama</p>
        </div>
      )}

      {query && results.length === 0 && (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">😔</p>
          <p className="text-slate-300 font-medium">Tidak ditemukan</p>
          <p className="text-slate-600 text-sm mt-1">Coba kata kunci lain</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-slate-600">{results.length} hasil</p>
          {results.map(entry => {
            const meta = CATEGORY_META[entry.category]
            return (
              <button
                key={entry.id}
                onClick={() => setSelected(entry)}
                className="w-full flex items-center gap-3 glass rounded-xl p-3 border border-white/[0.07] hover:border-violet-500/20 transition-all text-left"
              >
                <span className="text-2xl flex-shrink-0">{meta.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-200 truncate">{entry.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-xs ${meta.color} capitalize`}>{entry.subtype.replace('_', ' ')}</span>
                    <span className="text-slate-700">·</span>
                    <span className={`chip text-xs ${STATUS_CLASS[entry.status]}`}>{STATUS_LABELS[entry.status]}</span>
                  </div>
                </div>
                <div className="text-xs text-slate-500 flex-shrink-0">
                  {entry.category === 'manga' ? 'Ch' : 'Ep'} {entry.progress}
                </div>
              </button>
            )
          })}
        </div>
      )}

      {selected && (
        <MediaDetailModal entry={selected} onClose={() => setSelected(null)} onUpdate={handleUpdate} onDelete={handleUpdate} />
      )}
    </div>
  )
}
