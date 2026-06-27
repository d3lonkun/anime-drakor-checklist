'use client'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'
import { Search, RefreshCw } from 'lucide-react'
import { syncFromSupabaseToLocal } from '@/lib/sync'

const TITLES: Record<string, string> = {
  '/': 'My Tracker',
  '/anime': 'Anime',
  '/manga': 'Komik',
  '/drakor': 'Drakor',
  '/dorama': 'Dorama',
  '/search': 'Cari',
  '/settings': 'Pengaturan',
}

export default function TopBar() {
  const pathname = usePathname()
  const [syncing, setSyncing] = useState(false)

  async function handleSync() {
    if (syncing) return
    setSyncing(true)
    await syncFromSupabaseToLocal().catch(console.error)
    setSyncing(false)
  }

  const isHome = pathname === '/'

  return (
    <header className="lg:hidden fixed top-0 left-0 right-0 z-40 glass border-b border-white/[0.06]">
      <div className="flex items-center justify-between px-4 h-14">
        <Link href="/">
          {isHome ? (
            <span className="text-lg font-black" style={{ fontFamily: 'Outfit, sans-serif' }}>
              <span className="text-white">My </span>
              <span className="text-violet-400">Tracker</span>
            </span>
          ) : (
            <span className="text-base font-bold text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
              {TITLES[pathname] || 'My Tracker'}
            </span>
          )}
        </Link>

        <div className="flex items-center gap-1">
          <button onClick={handleSync} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all">
            <RefreshCw size={18} className={syncing ? 'animate-spin text-violet-400' : ''} />
          </button>
          <Link href="/search" className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all">
            <Search size={19} />
          </Link>
        </div>
      </div>
    </header>
  )
}
