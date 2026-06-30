'use client'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { MediaEntry } from '@/types'
import { timeAgo } from '@/lib/format'

const CATEGORY_META: Record<string, { label: string; color: string; href: string }> = {
  anime: { label: 'ANIME', color: '#8b5cf6', href: '/anime' },
  drakor: { label: 'DRAKOR', color: '#ec4899', href: '/drakor' },
  manga: { label: 'KOMIK', color: '#f59e0b', href: '/manga' },
  dorama: { label: 'DORAMA', color: '#06b6d4', href: '/dorama' },
}

export default function ActivityCard({ entry, delay = 0 }: { entry: MediaEntry; delay?: number }) {
  const meta = CATEGORY_META[entry.category]
  const unit = entry.category === 'manga' ? 'Chapter' : 'Episode'
  const pct = entry.total
    ? Math.min(100, (entry.progress / entry.total) * 100)
    : entry.status === 'completed' ? 100 : 35

  return (
    <motion.div
      initial={{ opacity: 0, x: 14 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.35 }}
      className="w-64 lg:w-auto flex-shrink-0"
    >
      <Link
        href={meta.href}
        className="glass rounded-2xl border border-white/[0.07] hover:border-white/[0.15] transition-all flex gap-3 p-3 h-full"
      >
        <div className="relative w-14 h-20 rounded-xl overflow-hidden bg-white/5 flex-shrink-0">
          {entry.image_url && (
            <Image src={entry.image_url} alt={entry.title} fill className="object-cover" sizes="56px" />
          )}
        </div>
        <div className="flex-1 min-w-0 flex flex-col">
          <p className="text-[10px] font-bold tracking-wider" style={{ color: meta.color }}>{meta.label}</p>
          <p className="text-sm font-bold text-white truncate mt-0.5">{entry.title}</p>
          <p className="text-xs text-slate-400 mt-0.5">{unit} {entry.progress}{entry.total ? `/${entry.total}` : ''}</p>
          <p className="text-[11px] text-slate-600 mt-0.5">{timeAgo(entry.updated_at)}</p>
          <div className="mt-auto pt-2">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${pct}%`, background: meta.color }} />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
