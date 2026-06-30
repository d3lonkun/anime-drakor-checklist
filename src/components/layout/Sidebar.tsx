'use client'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'
import { Home, Bookmark, Clock, PlayCircle, CheckCircle2, XCircle, Heart, LucideIcon } from 'lucide-react'
import { getStats, getAllEntries } from '@/lib/storage'
import { estimateDurationHours } from '@/lib/format'
import { SYNC_EVENT } from '@/lib/sync'

const NAV = [
  { href: '/', icon: Home, label: 'Beranda' },
  { href: '/list', icon: Bookmark, label: 'Daftar Saya' },
  { href: '/list/akan-ditonton', icon: Clock, label: 'Akan Ditonton' },
  { href: '/list/sedang-ditonton', icon: PlayCircle, label: 'Sedang Ditonton' },
  { href: '/list/selesai', icon: CheckCircle2, label: 'Selesai' },
  { href: '/list/dibatalkan', icon: XCircle, label: 'Dibatalkan' },
  { href: '/list/favorit', icon: Heart, label: 'Favorit' },
]

// Ganti lewat NEXT_PUBLIC_USER_NAME di Vercel kalau mau ganti nama
const DISPLAY_NAME = process.env.NEXT_PUBLIC_USER_NAME || 'GEFRANDO'
const TAGLINE = 'Keep tracking your stories.'

export default function Sidebar() {
  const pathname = usePathname()
  const [imgErr, setImgErr] = useState(false)
  const [stats, setStats] = useState(() => getStats())
  const [hours, setHours] = useState(0)

  const load = useCallback(() => {
    setStats(getStats())
    setHours(estimateDurationHours(getAllEntries()))
  }, [])

  useEffect(() => { load() }, [load])
  useEffect(() => {
    window.addEventListener(SYNC_EVENT, load)
    return () => window.removeEventListener(SYNC_EVENT, load)
  }, [load])

  return (
    <aside className="hidden lg:flex flex-col fixed left-0 top-20 bottom-0 w-72 overflow-y-auto px-4 pt-4 pb-6 z-30">
      {/* Nav */}
      <nav className="space-y-1 mb-5">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? 'bg-violet-600 text-white shadow-[0_4px_20px_-4px_rgba(124,58,237,0.6)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={17} strokeWidth={active ? 2.3 : 1.8} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Statistik */}
      <div className="glass rounded-2xl border border-white/[0.07] p-4 mb-4">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Statistik</p>
        <div className="space-y-2.5">
          <StatRow icon={PlayCircle} label="Total Ditonton" value={stats.total} />
          <StatRow icon={PlayCircle} label="Sedang Ditonton" value={stats.watching} />
          <StatRow icon={Bookmark} label="Akan Ditonton" value={stats.plan_to_watch} />
          <StatRow icon={Clock} label="Total Durasi" value={`${hours} Jam`} />
        </div>
      </div>

      {/* Profile */}
      <Link
        href="/settings"
        className="glass rounded-2xl border border-white/[0.07] p-4 flex flex-col items-center text-center mt-auto hover:border-violet-500/25 transition-all"
      >
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-violet-500/40 bg-violet-500/10 mb-3">
          {!imgErr ? (
            <Image
              src="/avatar.jpg"
              alt="Profil"
              width={64}
              height={64}
              className="object-cover w-full h-full"
              onError={() => setImgErr(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-violet-300 font-bold">U</div>
          )}
        </div>
        <p className="font-bold text-white text-sm tracking-wide" style={{ fontFamily: 'Outfit, sans-serif' }}>
          {DISPLAY_NAME}
        </p>
        <p className="text-[11px] text-slate-500 mt-0.5">{TAGLINE}</p>
      </Link>
    </aside>
  )
}

function StatRow({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: number | string }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-7 h-7 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center flex-shrink-0">
        <Icon size={13} className="text-violet-400" />
      </div>
      <span className="text-xs text-slate-400 flex-1">{label}</span>
      <span className="text-xs font-bold text-white">{value}</span>
    </div>
  )
}
