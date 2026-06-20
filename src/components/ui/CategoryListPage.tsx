'use client'
import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { LucideIcon, Search, Plus, PencilLine, MoreVertical, LayoutGrid, Play, CheckCircle2, ChevronRight } from 'lucide-react'
import { MediaCategory, MediaEntry, WatchStatus } from '@/types'
import { getEntriesByCategory, getStats } from '@/lib/storage'
import { SYNC_EVENT } from '@/lib/sync'
import StatCard from './StatCard'
import RatingStars from './RatingStars'
import MediaDetailModal from './MediaDetailModal'
import AddMediaModal from './AddMediaModal'
import SearchMALModal from './SearchMALModal'

interface Props {
  category: MediaCategory
  title: string
  subtitle: string
  icon: LucideIcon
  showMALSearch?: boolean
  progressLabel: string
  unitLabel: string
}

const SUBTYPE_FILTERS: Record<string, string> = {
  all: 'Semua', manga: 'Manga', manhwa: 'Manhwa',
  manhua: 'Manhua', komik_indo: 'Indo', webtoon: 'Webtoon', novel: 'Novel',
}

const STATUS_BADGE: Record<WatchStatus, string> = {
  watching: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
  completed: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30',
  on_hold: 'bg-amber-500/15 text-amber-300 border-amber-500/25',
  dropped: 'bg-rose-500/15 text-rose-300 border-rose-500/25',
  plan_to_watch: 'bg-slate-500/15 text-slate-300 border-slate-500/25',
}

const STATUS_LABEL: Record<WatchStatus, string> = {
  watching: 'Sedang ditonton',
  completed: 'Selesai',
  on_hold: 'Ditunda',
  dropped: 'Dihentikan',
  plan_to_watch: 'Mau ditonton',
}

export default function CategoryListPage({
  category, title, subtitle, icon: Icon, showMALSearch = false, progressLabel, unitLabel,
}: Props) {
  const [entries, setEntries] = useState<MediaEntry[]>([])
  const [statFilter, setStatFilter] = useState<'all' | 'watching' | 'completed'>('all')
  const [subtypeFilter, setSubtypeFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<MediaEntry | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [showMAL, setShowMAL] = useState(false)

  const load = useCallback(() => {
    setEntries(getEntriesByCategory(category))
  }, [category])

  useEffect(() => { load() }, [load])

  useEffect(() => {
    const handler = () => load()
    window.addEventListener(SYNC_EVENT, handler)
    return () => window.removeEventListener(SYNC_EVENT, handler)
  }, [load])

  const stats = getStats(category)

  const filtered = entries
    .filter(e => statFilter === 'all' || e.status === statFilter)
    .filter(e => subtypeFilter === 'all' || e.subtype === subtypeFilter)
    .filter(e => !search || e.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5 space-y-5">
      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <StatCard
          icon={LayoutGrid}
          label="Jumlah Total"
          value={stats.total}
          sublabel={`Semua ${title.toLowerCase()} dalam list kamu`}
          active={statFilter === 'all'}
          onClick={() => setStatFilter('all')}
          delay={0}
        />
        <StatCard
          icon={Play}
          label={progressLabel}
          value={stats.watching}
          sublabel={`${title} yang sedang kamu nikmati`}
          active={statFilter === 'watching'}
          onClick={() => setStatFilter('watching')}
          delay={0.06}
        />
        <StatCard
          icon={CheckCircle2}
          label="Selesai"
          value={stats.completed}
          sublabel={`${title} yang sudah kamu selesaikan`}
          active={statFilter === 'completed'}
          onClick={() => setStatFilter('completed')}
          delay={0.12}
        />
      </div>

      {/* Tambahkan section */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18, duration: 0.4 }}
        className="bg-[#120c20] rounded-2xl border border-[#241a3a] p-4 sm:p-5"
      >
        <div className="flex items-center gap-2 mb-3.5">
          <Plus size={16} className="text-violet-400" />
          <p className="text-sm font-semibold text-slate-200">Tambahkan {title}</p>
        </div>

        <div className={`grid gap-3 ${showMALSearch ? 'sm:grid-cols-2' : ''}`}>
          {showMALSearch && (
            <button
              onClick={() => setShowMAL(true)}
              className="flex items-center gap-3 bg-[#1a1228] hover:bg-[#211333] border border-[#2a1f44] rounded-xl px-4 py-3.5 transition-colors text-left"
            >
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-[10px] font-black tracking-tight">MAL</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-200">Cari di MAL</p>
                <p className="text-xs text-slate-500">Cari dari MyAnimeList</p>
              </div>
              <ChevronRight size={16} className="text-slate-600 flex-shrink-0" />
            </button>
          )}

          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-3 bg-[#1a1228] hover:bg-[#211333] border border-[#2a1f44] rounded-xl px-4 py-3.5 transition-colors text-left"
          >
            <div className="w-9 h-9 rounded-lg bg-violet-600 flex items-center justify-center flex-shrink-0">
              <PencilLine size={16} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-200">Tambahkan Manual</p>
              <p className="text-xs text-slate-500">Tambahkan {title.toLowerCase()} secara manual</p>
            </div>
            <ChevronRight size={16} className="text-slate-600 flex-shrink-0" />
          </button>
        </div>
      </motion.div>

      {/* Subtype filter (manga only) */}
      {category === 'manga' && (
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {Object.entries(SUBTYPE_FILTERS).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSubtypeFilter(key)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                subtypeFilter === key
                  ? 'bg-violet-500/20 border-violet-500/40 text-violet-300'
                  : 'border-[#241a3a] text-slate-500 bg-[#120c20]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={`Cari ${title.toLowerCase()} dalam list...`}
          className="w-full bg-[#120c20] border border-[#241a3a] rounded-xl pl-11 pr-4 py-3 text-sm text-slate-200 placeholder-slate-600 outline-none focus:border-violet-500/40 transition-colors"
        />
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <Icon size={36} className="text-[#2a1f44] mx-auto mb-3" />
          <p className="text-slate-400 font-medium text-sm">
            {search ? 'Tidak ditemukan' : 'Belum ada di sini'}
          </p>
          <p className="text-slate-600 text-xs mt-1">
            {!search && 'Tambahkan lewat tombol di atas'}
          </p>
        </div>
      ) : (
        <div className="bg-[#120c20] rounded-2xl border border-[#241a3a] overflow-hidden">
          {/* Header row (desktop only) */}
          <div className="hidden sm:flex items-center px-5 py-3 border-b border-[#241a3a] text-xs text-slate-500">
            <span className="flex-1">{title}</span>
            <span className="w-40 text-right pr-2">Rating dari saya</span>
            <span className="w-8" />
          </div>

          <AnimatePresence initial={false}>
            {filtered.map((entry, i) => (
              <motion.button
                key={entry.id}
                onClick={() => setSelected(entry)}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: Math.min(i * 0.035, 0.5), duration: 0.3 }}
                whileHover={{ backgroundColor: 'rgba(168,85,247,0.06)' }}
                className="w-full flex items-center gap-3 px-4 sm:px-5 py-3 border-b border-[#1c1530] last:border-b-0 text-left transition-colors"
              >
                <div className="relative w-11 h-14 sm:w-12 sm:h-16 flex-shrink-0 rounded-lg overflow-hidden bg-[#1a1228]">
                  {entry.image_url ? (
                    <Image src={entry.image_url} alt={entry.title} fill className="object-cover" sizes="60px" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Icon size={16} className="text-[#3a2a5c]" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-200 truncate">{entry.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {entry.title_native && (
                      <span className="text-xs text-slate-500 truncate hidden sm:inline">{entry.title_native}</span>
                    )}
                    <span className={`chip text-[10px] px-2 py-0.5 border flex-shrink-0 ${STATUS_BADGE[entry.status]}`}>
                      {STATUS_LABEL[entry.status]}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 sm:hidden">
                    {unitLabel} {entry.progress}{entry.total ? `/${entry.total}` : ''}
                  </p>
                </div>

                <div className="hidden sm:flex items-center gap-3 w-40 justify-end pr-2">
                  <span className="text-violet-300 font-bold text-sm w-8 text-right">
                    {entry.score ? entry.score.toFixed(1) : '—'}
                  </span>
                  <RatingStars score={entry.score} />
                </div>

                <MoreVertical size={16} className="text-slate-600 flex-shrink-0" />
              </motion.button>
            ))}
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
      {showAdd && <AddMediaModal category={category} onClose={() => setShowAdd(false)} onAdd={load} />}
      {showMAL && <SearchMALModal category={category} onClose={() => setShowMAL(false)} onAdd={load} />}
    </div>
  )
}
