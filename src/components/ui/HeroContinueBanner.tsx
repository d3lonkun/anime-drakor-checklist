'use client'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Play } from 'lucide-react'
import { MediaEntry } from '@/types'

const CATEGORY_HREF: Record<string, string> = {
  anime: '/anime', manga: '/manga', drakor: '/drakor', dorama: '/dorama',
}

export default function HeroContinueBanner({ entry }: { entry: MediaEntry }) {
  const unit = entry.category === 'manga' ? 'Chapter' : 'Episode'

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="relative rounded-3xl overflow-hidden border border-white/[0.08] h-64 sm:h-72 lg:h-80"
    >
      {entry.image_url ? (
        <Image
          src={entry.image_url}
          alt={entry.title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/60 via-[#1a0f35] to-[#08051a]" />
      )}

      {/* Gradient overlay supaya teks tetap terbaca */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#08051a] via-[#08051a]/75 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#08051a]/60 via-transparent to-transparent" />

      <div className="relative z-10 h-full flex flex-col justify-end p-6 sm:p-8 max-w-lg">
        <p className="text-violet-400 text-xs font-semibold uppercase tracking-wider mb-2">
          Terakhir di tonton
        </p>
        <h2 className="text-2xl sm:text-3xl font-black text-white mb-1.5 leading-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
          {entry.title}
        </h2>
        <p className="text-sm text-slate-300 mb-5">{unit} {entry.progress}</p>
        <Link
          href={CATEGORY_HREF[entry.category]}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-bold w-fit transition-colors shadow-[0_8px_24px_-6px_rgba(124,58,237,0.6)]"
        >
          <Play size={15} className="fill-white" />
          Lanjutkan
        </Link>
      </div>
    </motion.div>
  )
}
