'use client'
import { useState, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import Link from 'next/link'
import { getAllEntries, STATUS_LABELS, STATUS_BG } from '@/lib/storage'
import { MediaEntry } from '@/types'
import MediaDetailModal from '@/components/ui/MediaDetailModal'

const CATEGORY_EMOJI: Record<string, string> = {
  anime: '🎌', manga: '📚', drakor: '💝', dorama: '🎭'
}
const CATEGORY_COLOR: Record<string, string> = {
  anime: 'text-blue-400', manga: 'text-amber-400', drakor: 'text-pink-400', dorama: 'text-cyan-400'
}

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<MediaEntry[]>([])
  const [selected, setSelected] = useState<MediaEntry | null>(null)
  const [allEntries, setAllEntries] = useState<MediaEntry[]>([])

  useEffect(() => {
    setAllEntries(getAllEntries())
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
    <div className="px-4 py-3 animate-fade-in">
      {/* Search input */}
      <div className="relative mb-4">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Cari semua list kamu..."
          className="search-input text-base"
          autoFocus
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {!query && (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-slate-400 font-medium">Cari di seluruh list kamu</p>
          <p className="text-slate-600 text-sm mt-1">Anime, manga, drakor, dan dorama</p>
        </div>
      )}

      {query && results.length === 0 && (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">😔</p>
          <p className="text-slate-400 font-medium">Tidak ditemukan</p>
          <p className="text-slate-600 text-sm mt-1">Coba kata kunci lain</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-slate-600 mb-2">{results.length} hasil</p>
          {results.map(entry => (
            <button
              key={entry.id}
              onClick={() => setSelected(entry)}
              className="w-full flex items-center gap-3 bg-[#1a1e2e] rounded-xl p-3 border border-[#1e2538] card-hover text-left"
            >
              <span className="text-2xl">{CATEGORY_EMOJI[entry.category]}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-200 truncate">{entry.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`text-xs ${CATEGORY_COLOR[entry.category]} capitalize`}>
                    {entry.subtype.replace('_', ' ')}
                  </span>
                  <span className="text-slate-600">·</span>
                  <span className={`text-xs chip px-2 py-0.5 ${STATUS_BG[entry.status]}`}>
                    {STATUS_LABELS[entry.status]}
                  </span>
                </div>
              </div>
              <div className="text-xs text-slate-500 flex-shrink-0">
                {entry.category === 'manga' ? 'Ch' : 'Ep'} {entry.progress}
              </div>
            </button>
          ))}
        </div>
      )}

      {selected && (
        <MediaDetailModal
          entry={selected}
          onClose={() => setSelected(null)}
          onUpdate={handleUpdate}
          onDelete={handleUpdate}
        />
      )}
    </div>
  )
}
