'use client'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Search, Settings } from 'lucide-react'

const PAGE_TITLES: Record<string, string> = {
  '/': 'OtakuTracker',
  '/anime': 'Anime',
  '/manga': 'Komik',
  '/drakor': 'Drama Korea',
  '/dorama': 'Dorama',
  '/search': 'Cari',
  '/settings': 'Pengaturan',
}

const accentMap: Record<string, string> = {
  '/anime': 'from-blue-500 to-violet-500',
  '/manga': 'from-amber-500 to-red-500',
  '/drakor': 'from-pink-500 to-violet-500',
  '/dorama': 'from-cyan-500 to-emerald-500',
  '/settings': 'from-slate-500 to-slate-600',
}

export default function TopBar() {
  const pathname = usePathname()
  const title = PAGE_TITLES[pathname] || 'OtakuTracker'
  const accent = accentMap[pathname] || 'from-blue-500 to-violet-500'

  return (
    <header className="fixed top-0 left-0 right-0 z-40 glass border-b border-[#1e2538]">
      <div className="flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-2">
          <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${accent} flex items-center justify-center`}>
            <span className="text-white text-xs font-bold" style={{ fontFamily: 'Syne, sans-serif' }}>O</span>
          </div>
          <span className="font-bold text-base text-slate-100" style={{ fontFamily: 'Syne, sans-serif' }}>
            {title}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Link href="/search" className="p-2 rounded-xl hover:bg-white/5 transition-colors text-slate-400">
            <Search size={20} />
          </Link>
          <Link href="/settings" className={`p-2 rounded-xl hover:bg-white/5 transition-colors ${pathname === '/settings' ? 'text-blue-400' : 'text-slate-400'}`}>
            <Settings size={20} />
          </Link>
        </div>
      </div>
    </header>
  )
}
