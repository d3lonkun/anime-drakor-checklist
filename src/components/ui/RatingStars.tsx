'use client'
import { Star } from 'lucide-react'

interface Props {
  score: number | null
  size?: number
}

export default function RatingStars({ score, size = 15 }: Props) {
  const value = score ? score / 2 : 0

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = value >= i + 1
        const half = !filled && value >= i + 0.5

        if (half) {
          return (
            <span key={i} className="relative inline-block" style={{ width: size, height: size }}>
              <Star size={size} className="absolute inset-0 text-[#2a2440]" />
              <span className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
                <Star size={size} className="text-violet-400 fill-violet-400" />
              </span>
            </span>
          )
        }

        return (
          <Star
            key={i}
            size={size}
            className={filled ? 'text-violet-400 fill-violet-400' : 'text-[#2a2440]'}
          />
        )
      })}
    </div>
  )
}
