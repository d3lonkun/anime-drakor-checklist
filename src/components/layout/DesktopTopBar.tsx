'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Search, Settings } from 'lucide-react'

export default function DesktopTopBar() {
  const [query, setQuery] = useState('')
  const router = useRouter()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (query.trim()) {
      // Titip query lewat localStorage, diambil oleh halaman /search saat dibuka
      localStorage.setItem('pending_search_query', query.trim())
    }
    router.push('/search')
  }

  return (
    <header className="hidden lg:flex fixed top-0 left-0 right-0 z-40 h-20 items-center px-6 glass border-b border-white/[0.06]">
      <Link href="/" className="flex-shrink-0 mr-8">
        <span className="text-xl font-black" style={{ fontFamily: 'Outfit, sans-serif' }}>
          <span className="text-white">My</span>
          <span className="text-violet-400">Tracker</span>
        </span>
      </Link>

      <form onSubmit={handleSubmit} className="flex-1 max-w-2xl relative">
        <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Cari anime, drakor, komik, dorama..."
          className="w-full bg-white/[0.04] border border-white/[0.08] rounded-2xl pl-11 pr-4 py-3 text-sm text-slate-200 placeholder-slate-600 outline-none focus:border-violet-500/40 transition-colors"
        />
      </form>

      <Link
        href="/settings"
        className="ml-auto flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/[0.08] text-slate-300 hover:border-violet-500/30 hover:text-white transition-all text-sm font-medium"
      >
        <Settings size={16} />
        Setelan
      </Link>
    </header>
  )
}
