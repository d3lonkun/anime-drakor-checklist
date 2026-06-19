'use client'

/**
 * Background dekoratif "senja kuil" — ilustrasi original berbasis SVG.
 * Bukan reproduksi karya lain; semua bentuk (langit, gunung, pohon,
 * gerbang torii, lentera) digambar manual dengan path/shape SVG.
 */
export default function LoginBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#11151c]">
      <svg
        viewBox="0 0 1200 1600"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Langit senja */}
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1c2748" />
            <stop offset="32%" stopColor="#4a4368" />
            <stop offset="52%" stopColor="#9a6f8d" />
            <stop offset="68%" stopColor="#e2917c" />
            <stop offset="80%" stopColor="#f3bb7d" />
            <stop offset="100%" stopColor="#171c16" />
          </linearGradient>

          {/* Glow matahari */}
          <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff3d6" stopOpacity="1" />
            <stop offset="35%" stopColor="#ffd98e" stopOpacity="0.85" />
            <stop offset="70%" stopColor="#ffb877" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#ffb877" stopOpacity="0" />
          </radialGradient>

          {/* Gradasi gunung jauh */}
          <linearGradient id="mountain" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5a4a5e" />
            <stop offset="100%" stopColor="#3a3142" />
          </linearGradient>

          {/* Vignette gelap di tepi untuk fokus ke kartu login */}
          <radialGradient id="vignette" cx="50%" cy="42%" r="75%">
            <stop offset="0%" stopColor="#000000" stopOpacity="0" />
            <stop offset="70%" stopColor="#000000" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.55" />
          </radialGradient>
        </defs>

        {/* Langit */}
        <rect x="0" y="0" width="1200" height="1600" fill="url(#sky)" />

        {/* Matahari + sinar */}
        <g opacity="0.95">
          <circle cx="930" cy="620" r="230" fill="url(#sunGlow)" className="sun-pulse" />
          <circle cx="930" cy="620" r="58" fill="#fff6e0" opacity="0.95" />
          <rect x="0" y="612" width="1200" height="3" fill="#fff3d2" opacity="0.35" />
          <rect x="0" y="600" width="1200" height="1.5" fill="#ffe7b8" opacity="0.25" />
        </g>

        {/* Awan tipis */}
        <g fill="#f7e3da" opacity="0.28">
          <ellipse cx="330" cy="260" rx="170" ry="26" />
          <ellipse cx="470" cy="290" rx="120" ry="18" />
          <ellipse cx="760" cy="190" rx="140" ry="20" />
        </g>

        {/* Siluet gunung jauh */}
        <path
          d="M0,780 L120,700 L240,760 L380,660 L520,740 L640,650 L760,730 L880,680 L1000,750 L1120,690 L1200,740 L1200,900 L0,900 Z"
          fill="url(#mountain)"
          opacity="0.55"
        />

        {/* Klaster pohon kiri */}
        <g fill="#0d1410">
          <ellipse cx="90" cy="760" rx="150" ry="220" opacity="0.55" />
          <ellipse cx="60" cy="880" rx="190" ry="260" opacity="0.7" />
          <ellipse cx="180" cy="900" rx="160" ry="240" opacity="0.85" />
          <ellipse cx="40" cy="1020" rx="220" ry="300" />
          <ellipse cx="230" cy="1060" rx="200" ry="280" />
        </g>

        {/* Klaster pohon kanan */}
        <g fill="#0d1410">
          <ellipse cx="1120" cy="740" rx="160" ry="220" opacity="0.5" />
          <ellipse cx="1160" cy="860" rx="200" ry="260" opacity="0.68" />
          <ellipse cx="1010" cy="900" rx="170" ry="240" opacity="0.85" />
          <ellipse cx="1170" cy="1010" rx="230" ry="300" />
          <ellipse cx="990" cy="1050" rx="200" ry="280" />
        </g>

        {/* Lentera batu kecil */}
        <g fill="#1a1612" opacity="0.9">
          <rect x="985" y="1180" width="34" height="14" rx="2" />
          <rect x="993" y="1140" width="18" height="44" />
          <rect x="980" y="1120" width="44" height="16" rx="3" />
          <circle cx="1002" cy="1100" r="20" />
          <rect x="988" y="1075" width="28" height="14" rx="2" />
        </g>

        {/* Gerbang Torii */}
        <g fill="#6b2f2b">
          {/* Pilar */}
          <path d="M430,1340 L468,1340 L478,940 L440,940 Z" />
          <path d="M770,1340 L808,1340 L798,940 L760,940 Z" />
          {/* Palang bawah */}
          <rect x="420" y="985" width="400" height="22" rx="2" fill="#5c2622" />
          {/* Palang atas melengkung */}
          <path
            d="M380,930 Q619,880 858,930 L858,958 Q619,912 380,958 Z"
            fill="#6b2f2b"
          />
          <path
            d="M380,930 Q619,880 858,930 L858,944 Q619,898 380,944 Z"
            fill="#7d3a34"
            opacity="0.7"
          />
          {/* Plakat tengah */}
          <rect x="590" y="935" width="58" height="44" rx="2" fill="#2b211a" />
          <rect x="598" y="943" width="42" height="28" rx="1" fill="#3a2c20" />
        </g>

        {/* Tangga batu bawah */}
        <g fill="#2a2a26" opacity="0.9">
          <rect x="0" y="1420" width="1200" height="40" />
          <rect x="0" y="1380" width="1200" height="34" opacity="0.85" />
          <rect x="0" y="1340" width="1200" height="30" opacity="0.7" />
        </g>

        {/* Vignette */}
        <rect x="0" y="0" width="1200" height="1600" fill="url(#vignette)" />
      </svg>

      {/* Partikel mengambang (kunang-kunang / kelopak) */}
      <div className="particles" aria-hidden="true">
        {Array.from({ length: 10 }).map((_, i) => (
          <span key={i} className={`particle particle-${i}`} />
        ))}
      </div>

      <style jsx>{`
        .sun-pulse {
          animation: sunPulse 6s ease-in-out infinite;
          transform-origin: 930px 620px;
        }
        @keyframes sunPulse {
          0%, 100% { opacity: 0.9; }
          50% { opacity: 1; }
        }

        .particles {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        .particle {
          position: absolute;
          bottom: -10px;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #ffe2ad;
          opacity: 0;
          box-shadow: 0 0 6px 1px rgba(255, 210, 140, 0.7);
          animation: floatUp linear infinite;
        }
        .particle-0 { left: 12%; animation-duration: 11s; animation-delay: 0s; }
        .particle-1 { left: 22%; animation-duration: 14s; animation-delay: 2s; }
        .particle-2 { left: 35%; animation-duration: 9s;  animation-delay: 4s; }
        .particle-3 { left: 48%; animation-duration: 13s; animation-delay: 1s; }
        .particle-4 { left: 58%; animation-duration: 10s; animation-delay: 5s; }
        .particle-5 { left: 68%; animation-duration: 15s; animation-delay: 3s; }
        .particle-6 { left: 78%; animation-duration: 12s; animation-delay: 6s; }
        .particle-7 { left: 85%; animation-duration: 9s;  animation-delay: 2.5s; }
        .particle-8 { left: 30%; animation-duration: 16s; animation-delay: 7s; }
        .particle-9 { left: 64%; animation-duration: 11s; animation-delay: 8s; }

        @keyframes floatUp {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: 0.8; }
          50% { transform: translateY(-48vh) translateX(12px); opacity: 0.6; }
          90% { opacity: 0.2; }
          100% { transform: translateY(-92vh) translateX(-8px); opacity: 0; }
        }

        @media (prefers-reduced-motion: reduce) {
          .sun-pulse, .particle {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  )
}
