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
}

const SPARK_PATH = 'M2,26 C16,8 28,34 42,16 C56,-2 68,28 82,14 C94,3 106,22 124,9'

export default function StatCard({ icon: Icon, label, value, sublabel, active, onClick, delay = 0 }: Props) {
  const Wrapper = onClick ? motion.button : motion.div

  return (
    <Wrapper
      onClick={onClick}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45, ease: 'easeOut' }}
      whileHover={onClick ? { y: -3 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      className={`relative text-left rounded-2xl p-4 sm:p-5 border transition-colors w-full ${
        active
          ? 'bg-violet-500/10 border-violet-500/50'
          : 'bg-[#150f24] border-[#241a3a] hover:border-violet-500/30'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center border"
          style={{
            background: 'radial-gradient(circle, rgba(168,85,247,0.18), rgba(168,85,247,0.04))',
            borderColor: 'rgba(168,85,247,0.35)',
            boxShadow: '0 0 18px -4px rgba(168,85,247,0.45)',
          }}
        >
          <Icon size={18} className="text-violet-300" />
        </div>

        <svg viewBox="0 0 124 40" width="92" height="32" className="hidden sm:block">
          <motion.path
            d={SPARK_PATH}
            fill="none"
            stroke="#a855f7"
            strokeWidth="2.2"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.8 }}
            transition={{ delay: delay + 0.2, duration: 1.1, ease: 'easeOut' }}
          />
        </svg>
      </div>

      <p className="text-xs text-slate-400 mb-0.5">{label}</p>
      <AnimatedNumber
        value={value}
        className="text-3xl font-black text-white block"
        duration={1.1}
      />
      <p className="text-[11px] text-slate-500 mt-1">{sublabel}</p>
    </Wrapper>
  )
}
