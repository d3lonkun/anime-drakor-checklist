'use client'
import { usePathname } from 'next/navigation'
import Sidebar from './Sidebar'
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
        {/* Desktop sidebar */}
        <Sidebar />

        {/* Mobile top bar */}
        <TopBar />

        {/* Main content */}
        <main className="
          lg:pl-56 xl:pl-64
          pt-14 pb-20
          lg:pt-0 lg:pb-8
          min-h-screen
        ">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </div>
        </main>

        {/* Mobile bottom nav */}
        <BottomNav />
      </SyncProvider>
    </AuthGate>
  )
}
