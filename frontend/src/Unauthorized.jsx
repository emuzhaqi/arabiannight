import { useKeycloak } from './KeycloakProvider'

export default function Unauthorized() {
  const keycloak = useKeycloak()

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #0d0005 0%, #1a0010 50%, #0a0005 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#c0392b',
      fontFamily: "'Cinzel', serif",
      gap: '24px',
      textAlign: 'center',
      padding: '20px',
    }}>
      <div style={{ fontSize: '4rem' }}>&#9760;</div>
      <h1 style={{
        fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
        letterSpacing: '0.1em',
        color: '#e74c3c',
        textShadow: '0 0 20px rgba(231, 76, 60, 0.6)',
      }}>
        The palace guards bar your way
      </h1>
      <p style={{
        fontSize: '1rem',
        color: 'rgba(200, 100, 80, 0.7)',
        letterSpacing: '0.15em',
        maxWidth: '400px',
      }}>
        You do not hold the right to enter this chamber,{' '}
        <strong style={{ color: '#e8a87c' }}>
          {keycloak?.tokenParsed?.preferred_username || 'stranger'}
        </strong>.
      </p>
      <button
        onClick={() => keycloak.logout({ redirectUri: window.location.origin })}
        style={{
          marginTop: '16px',
          padding: '12px 32px',
          background: 'transparent',
          border: '1px solid rgba(231, 76, 60, 0.5)',
          color: '#e74c3c',
          fontFamily: "'Cinzel', serif",
          fontSize: '0.85rem',
          letterSpacing: '0.2em',
          cursor: 'pointer',
          borderRadius: '2px',
        }}
      >
        Leave these grounds
      </button>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&display=swap');
      `}</style>
    </div>
  )
}
