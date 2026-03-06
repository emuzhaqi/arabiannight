import './Agrabah.css'
import { Link } from 'react-router-dom'
import { useKeycloak } from './KeycloakProvider'

const birds = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  top: `${Math.random() * 80 + 5}%`,
  dur: `${14 + Math.random() * 10}s`,
  del: `${Math.random() * 12}s`,
  size: `${12 + Math.random() * 12}px`,
}))

function Birds() {
  return (
    <div className="birds">
      {birds.map((b) => (
        <div
          key={b.id}
          className="bird"
          style={{
            top: b.top,
            '--b-dur': b.dur,
            '--b-del': b.del,
            '--b-size': b.size,
          }}
        >
          <svg viewBox="0 0 30 12" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 6 Q7 0 15 6 Q23 0 30 6" />
          </svg>
        </div>
      ))}
    </div>
  )
}

function Sun() {
  return (
    <div className="sun-container">
      <div className="sun-glow-outer" />
      <div className="sun-glow-inner" />
      <div className="sun" />
    </div>
  )
}

function AgrabahSilhouette() {
  const c = '#1a0800'
  return (
    <div className="agrabah-silhouette">
      <svg viewBox="0 0 1440 240" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMax meet">
        {/* Far-left minaret */}
        <rect x="30" y="30" width="18" height="160" fill={c} />
        <polygon points="30,30 39,0 48,30" fill={c} />
        <ellipse cx="39" cy="30" rx="12" ry="5" fill={c} />
        <rect x="24" y="72" width="30" height="7" fill={c} />

        {/* Far-right minaret */}
        <rect x="1392" y="30" width="18" height="160" fill={c} />
        <polygon points="1392,30 1401,0 1410,30" fill={c} />
        <ellipse cx="1401" cy="30" rx="12" ry="5" fill={c} />
        <rect x="1386" y="72" width="30" height="7" fill={c} />

        {/* Left district buildings */}
        <rect x="80" y="110" width="240" height="130" fill={c} />
        <path d="M80 110 Q125 65 170 110Z" fill={c} />
        <path d="M150 110 Q195 65 240 110Z" fill={c} />
        <path d="M220 110 Q265 55 310 110Z" fill={c} />
        {/* windows */}
        <path d="M100 175 Q112 152 124 175Z" fill="#2a1000" />
        <path d="M145 175 Q157 152 169 175Z" fill="#2a1000" />
        <path d="M220 175 Q232 152 244 175Z" fill="#2a1000" />
        <path d="M265 175 Q277 152 289 175Z" fill="#2a1000" />

        {/* Left mid tower */}
        <rect x="340" y="75" width="22" height="165" fill={c} />
        <ellipse cx="351" cy="75" rx="13" ry="20" fill={c} />
        <rect x="335" y="115" width="32" height="7" fill={c} />

        {/* Central grand mosque / palace */}
        <rect x="520" y="40" width="400" height="200" fill={c} />
        {/* Main dome */}
        <ellipse cx="720" cy="40" rx="90" ry="58" fill={c} />
        {/* Flanking domes */}
        <ellipse cx="580" cy="90" rx="40" ry="30" fill={c} />
        <ellipse cx="860" cy="90" rx="40" ry="30" fill={c} />
        {/* Central arch windows */}
        <path d="M640 180 Q660 145 680 180Z" fill="#2a1000" />
        <path d="M700 180 Q720 145 740 180Z" fill="#2a1000" />
        <path d="M760 180 Q780 145 800 180Z" fill="#2a1000" />
        {/* Side towers */}
        <rect x="498" y="95" width="26" height="145" fill={c} />
        <ellipse cx="511" cy="95" rx="15" ry="24" fill={c} />
        <rect x="916" y="95" width="26" height="145" fill={c} />
        <ellipse cx="929" cy="95" rx="15" ry="24" fill={c} />

        {/* Right mid tower */}
        <rect x="1078" y="75" width="22" height="165" fill={c} />
        <ellipse cx="1089" cy="75" rx="13" ry="20" fill={c} />
        <rect x="1073" y="115" width="32" height="7" fill={c} />

        {/* Right district buildings */}
        <rect x="1120" y="110" width="240" height="130" fill={c} />
        <path d="M1130 110 Q1175 55 1220 110Z" fill={c} />
        <path d="M1200 110 Q1245 65 1290 110Z" fill={c} />
        <path d="M1270 110 Q1315 65 1360 110Z" fill={c} />
        <path d="M1150 175 Q1162 152 1174 175Z" fill="#2a1000" />
        <path d="M1210 175 Q1222 152 1234 175Z" fill="#2a1000" />
        <path d="M1275 175 Q1287 152 1299 175Z" fill="#2a1000" />

        {/* Palm trees */}
        <rect x="440" y="155" width="6" height="85" fill={c} />
        <ellipse cx="443" cy="153" rx="24" ry="12" fill={c} transform="rotate(-15 443 153)" />
        <ellipse cx="443" cy="153" rx="24" ry="12" fill={c} transform="rotate(20 443 153)" />
        <rect x="990" y="155" width="6" height="85" fill={c} />
        <ellipse cx="993" cy="153" rx="24" ry="12" fill={c} transform="rotate(15 993 153)" />
        <ellipse cx="993" cy="153" rx="24" ry="12" fill={c} transform="rotate(-20 993 153)" />
      </svg>
    </div>
  )
}

function AgrabahDunes() {
  return (
    <div className="agrabah-dunes">
      <svg viewBox="0 0 1440 200" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        <path
          d="M0 200 L0 120 Q180 40 360 100 Q540 160 720 80 Q900 0 1080 90 Q1260 180 1440 110 L1440 200Z"
          fill="#2a1200"
        />
        <path
          d="M0 200 L0 155 Q200 95 400 140 Q600 185 800 130 Q1000 75 1200 145 Q1350 185 1440 165 L1440 200Z"
          fill="#3a1800"
        />
      </svg>
    </div>
  )
}

function CityGate() {
  return (
    <div className="city-gate">
      <svg viewBox="0 0 160 100" xmlns="http://www.w3.org/2000/svg" className="gate-svg">
        <defs>
          <linearGradient id="gateGold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#ffe066" />
            <stop offset="50%"  stopColor="#d4a017" />
            <stop offset="100%" stopColor="#7a4e00" />
          </linearGradient>
          <filter id="gateGlow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {/* Left tower */}
        <rect x="5"  y="30" width="28" height="68" rx="1" fill="url(#gateGold)" opacity="0.9" />
        <polygon points="5,30 19,8 33,30"   fill="#ffe066" opacity="0.95" />
        <ellipse cx="19" cy="30" rx="14" ry="5" fill="#ffe066" opacity="0.7" />
        {/* Right tower */}
        <rect x="127" y="30" width="28" height="68" rx="1" fill="url(#gateGold)" opacity="0.9" />
        <polygon points="127,30 141,8 155,30" fill="#ffe066" opacity="0.95" />
        <ellipse cx="141" cy="30" rx="14" ry="5" fill="#ffe066" opacity="0.7" />
        {/* Gate arch */}
        <path
          d="M33 98 L33 58 Q33 28 80 28 Q127 28 127 58 L127 98Z"
          fill="url(#gateGold)"
          opacity="0.85"
          filter="url(#gateGlow)"
        />
        {/* Arch opening (darker) */}
        <path
          d="M42 98 L42 60 Q42 38 80 38 Q118 38 118 60 L118 98Z"
          fill="#1a0800"
          opacity="0.85"
        />
        {/* Crenellations top of towers */}
        {[7,13,19,25].map((x, i) => (
          <rect key={i} x={x} y={22} width={4} height={8} fill="#ffe066" opacity="0.8" />
        ))}
        {[129,135,141,147].map((x, i) => (
          <rect key={i} x={x} y={22} width={4} height={8} fill="#ffe066" opacity="0.8" />
        ))}
        {/* Star above arch */}
        <circle cx="80" cy="22" r="5" fill="#ffcc00" opacity="0.95" filter="url(#gateGlow)" />
        <circle cx="80" cy="22" r="2" fill="#ffffff" opacity="0.9" />
      </svg>
    </div>
  )
}

function NavCards() {
  const keycloak = useKeycloak()

  return (
    <div className="nav-cards">
      {keycloak.hasRealmRole('bazaar-access') && (
        <Link to="/bazaar" className="nav-card bazaar-card">
          <span className="card-label">Enter</span>
          <span className="card-title">The Bazaar</span>
          <span className="card-sub">Night market of wonders</span>
        </Link>
      )}
      {keycloak.hasRealmRole('palace-access') && (
        <Link to="/palace" className="nav-card palace-card">
          <span className="card-label">Enter</span>
          <span className="card-title">The Palace</span>
          <span className="card-sub">Royal halls of Agrabah</span>
        </Link>
      )}
    </div>
  )
}

function UserBadge() {
  const keycloak = useKeycloak()
  const username = keycloak?.tokenParsed?.preferred_username || ''

  return (
    <div className="agrabah-user-badge">
      <span className="agrabah-user-name">{username}</span>
      <button
        className="agrabah-logout-btn"
        onClick={() => keycloak.logout({ redirectUri: window.location.origin })}
      >
        Leave
      </button>
    </div>
  )
}

function SandBorder() {
  return (
    <svg
      className="sand-border"
      viewBox="0 0 1440 55"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      <defs>
        <pattern id="sandPat" x="0" y="0" width="72" height="55" patternUnits="userSpaceOnUse">
          <path
            d="M0 30 Q18 5 36 30 Q54 55 72 30"
            fill="none"
            stroke="#e87820"
            strokeWidth="1"
            opacity="0.6"
          />
          <circle cx="36" cy="30" r="2" fill="#e87820" opacity="0.5" />
        </pattern>
      </defs>
      <rect width="1440" height="55" fill="url(#sandPat)" />
    </svg>
  )
}

export default function Agrabah() {
  return (
    <div className="agrabah-page">
      <UserBadge />
      <Birds />
      <Sun />
      <div className="horizon-haze" />
      <AgrabahSilhouette />
      <AgrabahDunes />

      <main className="agrabah-content">
        <div className="agrabah-ornament">&#10022; &#9670; &#10022;</div>

        <CityGate />

        <div className="agrabah-title-container">
          <div className="agrabah-title-glow" />
          <h1 className="agrabah-title">Agrabah</h1>
          <div className="agrabah-subtitle">City of Wonders &bull; مدينة العجائب &bull; City of Wonders</div>
        </div>

        <NavCards />

        <div className="agrabah-ornament">&#10022; &#9670; &#10022;</div>

        <p className="agrabah-tagline">Where the desert meets destiny...</p>
      </main>

      <SandBorder />
    </div>
  )
}
