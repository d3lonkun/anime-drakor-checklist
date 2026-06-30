'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'
import AnimatedNumber from './AnimatedNumber'

interface Props {
  href: string
  icon: LucideIcon
  label: string
  value: number
  color: string
  delay?: number
}

export default function CategoryStatCard({ href, icon: Icon, label, value, color, delay = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: 'easeOut' }}
      whileHover={{ y: -3 }}
    >
      <Link
        href={href}
        className="glass card border-white/[0.07] hover:border-white/[0.15] transition-all flex flex-col h-full block"
      >
        <div
          className="w-11 h-11 rounded-xl border-2 flex items-center justify-center mb-5"
          style={{ borderColor: color }}
        >
          <Icon size={18} style={{ color }} strokeWidth={2.2} />
        </div>
        <p className="text-xs font-bold tracking-widest text-slate-300 uppercase mb-3">{label}</p>
        <AnimatedNumber value={value} className="text-3xl font-black text-white block" duration={1} />
        <p className="text-xs text-slate-500 mt-0.5">Judul</p>
      </Link>
    </motion.div>
  )
}
