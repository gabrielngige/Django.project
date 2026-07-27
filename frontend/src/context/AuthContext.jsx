import { useState } from 'react'
import { login as apiLogin, logout as apiLogout } from '../api/endpoints'
import { AuthContext } from './auth-context'

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [error, setError] = useState(null)
  const [tokens, setTokens] = useState(null)

  async function login(username, password) {
    setError(null)
    try {
      const data = await apiLogin(username, password)
      // Store tokens from response
      if (data.access && data.refresh) {
        setTokens({ access: data.access, refresh: data.refresh })
        localStorage.setItem('tokens', JSON.stringify({ access: data.access, refresh: data.refresh }))
      }
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
    setTokens(null)
    localStorage.removeItem('tokens')
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, error, tokens }}>
      {children}
    </AuthContext.Provider>
  )
}
