import type { Metadata, Viewport } from 'next'
import './globals.css'
import ClientLayout from '@/components/layout/ClientLayout'

export const metadata: Metadata = {
  title: 'My Tracker',
  description: 'Tracker anime, manga, drakor & dorama',
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'My Tracker' },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#08051a',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-[#08051a] text-slate-200 antialiased">
        {/* Background image layer - ganti /background.jpg dengan foto kamu */}
        <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
          <img
            src="/background.jpg"
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-center"
            style={{ filter: 'blur(0px)' }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
          {/* Overlay gelap supaya konten tetap terbaca */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#08051ae0] via-[#0c0820cc] to-[#08051ae0]" />
          {/* Lapisan ekstra untuk glass pop */}
          <div className="absolute inset-0 bg-[#08051a]/40" />
        </div>

        {/* App */}
        <div className="relative z-10 min-h-screen">
          <ClientLayout>{children}</ClientLayout>
        </div>
      </body>
    </html>
  )
}
