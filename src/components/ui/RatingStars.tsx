'use client'
import { Star } from 'lucide-react'

export default function RatingStars({ score, size = 14 }: { score: number | null; size?: number }) {
  const v = score ? score / 2 : 0
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = v >= i + 1
        const half = !filled && v >= i + 0.5
        if (half) return (
          <span key={i} className="relative inline-block" style={{ width: size, height: size }}>
            <Star size={size} className="absolute text-white/10" />
            <span className="absolute overflow-hidden" style={{ width: '50%' }}>
              <Star size={size} className="text-violet-400 fill-violet-400" />
            </span>
          </span>
        )
        return <Star key={i} size={size} className={filled ? 'text-violet-400 fill-violet-400' : 'text-white/10'} />
      })}
    </div>
  )
}
