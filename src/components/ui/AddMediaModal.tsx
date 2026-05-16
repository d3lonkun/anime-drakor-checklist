'use client'
import { useState } from 'react'
import { X } from 'lucide-react'
import { MediaEntry, MediaCategory, MediaSubtype, WatchStatus } from '@/types'
import { saveEntry, generateId, STATUS_LABELS } from '@/lib/storage'

interface Props {
  category: MediaCategory
  onClose: () => void
  onAdd: () => void
}

const SUBTYPE_OPTIONS: Record<MediaCategory, { value: MediaSubtype; label: string }[]> = {
  anime: [{ value: 'anime', label: 'Anime' }],
  manga: [
    { value: 'manga', label: 'Manga (Jepang)' },
    { value: 'manhwa', label: 'Manhwa (Korea)' },
    { value: 'manhua', label: 'Manhua (China)' },
    { value: 'komik_indo', label: 'Komik Indo' },
    { value: 'webtoon', label: 'Webtoon' },
    { value: 'novel', label: 'Novel/LN' },
  ],
  drakor: [{ value: 'drakor', label: 'Drama Korea' }],
  dorama: [{ value: 'dorama', label: 'Dorama Jepang' }],
}

const STATUSES: WatchStatus[] = ['plan_to_watch', 'watching', 'completed', 'on_hold', 'dropped']

export default function AddMediaModal({ category, onClose, onAdd }: Props) {
  const defaultSubtype = SUBTYPE_OPTIONS[category][0].value
  const [form, setForm] = useState({
    title: '',
    subtype: defaultSubtype as MediaSubtype,
    status: 'plan_to_watch' as WatchStatus,
    progress: 0,
    total: '' as string | number,
    score: '' as string | number,
    notes: '',
    image_url: '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function handleSave() {
    if (!form.title.trim()) {
      setError('Judul harus diisi!')
      return
    }
    setSaving(true)
    const entry: MediaEntry = {
      id: generateId(),
      title: form.title.trim(),
      category,
      subtype: form.subtype,
      status: form.status,
      progress: Number(form.progress) || 0,
      total: form.total !== '' ? Number(form.total) : null,
      score: form.score !== '' ? Number(form.score) : null,
      notes: form.notes,
      image_url: form.image_url || undefined,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    saveEntry(entry)
    onAdd()
    onClose()
    setSaving(false)
  }

  const isReadable = category === 'manga'
  const unitLabel = isReadable ? 'Chapter/Volume' : 'Episode'

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()}>
        <div className="w-10 h-1 bg-[#2a3050] rounded-full mx-auto mb-4" />

        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-base text-slate-100" style={{ fontFamily: 'Syne, sans-serif' }}>
            Tambah Manual
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-xl text-slate-500 hover:bg-white/5">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3">
          {/* Title */}
          <div>
            <label className="text-xs text-slate-500 mb-1.5 block font-medium">Judul *</label>
            <input
              type="text"
              value={form.title}
              onChange={e => { setForm(f => ({ ...f, title: e.target.value })); setError('') }}
              placeholder="Masukkan judul..."
              className="search-input pl-4"
              autoFocus
            />
            {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
          </div>

          {/* Subtype */}
          {SUBTYPE_OPTIONS[category].length > 1 && (
            <div>
              <label className="text-xs text-slate-500 mb-1.5 block font-medium">Tipe</label>
              <div className="grid grid-cols-2 gap-2">
                {SUBTYPE_OPTIONS[category].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setForm(f => ({ ...f, subtype: opt.value }))}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-medium transition-all ${
                      form.subtype === opt.value
                        ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                        : 'border-[#2a3050] text-slate-500 bg-[#1f2437]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Status */}
          <div>
            <label className="text-xs text-slate-500 mb-1.5 block font-medium">Status</label>
            <select
              value={form.status}
              onChange={e => setForm(f => ({ ...f, status: e.target.value as WatchStatus }))}
              className="w-full bg-[#1f2437] border border-[#2a3050] rounded-xl px-3 py-3 text-slate-200 text-sm outline-none focus:border-blue-500/50"
            >
              {STATUSES.map(s => (
                <option key={s} value={s}>{STATUS_LABELS[s]}</option>
              ))}
            </select>
          </div>

          {/* Progress & Total */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-slate-500 mb-1.5 block font-medium">Progress</label>
              <input
                type="number"
                min={0}
                value={form.progress}
                onChange={e => setForm(f => ({ ...f, progress: parseInt(e.target.value) || 0 }))}
                className="search-input pl-4 text-center"
                placeholder="0"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1.5 block font-medium">Total {isReadable ? 'Ch' : 'Ep'}</label>
              <input
                type="number"
                min={1}
                value={form.total}
                onChange={e => setForm(f => ({ ...f, total: e.target.value }))}
                className="search-input pl-4 text-center"
                placeholder="?"
              />
            </div>
          </div>

          {/* Score */}
          <div>
            <label className="text-xs text-slate-500 mb-1.5 block font-medium">Skor (1-10)</label>
            <input
              type="number"
              min={1}
              max={10}
              value={form.score}
              onChange={e => setForm(f => ({ ...f, score: e.target.value }))}
              className="search-input pl-4"
              placeholder="Nilai 1-10..."
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="text-xs text-slate-500 mb-1.5 block font-medium">URL Gambar Cover (opsional)</label>
            <input
              type="url"
              value={form.image_url}
              onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))}
              className="search-input pl-4"
              placeholder="https://..."
            />
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

        <div className="flex gap-2 mt-5">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-[#2a3050] text-slate-400 font-medium text-sm">
            Batal
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-semibold text-sm active:bg-blue-700"
          >
            Tambah
          </button>
        </div>
      </div>
    </div>
  )
}
