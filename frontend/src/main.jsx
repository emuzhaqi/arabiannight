import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import KeycloakProvider from './KeycloakProvider.jsx'
import ProtectedRoute from './ProtectedRoute.jsx'
import Agrabah from './Agrabah.jsx'
import Bazaar from './Bazaar.jsx'
import Palace from './Palace.jsx'
import Unauthorized from './Unauthorized.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <KeycloakProvider>
      <BrowserRouter>
        <Routes>
          {/* Index — all users land here */}
          <Route
            path="/"
            element={
              <ProtectedRoute role="agrabah-access">
                <Agrabah />
              </ProtectedRoute>
            }
          />
          {/* Aladdin + Genie */}
          <Route
            path="/bazaar"
            element={
              <ProtectedRoute role="bazaar-access">
                <Bazaar />
              </ProtectedRoute>
            }
          />
          {/* Jasmine + Genie */}
          <Route
            path="/palace"
            element={
              <ProtectedRoute role="palace-access">
                <Palace />
              </ProtectedRoute>
            }
          />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </KeycloakProvider>
  </StrictMode>,
)
