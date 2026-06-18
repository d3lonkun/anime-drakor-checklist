'use client'
import { usePathname } from 'next/navigation'
import TopBar from './TopBar'
import BottomNav from './BottomNav'
import AuthGate from './AuthGate'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/login'

  return (
    <AuthGate>
      {!isLoginPage && <TopBar />}
      <main className={!isLoginPage ? 'pt-14 pb-24 min-h-screen' : 'min-h-screen'}>
        {children}
      </main>
      {!isLoginPage && <BottomNav />}
    </AuthGate>
  )
}
