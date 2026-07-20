import axios from 'axios'

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api'

const ACCESS_KEY = 'tavern_access_token'
const REFRESH_KEY = 'tavern_refresh_token'

export const tokenStore = {
  getAccess: () => localStorage.getItem(ACCESS_KEY),
  getRefresh: () => localStorage.getItem(REFRESH_KEY),
  set: (access, refresh) => {
    localStorage.setItem(ACCESS_KEY, access)
    if (refresh) localStorage.setItem(REFRESH_KEY, refresh)
  },
  clear: () => {
    localStorage.removeItem(ACCESS_KEY)
    localStorage.removeItem(REFRESH_KEY)
  },
}

const api = axios.create({ baseURL: API_BASE_URL })

api.interceptors.request.use((config) => {
  const token = tokenStore.getAccess()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

let refreshPromise = null

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error
    if (response?.status === 401 && tokenStore.getRefresh() && !config._retried) {
      config._retried = true
      try {
        if (!refreshPromise) {
          refreshPromise = axios
            .post(`${API_BASE_URL}/auth/token/refresh/`, { refresh: tokenStore.getRefresh() })
            .finally(() => {
              refreshPromise = null
            })
        }
        const { data } = await refreshPromise
        tokenStore.set(data.access, null)
        config.headers.Authorization = `Bearer ${data.access}`
        return api(config)
      } catch {
        tokenStore.clear()
      }
    }
    return Promise.reject(error)
  },
)

export default api
