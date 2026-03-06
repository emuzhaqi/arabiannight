import './Palace.css'
import { Link } from 'react-router-dom'
import { useKeycloak } from './KeycloakProvider'

const JEWEL_COLORS = [
  { color: '#e74c3c', shadow: 'rgba(231,76,60,0.8)',   label: 'ruby'     },
  { color: '#3498db', shadow: 'rgba(52,152,219,0.8)',  label: 'sapphire' },
  { color: '#2ecc71', shadow: 'rgba(46,204,113,0.8)',  label: 'emerald'  },
  { color: '#9b59b6', shadow: 'rgba(155,89,182,0.8)',  label: 'amethyst' },
  { color: '#f39c12', shadow: 'rgba(243,156,18,0.8)',  label: 'topaz'    },
  { color: '#1abc9c', shadow: 'rgba(26,188,156,0.8)',  label: 'turquoise'},
]

const jewels = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  x: Math.random() * 90 + 5,
  y: Math.random() * 75 + 5,
  size: Math.random() * 10 + 5,
  dur: (Math.random() * 3 + 3).toFixed(1),
  del: (Math.random() * 4).toFixed(1),
  ...JEWEL_COLORS[i % JEWEL_COLORS.length],
}))

const rays = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  left: `${8 + i * 9}%`,
  angle: `${(i - 4.5) * 4}deg`,
  dur: `${3 + (i % 3)}s`,
}))

function LightRays() {
  return (
    <div className="light-rays">
      {rays.map((r) => (
        <div
          key={r.id}
          className="ray"
          style={{
            left: r.left,
            '--ray-angle': r.angle,
            '--ray-dur': r.dur,
          }}
        />
      ))}
    </div>
  )
}

function CeilingPattern() {
  return (
    <div className="ceiling-pattern">
      <svg viewBox="0 0 1440 140" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        <defs>
          <pattern id="palatialPattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
            {/* Octagon */}
            <polygon
              points="40,5 65,15 75,40 65,65 40,75 15,65 5,40 15,15"
              fill="none" stroke="#9b59b6" strokeWidth="0.8" opacity="0.5"
            />
            {/* Inner diamond */}
            <polygon
              points="40,18 55,40 40,62 25,40"
              fill="none" stroke="#d4a017" strokeWidth="0.7" opacity="0.4"
            />
            {/* Center dot */}
            <circle cx="40" cy="40" r="3" fill="#c9921a" opacity="0.5" />
            {/* Corner flourishes */}
            <circle cx="0"  cy="0"  r="4" fill="none" stroke="#9b59b6" strokeWidth="0.6" opacity="0.3" />
            <circle cx="80" cy="0"  r="4" fill="none" stroke="#9b59b6" strokeWidth="0.6" opacity="0.3" />
            <circle cx="0"  cy="80" r="4" fill="none" stroke="#9b59b6" strokeWidth="0.6" opacity="0.3" />
            <circle cx="80" cy="80" r="4" fill="none" stroke="#9b59b6" strokeWidth="0.6" opacity="0.3" />
          </pattern>
        </defs>
        {/* Dark ceiling band */}
        <rect width="1440" height="140" fill="rgba(10,5,20,0.6)" />
        {/* Pattern overlay */}
        <rect width="1440" height="140" fill="url(#palatialPattern)" />
        {/* Bottom trim line in gold */}
        <line x1="0" y1="138" x2="1440" y2="138" stroke="#d4a017" strokeWidth="2" opacity="0.5" />
        {/* Arch tops along the ceiling */}
        {[120, 360, 600, 840, 1080, 1320].map((cx, i) => (
          <path
            key={i}
            d={`M${cx - 100} 140 Q${cx} 60 ${cx + 100} 140`}
            fill="none"
            stroke="#c9921a"
            strokeWidth="1.5"
            opacity="0.4"
          />
        ))}
      </svg>
    </div>
  )
}

function Columns() {
  return (
    <div className="columns">
      <div className="column column-left">
        <div className="column-capital" />
        <div className="column-shaft" />
        <div className="column-base" />
      </div>
      <div className="column column-right">
        <div className="column-capital" />
        <div className="column-shaft" />
        <div className="column-base" />
      </div>
    </div>
  )
}

function Jewels() {
  return (
    <div className="jewels">
      {jewels.map((j) => (
        <div
          key={j.id}
          className="jewel"
          style={{
            left: `${j.x}%`,
            top: `${j.y}%`,
            width: `${j.size}px`,
            height: `${j.size}px`,
            background: j.color,
            boxShadow: `0 0 ${j.size * 1.5}px ${j.size * 0.8}px ${j.shadow}`,
            '--j-dur': `${j.dur}s`,
            '--j-del': `${j.del}s`,
          }}
        />
      ))}
    </div>
  )
}

function PalaceFloor() {
  return (
    <div className="palace-floor">
      <svg viewBox="0 0 1440 120" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        <defs>
          <pattern id="tilePattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <rect width="60" height="60" fill="#1a0a00" />
            <rect x="2" y="2" width="56" height="56" fill="#220d00" />
            <line x1="30" y1="0" x2="30" y2="60" stroke="#3a1800" strokeWidth="0.5" />
            <line x1="0" y1="30" x2="60" y2="30" stroke="#3a1800" strokeWidth="0.5" />
            <circle cx="30" cy="30" r="3" fill="#4a2200" />
          </pattern>
        </defs>
        <rect width="1440" height="120" fill="url(#tilePattern)" />
        {/* Top edge gold trim */}
        <line x1="0" y1="2" x2="1440" y2="2" stroke="#d4a017" strokeWidth="2" opacity="0.4" />
      </svg>
    </div>
  )
}

function Crown() {
  return (
    <div className="crown-container">
      <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" className="crown-svg">
        {/* Crown body */}
        <path
          d="M10 70 L10 40 L30 55 L60 15 L90 55 L110 40 L110 70Z"
          fill="url(#crownGrad)"
          stroke="#b8860b"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {/* Crown base band */}
        <rect x="10" y="62" width="100" height="10" rx="2" fill="url(#baseGrad)" />
        {/* Jewels on crown */}
        <circle cx="60" cy="30" r="6" fill="#e74c3c" filter="url(#glow)" />
        <circle cx="32" cy="52" r="4" fill="#3498db" filter="url(#glow)" />
        <circle cx="88" cy="52" r="4" fill="#2ecc71" filter="url(#glow)" />
        <circle cx="20" cy="65" r="3" fill="#9b59b6" filter="url(#glow)" />
        <circle cx="60" cy="65" r="3" fill="#f39c12" filter="url(#glow)" />
        <circle cx="100" cy="65" r="3" fill="#9b59b6" filter="url(#glow)" />
        {/* Shine */}
        <ellipse cx="45" cy="50" rx="8" ry="3" fill="white" opacity="0.15" transform="rotate(-20 45 50)" />
        <defs>
          <linearGradient id="crownGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#ffe066" />
            <stop offset="40%"  stopColor="#d4a017" />
            <stop offset="100%" stopColor="#7a4e00" />
          </linearGradient>
          <linearGradient id="baseGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#f0c040" />
            <stop offset="100%" stopColor="#8b5e0a" />
          </linearGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
      </svg>
    </div>
  )
}

function JewelBorder() {
  return (
    <svg
      className="jewel-border"
      viewBox="0 0 1440 50"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      <defs>
        <pattern id="jewelBorderPat" x="0" y="0" width="40" height="50" patternUnits="userSpaceOnUse">
          <polygon points="20,5 35,25 20,45 5,25" fill="none" stroke="#9b59b6" strokeWidth="1" opacity="0.7" />
          <circle cx="20" cy="25" r="3" fill="#9b59b6" opacity="0.6" />
        </pattern>
      </defs>
      <rect width="1440" height="50" fill="url(#jewelBorderPat)" />
    </svg>
  )
}

function UserBadge() {
  const keycloak = useKeycloak()
  const username = keycloak?.tokenParsed?.preferred_username || ''

  return (
    <div className="user-badge">
      <span className="user-name">{username}</span>
      <button
        className="logout-btn"
        onClick={() => keycloak.logout({ redirectUri: window.location.origin })}
      >
        Leave
      </button>
    </div>
  )
}

export default function Palace() {
  return (
    <div className="palace-page">
      <UserBadge />
      <Link to="/" style={{
        position: 'fixed',
        top: '20px',
        left: '24px',
        fontFamily: "'Cinzel', serif",
        fontSize: '0.75rem',
        letterSpacing: '0.2em',
        color: '#9b59b6',
        textDecoration: 'none',
        padding: '8px 16px',
        background: 'rgba(15, 5, 25, 0.7)',
        border: '1px solid rgba(155, 89, 182, 0.35)',
        borderRadius: '2px',
        backdropFilter: 'blur(8px)',
        zIndex: 100,
      }}>
        &#8592; Agrabah
      </Link>
      <LightRays />
      <div className="ceiling-glow" />
      <CeilingPattern />
      <Columns />
      <Jewels />
      <PalaceFloor />

      <main className="palace-content">
        <div className="palace-ornament">&#10022; &#9670; &#10022;</div>

        <Crown />

        <div className="palace-title-container">
          <div className="palace-title-glow" />
          <h1 className="palace-title">The Royal Palace</h1>
          <div className="palace-subtitle">Palace of Agrabah &bull; Only the worthy may enter &bull; قصر أغراباه</div>
        </div>

        <div className="palace-ornament">&#10022; &#9670; &#10022;</div>

        <p className="palace-tagline">A thousand and one nights of splendour await...</p>
      </main>

      <JewelBorder />
    </div>
  )
}
