'use client'
import { usePathname } from 'next/navigation'
import Sidebar from './Sidebar'
import DesktopTopBar from './DesktopTopBar'
import TopBar from './TopBar'
import BottomNav from './BottomNav'
import AuthGate from './AuthGate'
import SyncProvider from '@/components/providers/SyncProvider'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLogin = pathname === '/login'

  if (isLogin) {
    return <AuthGate>{children}</AuthGate>
  }

  return (
    <AuthGate>
      <SyncProvider>
        {/* Desktop */}
        <DesktopTopBar />
        <Sidebar />

        {/* Mobile */}
        <TopBar />

        <main className="lg:pl-72 pt-14 pb-20 lg:pt-20 lg:pb-10 min-h-screen">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </div>
        </main>

        <BottomNav />
      </SyncProvider>
    </AuthGate>
  )
}
