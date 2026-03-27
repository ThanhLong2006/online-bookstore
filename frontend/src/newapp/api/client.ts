import axios from 'axios'
import { useAuthStore } from '../store/authStore'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8080',
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401 && !error.config.__retry) {
      error.config.__retry = true
      const refresh = await api.post('/api/auth/refresh-token', {})
      useAuthStore.getState().setAccessToken(refresh.data.accessToken)
      error.config.headers.Authorization = `Bearer ${refresh.data.accessToken}`
      return api.request(error.config)
    }
    return Promise.reject(error)
  },
)
