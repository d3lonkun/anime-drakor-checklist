'use client'
import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Search, MoreVertical, Heart } from 'lucide-react'
import { MediaCategory, MediaEntry, WatchStatus } from '@/types'
import { getAllEntries } from '@/lib/storage'
import { SYNC_EVENT } from '@/lib/sync'
import RatingStars from './RatingStars'
import MediaDetailModal from './MediaDetailModal'

interface Props {
  title: string
  statusFilter?: WatchStatus
  favoriteOnly?: boolean
}

const CATEGORY_META: Record<MediaCategory, { label: string; color: string }> = {
  anime: { label: 'Anime', color: '#8b5cf6' },
  drakor: { label: 'Drakor', color: '#ec4899' },
  manga: { label: 'Komik', color: '#f59e0b' },
  dorama: { label: 'Dorama', color: '#06b6d4' },
}

const STATUS_LABEL: Record<WatchStatus, string> = {
  watching: 'Ditonton', completed: 'Selesai', on_hold: 'Ditunda', dropped: 'Drop', plan_to_watch: 'Plan',
}
const STATUS_CLASS: Record<WatchStatus, string> = {
  watching: 'status-watching', completed: 'status-completed', on_hold: 'status-on_hold',
  dropped: 'status-dropped', plan_to_watch: 'status-plan_to_watch',
}

export default function UnifiedListPage({ title, statusFilter, favoriteOnly }: Props) {
  const [entries, setEntries] = useState<MediaEntry[]>([])
  const [categoryFilter, setCategoryFilter] = useState<MediaCategory | 'all'>('all')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<MediaEntry | null>(null)

  const load = useCallback(() => {
    let all = getAllEntries()
    if (statusFilter) all = all.filter(e => e.status === statusFilter)
    if (favoriteOnly) all = all.filter(e => e.favorite)
    setEntries(all)
  }, [statusFilter, favoriteOnly])

  useEffect(() => { load() }, [load])
  useEffect(() => {
    window.addEventListener(SYNC_EVENT, load)
    return () => window.removeEventListener(SYNC_EVENT, load)
  }, [load])

  const filtered = entries
    .filter(e => categoryFilter === 'all' || e.category === categoryFilter)
    .filter(e => !search || e.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-black text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>{title}</h1>

      <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {(['all', 'anime', 'drakor', 'manga', 'dorama'] as const).map(key => (
          <button
            key={key}
            onClick={() => setCategoryFilter(key)}
            className={`flex-shrink-0 px-3.5 py-1.5 rounded-xl border text-xs font-medium transition-all ${
              categoryFilter === key
                ? 'bg-violet-500/15 border-violet-500/30 text-violet-300'
                : 'border-white/[0.07] text-slate-500 hover:text-slate-300'
            }`}
          >
            {key === 'all' ? 'Semua' : CATEGORY_META[key as MediaCategory].label}
          </button>
        ))}
      </div>

      <div className="relative">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Cari dalam daftar ini..."
          className="search-input pl-10"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-slate-400 text-sm">{search ? 'Tidak ditemukan' : 'Belum ada di sini'}</p>
        </div>
      ) : (
        <div className="glass rounded-2xl border border-white/[0.07] overflow-hidden">
          <AnimatePresence initial={false}>
            {filtered.map((entry, i) => {
              const meta = CATEGORY_META[entry.category]
              return (
                <motion.button
                  key={entry.id}
                  onClick={() => setSelected(entry)}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: Math.min(i * 0.03, 0.4), duration: 0.25 }}
                  whileHover={{ backgroundColor: 'rgba(139,92,246,0.05)' }}
                  className="w-full flex items-center gap-3 px-4 sm:px-5 py-3 border-b border-white/[0.03] last:border-b-0 text-left transition-colors"
                >
                  <div className="relative w-10 h-14 flex-shrink-0 rounded-lg overflow-hidden bg-white/5">
                    {entry.image_url && (
                      <Image src={entry.image_url} alt={entry.title} fill className="object-cover" sizes="40px" />
                    )}
                    {entry.favorite && (
                      <div className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-black/60 flex items-center justify-center">
                        <Heart size={9} className="text-rose-400 fill-rose-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-100 truncate">{entry.title}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-[10px] font-bold" style={{ color: meta.color }}>
                        {meta.label.toUpperCase()}
                      </span>
                      <span className={`chip text-[10px] ${STATUS_CLASS[entry.status]}`}>
                        {STATUS_LABEL[entry.status]}
                      </span>
                    </div>
                  </div>
                  <div className="hidden sm:flex items-center gap-2">
                    <RatingStars score={entry.score} />
                  </div>
                  <MoreVertical size={14} className="text-slate-600 flex-shrink-0" />
                </motion.button>
              )
            })}
          </AnimatePresence>
        </div>
      )}

      {selected && (
        <MediaDetailModal
          entry={selected}
          onClose={() => setSelected(null)}
          onUpdate={() => { load(); setSelected(null) }}
          onDelete={() => { load(); setSelected(null) }}
        />
      )}
    </div>
  )
}
