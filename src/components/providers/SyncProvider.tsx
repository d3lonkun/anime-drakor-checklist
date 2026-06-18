'use client'
import { useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { syncFromSupabaseToLocal } from '@/lib/sync'
import { isAuthenticated } from '@/lib/auth'

const POLL_INTERVAL = 15000 // poll tiap 15 detik sebagai fallback

export default function SyncProvider({ children }: { children: React.ReactNode }) {
  const isSyncing = useRef(false)

  async function doSync() {
    if (isSyncing.current) return
    if (!isAuthenticated()) return
    isSyncing.current = true
    try {
      await syncFromSupabaseToLocal()
    } finally {
      isSyncing.current = false
    }
  }

  useEffect(() => {
    if (!isAuthenticated()) return

    // 1. Sync pertama saat app buka
    doSync()

    // 2. Polling setiap 15 detik (fallback kalau Realtime putus)
    const pollInterval = setInterval(doSync, POLL_INTERVAL)

    // 3. Sync saat tab aktif kembali (pindah tab/app lalu balik)
    const handleVisibility = () => {
      if (!document.hidden) doSync()
    }
    document.addEventListener('visibilitychange', handleVisibility)

    // 4. Sync saat window fokus (klik kembali ke window)
    const handleFocus = () => doSync()
    window.addEventListener('focus', handleFocus)

    // 5. Supabase Realtime — update instan dari device lain
    const channel = supabase
      ?.channel('global-media-sync')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'media_entries' },
        () => {
          // Ada perubahan di Supabase (dari device lain) → sync sekarang
          doSync()
        }
      )
      .subscribe((status) => {
        console.log('[Realtime] status:', status)
      })

    return () => {
      clearInterval(pollInterval)
      document.removeEventListener('visibilitychange', handleVisibility)
      window.removeEventListener('focus', handleFocus)
      if (channel) supabase?.removeChannel(channel)
    }
  }, [])

  return <>{children}</>
}
