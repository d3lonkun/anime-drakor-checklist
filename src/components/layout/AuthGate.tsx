'use client'
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth'

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<'loading' | 'auth' | 'unauth'>('loading')
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const authed = isAuthenticated()
    if (authed) {
      setStatus('auth')
    } else if (pathname !== '/login') {
      router.replace('/login')
      setStatus('unauth')
    } else {
      setStatus('unauth')
    }
  }, [pathname, router])

  if (status === 'loading') {
    return (
      <div className="fixed inset-0 bg-[#0d0f14] flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
        <p className="text-slate-600 text-sm">Memuat...</p>
      </div>
    )
  }

  if (pathname === '/login') return <>{children}</>
  if (status !== 'auth') return null
  return <>{children}</>
}
