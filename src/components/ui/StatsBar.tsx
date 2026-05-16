'use client'
import { Stats, WatchStatus } from '@/types'
import { STATUS_LABELS } from '@/lib/storage'

interface Props {
  stats: Stats
  activeFilter: WatchStatus | 'all'
  onFilter: (f: WatchStatus | 'all') => void
  accentColor?: string
}

const FILTER_ITEMS: { key: WatchStatus | 'all'; emoji: string }[] = [
  { key: 'all', emoji: '📋' },
  { key: 'watching', emoji: '▶️' },
  { key: 'completed', emoji: '✅' },
  { key: 'on_hold', emoji: '⏸️' },
  { key: 'dropped', emoji: '🗑️' },
  { key: 'plan_to_watch', emoji: '📌' },
]

const COUNT_MAP = {
  all: (s: Stats) => s.total,
  watching: (s: Stats) => s.watching,
  completed: (s: Stats) => s.completed,
  on_hold: (s: Stats) => s.on_hold,
  dropped: (s: Stats) => s.dropped,
  plan_to_watch: (s: Stats) => s.plan_to_watch,
}

const FILTER_LABELS = {
  all: 'Semua',
  watching: 'Nonton',
  completed: 'Selesai',
  on_hold: 'Ditunda',
  dropped: 'Drop',
  plan_to_watch: 'Plan',
}

export default function StatsBar({ stats, activeFilter, onFilter, accentColor = 'bg-blue-500' }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar" style={{ scrollbarWidth: 'none' }}>
      {FILTER_ITEMS.map(({ key, emoji }) => {
        const count = COUNT_MAP[key](stats)
        const isActive = activeFilter === key
        return (
          <button
            key={key}
            onClick={() => onFilter(key)}
            className={`flex-shrink-0 flex flex-col items-center px-3 py-2 rounded-xl border transition-all ${
              isActive
                ? 'bg-white/10 border-white/20 text-white'
                : 'border-[#1e2538] text-slate-500 bg-[#1a1e2e]'
            }`}
          >
            <span className="text-base">{emoji}</span>
            <span className={`text-xs font-bold mt-0.5 ${isActive ? 'text-white' : 'text-slate-400'}`}>{count}</span>
            <span className="text-[9px] mt-0.5 opacity-75">{FILTER_LABELS[key]}</span>
          </button>
        )
      })}
    </div>
  )
}
