import { createContext, useContext, useEffect, useState } from 'react'
import keycloak from './keycloak'
import LoginPage from './LoginPage'

const KeycloakContext = createContext(null)

export function useKeycloak() {
  return useContext(KeycloakContext)
}

export default function KeycloakProvider({ children }) {
  const [status, setStatus] = useState('loading') // 'loading' | 'authenticated' | 'error'

  useEffect(() => {
    keycloak
      .init({ onLoad: 'login-required', checkLoginIframe: false })
      .then((authenticated) => {
        if (authenticated) {
          setStatus('authenticated')
        } else {
          // init resolved but not authenticated — trigger login
          keycloak.login()
        }
      })
      .catch(() => setStatus('error'))
  }, [])

  if (status === 'loading') return <LoginPage message="Seeking the cave of wonders..." />
  if (status === 'error') return <LoginPage message="The spirits are restless. Reload to try again." />

  return (
    <KeycloakContext.Provider value={keycloak}>
      {children}
    </KeycloakContext.Provider>
  )
}
