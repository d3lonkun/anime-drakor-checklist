'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Play, BookOpen, Heart, Tv2, Search } from 'lucide-react'

const navItems = [
  { href: '/', icon: Home, label: 'Home', color: 'text-slate-400', activeColor: 'text-white', activeBg: 'bg-white/10' },
  { href: '/anime', icon: Play, label: 'Anime', color: 'text-slate-400', activeColor: 'text-blue-400', activeBg: 'bg-blue-500/15' },
  { href: '/manga', icon: BookOpen, label: 'Komik', color: 'text-slate-400', activeColor: 'text-amber-400', activeBg: 'bg-amber-500/15' },
  { href: '/drakor', icon: Heart, label: 'Drakor', color: 'text-slate-400', activeColor: 'text-pink-400', activeBg: 'bg-pink-500/15' },
  { href: '/dorama', icon: Tv2, label: 'Dorama', color: 'text-slate-400', activeColor: 'text-cyan-400', activeBg: 'bg-cyan-500/15' },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="bottom-nav">
      <div className="flex items-center justify-around px-2 h-16">
        {navItems.map(({ href, icon: Icon, label, color, activeColor, activeBg }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center justify-center gap-1 flex-1 py-2 rounded-xl transition-all duration-200 active:scale-90"
            >
              <div className={`p-1.5 rounded-xl transition-all duration-200 ${isActive ? activeBg : ''}`}>
                <Icon 
                  size={22} 
                  className={`transition-colors duration-200 ${isActive ? activeColor : color}`}
                  strokeWidth={isActive ? 2.5 : 1.8}
                />
              </div>
              <span className={`text-[10px] font-medium transition-colors duration-200 ${isActive ? activeColor : color}`}>
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
