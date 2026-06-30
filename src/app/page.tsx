'use client'
import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { Tv, Clapperboard, BookOpen, Video, ChevronRight } from 'lucide-react'
import { getStats, getAllEntries } from '@/lib/storage'
import { SYNC_EVENT } from '@/lib/sync'
import HeroContinueBanner from '@/components/ui/HeroContinueBanner'
import CategoryStatCard from '@/components/ui/CategoryStatCard'
import ActivityCard from '@/components/ui/ActivityCard'

function loadData() {
  const all = getAllEntries()
  const byUpdated = [...all].sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
  const watching = byUpdated.filter(e => e.status === 'watching')

  return {
    continueEntry: watching[0] || byUpdated[0] || null,
    anime: getStats('anime'),
    drakor: getStats('drakor'),
    manga: getStats('manga'),
    dorama: getStats('dorama'),
    recent: byUpdated.slice(0, 6),
  }
}

export default function HomePage() {
  const [data, setData] = useState(loadData)
  const load = useCallback(() => setData(loadData()), [])

  useEffect(() => { load() }, [load])
  useEffect(() => {
    window.addEventListener(SYNC_EVENT, load)
    return () => window.removeEventListener(SYNC_EVENT, load)
  }, [load])

  const { continueEntry, anime, drakor, manga, dorama, recent } = data

  return (
    <div className="space-y-7">
      {continueEntry && <HeroContinueBanner entry={continueEntry} />}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <CategoryStatCard href="/anime" icon={Tv} label="Anime" value={anime.total} color="#8b5cf6" delay={0} />
        <CategoryStatCard href="/drakor" icon={Clapperboard} label="Drakor" value={drakor.total} color="#ec4899" delay={0.06} />
        <CategoryStatCard href="/manga" icon={BookOpen} label="Komik" value={manga.total} color="#f59e0b" delay={0.12} />
        <CategoryStatCard href="/dorama" icon={Video} label="Dorama" value={dorama.total} color="#06b6d4" delay={0.18} />
      </div>

      {recent.length > 0 ? (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-base font-bold text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Aktivitas Terakhir
            </p>
            <Link href="/list" className="text-xs text-slate-400 hover:text-violet-400 flex items-center gap-1 transition-colors">
              Lihat Semua <ChevronRight size={13} />
            </Link>
          </div>
          <div className="flex lg:grid lg:grid-cols-5 gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
            {recent.map((entry, i) => (
              <ActivityCard key={entry.id} entry={entry} delay={0.25 + i * 0.05} />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🎬</p>
          <p className="text-slate-300 font-semibold">Belum ada koleksi</p>
          <p className="text-slate-600 text-sm mt-1">Mulai tambahkan anime, drakor, komik, atau dorama</p>
        </div>
      )}
    </div>
  )
}
