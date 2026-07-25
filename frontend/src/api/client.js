import axios from 'axios'

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Include cookies in requests
})

let refreshPromise = null

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error

    if (response?.status === 401 && !config._retried) {
      config._retried = true

      try {
        if (!refreshPromise) {
          refreshPromise = axios.post(
            `${API_BASE_URL}/auth/token/refresh/`,
            {},
            { withCredentials: true }
          ).finally(() => {
            refreshPromise = null
          })
        }

        await refreshPromise
        // Token is now in cookie, retry the request
        return api(config)
      } catch {
        // Refresh failed, redirect to login
        window.location.href = '/hub/login'
      }
    }

    return Promise.reject(error)
  }
)

export default api

