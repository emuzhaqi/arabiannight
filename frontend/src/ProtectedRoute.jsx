import { Navigate } from 'react-router-dom'
import { useKeycloak } from './KeycloakProvider'

export default function ProtectedRoute({ role, children }) {
  const keycloak = useKeycloak()

  if (!keycloak.hasRealmRole(role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return children
}
