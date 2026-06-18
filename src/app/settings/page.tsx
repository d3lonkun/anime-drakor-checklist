'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut, RefreshCw, Database, CheckCircle } from 'lucide-react'
import { logout } from '@/lib/auth'
import { syncFromSupabaseToLocal, pushAllToSupabase } from '@/lib/sync'
import { getAllEntries } from '@/lib/storage'

export default function SettingsPage() {
  const router = useRouter()
  const [syncing, setSyncing] = useState(false)
  const [syncMsg, setSyncMsg] = useState('')
  const [logoutConfirm, setLogoutConfirm] = useState(false)

  async function handleSyncFromCloud() {
    setSyncing(true)
    setSyncMsg('')
    const ok = await syncFromSupabaseToLocal()
    setSyncing(false)
    setSyncMsg(ok ? '✅ Data berhasil disinkron dari cloud!' : '⚠️ Tidak ada data di cloud atau koneksi gagal.')
    setTimeout(() => setSyncMsg(''), 4000)
  }

  async function handlePushToCloud() {
    setSyncing(true)
    setSyncMsg('')
    const entries = getAllEntries()
    await pushAllToSupabase(entries)
    setSyncing(false)
    setSyncMsg(`✅ ${entries.length} item berhasil diupload ke cloud!`)
    setTimeout(() => setSyncMsg(''), 4000)
  }

  function handleLogout() {
    if (logoutConfirm) {
      logout()
      router.replace('/login')
    } else {
      setLogoutConfirm(true)
      setTimeout(() => setLogoutConfirm(false), 3000)
    }
  }

  const totalEntries = getAllEntries().length

  return (
    <div className="px-4 py-4 space-y-4 animate-fade-in">
      {/* Info */}
      <div className="bg-gradient-to-br from-blue-600/20 to-violet-600/10 rounded-2xl p-4 border border-blue-500/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center">
            <span className="text-lg">🎌</span>
          </div>
          <div>
            <p className="font-bold text-slate-200" style={{ fontFamily: 'Syne, sans-serif' }}>
              OtakuTracker
            </p>
            <p className="text-xs text-slate-500">{totalEntries} item di list kamu</p>
          </div>
        </div>
      </div>

      {/* Sync section */}
      <div className="bg-[#1a1e2e] rounded-2xl border border-[#1e2538] overflow-hidden">
        <div className="px-4 py-3 border-b border-[#1e2538]">
          <p className="text-xs text-slate-500 uppercase tracking-widest font-medium">Sinkronisasi Cloud</p>
        </div>

        <div className="divide-y divide-[#1e2538]">
          <button
            onClick={handleSyncFromCloud}
            disabled={syncing}
            className="w-full flex items-center gap-3 px-4 py-4 text-left hover:bg-white/5 active:bg-white/10 transition-colors"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-500/15 flex items-center justify-center flex-shrink-0">
              <RefreshCw size={18} className={`text-blue-400 ${syncing ? 'animate-spin' : ''}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-200">Ambil dari Cloud</p>
              <p className="text-xs text-slate-500 mt-0.5">Update data dari Supabase ke device ini</p>
            </div>
          </button>

          <button
            onClick={handlePushToCloud}
            disabled={syncing}
            className="w-full flex items-center gap-3 px-4 py-4 text-left hover:bg-white/5 active:bg-white/10 transition-colors"
          >
            <div className="w-9 h-9 rounded-xl bg-green-500/15 flex items-center justify-center flex-shrink-0">
              <Database size={18} className="text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-200">Upload ke Cloud</p>
              <p className="text-xs text-slate-500 mt-0.5">Kirim semua data device ini ke Supabase</p>
            </div>
          </button>
        </div>

        {syncMsg && (
          <div className="px-4 py-3 bg-[#1f2437] border-t border-[#1e2538]">
            <p className="text-sm text-slate-300">{syncMsg}</p>
          </div>
        )}
      </div>

      {/* Info sinkron */}
      <div className="bg-[#1a1e2e] rounded-2xl p-4 border border-[#1e2538]">
        <p className="text-xs text-slate-500 uppercase tracking-widest font-medium mb-3">Info</p>
        <div className="space-y-2 text-xs text-slate-500 leading-relaxed">
          <p>• Data otomatis tersimpan ke cloud setiap kali kamu menambah atau mengubah item.</p>
          <p>• Saat buka app, data otomatis diambil dari cloud.</p>
          <p>• Gunakan <strong className="text-slate-400">"Ambil dari Cloud"</strong> jika data belum update setelah ganti device.</p>
          <p>• Gunakan <strong className="text-slate-400">"Upload ke Cloud"</strong> jika baru pertama kali login di device baru.</p>
        </div>
      </div>

      {/* Logout */}
      <div className="bg-[#1a1e2e] rounded-2xl border border-[#1e2538] overflow-hidden">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-4 py-4 transition-colors ${
            logoutConfirm
              ? 'bg-red-500/10'
              : 'hover:bg-white/5 active:bg-white/10'
          }`}
        >
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
            logoutConfirm ? 'bg-red-500/20' : 'bg-red-500/15'
          }`}>
            <LogOut size={18} className="text-red-400" />
          </div>
          <div className="text-left">
            <p className={`text-sm font-medium ${logoutConfirm ? 'text-red-400' : 'text-slate-200'}`}>
              {logoutConfirm ? 'Ketuk lagi untuk keluar' : 'Keluar'}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              {logoutConfirm ? 'Data tersimpan di cloud, aman kok!' : 'Data kamu tidak akan hilang'}
            </p>
          </div>
        </button>
      </div>
    </div>
  )
}
