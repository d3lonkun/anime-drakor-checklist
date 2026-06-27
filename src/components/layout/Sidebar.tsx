'use client'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Home, Tv, Clapperboard, BookOpen, Video, Search, Settings, RefreshCw } from 'lucide-react'
import { syncFromSupabaseToLocal } from '@/lib/sync'

const NAV = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/anime', icon: Tv, label: 'Anime' },
  { href: '/drakor', icon: Clapperboard, label: 'Drakor' },
  { href: '/manga', icon: BookOpen, label: 'Komik' },
  { href: '/dorama', icon: Video, label: 'Dorama' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [syncing, setSyncing] = useState(false)
  const [imgErr, setImgErr] = useState(false)

  async function handleSync() {
    if (syncing) return
    setSyncing(true)
    await syncFromSupabaseToLocal().catch(console.error)
    setSyncing(false)
  }

  return (
    <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-56 xl:w-64 glass border-r border-white/[0.06] z-30 py-6 px-4">
      {/* Logo */}
      <div className="px-2 mb-8">
        <Link href="/">
          <span className="text-xl font-black" style={{ fontFamily: 'Outfit, sans-serif' }}>
            <span className="text-white">My </span>
            <span className="text-violet-400">Tracker</span>
          </span>
        </Link>
      </div>

      {/* Nav links */}
      <nav className="flex-1 space-y-0.5">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? 'bg-violet-500/15 text-violet-300 border border-violet-500/25 shadow-[0_0_16px_-4px_rgba(139,92,246,0.3)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={17} strokeWidth={active ? 2.5 : 1.8} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom section */}
      <div className="space-y-0.5">
        {/* Sync button */}
        <button
          onClick={handleSync}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all"
        >
          <RefreshCw size={17} className={syncing ? 'animate-spin text-violet-400' : ''} />
          Sinkron Data
        </button>

        <Link href="/search" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all">
          <Search size={17} />
          Cari
        </Link>

        <Link href="/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all">
          <Settings size={17} />
          Pengaturan
        </Link>

        {/* Avatar */}
        <div className="mt-4 pt-4 border-t border-white/[0.06]">
          <Link href="/settings" className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-white/5 transition-all">
            <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-violet-500/40 flex-shrink-0 bg-violet-500/10">
              {!imgErr ? (
                <Image src="/avatar.jpg" alt="Profil" width={36} height={36} className="object-cover w-full h-full" onError={() => setImgErr(true)} />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-violet-300 text-xs font-bold">U</div>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-200 truncate">Profil</p>
              <p className="text-xs text-slate-500">Pengaturan akun</p>
            </div>
          </Link>
        </div>
      </div>
    </aside>
  )
}
