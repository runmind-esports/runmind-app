import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || ''
const AUTH_API_URL = process.env.NEXT_PUBLIC_AUTH_API_URL || ''
const RUNMID_API_URL = process.env.NEXT_PUBLIC_RUNMID_API_URL || ''
const CHAT_API_URL = process.env.NEXT_PUBLIC_CHAT_API_URL || ''

// Token storage keys
const ACCESS_TOKEN_KEY = 'runmind_access_token'
const REFRESH_TOKEN_KEY = 'runmind_refresh_token'
const USERNAME_KEY = 'runmind_username'

// Token management
export const tokenStorage = {
  getAccessToken: () => {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(ACCESS_TOKEN_KEY)
  },
  getRefreshToken: () => {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(REFRESH_TOKEN_KEY)
  },
  getUsername: () => {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(USERNAME_KEY)
  },
  setTokens: (accessToken: string, refreshToken: string, username?: string) => {
    if (typeof window === 'undefined') return
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
    if (username) {
      localStorage.setItem(USERNAME_KEY, username)
    }
  },
  clearTokens: () => {
    if (typeof window === 'undefined') return
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    localStorage.removeItem(USERNAME_KEY)
  },
}

// API client for the runmind backend
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// API client for cara-cracha auth service
export const authApiClient = axios.create({
  baseURL: AUTH_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenStorage.getAccessToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor for token refresh
let isRefreshing = false
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (error: AxiosError) => void
}> = []

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else if (token) {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    // If 401 and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Wait for the refresh to complete
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`
              resolve(apiClient(originalRequest))
            },
            reject,
          })
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      const refreshToken = tokenStorage.getRefreshToken()
      if (!refreshToken) {
        tokenStorage.clearTokens()
        if (typeof window !== 'undefined') {
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }

      try {
        const response = await authApiClient.post('/api/auth/refresh', {
          refreshToken: refreshToken,
        })

        const { accessToken, refreshToken: newRefreshToken } = response.data
        tokenStorage.setTokens(accessToken, newRefreshToken)

        processQueue(null, accessToken)

        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        return apiClient(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError as AxiosError)
        tokenStorage.clearTokens()
        if (typeof window !== 'undefined') {
          window.location.href = '/login'
        }
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

// API client for runmid backend (Strava, activities, etc)
export const runmidApiClient = axios.create({
  baseURL: RUNMID_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for runmid API
runmidApiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenStorage.getAccessToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor for runmid API — no auth redirect
// Auth state is managed by useAuth hook; 401s from domain endpoints
// (strava, googlehealth) mean "not connected", not "not authenticated"
runmidApiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => Promise.reject(error)
)

// API client for chat service
export const chatApiClient = axios.create({
  baseURL: CHAT_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for chat API
chatApiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenStorage.getAccessToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor for chat API — no auth redirect
// Auth state is managed by useAuth hook
chatApiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => Promise.reject(error)
)

export default apiClient
