import { useState } from 'react'
import { login as apiLogin, logout as apiLogout } from '../api/endpoints'
import { tokenStore } from '../api/client'
import { AuthContext } from './auth-context'

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(tokenStore.getAccess()))
  const [error, setError] = useState(null)

  async function login(username, password) {
    setError(null)
    try {
      await apiLogin(username, password)
      setIsAuthenticated(true)
      return true
    } catch {
      setError('Invalid username or password.')
      return false
    }
  }

  function logout() {
    apiLogout()
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, error }}>
      {children}
    </AuthContext.Provider>
  )
}
