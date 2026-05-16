'use client'
import { useState } from 'react'
import Image from 'next/image'
import { X, Star, Trash2, ExternalLink, ChevronDown } from 'lucide-react'
import { MediaEntry, WatchStatus } from '@/types'
import { saveEntry, deleteEntry, STATUS_LABELS, STATUS_BG } from '@/lib/storage'

interface Props {
  entry: MediaEntry
  onClose: () => void
  onUpdate: () => void
  onDelete: () => void
}

const ALL_STATUSES: WatchStatus[] = ['watching', 'completed', 'on_hold', 'dropped', 'plan_to_watch']

export default function MediaDetailModal({ entry, onClose, onUpdate, onDelete }: Props) {
  const [form, setForm] = useState<MediaEntry>({ ...entry })
  const [saving, setSaving] = useState(false)
  const [delConfirm, setDelConfirm] = useState(false)

  function handleSave() {
    setSaving(true)
    saveEntry({ ...form, updated_at: new Date().toISOString() })
    onUpdate()
    setSaving(false)
    onClose()
  }

  function handleDelete() {
    if (delConfirm) {
      deleteEntry(entry.id)
      onDelete()
      onClose()
    } else {
      setDelConfirm(true)
      setTimeout(() => setDelConfirm(false), 3000)
    }
  }

  const isReadable = form.category === 'manga'
  const unit = isReadable ? 'Chapter' : 'Episode'

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()}>
        {/* Handle bar */}
        <div className="w-10 h-1 bg-[#2a3050] rounded-full mx-auto mb-4" />

        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          {form.image_url && (
            <div className="relative w-16 h-20 flex-shrink-0 rounded-xl overflow-hidden">
              <Image src={form.image_url} alt={form.title} fill className="object-cover" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-base text-slate-100 leading-tight" style={{ fontFamily: 'Syne, sans-serif' }}>
              {form.title}
            </h2>
            {form.title_en && form.title_en !== form.title && (
              <p className="text-xs text-slate-500 mt-0.5 truncate">{form.title_en}</p>
            )}
            <div className="flex items-center gap-2 mt-1.5">
              {form.mal_score && (
                <div className="flex items-center gap-1">
                  <Star size={12} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-xs text-slate-400">MAL: {form.mal_score}</span>
                </div>
              )}
              {form.year && (
                <span className="text-xs text-slate-500">{form.year}</span>
              )}
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl text-slate-500 hover:text-slate-300 hover:bg-white/5 flex-shrink-0">
            <X size={18} />
          </button>
        </div>

        {/* Synopsis */}
        {form.synopsis && (
          <div className="bg-[#1f2437] rounded-xl p-3 mb-4">
            <p className="text-xs text-slate-400 leading-relaxed line-clamp-4">{form.synopsis}</p>
          </div>
        )}

        {/* Genres */}
        {form.genres && form.genres.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {form.genres.slice(0, 5).map(g => (
              <span key={g} className="chip bg-white/5 border-white/10 text-slate-400">{g}</span>
            ))}
          </div>
        )}

        <div className="space-y-3">
          {/* Status */}
          <div>
            <label className="text-xs text-slate-500 mb-1.5 block font-medium">Status</label>
            <div className="grid grid-cols-2 gap-2">
              {ALL_STATUSES.map(s => (
                <button
                  key={s}
                  onClick={() => setForm(f => ({ ...f, status: s }))}
                  className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                    form.status === s
                      ? `${STATUS_BG[s]} scale-[0.98]`
                      : 'border-[#2a3050] text-slate-500 bg-[#1f2437]'
                  }`}
                >
                  {STATUS_LABELS[s]}
                </button>
              ))}
            </div>
          </div>

          {/* Progress */}
          <div>
            <label className="text-xs text-slate-500 mb-1.5 block font-medium">
              Progress ({unit} yang sudah ditonton/dibaca)
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-[#1f2437] border border-[#2a3050] rounded-xl flex items-center">
                <button
                  onClick={() => setForm(f => ({ ...f, progress: Math.max(0, f.progress - 1) }))}
                  className="px-4 py-3 text-slate-400 active:bg-white/5 rounded-l-xl"
                >−</button>
                <input
                  type="number"
                  min={0}
                  max={form.total ?? 99999}
                  value={form.progress}
                  onChange={e => setForm(f => ({ ...f, progress: parseInt(e.target.value) || 0 }))}
                  className="flex-1 text-center bg-transparent text-slate-100 text-base font-bold outline-none py-3"
                />
                <button
                  onClick={() => setForm(f => ({ ...f, progress: f.progress + 1 }))}
                  className="px-4 py-3 text-slate-400 active:bg-white/5 rounded-r-xl"
                >+</button>
              </div>
              {form.total && (
                <span className="text-slate-500 text-sm whitespace-nowrap">/ {form.total}</span>
              )}
            </div>
            {form.total && (
              <div className="progress-bar mt-2">
                <div
                  className="progress-bar-fill bg-blue-500"
                  style={{ width: `${Math.min(100, (form.progress / form.total) * 100)}%` }}
                />
              </div>
            )}
          </div>

          {/* Total (editable for custom entries) */}
          {!form.mal_id && (
            <div>
              <label className="text-xs text-slate-500 mb-1.5 block font-medium">
                Total {unit} (kosongkan jika tidak tahu)
              </label>
              <input
                type="number"
                min={1}
                value={form.total ?? ''}
                onChange={e => setForm(f => ({ ...f, total: parseInt(e.target.value) || null }))}
                className="search-input"
                placeholder="Total episode/chapter..."
              />
            </div>
          )}

          {/* Score */}
          <div>
            <label className="text-xs text-slate-500 mb-1.5 block font-medium">Skor Kamu (1-10)</label>
            <div className="grid grid-cols-5 gap-1.5">
              {[2, 4, 6, 7, 8, 9, 10].map(s => (
                <button
                  key={s}
                  onClick={() => setForm(f => ({ ...f, score: f.score === s ? null : s }))}
                  className={`py-2.5 rounded-xl text-sm font-bold border transition-all ${
                    form.score === s
                      ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400'
                      : 'border-[#2a3050] text-slate-500 bg-[#1f2437]'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs text-slate-500 mb-1.5 block font-medium">Catatan</label>
            <textarea
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              rows={2}
              placeholder="Catatan pribadi..."
              className="w-full bg-[#1f2437] border border-[#2a3050] rounded-xl p-3 text-slate-200 text-sm outline-none resize-none placeholder-[#4a5568] focus:border-blue-500/50"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-5">
          <button
            onClick={handleDelete}
            className={`p-3 rounded-xl border transition-all ${
              delConfirm
                ? 'bg-red-500/20 border-red-500/50 text-red-400'
                : 'border-[#2a3050] text-slate-500 bg-[#1f2437]'
            }`}
          >
            <Trash2 size={18} />
          </button>
          {form.mal_url && (
            <a
              href={form.mal_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl border border-[#2a3050] text-slate-500 bg-[#1f2437]"
            >
              <ExternalLink size={18} />
            </a>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-semibold text-sm active:bg-blue-700 transition-colors"
          >
            {saving ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>

        {delConfirm && (
          <p className="text-center text-xs text-red-400 mt-2">Tekan lagi untuk hapus permanen</p>
        )}
      </div>
    </div>
  )
}
