import './App.css'
import { useKeycloak } from './KeycloakProvider'

function UserBadge() {
  const keycloak = useKeycloak()
  const username = keycloak?.tokenParsed?.preferred_username || ''

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '24px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '8px 16px',
      background: 'rgba(10, 5, 0, 0.7)',
      border: '1px solid rgba(212, 160, 23, 0.35)',
      borderRadius: '2px',
      backdropFilter: 'blur(8px)',
      zIndex: 100,
    }}>
      <span style={{
        fontFamily: "'Cinzel', serif",
        fontSize: '0.75rem',
        letterSpacing: '0.15em',
        color: '#c9921a',
      }}>
        {username}
      </span>
      <button
        onClick={() => keycloak.logout({ redirectUri: window.location.origin })}
        style={{
          background: 'transparent',
          border: '1px solid rgba(212, 160, 23, 0.4)',
          color: '#d4a017',
          fontFamily: "'Cinzel', serif",
          fontSize: '0.7rem',
          letterSpacing: '0.1em',
          padding: '4px 10px',
          cursor: 'pointer',
          borderRadius: '1px',
        }}
      >
        Leave
      </button>
    </div>
  )
}

function Stars() {
  const stars = Array.from({ length: 120 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 60,
    size: Math.random() * 2.5 + 0.5,
    delay: Math.random() * 4,
    duration: Math.random() * 3 + 2,
  }))

  return (
    <div className="stars">
      {stars.map((star) => (
        <div
          key={star.id}
          className="star"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
          }}
        />
      ))}
    </div>
  )
}

function Lanterns() {
  return (
    <div className="lanterns">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="lantern-wrap" style={{ '--i': i }}>
          <div className="lantern-string" />
          <div className="lantern">
            <div className="lantern-top" />
            <div className="lantern-body">
              <div className="lantern-glow" />
            </div>
            <div className="lantern-bottom" />
            <div className="lantern-fringe">
              {[...Array(5)].map((_, j) => (
                <div key={j} className="fringe-strand" style={{ '--j': j }} />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function ArabicPattern() {
  return (
    <svg
      className="arabic-border"
      viewBox="0 0 1440 120"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      <defs>
        <pattern id="arabesquePattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
          <path
            d="M30 5 C40 5, 55 20, 55 30 C55 40, 40 55, 30 55 C20 55, 5 40, 5 30 C5 20, 20 5, 30 5Z"
            fill="none"
            stroke="#c9921a"
            strokeWidth="1"
            opacity="0.6"
          />
          <path
            d="M30 0 L35 15 L50 10 L40 22 L55 30 L40 38 L50 50 L35 45 L30 60 L25 45 L10 50 L20 38 L5 30 L20 22 L10 10 L25 15Z"
            fill="none"
            stroke="#d4a017"
            strokeWidth="0.8"
            opacity="0.4"
          />
        </pattern>
      </defs>
      <rect width="1440" height="120" fill="url(#arabesquePattern)" />
    </svg>
  )
}

export default function App() {
  return (
    <div className="page">
      <UserBadge />
      <Stars />

      <div className="sky-gradient" />

      <div className="moon-container">
        <div className="moon">
          <div className="moon-crater crater-1" />
          <div className="moon-crater crater-2" />
          <div className="moon-crater crater-3" />
        </div>
        <div className="moon-glow" />
      </div>

      <Lanterns />

      <div className="dunes">
        <svg viewBox="0 0 1440 300" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path
            d="M0 300 L0 200 Q180 80 360 160 Q540 240 720 140 Q900 40 1080 130 Q1260 220 1440 150 L1440 300Z"
            fill="#1a0a00"
          />
          <path
            d="M0 300 L0 240 Q200 140 400 200 Q600 260 800 190 Q1000 120 1200 195 Q1350 245 1440 220 L1440 300Z"
            fill="#2a1000"
          />
        </svg>
      </div>

      <div className="silhouette">
        <svg viewBox="0 0 1440 220" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMax meet">
          {/* Left minaret */}
          <rect x="60" y="40" width="20" height="150" fill="#0d0005" />
          <polygon points="60,40 70,5 80,40" fill="#0d0005" />
          <ellipse cx="70" cy="40" rx="14" ry="6" fill="#0d0005" />
          <rect x="54" y="80" width="32" height="8" fill="#0d0005" />

          {/* Right minaret */}
          <rect x="1360" y="40" width="20" height="150" fill="#0d0005" />
          <polygon points="1360,40 1370,5 1380,40" fill="#0d0005" />
          <ellipse cx="1370" cy="40" rx="14" ry="6" fill="#0d0005" />
          <rect x="1354" y="80" width="32" height="8" fill="#0d0005" />

          {/* Central palace */}
          <rect x="560" y="60" width="320" height="160" fill="#0d0005" />
          {/* Dome */}
          <ellipse cx="720" cy="60" rx="80" ry="50" fill="#0d0005" />
          {/* Arched windows */}
          <path d="M620 150 Q635 120 650 150Z" fill="#1a0010" />
          <path d="M680 150 Q695 120 710 150Z" fill="#1a0010" />
          <path d="M740 150 Q755 120 770 150Z" fill="#1a0010" />
          <path d="M790 150 Q805 120 820 150Z" fill="#1a0010" />
          {/* Small side towers */}
          <rect x="540" y="100" width="25" height="120" fill="#0d0005" />
          <ellipse cx="552" cy="100" rx="14" ry="22" fill="#0d0005" />
          <rect x="875" y="100" width="25" height="120" fill="#0d0005" />
          <ellipse cx="887" cy="100" rx="14" ry="22" fill="#0d0005" />

          {/* Left wing buildings */}
          <rect x="200" y="120" width="200" height="100" fill="#0d0005" />
          <path d="M200 120 Q240 80 280 120Z" fill="#0d0005" />
          <path d="M260 120 Q300 80 340 120Z" fill="#0d0005" />
          <path d="M320 120 Q360 80 400 120Z" fill="#0d0005" />

          {/* Right wing buildings */}
          <rect x="1040" y="120" width="200" height="100" fill="#0d0005" />
          <path d="M1040 120 Q1080 80 1120 120Z" fill="#0d0005" />
          <path d="M1100 120 Q1140 80 1180 120Z" fill="#0d0005" />
          <path d="M1160 120 Q1200 80 1240 120Z" fill="#0d0005" />

          {/* Palm trees */}
          <rect x="460" y="150" width="6" height="70" fill="#0d0005" />
          <ellipse cx="463" cy="148" rx="22" ry="12" fill="#0d0005" transform="rotate(-15 463 148)" />
          <ellipse cx="463" cy="148" rx="22" ry="12" fill="#0d0005" transform="rotate(20 463 148)" />

          <rect x="968" y="150" width="6" height="70" fill="#0d0005" />
          <ellipse cx="971" cy="148" rx="22" ry="12" fill="#0d0005" transform="rotate(15 971 148)" />
          <ellipse cx="971" cy="148" rx="22" ry="12" fill="#0d0005" transform="rotate(-20 971 148)" />
        </svg>
      </div>

      <main className="content">
        <div className="ornament top-ornament">&#10022; &#9830; &#10022;</div>

        <div className="title-container">
          <div className="title-glow-bg" />
          <h1 className="title">City of Agrabah</h1>
          <div className="title-subtitle">&#x202E;&#x645;&#x641;&#x62A;&#x648;&#x62D;&#x202C; &#8226; Open Sesame &#8226; &#x202E;&#x645;&#x641;&#x62A;&#x648;&#x62D;&#x202C;</div>
        </div>

        <div className="ornament bottom-ornament">&#10022; &#9830; &#10022;</div>

        <div className="magic-lamp">
          <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" className="lamp-svg">
            {/* Smoke */}
            <path d="M55 18 Q50 8 55 0 Q62 8 57 18" fill="none" stroke="#c9921a" strokeWidth="1.5" opacity="0.6" className="smoke-1" />
            <path d="M60 15 Q68 3 63 -5 Q72 5 65 18" fill="none" stroke="#d4a017" strokeWidth="1" opacity="0.5" className="smoke-2" />
            {/* Lamp body */}
            <ellipse cx="60" cy="55" rx="45" ry="15" fill="#c9921a" />
            <path d="M15 55 Q30 35 60 32 Q90 35 105 55Z" fill="#d4a017" />
            <ellipse cx="60" cy="32" rx="12" ry="6" fill="#b8860b" />
            {/* Spout */}
            <path d="M105 50 Q120 45 118 55 Q116 60 100 58Z" fill="#c9921a" />
            {/* Handle */}
            <path d="M15 50 Q0 45 5 60 Q8 68 20 62" fill="none" stroke="#b8860b" strokeWidth="5" strokeLinecap="round" />
            {/* Shine */}
            <ellipse cx="50" cy="40" rx="8" ry="4" fill="white" opacity="0.2" transform="rotate(-20 50 40)" />
          </svg>
        </div>

        <p className="tagline">The cave of wonders awaits...</p>
      </main>

      <ArabicPattern />
    </div>
  )
}
