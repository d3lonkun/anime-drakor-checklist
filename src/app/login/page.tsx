'use client'
import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { KeyRound, Loader2, Eye, EyeOff } from 'lucide-react'
import { setAuthenticated, verifyCode } from '@/lib/auth'
import { pullFromSupabase, pushAllToSupabase } from '@/lib/sync'
import { getAllEntries } from '@/lib/storage'
import BackgroundImage from '@/components/ui/BackgroundImage'

const STORAGE_KEY = 'otaku_tracker_data'
const DISPLAY_NAME = process.env.NEXT_PUBLIC_USER_NAME || 'GEFRANDO'

export default function LoginPage() {
  const [code, setCode] = useState('')
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleLogin() {
    if (!code.trim()) { setError('Masukkan Secret ID dulu!'); return }
    setLoading(true)
    setError('')

    const ok = await verifyCode(code.trim())
    if (!ok) { setError('Secret ID salah! Coba lagi.'); setLoading(false); return }

    setAuthenticated(true)
    setSyncing(true)

    const supabaseData = await pullFromSupabase()
    const localData = getAllEntries()
    if (supabaseData && supabaseData.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(supabaseData))
    } else if (localData.length > 0) {
      await pushAllToSupabase(localData)
    }

    router.replace('/')
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center px-5 overflow-hidden">
      {/* Background foto kamu (dari /public/background.jpg) */}
      <BackgroundImage />

      {/* Kartu login */}
      <div className="relative z-10 w-full max-w-sm">
        <div
          className="rounded-[28px] px-7 py-9 flex flex-col items-center text-center shadow-2xl"
          style={{
            background: 'rgba(8, 5, 26, 0.55)',
            backdropFilter: 'blur(22px) saturate(1.4)',
            WebkitBackdropFilter: 'blur(22px) saturate(1.4)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          {/* Avatar */}
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-[3px] border-white/80 shadow-lg mb-5">
            <Image src="/avatar.jpg" alt="Avatar" fill className="object-cover" priority />
          </div>

          {/* Greeting */}
          <h1
            className="text-white text-[26px] leading-tight mb-6 drop-shadow-md font-black"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            Hi {DISPLAY_NAME}!
          </h1>

          {/* Input */}
          <div className="w-full relative mb-2">
            <KeyRound size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
            <input
              type={show ? 'text' : 'password'}
              value={code}
              onChange={e => { setCode(e.target.value); setError('') }}
              onKeyDown={e => e.key === 'Enter' && !loading && handleLogin()}
              placeholder="SECRET ID"
              autoFocus
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              className="w-full rounded-2xl pl-11 pr-11 py-3.5 text-white text-sm tracking-widest uppercase outline-none transition-all"
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                fontFamily: 'Inter, sans-serif',
              }}
              onFocus={e => { e.target.style.borderColor = 'rgba(139,92,246,0.6)'; e.target.style.background = 'rgba(139,92,246,0.08)' }}
              onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.15)'; e.target.style.background = 'rgba(255,255,255,0.08)' }}
            />
            <button
              type="button"
              onClick={() => setShow(s => !s)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
            >
              {show ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>

          {error && <p className="text-rose-300 text-xs mb-3 mt-1">{error}</p>}

          {/* Tombol masuk */}
          <button
            onClick={handleLogin}
            disabled={loading || syncing}
            className="w-full mt-4 py-3.5 rounded-2xl text-white font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-60"
            style={{
              fontFamily: 'Outfit, sans-serif',
              background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
              boxShadow: '0 8px 24px -6px rgba(124,58,237,0.5)',
            }}
          >
            {syncing ? <><Loader2 size={15} className="animate-spin" /> MENYINKRON...</>
              : loading ? <><Loader2 size={15} className="animate-spin" /> MEMVERIFIKASI...</>
              : 'MASUK'}
          </button>
        </div>

        <p className="text-center text-white/30 text-[11px] mt-5 tracking-wide">
          Hanya untuk penggunaan pribadi 🔒
        </p>
      </div>
    </div>
  )
}
