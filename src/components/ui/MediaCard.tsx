'use client'
import Image from 'next/image'
import { useState } from 'react'
import { Star, ChevronRight, Plus, Minus, Check } from 'lucide-react'
import { MediaEntry, WatchStatus } from '@/types'
import { STATUS_BG, STATUS_LABELS, updateProgress, updateStatus } from '@/lib/storage'

interface Props {
  entry: MediaEntry
  onUpdate: () => void
  onClick: () => void
}

export default function MediaCard({ entry, onUpdate, onClick }: Props) {
  const [imgError, setImgError] = useState(false)
  const progressPct = entry.total ? Math.min(100, (entry.progress / entry.total) * 100) : null

  const isReadable = entry.category === 'manga'
  const unit = isReadable ? 'Ch' : 'Ep'

  function handleProgressChange(delta: number) {
    const newVal = Math.max(0, entry.progress + delta)
    updateProgress(entry.id, newVal)
    onUpdate()
  }

  return (
    <div
      className="bg-[#1a1e2e] rounded-2xl overflow-hidden border border-[#1e2538] card-hover active:scale-[0.97] transition-all duration-150"
    >
      {/* Image + overlay */}
      <div className="relative" onClick={onClick}>
        <div className="aspect-[3/4] bg-[#151820] relative overflow-hidden">
          {entry.image_url && !imgError ? (
            <Image
              src={entry.image_url}
              alt={entry.title}
              fill
              className="object-cover"
              onError={() => setImgError(true)}
              sizes="(max-width: 768px) 45vw, 200px"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-[#1f2437]">
              <span className="text-2xl">
                {entry.category === 'anime' ? '🎌' : entry.category === 'manga' ? '📚' : entry.category === 'drakor' ? '💝' : '🎭'}
              </span>
            </div>
          )}
          {/* Score badge */}
          {entry.score && (
            <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded-lg px-1.5 py-0.5 flex items-center gap-1">
              <Star size={10} className="text-yellow-400 fill-yellow-400" />
              <span className="text-[11px] font-bold text-white">{entry.score}</span>
            </div>
          )}
          {/* Status chip */}
          <div className="absolute bottom-2 left-2 right-2">
            <span className={`chip text-[10px] ${STATUS_BG[entry.status]} border`}>
              {STATUS_LABELS[entry.status]}
            </span>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-2.5">
        <p className="text-[13px] font-semibold text-slate-200 leading-tight line-clamp-2 mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>
          {entry.title}
        </p>

        {/* Progress */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400">{unit} {entry.progress}{entry.total ? `/${entry.total}` : ''}</span>
            {progressPct !== null && (
              <span className="text-slate-500">{Math.round(progressPct)}%</span>
            )}
          </div>
          {progressPct !== null && (
            <div className="progress-bar">
              <div
                className="progress-bar-fill"
                style={{
                  width: `${progressPct}%`,
                  background: entry.status === 'completed'
                    ? 'var(--accent-green)'
                    : entry.category === 'anime' ? 'var(--accent-blue)'
                    : entry.category === 'manga' ? '#f59e0b'
                    : entry.category === 'drakor' ? '#ec4899'
                    : 'var(--accent-cyan)',
                }}
              />
            </div>
          )}
        </div>

        {/* Quick progress controls */}
        {entry.status === 'watching' || entry.status === 'on_hold' ? (
          <div className="flex items-center justify-between mt-2 gap-1">
            <button
              onClick={() => handleProgressChange(-1)}
              className="flex-1 py-1.5 rounded-lg bg-[#1f2437] border border-[#2a3050] text-slate-400 flex items-center justify-center active:bg-white/10"
            >
              <Minus size={14} />
            </button>
            <button
              onClick={() => handleProgressChange(1)}
              className="flex-1 py-1.5 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-400 flex items-center justify-center active:bg-blue-500/30"
            >
              <Plus size={14} />
            </button>
          </div>
        ) : null}
      </div>
    </div>
  )
}
