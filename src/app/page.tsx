'use client'
import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { LayoutGrid, Play, CheckCircle2, Tv, Clapperboard, BookOpen, Video, ChevronRight, Folder } from 'lucide-react'
import { getStats } from '@/lib/storage'
import { SYNC_EVENT } from '@/lib/sync'
import StatCard from '@/components/ui/StatCard'

const CATEGORIES = [
  { key: 'anime', href: '/anime', label: 'Anime', desc: 'Koleksi anime favoritmu', icon: Tv },
  { key: 'drakor', href: '/drakor', label: 'Drakor', desc: 'Drama Korea pilihan terbaik', icon: Clapperboard },
  { key: 'manga', href: '/manga', label: 'Komiki', desc: 'Baca komik dan manga seru', icon: BookOpen },
  { key: 'dorama', href: '/dorama', label: 'Dorama', desc: 'Drama Jepang favoritmu', icon: Video },
] as const

function loadAll() {
  return {
    total: getStats(),
    anime: getStats('anime'),
    drakor: getStats('drakor'),
    manga: getStats('manga'),
    dorama: getStats('dorama'),
  }
}

export default function HomePage() {
  const [data, setData] = useState(loadAll)

  const load = useCallback(() => setData(loadAll()), [])

  useEffect(() => { load() }, [load])
  useEffect(() => {
    const handler = () => load()
    window.addEventListener(SYNC_EVENT, handler)
    return () => window.removeEventListener(SYNC_EVENT, handler)
  }, [load])

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 space-y-7">
      {/* Kategori header */}
      <div>
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-2 mb-3"
        >
          <LayoutGrid size={17} className="text-violet-400" />
          <h2 className="text-sm font-semibold text-slate-300">Kategori</h2>
        </motion.div>

        {/* Stat cards keseluruhan */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          <StatCard
            icon={LayoutGrid}
            label="Total semua"
            value={data.total.total}
            sublabel="Semua anime, drama, komik, dorama"
            delay={0}
          />
          <StatCard
            icon={Play}
            label="Sedang ditonton"
            value={data.total.watching}
            sublabel="Lanjutkan tontonanmu"
            delay={0.07}
          />
          <StatCard
            icon={CheckCircle2}
            label="Selesai"
            value={data.total.completed}
            sublabel="Tontonan yang telah selesai"
            delay={0.14}
          />
        </div>
      </div>

      {/* Perkategori */}
      <div>
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex items-center gap-2 mb-3"
        >
          <Folder size={17} className="text-violet-400" />
          <h2 className="text-sm font-semibold text-slate-300">Perkategori</h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CATEGORIES.map((cat, i) => {
            const cs = data[cat.key]
            const Icon = cat.icon
            return (
              <motion.div
                key={cat.key}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18 + i * 0.08, duration: 0.45, ease: 'easeOut' }}
                whileHover={{ y: -4 }}
                className="bg-[#150f24] border border-[#241a3a] hover:border-violet-500/40 rounded-2xl p-5 transition-colors flex flex-col"
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center border mb-4"
                  style={{
                    background: 'radial-gradient(circle, rgba(168,85,247,0.2), rgba(168,85,247,0.05))',
                    borderColor: 'rgba(168,85,247,0.35)',
                    boxShadow: '0 0 22px -4px rgba(168,85,247,0.5)',
                  }}
                >
                  <Icon size={24} className="text-violet-300" />
                </div>

                <h3 className="text-lg font-bold text-white mb-1">{cat.label}</h3>
                <p className="text-xs text-slate-500 mb-4">{cat.desc}</p>

                <div className="grid grid-cols-3 gap-2 pb-4 mb-4 border-b border-[#241a3a]">
                  <div>
                    <p className="text-[10px] text-slate-500 mb-0.5">Total</p>
                    <p className="text-base font-bold text-violet-300">{cs.total}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 mb-0.5">Aktif</p>
                    <p className="text-base font-bold text-violet-300">{cs.watching}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 mb-0.5">Selesai</p>
                    <p className="text-base font-bold text-violet-300">{cs.completed}</p>
                  </div>
                </div>

                <Link
                  href={cat.href}
                  className="mt-auto flex items-center justify-between px-4 py-2.5 rounded-xl border border-[#2a1f44] text-sm text-slate-300 hover:bg-violet-500/10 hover:border-violet-500/40 transition-colors"
                >
                  Lihat koleksi
                  <ChevronRight size={15} />
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
