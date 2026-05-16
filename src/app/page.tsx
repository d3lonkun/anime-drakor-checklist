'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Play, BookOpen, Heart, Tv2, TrendingUp, Clock, CheckCircle, BarChart3 } from 'lucide-react'
import { getStats, getAllEntries, STATUS_LABELS } from '@/lib/storage'
import { Stats, MediaEntry } from '@/types'

const CATEGORIES = [
  {
    href: '/anime', label: 'Anime', emoji: '🎌',
    gradient: 'from-blue-600/30 to-violet-600/20',
    border: 'border-blue-500/20',
    icon: Play, iconColor: 'text-blue-400',
    desc: 'Series & Film Jepang'
  },
  {
    href: '/manga', label: 'Komik', emoji: '📚',
    gradient: 'from-amber-600/30 to-red-600/20',
    border: 'border-amber-500/20',
    icon: BookOpen, iconColor: 'text-amber-400',
    desc: 'Manga, Manhwa, Manhua'
  },
  {
    href: '/drakor', label: 'Drakor', emoji: '💝',
    gradient: 'from-pink-600/30 to-violet-600/20',
    border: 'border-pink-500/20',
    icon: Heart, iconColor: 'text-pink-400',
    desc: 'Drama Korea'
  },
  {
    href: '/dorama', label: 'Dorama', emoji: '🎭',
    gradient: 'from-cyan-600/30 to-emerald-600/20',
    border: 'border-cyan-500/20',
    icon: Tv2, iconColor: 'text-cyan-400',
    desc: 'Drama Jepang'
  },
]

export default function HomePage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [recentEntries, setRecentEntries] = useState<MediaEntry[]>([])

  useEffect(() => {
    const s = getStats()
    setStats(s)
    const entries = getAllEntries()
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      .slice(0, 5)
    setRecentEntries(entries)
  }, [])

  const CATEGORY_STATS = {
    anime: getStats('anime'),
    manga: getStats('manga'),
    drakor: getStats('drakor'),
    dorama: getStats('dorama'),
  }

  return (
    <div className="px-4 py-4 space-y-6 animate-fade-in">
      {/* Hero greeting */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600/20 via-violet-600/10 to-transparent rounded-2xl p-5 border border-blue-500/20">
        <div className="absolute top-0 right-0 text-6xl opacity-20 -translate-y-2 translate-x-2">🎌</div>
        <p className="text-xs text-blue-400 font-medium mb-1 uppercase tracking-wider">Selamat Datang</p>
        <h1 className="text-xl font-black text-slate-100 mb-1" style={{ fontFamily: 'Syne, sans-serif' }}>
          OtakuTracker
        </h1>
        <p className="text-sm text-slate-400">
          Lacak semua tontonan & bacaan kamu 📺📖
        </p>

        {stats && (
          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="bg-black/20 rounded-xl p-2.5 text-center">
              <p className="text-xl font-black text-white" style={{ fontFamily: 'Syne, sans-serif' }}>{stats.total}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Total</p>
            </div>
            <div className="bg-black/20 rounded-xl p-2.5 text-center">
              <p className="text-xl font-black text-blue-400" style={{ fontFamily: 'Syne, sans-serif' }}>{stats.watching}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Sedang Nonton</p>
            </div>
            <div className="bg-black/20 rounded-xl p-2.5 text-center">
              <p className="text-xl font-black text-green-400" style={{ fontFamily: 'Syne, sans-serif' }}>{stats.completed}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Selesai</p>
            </div>
          </div>
        )}
      </div>

      {/* Category cards */}
      <div>
        <h2 className="section-title text-slate-300 mb-3">Kategori</h2>
        <div className="grid grid-cols-2 gap-3">
          {CATEGORIES.map(cat => {
            const catStat = CATEGORY_STATS[cat.href.slice(1) as keyof typeof CATEGORY_STATS]
            return (
              <Link
                key={cat.href}
                href={cat.href}
                className={`bg-gradient-to-br ${cat.gradient} rounded-2xl p-4 border ${cat.border} card-hover block`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{cat.emoji}</span>
                  <span className="text-2xl font-black text-white/80" style={{ fontFamily: 'Syne, sans-serif' }}>
                    {catStat?.total || 0}
                  </span>
                </div>
                <p className="font-bold text-slate-200 text-sm" style={{ fontFamily: 'Syne, sans-serif' }}>{cat.label}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{cat.desc}</p>
                {catStat && catStat.watching > 0 && (
                  <div className="mt-2 flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                    <span className="text-[10px] text-blue-400">{catStat.watching} aktif</span>
                  </div>
                )}
              </Link>
            )
          })}
        </div>
      </div>

      {/* Quick stats */}
      {stats && (stats.episodes_watched > 0 || stats.chapters_read > 0) && (
        <div>
          <h2 className="section-title text-slate-300 mb-3">Pencapaian</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#1a1e2e] rounded-2xl p-4 border border-[#1e2538]">
              <BarChart3 size={20} className="text-blue-400 mb-2" />
              <p className="text-2xl font-black text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
                {stats.episodes_watched}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">Episode Ditonton</p>
            </div>
            <div className="bg-[#1a1e2e] rounded-2xl p-4 border border-[#1e2538]">
              <BookOpen size={20} className="text-amber-400 mb-2" />
              <p className="text-2xl font-black text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
                {stats.chapters_read}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">Chapter Dibaca</p>
            </div>
          </div>
        </div>
      )}

      {/* Recent activity */}
      {recentEntries.length > 0 && (
        <div>
          <h2 className="section-title text-slate-300 mb-3">Aktivitas Terakhir</h2>
          <div className="space-y-2">
            {recentEntries.map(entry => (
              <Link
                key={entry.id}
                href={`/${entry.category}`}
                className="flex items-center gap-3 bg-[#1a1e2e] rounded-xl p-3 border border-[#1e2538] card-hover"
              >
                <div className="text-xl">
                  {entry.category === 'anime' ? '🎌' : entry.category === 'manga' ? '📚' : entry.category === 'drakor' ? '💝' : '🎭'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-200 truncate">{entry.title}</p>
                  <p className="text-xs text-slate-500">
                    {entry.category === 'manga' ? 'Ch' : 'Ep'} {entry.progress}
                    {entry.total ? `/${entry.total}` : ''} · {STATUS_LABELS[entry.status]}
                  </p>
                </div>
                {entry.score && (
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <span className="text-yellow-400 text-xs">⭐</span>
                    <span className="text-xs text-slate-400">{entry.score}</span>
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}

      {stats?.total === 0 && (
        <div className="text-center py-8">
          <p className="text-4xl mb-3">🎌</p>
          <p className="text-slate-400 font-medium">Belum ada list!</p>
          <p className="text-slate-600 text-sm mt-1">Mulai tambahkan anime, manga, drakor, atau dorama</p>
        </div>
      )}
    </div>
  )
}
