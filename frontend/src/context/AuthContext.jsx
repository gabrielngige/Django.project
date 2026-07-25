import { useState } from 'react'
import { login as apiLogin, logout as apiLogout } from '../api/endpoints'
import { AuthContext } from './auth-context'

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
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

  async function logout() {
    try {
      await apiLogout()
    } catch {
      // Logout on client side even if API call fails
    }
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, error }}>
      {children}
    </AuthContext.Provider>
  )
}
