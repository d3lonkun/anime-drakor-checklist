'use client'
import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { LucideIcon, Search, Plus, PencilLine, LayoutGrid, Play, CheckCircle2, ChevronRight, MoreVertical } from 'lucide-react'
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
  icon: LucideIcon
  showMALSearch?: boolean
  progressLabel: string
  unitLabel: string
  accentColor?: string
}

const SUBTYPE_FILTERS: Record<string, string> = {
  all: 'Semua', manga: 'Manga', manhwa: 'Manhwa',
  manhua: 'Manhua', komik_indo: 'Indo', webtoon: 'Webtoon', novel: 'Novel',
}

const STATUS_LABEL: Record<WatchStatus, string> = {
  watching: 'Ditonton', completed: 'Selesai', on_hold: 'Ditunda',
  dropped: 'Drop', plan_to_watch: 'Plan',
}

const STATUS_CLASS: Record<WatchStatus, string> = {
  watching: 'status-watching', completed: 'status-completed',
  on_hold: 'status-on_hold', dropped: 'status-dropped',
  plan_to_watch: 'status-plan_to_watch',
}

export default function CategoryListPage({
  category, title, icon: Icon, showMALSearch = false, progressLabel, unitLabel, accentColor = '#8b5cf6',
}: Props) {
  const [entries, setEntries] = useState<MediaEntry[]>([])
  const [statFilter, setStatFilter] = useState<'all' | WatchStatus>('all')
  const [subtypeFilter, setSubtypeFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<MediaEntry | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [showMAL, setShowMAL] = useState(false)
  const [sortBy, setSortBy] = useState<'updated' | 'title' | 'score'>('updated')

  const load = useCallback(() => setEntries(getEntriesByCategory(category)), [category])

  useEffect(() => { load() }, [load])
  useEffect(() => {
    window.addEventListener(SYNC_EVENT, load)
    return () => window.removeEventListener(SYNC_EVENT, load)
  }, [load])

  const stats = getStats(category)

  const filtered = entries
    .filter(e => statFilter === 'all' || e.status === statFilter)
    .filter(e => subtypeFilter === 'all' || e.subtype === subtypeFilter)
    .filter(e => !search || e.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title)
      if (sortBy === 'score') return (b.score ?? 0) - (a.score ?? 0)
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    })

  return (
    <div className="space-y-5">
      {/* Stat cards (clickable filter) */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard
          icon={LayoutGrid} label="Total" value={stats.total}
          sublabel={`Semua ${title.toLowerCase()}`}
          active={statFilter === 'all'}
          onClick={() => setStatFilter('all')} delay={0} color={accentColor}
        />
        <StatCard
          icon={Play} label={progressLabel} value={stats.watching}
          sublabel="Yang sedang aktif"
          active={statFilter === 'watching'}
          onClick={() => setStatFilter('watching')} delay={0.07} color={accentColor}
        />
        <StatCard
          icon={CheckCircle2} label="Selesai" value={stats.completed}
          sublabel="Sudah tamat"
          active={statFilter === 'completed'}
          onClick={() => setStatFilter('completed')} delay={0.14} color={accentColor}
        />
      </div>

      {/* Add section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18 }}
        className="glass rounded-2xl border border-white/[0.07] p-4"
      >
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Plus size={13} className="text-violet-400" />
          Tambahkan {title}
        </p>
        <div className={`grid gap-2 ${showMALSearch ? 'sm:grid-cols-2' : ''}`}>
          {showMALSearch && (
            <button
              onClick={() => setShowMAL(true)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/[0.06] hover:border-violet-500/25 hover:bg-violet-500/5 transition-all text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-[9px] font-black">MAL</span>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-200">Cari di MAL</p>
                <p className="text-xs text-slate-500">MyAnimeList database</p>
              </div>
              <ChevronRight size={14} className="text-slate-600 ml-auto" />
            </button>
          )}
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/[0.06] hover:border-violet-500/25 hover:bg-violet-500/5 transition-all text-left"
          >
            <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center flex-shrink-0">
              <PencilLine size={15} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-200">Tambah Manual</p>
              <p className="text-xs text-slate-500">Input sendiri</p>
            </div>
            <ChevronRight size={14} className="text-slate-600 ml-auto" />
          </button>
        </div>
      </motion.div>

      {/* Manga subtype filter */}
      {category === 'manga' && (
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {Object.entries(SUBTYPE_FILTERS).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSubtypeFilter(key)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                subtypeFilter === key
                  ? 'bg-violet-500/15 border-violet-500/30 text-violet-300'
                  : 'border-white/[0.06] text-slate-500 hover:text-slate-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {/* Search + sort */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
          <input
            type="text" value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={`Cari ${title.toLowerCase()}...`}
            className="search-input pl-10"
          />
        </div>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value as any)}
          className="glass border-white/[0.07] rounded-xl px-3 text-xs text-slate-400 outline-none"
        >
          <option value="updated">Terbaru</option>
          <option value="title">A-Z</option>
          <option value="score">Skor</option>
        </select>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <Icon size={32} className="mx-auto mb-3 text-white/10" />
          <p className="text-slate-400 text-sm">{search ? 'Tidak ditemukan' : 'Belum ada data'}</p>
          {!search && <p className="text-slate-600 text-xs mt-1">Gunakan tombol tambah di atas</p>}
        </div>
      ) : (
        <div className="glass rounded-2xl border border-white/[0.07] overflow-hidden">
          <div className="hidden sm:flex items-center px-5 py-2.5 border-b border-white/[0.04] text-[11px] text-slate-500 uppercase tracking-wide">
            <span className="flex-1">{title}</span>
            <span className="w-36 text-right pr-2">Rating</span>
            <span className="w-6" />
          </div>

          <AnimatePresence initial={false}>
            {filtered.map((entry, i) => (
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
                {/* Thumbnail */}
                <div className="relative w-10 h-14 sm:w-11 sm:h-15 flex-shrink-0 rounded-lg overflow-hidden bg-white/5">
                  {entry.image_url ? (
                    <Image src={entry.image_url} alt={entry.title} fill className="object-cover" sizes="48px" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Icon size={14} className="text-white/20" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-100 truncate">{entry.title}</p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className={`chip text-[10px] ${STATUS_CLASS[entry.status]}`}>
                      {STATUS_LABEL[entry.status]}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {unitLabel} {entry.progress}{entry.total ? `/${entry.total}` : ''}
                    </span>
                  </div>
                </div>

                {/* Rating */}
                <div className="hidden sm:flex items-center gap-2 w-36 justify-end pr-2">
                  <span className="font-bold text-sm" style={{ color: accentColor }}>
                    {entry.score ? entry.score.toFixed(1) : '—'}
                  </span>
                  <RatingStars score={entry.score} />
                </div>

                <MoreVertical size={14} className="text-slate-600 flex-shrink-0" />
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Modals */}
      {selected && (
        <MediaDetailModal entry={selected} onClose={() => setSelected(null)} onUpdate={() => { load(); setSelected(null) }} onDelete={() => { load(); setSelected(null) }} />
      )}
      {showAdd && <AddMediaModal category={category} onClose={() => setShowAdd(false)} onAdd={load} />}
      {showMAL && <SearchMALModal category={category} onClose={() => setShowMAL(false)} onAdd={load} />}
    </div>
  )
}
