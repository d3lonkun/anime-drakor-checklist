import type { Metadata, Viewport } from 'next'
import './globals.css'
import BottomNav from '@/components/layout/BottomNav'
import TopBar from '@/components/layout/TopBar'

export const metadata: Metadata = {
  title: 'OtakuTracker - List Anime, Manga, Drakor & Dorama',
  description: 'Tracker untuk anime, manga, manhwa, drakor, dan dorama kamu',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'OtakuTracker',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0d0f14',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-[#0d0f14] text-slate-200 antialiased">
        <TopBar />
        <main className="pt-14 pb-24 min-h-screen">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  )
}
