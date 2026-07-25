import api from './client'

export async function login(username, password) {
  const { data } = await api.post('/auth/token/', { username, password })
  return data
}

export async function logout() {
  await api.post('/auth/logout/')
}

export const offerings = {
  list: (params) => api.get('/offerings/', { params }).then((r) => r.data),
  create: (payload) => api.post('/offerings/', payload).then((r) => r.data),
  update: (id, payload) => api.patch(`/offerings/${id}/`, payload).then((r) => r.data),
  remove: (id) => api.delete(`/offerings/${id}/`),
}

export const events = {
  list: (params) => api.get('/events/', { params }).then((r) => r.data),
  happeningNow: () => api.get('/events/happening_now/').then((r) => r.data),
  create: (payload) => api.post('/events/', payload).then((r) => r.data),
  update: (id, payload) => api.patch(`/events/${id}/`, payload).then((r) => r.data),
  remove: (id) => api.delete(`/events/${id}/`),
}

export const bundles = {
  list: (params) => api.get('/bundles/', { params }).then((r) => r.data),
  create: (payload) => api.post('/bundles/', payload).then((r) => r.data),
  update: (slug, payload) => api.patch(`/bundles/${slug}/`, payload).then((r) => r.data),
  remove: (slug) => api.delete(`/bundles/${slug}/`),
}

export const redemptions = {
  list: (params) => api.get('/redemptions/', { params }).then((r) => r.data),
  create: (payload) => api.post('/redemptions/', payload).then((r) => r.data),
}

export const gallery = {
  list: (params) => api.get('/gallery/', { params }).then((r) => r.data),
  create: (formData) =>
    api
      .post('/gallery/', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then((r) => r.data),
  remove: (id) => api.delete(`/gallery/${id}/`),
}

export const posters = {
  list: () => api.get('/posters/').then((r) => r.data),
  create: (formData) =>
    api
      .post('/posters/', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then((r) => r.data),
  generate: (id) => api.post(`/posters/${id}/generate/`).then((r) => r.data),
  publish: (id) => api.post(`/posters/${id}/publish/`).then((r) => r.data),
}

export const socialLogs = {
  list: (params) => api.get('/social-logs/', { params }).then((r) => r.data),
  create: (payload) => api.post('/social-logs/', payload).then((r) => r.data),
}

export const analytics = {
  summary: () => api.get('/analytics/summary/').then((r) => r.data),
}
