import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'

export default function AdminLogin() {
  const { login, isAuthenticated, error } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [validationErrors, setValidationErrors] = useState({})

  if (isAuthenticated) return <Navigate to="/hub" replace />

  async function handleSubmit(e) {
    e.preventDefault()
    const errors = {}

    if (!username.trim()) errors.username = 'Username is required'
    if (!password) errors.password = 'Password is required'

    if (Object.keys(errors).length) {
      setValidationErrors(errors)
      return
    }

    setSubmitting(true)
    const ok = await login(username, password)
    setSubmitting(false)

    if (ok) navigate('/hub')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-tavern-900 px-4 text-white">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-tavern-800 p-8"
        aria-labelledby="login-title"
      >
        <h1 id="login-title" className="text-center text-xl font-bold text-gold">
          109 Tavern Ops Hub
        </h1>
        <p className="mt-1 text-center text-sm text-white/50">Staff sign-in</p>

        <div className="mt-6 space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-white mb-1">
              Username <span aria-label="required" className="text-red-400">*</span>
            </label>
            <input
              id="username"
              className={`w-full rounded-lg border px-4 py-2 outline-none focus:border-gold bg-tavern-900 ${
                validationErrors.username ? 'border-red-400' : 'border-white/10'
              }`}
              placeholder="Enter your username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value)
                setValidationErrors({ ...validationErrors, username: '' })
              }}
              autoComplete="username"
              aria-invalid={!!validationErrors.username}
              aria-describedby={validationErrors.username ? 'username-error' : undefined}
            />
            {validationErrors.username && (
              <p id="username-error" className="mt-1 text-sm text-red-400" role="alert">
                {validationErrors.username}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white mb-1">
              Password <span aria-label="required" className="text-red-400">*</span>
            </label>
            <input
              id="password"
              className={`w-full rounded-lg border px-4 py-2 outline-none focus:border-gold bg-tavern-900 ${
                validationErrors.password ? 'border-red-400' : 'border-white/10'
              }`}
              placeholder="Enter your password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setValidationErrors({ ...validationErrors, password: '' })
              }}
              autoComplete="current-password"
              aria-invalid={!!validationErrors.password}
              aria-describedby={validationErrors.password ? 'password-error' : undefined}
            />
            {validationErrors.password && (
              <p id="password-error" className="mt-1 text-sm text-red-400" role="alert">
                {validationErrors.password}
              </p>
            )}
          </div>
        </div>

        {error && (
          <p className="mt-4 text-sm text-red-400" role="alert" aria-live="polite">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="mt-6 w-full rounded-lg bg-gold py-2.5 font-semibold text-tavern-900 transition hover:bg-gold-light disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-tavern-900"
          aria-busy={submitting}
        >
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}
