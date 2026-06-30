'use client'

export default function BackgroundImage() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
      <img
        src="/background.jpg"
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-center"
        onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
      />
      {/* Overlay gelap supaya teks tetap terbaca */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#08051ae0] via-[#0c0820cc] to-[#08051ae0]" />
      <div className="absolute inset-0 bg-[#08051a]/40" />
    </div>
  )
}
