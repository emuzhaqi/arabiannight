export default function LoginPage({ message = 'Authenticating...' }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #000010 0%, #0d0030 40%, #0a0005 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#d4a017',
      fontFamily: "'Cinzel', serif",
      gap: '24px',
    }}>
      <div style={{
        fontSize: '3rem',
        animation: 'spin 2s linear infinite',
      }}>
        ✦
      </div>
      <p style={{
        fontSize: '1rem',
        letterSpacing: '0.2em',
        opacity: 0.8,
      }}>
        {message}
      </p>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400&display=swap');
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
