'use client'
import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'
import AnimatedNumber from './AnimatedNumber'

interface Props {
  icon: LucideIcon
  label: string
  value: number
  sublabel: string
  active?: boolean
  onClick?: () => void
  delay?: number
  color?: string
}

const SPARK = 'M2,26 C16,8 28,34 42,16 C56,-2 68,28 82,14 C94,3 106,22 124,9'

export default function StatCard({ icon: Icon, label, value, sublabel, active, onClick, delay = 0, color = '#8b5cf6' }: Props) {
  return (
    <motion.div
      onClick={onClick}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: 'easeOut' }}
      whileHover={{ y: -2 }}
      className={`glass card cursor-pointer select-none transition-all ${
        active
          ? 'border-violet-500/30 bg-violet-500/10 shadow-[0_0_24px_-6px_rgba(139,92,246,0.35)]'
          : 'border-white/[0.07] hover:border-violet-500/20'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${color}22`, border: `1px solid ${color}44`, boxShadow: `0 0 16px -4px ${color}66` }}
        >
          <Icon size={18} style={{ color }} />
        </div>
        <svg viewBox="0 0 124 40" width="80" height="28" className="opacity-70">
          <motion.path
            d={SPARK}
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: delay + 0.3, duration: 1.2, ease: 'easeOut' }}
          />
        </svg>
      </div>

      <p className="text-xs text-slate-400 mb-0.5">{label}</p>
      <AnimatedNumber value={value} className="text-3xl font-black text-white" duration={1.1} />
      <p className="text-[11px] text-slate-500 mt-1 leading-tight">{sublabel}</p>
    </motion.div>
  )
}
