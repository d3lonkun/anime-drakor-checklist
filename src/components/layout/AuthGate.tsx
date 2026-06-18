'use client'
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth'
import { syncFromSupabaseToLocal } from '@/lib/sync'
import { supabase } from '@/lib/supabase'

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<'loading' | 'auth' | 'unauth'>('loading')
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const authed = isAuthenticated()

    if (authed) {
      setStatus('auth')
      // Sync pertama saat buka app
      syncFromSupabaseToLocal().catch(console.error)
    } else if (pathname !== '/login') {
      router.replace('/login')
      setStatus('unauth')
    } else {
      setStatus('unauth')
    }
  }, [pathname, router])

  // Sync saat user balik ke tab/window (visibility change)
  useEffect(() => {
    if (status !== 'auth') return

    const handleVisibility = () => {
      if (!document.hidden) {
        // User balik ke tab ini — sync dari Supabase
        syncFromSupabaseToLocal().catch(console.error)
      }
    }

    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [status])

  // Supabase Realtime — update otomatis saat ada perubahan di device lain
  useEffect(() => {
    if (status !== 'auth' || !supabase) return

    const channel = supabase
      .channel('realtime-media-entries')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'media_entries' },
        async () => {
          // Ada perubahan di Supabase → sync ke localStorage dan update UI
          await syncFromSupabaseToLocal()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [status])

  if (status === 'loading') {
    return (
      <div className="fixed inset-0 bg-[#0d0f14] flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
        <p className="text-slate-600 text-sm">Memuat...</p>
      </div>
    )
  }

  if (pathname === '/login') {
    return <>{children}</>
  }

  if (status !== 'auth') return null

  return <>{children}</>
}
