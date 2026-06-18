'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { KeyRound, Loader2, Eye, EyeOff } from 'lucide-react'
import { setAuthenticated, verifyCode } from '@/lib/auth'
import { pullFromSupabase, pushAllToSupabase } from '@/lib/sync'
import { getAllEntries } from '@/lib/storage'

const STORAGE_KEY = 'otaku_tracker_data'

export default function LoginPage() {
  const [code, setCode] = useState('')
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleLogin() {
    if (!code.trim()) {
      setError('Masukkan ID kamu dulu!')
      return
    }

    setLoading(true)
    setError('')

    const ok = await verifyCode(code.trim())

    if (!ok) {
      setError('ID salah! Coba lagi.')
      setLoading(false)
      return
    }

    // ID benar — simpan status login
    setAuthenticated(true)
    setSyncing(true)

    // Sinkron data dengan Supabase
    const supabaseData = await pullFromSupabase()
    const localData = getAllEntries()

    if (supabaseData && supabaseData.length > 0) {
      // Supabase punya data → pakai data Supabase (sumber kebenaran)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(supabaseData))
    } else if (localData.length > 0) {
      // Supabase kosong, localStorage ada data → upload ke Supabase (migrasi)
      await pushAllToSupabase(localData)
    }

    router.replace('/')
  }

  return (
    <div className="min-h-screen bg-[#0d0f14] flex flex-col items-center justify-center px-6">
      {/* Logo */}
      <div className="mb-8 text-center">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-blue-500/30">
          <span className="text-4xl">🎌</span>
        </div>
        <h1
          className="text-3xl font-black text-white"
          style={{ fontFamily: 'Syne, sans-serif' }}
        >
          OtakuTracker
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Masukkan ID kamu untuk lanjut
        </p>
      </div>

      {/* Card login */}
      <div className="w-full max-w-sm bg-[#1a1e2e] rounded-2xl p-6 border border-[#1e2538] shadow-2xl">
        <label className="block text-xs text-slate-400 font-medium mb-2 uppercase tracking-widest">
          ID Akses
        </label>

        <div className="relative mb-4">
          <KeyRound
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
          />
          <input
            type={show ? 'text' : 'password'}
            value={code}
            onChange={e => {
              setCode(e.target.value)
              setError('')
            }}
            onKeyDown={e => e.key === 'Enter' && !loading && handleLogin()}
            placeholder="Masukkan ID kamu..."
            autoFocus
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            className="w-full bg-[#0d0f14] border border-[#2a3050] rounded-xl pl-10 pr-12 py-4 text-slate-200 text-base outline-none focus:border-blue-500/60 transition-colors placeholder-[#4a5568]"
          />
          <button
            type="button"
            onClick={() => setShow(s => !s)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
          >
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        {error && (
          <div className="mb-4 px-3 py-2.5 bg-red-500/10 border border-red-500/20 rounded-xl">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={loading || syncing}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold text-sm flex items-center justify-center gap-2 active:opacity-90 transition-opacity disabled:opacity-60 shadow-lg shadow-blue-500/20"
        >
          {syncing ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Menyinkron data...
            </>
          ) : loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Memverifikasi...
            </>
          ) : (
            'Masuk'
          )}
        </button>
      </div>

      <p className="text-[#2a3050] text-xs mt-8 text-center">
        Hanya untuk penggunaan pribadi 🔒
      </p>
    </div>
  )
}
