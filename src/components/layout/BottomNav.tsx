'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Tv, Clapperboard, BookOpen, Video } from 'lucide-react'

const NAV = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/anime', icon: Tv, label: 'Anime' },
  { href: '/drakor', icon: Clapperboard, label: 'Drakor' },
  { href: '/manga', icon: BookOpen, label: 'Komik' },
  { href: '/dorama', icon: Video, label: 'Dorama' },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 glass border-t border-white/[0.06] pb-safe">
      <div className="flex items-center justify-around px-2 h-16">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center justify-center gap-1 flex-1 py-2 rounded-xl transition-all active:scale-90"
            >
              <div className={`p-1.5 rounded-xl transition-all ${active ? 'bg-violet-500/15' : ''}`}>
                <Icon
                  size={20}
                  strokeWidth={active ? 2.5 : 1.8}
                  className={active ? 'text-violet-400' : 'text-slate-500'}
                />
              </div>
              <span className={`text-[10px] font-medium ${active ? 'text-violet-400' : 'text-slate-500'}`}>
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
