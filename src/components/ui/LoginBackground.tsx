'use client'

/**
 * Background "malam pegunungan" — ilustrasi original gaya pixel-art,
 * digambar manual dengan shape SVG (bukan reproduksi karya lain).
 */
export default function LoginBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#10122a]">
      <svg
        viewBox="0 0 1200 1600"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        shapeRendering="crispEdges"
      >
        <defs>
          {/* Langit malam */}
          <linearGradient id="nightSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#181b42" />
            <stop offset="45%" stopColor="#262b5c" />
            <stop offset="100%" stopColor="#2f3570" />
          </linearGradient>

          {/* Glow bulan */}
          <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#dfe6ff" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#a7b3ec" stopOpacity="0.55" />
            <stop offset="75%" stopColor="#6c79c2" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#6c79c2" stopOpacity="0" />
          </radialGradient>

          {/* Air danau */}
          <linearGradient id="lake" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4a5184" />
            <stop offset="100%" stopColor="#2a2f57" />
          </linearGradient>

          <filter id="waterBlur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" />
          </filter>

          {/* Vignette */}
          <radialGradient id="vignette2" cx="50%" cy="40%" r="78%">
            <stop offset="0%" stopColor="#000000" stopOpacity="0" />
            <stop offset="68%" stopColor="#000000" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.55" />
          </radialGradient>
        </defs>

        {/* Langit */}
        <rect x="0" y="0" width="1200" height="980" fill="url(#nightSky)" />

        {/* Scene atas (langit + bulan + gunung) — dipakai ulang utk refleksi */}
        <g id="upperScene">
          {/* Glow awan di sekitar bulan */}
          <ellipse cx="430" cy="430" rx="420" ry="320" fill="url(#moonGlow)" className="moon-twinkle" />

          {/* Bulan */}
          <circle cx="980" cy="160" r="70" fill="#eef1fb" />
          <circle cx="958" cy="145" r="11" fill="#c9cfe8" opacity="0.55" />
          <circle cx="1002" cy="178" r="7" fill="#c9cfe8" opacity="0.5" />
          <circle cx="995" cy="135" r="5" fill="#c9cfe8" opacity="0.45" />

          {/* Bintang (gaya pixel — kotak kecil) */}
          <g fill="#f3f5ff">
            <rect x="60" y="60" width="6" height="6" className="twinkle t1" />
            <rect x="180" y="120" width="5" height="5" opacity="0.7" />
            <rect x="320" y="50" width="6" height="6" className="twinkle t2" />
            <rect x="520" y="90" width="5" height="5" opacity="0.6" />
            <rect x="700" y="40" width="6" height="6" className="twinkle t3" />
            <rect x="840" y="110" width="5" height="5" opacity="0.65" />
            <rect x="1120" y="70" width="6" height="6" className="twinkle t1" />
            <rect x="1180" y="220" width="5" height="5" opacity="0.55" />
            <rect x="40" y="280" width="5" height="5" opacity="0.5" />
            <rect x="240" y="220" width="5" height="5" className="twinkle t2" />
            <rect x="600" y="200" width="5" height="5" opacity="0.6" />
            <rect x="900" y="280" width="6" height="6" className="twinkle t3" />
            <rect x="1050" y="330" width="5" height="5" opacity="0.55" />
            <rect x="150" y="350" width="5" height="5" opacity="0.45" />
            <rect x="780" y="350" width="5" height="5" opacity="0.5" />
            <rect x="380" y="160" width="5" height="5" opacity="0.55" />
          </g>

          {/* Pegunungan belakang */}
          <path
            d="M0,940 L70,880 L150,920 L230,820 L300,870 L380,790 L470,860
               L560,800 L650,870 L730,810 L820,880 L900,830 L980,900
               L1060,840 L1140,890 L1200,860 L1200,1000 L0,1000 Z"
            fill="#1b2050"
            opacity="0.85"
          />

          {/* Pegunungan depan — jagged dengan tonjolan rumput */}
          <path
            d="M0,980
               L10,965 L22,978 L35,955 L48,978 L60,960
               L90,975 L120,940 L150,965
               L185,860 L215,930 L240,900
               L260,920 L300,870 L330,920
               L360,895 L420,820 L480,900
               L520,870 L560,910 L600,860
               L640,900 L680,790 L740,890
               L780,860 L820,905 L850,880
               L880,915 L900,895 L930,915
               L960,860 L1000,910 L1040,875
               L1070,905 L1100,885 L1130,905
               L1160,890 L1180,910 L1200,895
               L1200,1000 L0,1000 Z"
            fill="#0a0c20"
          />
        </g>

        {/* Garis horizon */}
        <rect x="0" y="978" width="1200" height="4" fill="#10122a" opacity="0.6" />

        {/* Danau (dasar) */}
        <rect x="0" y="982" width="1200" height="618" fill="url(#lake)" />

        {/* Refleksi (scene atas dibalik, diburamkan) */}
        <g
          transform="translate(0, 1964) scale(1, -1)"
          opacity="0.4"
          filter="url(#waterBlur)"
        >
          <use href="#upperScene" />
        </g>

        {/* Garis riak air horizontal */}
        <g stroke="#dfe6ff" strokeOpacity="0.08" strokeWidth="3">
          <line x1="0" y1="1080" x2="1200" y2="1080" />
          <line x1="0" y1="1180" x2="1200" y2="1180" />
          <line x1="0" y1="1300" x2="1200" y2="1300" />
          <line x1="0" y1="1420" x2="1200" y2="1420" />
          <line x1="0" y1="1540" x2="1200" y2="1540" />
        </g>

        {/* Vignette */}
        <rect x="0" y="0" width="1200" height="1600" fill="url(#vignette2)" />
      </svg>

      <style jsx>{`
        .twinkle {
          animation: twinkle 3.5s ease-in-out infinite;
        }
        .t1 { animation-delay: 0s; }
        .t2 { animation-delay: 1.1s; }
        .t3 { animation-delay: 2.2s; }
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        .moon-twinkle {
          animation: glowPulse 7s ease-in-out infinite;
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.85; }
          50% { opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .twinkle, .moon-twinkle { animation: none !important; }
        }
      `}</style>
    </div>
  )
}
