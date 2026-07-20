import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function AdminLogin() {
  const { login, isAuthenticated, error } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (isAuthenticated) return <Navigate to="/hub" replace />

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    const ok = await login(username, password)
    setSubmitting(false)
    if (ok) navigate('/hub')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-tavern-900 px-4 text-white">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-2xl border border-white/10 bg-tavern-800 p-8">
        <h1 className="text-center text-xl font-bold text-gold">109 Tavern Ops Hub</h1>
        <p className="mt-1 text-center text-sm text-white/50">Staff sign-in</p>

        <div className="mt-6 space-y-4">
          <input
            className="w-full rounded-lg border border-white/10 bg-tavern-900 px-4 py-2 outline-none focus:border-gold"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
          <input
            className="w-full rounded-lg border border-white/10 bg-tavern-900 px-4 py-2 outline-none focus:border-gold"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>

        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="mt-6 w-full rounded-lg bg-gold py-2.5 font-semibold text-tavern-900 transition hover:bg-gold-light disabled:opacity-50"
        >
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}
