import type { Metadata, Viewport } from 'next'
import './globals.css'
import ClientLayout from '@/components/layout/ClientLayout'
import BackgroundImage from '@/components/ui/BackgroundImage'

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
        {/* Background image (client component) */}
        <BackgroundImage />

        {/* App */}
        <div className="relative z-10 min-h-screen">
          <ClientLayout>{children}</ClientLayout>
        </div>
      </body>
    </html>
  )
}
