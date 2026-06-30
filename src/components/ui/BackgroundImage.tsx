'use client'

// Atur angka ini untuk mengubah tingkat blur (semakin besar = semakin buram)
const BLUR_AMOUNT = 38 // dalam pixel

export default function BackgroundImage() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <img
        src="/background.jpg"
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-center"
        style={{
          // Blur dilakukan lewat CSS filter, jadi foto asli tidak perlu diedit dulu
          filter: `blur(${BLUR_AMOUNT}px) brightness(0.55) saturate(1.15)`,
          // Scale sedikit lebih besar supaya tepi yang buram tidak menampakkan celah transparan
          transform: 'scale(1.15)',
        }}
        onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
      />
      {/* Tint ungu supaya foto menyatu dengan tema dashboard */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0620]/70 via-[#1a0f35]/55 to-[#08051a]/75" />
    </div>
  )
}
