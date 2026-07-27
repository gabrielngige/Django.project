import axios from 'axios'

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Include cookies in requests
})

// Add Authorization header with token from localStorage
api.interceptors.request.use((config) => {
  const tokens = localStorage.getItem('tokens')
  if (tokens) {
    try {
      const { access } = JSON.parse(tokens)
      config.headers.Authorization = `Bearer ${access}`
    } catch {
      // Token parsing failed, continue without token
    }
  }
  return config
})

let refreshPromise = null

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error

    if (response?.status === 401 && !config._retried) {
      config._retried = true

      try {
        const tokens = localStorage.getItem('tokens')
        if (!tokens) throw new Error('No tokens')

        const { refresh } = JSON.parse(tokens)

        if (!refreshPromise) {
          refreshPromise = axios.post(
            `${API_BASE_URL}/auth/token/refresh/`,
            { refresh },
            { withCredentials: true }
          ).then((res) => {
            // Update tokens with new access token
            const oldTokens = JSON.parse(localStorage.getItem('tokens') || '{}')
            localStorage.setItem('tokens', JSON.stringify({
              ...oldTokens,
              access: res.data.access,
            }))
            return res
          }).finally(() => {
            refreshPromise = null
          })
        }

        await refreshPromise
        // Token is now updated, retry the request
        return api(config)
      } catch {
        // Refresh failed, redirect to login
        localStorage.removeItem('tokens')
        window.location.href = '/hub/login'
      }
    }

    return Promise.reject(error)
  }
)

export default api

