'use client'
import { usePathname } from 'next/navigation'
import TopBar from './TopBar'
import AuthGate from './AuthGate'
import SyncProvider from '@/components/providers/SyncProvider'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/login'

  return (
    <AuthGate>
      <SyncProvider>
        {!isLoginPage && <TopBar />}
        <main className={!isLoginPage ? 'pt-16 pb-10 min-h-screen' : 'min-h-screen'}>
          {children}
        </main>
      </SyncProvider>
    </AuthGate>
  )
}
