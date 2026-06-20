'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, Settings } from 'lucide-react'

export default function TopBar() {
  const [imgError, setImgError] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#0a0612]/90 backdrop-blur-xl border-b border-[#1c1530]">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 h-16">
        <Link href="/" className="text-xl font-black tracking-tight">
          <span className="text-white">My </span>
          <span className="text-violet-400">Tracker</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/search"
            className="p-2.5 rounded-xl hover:bg-white/5 transition-colors text-slate-400 hover:text-slate-200"
            title="Cari"
          >
            <Search size={19} />
          </Link>

          <Link
            href="/settings"
            className="w-9 h-9 rounded-full border-2 border-violet-500/50 overflow-hidden flex items-center justify-center bg-violet-500/10 hover:border-violet-400 transition-colors"
            title="Profil"
          >
            {!imgError ? (
              <Image
                src="/avatar.jpg"
                alt="Profil"
                width={36}
                height={36}
                className="object-cover w-full h-full"
                onError={() => setImgError(true)}
              />
            ) : (
              <span className="text-violet-300 text-xs font-bold">U</span>
            )}
          </Link>

          <Link
            href="/settings"
            className="p-2.5 rounded-xl border border-[#241a3a] hover:bg-white/5 transition-colors text-slate-300"
            title="Pengaturan"
          >
            <Settings size={18} />
          </Link>
        </div>
      </div>
    </header>
  )
}
