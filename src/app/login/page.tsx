'use client'
import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { KeyRound, Loader2, Eye, EyeOff } from 'lucide-react'
import { setAuthenticated, verifyCode } from '@/lib/auth'
import { pullFromSupabase, pushAllToSupabase } from '@/lib/sync'
import { getAllEntries } from '@/lib/storage'
import LoginBackground from '@/components/ui/LoginBackground'

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
    if (!code.trim()) {
      setError('Masukkan Secret ID dulu!')
      return
    }
    setLoading(true)
    setError('')

    const ok = await verifyCode(code.trim())
    if (!ok) {
      setError('Secret ID salah! Coba lagi.')
      setLoading(false)
      return
    }

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
      <LoginBackground />

      <div className="relative z-10 w-full max-w-sm">
        <div
          className="rounded-[28px] px-7 py-9 flex flex-col items-center text-center shadow-2xl"
          style={{
            background: 'rgba(20, 18, 22, 0.42)',
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
            border: '1px solid rgba(255,255,255,0.14)',
          }}
        >
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-[3px] border-white/85 shadow-lg mb-5">
            <Image src="/avatar.jpg" alt="Avatar" fill className="object-cover" priority />
          </div>

          <h1
            className="text-white text-[28px] leading-tight mb-6 drop-shadow-md"
            style={{ fontFamily: "'Zen Maru Gothic', sans-serif", fontWeight: 700 }}
          >
            Hi {DISPLAY_NAME}!
          </h1>

          <div className="w-full relative mb-2">
            <KeyRound size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/55 pointer-events-none" />
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
              className="w-full bg-white/10 border border-white/25 rounded-2xl pl-11 pr-11 py-3.5 text-white text-sm tracking-widest uppercase placeholder-white/45 outline-none focus:border-white/50 focus:bg-white/14 transition-all"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            />
            <button
              type="button"
              onClick={() => setShow(s => !s)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors"
            >
              {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {error && <p className="text-rose-200 text-xs mb-3 mt-1">{error}</p>}

          <button
            onClick={handleLogin}
            disabled={loading || syncing}
            className="w-full mt-4 py-3.5 rounded-2xl text-white font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              background: 'linear-gradient(135deg, #5b6cd9, #3d4ab0)',
              boxShadow: '0 8px 24px -6px rgba(61, 74, 176, 0.55)',
            }}
          >
            {syncing ? (
              <><Loader2 size={16} className="animate-spin" /> MENYINKRON...</>
            ) : loading ? (
              <><Loader2 size={16} className="animate-spin" /> MEMVERIFIKASI...</>
            ) : (
              'MASUK'
            )}
          </button>
        </div>

        <p className="text-center text-white/40 text-[11px] mt-6 tracking-wide">
          Hanya untuk penggunaan pribadi 🔒
        </p>
      </div>

      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@500;700&family=DM+Sans:wght@400;500;600;700&display=swap"
      />
    </div>
  )
}
