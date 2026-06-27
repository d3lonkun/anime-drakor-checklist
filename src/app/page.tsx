'use client'
import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { LayoutGrid, Play, CheckCircle2, Tv, Clapperboard, BookOpen, Video, ChevronRight, TrendingUp } from 'lucide-react'
import { getStats, getAllEntries, STATUS_LABELS } from '@/lib/storage'
import { SYNC_EVENT } from '@/lib/sync'
import StatCard from '@/components/ui/StatCard'

const CATEGORIES = [
  { key: 'anime' as const, href: '/anime', label: 'Anime', desc: 'Koleksi anime favoritmu', icon: Tv, color: '#8b5cf6', activeLabel: 'Aktif', completedLabel: 'Selesai' },
  { key: 'drakor' as const, href: '/drakor', label: 'Drakor', desc: 'Drama Korea pilihan terbaik', icon: Clapperboard, color: '#ec4899', activeLabel: 'Aktif', completedLabel: 'Selesai' },
  { key: 'manga' as const, href: '/manga', label: 'Komik', desc: 'Manga, manhwa & webtoon', icon: BookOpen, color: '#f59e0b', activeLabel: 'Dibaca', completedLabel: 'Selesai' },
  { key: 'dorama' as const, href: '/dorama', label: 'Dorama', desc: 'Drama Jepang favoritmu', icon: Video, color: '#06b6d4', activeLabel: 'Aktif', completedLabel: 'Selesai' },
]

function loadData() {
  return {
    total: getStats(),
    anime: getStats('anime'),
    drakor: getStats('drakor'),
    manga: getStats('manga'),
    dorama: getStats('dorama'),
    recent: getAllEntries()
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      .slice(0, 5),
  }
}

export default function HomePage() {
  const [data, setData] = useState(loadData)
  const [imgErr, setImgErr] = useState(false)

  const load = useCallback(() => setData(loadData()), [])
  useEffect(() => { load() }, [load])
  useEffect(() => {
    window.addEventListener(SYNC_EVENT, load)
    return () => window.removeEventListener(SYNC_EVENT, load)
  }, [load])

  const { total, recent } = data

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between"
      >
        <div>
          <p className="text-sm text-slate-400 mb-0.5">Selamat datang kembali 👋</p>
          <h1 className="text-2xl font-black text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
            My <span className="text-violet-400">Tracker</span>
          </h1>
        </div>
        <Link href="/settings">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-violet-500/40 bg-violet-500/10">
            {!imgErr ? (
              <Image src="/avatar.jpg" alt="Avatar" width={40} height={40} className="object-cover w-full h-full" onError={() => setImgErr(true)} />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-violet-300 text-sm font-bold">U</div>
            )}
          </div>
        </Link>
      </motion.div>

      {/* Stat cards */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <LayoutGrid size={15} className="text-violet-400" />
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Ringkasan</p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <StatCard icon={LayoutGrid} label="Total" value={total.total} sublabel="Semua list" delay={0} />
          <StatCard icon={Play} label="Aktif" value={total.watching} sublabel="Sedang ditonton" delay={0.07} color="#8b5cf6" />
          <StatCard icon={CheckCircle2} label="Selesai" value={total.completed} sublabel="Sudah tamat" delay={0.14} color="#22c55e" />
        </div>
      </div>

      {/* Category cards */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp size={15} className="text-violet-400" />
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Kategori</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {CATEGORIES.map((cat, i) => {
            const cs = data[cat.key]
            const Icon = cat.icon
            return (
              <motion.div
                key={cat.key}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.07, duration: 0.4, ease: 'easeOut' }}
                whileHover={{ y: -3 }}
                className="glass card border-white/[0.07] hover:border-violet-500/20 transition-all flex flex-col"
              >
                {/* Icon */}
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-3"
                  style={{
                    background: `${cat.color}18`,
                    border: `1px solid ${cat.color}35`,
                    boxShadow: `0 0 18px -4px ${cat.color}55`
                  }}
                >
                  <Icon size={20} style={{ color: cat.color }} />
                </div>

                <h3 className="text-base font-bold text-white mb-0.5" style={{ fontFamily: 'Outfit, sans-serif' }}>{cat.label}</h3>
                <p className="text-[11px] text-slate-500 mb-4 leading-tight">{cat.desc}</p>

                {/* Mini stats */}
                <div className="grid grid-cols-3 gap-1 text-center mb-4 pb-4 border-b border-white/[0.05]">
                  <div>
                    <p className="text-[10px] text-slate-500">Total</p>
                    <p className="text-sm font-bold" style={{ color: cat.color }}>{cs.total}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500">{cat.activeLabel}</p>
                    <p className="text-sm font-bold" style={{ color: cat.color }}>{cs.watching}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500">{cat.completedLabel}</p>
                    <p className="text-sm font-bold" style={{ color: cat.color }}>{cs.completed}</p>
                  </div>
                </div>

                <Link
                  href={cat.href}
                  className="mt-auto flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white transition-all"
                  style={{ background: `${cat.color}10`, border: `1px solid ${cat.color}25` }}
                >
                  Lihat koleksi <ChevronRight size={13} />
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Recent activity */}
      {recent.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Play size={15} className="text-violet-400" />
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Aktivitas Terakhir</p>
          </div>
          <div className="glass rounded-2xl border border-white/[0.07] overflow-hidden">
            {recent.map((entry, i) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.05 }}
                className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.04] last:border-b-0 hover:bg-white/[0.03] transition-colors"
              >
                <div className="relative w-9 h-12 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                  {entry.image_url && (
                    <Image src={entry.image_url} alt={entry.title} fill className="object-cover" sizes="40px" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-200 truncate">{entry.title}</p>
                  <p className="text-[11px] text-slate-500">
                    {entry.category === 'manga' ? 'Ch' : 'Ep'} {entry.progress}{entry.total ? `/${entry.total}` : ''} · {STATUS_LABELS[entry.status]}
                  </p>
                </div>
                <Link href={`/${entry.category}`} className="text-[10px] text-slate-600 hover:text-violet-400 transition-colors uppercase tracking-wide">
                  {entry.category}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
