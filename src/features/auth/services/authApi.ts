import { authApiClient, tokenStorage } from '@/shared/lib/apiClient'
import type {
  LoginCredentials,
  RegisterCredentials,
  AuthTokens,
  UserProfile,
} from '../types/auth.types'

// Decode JWT payload to extract user data
function decodeJwtPayload(token: string): { sub?: string; username?: string; email?: string } | null {
  try {
    const base64Payload = token.split('.')[1]
    const payload = JSON.parse(atob(base64Payload))
    return payload
  } catch {
    return null
  }
}

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthTokens> => {
    const { data } = await authApiClient.post<AuthTokens>('/api/auth/login', credentials)
    const payload = decodeJwtPayload(data.accessToken)
    const username = payload?.username || payload?.email || data.email
    tokenStorage.setTokens(data.accessToken, data.refreshToken, username)
    return data
  },

  register: async (credentials: RegisterCredentials): Promise<AuthTokens> => {
    const { data } = await authApiClient.post<AuthTokens>('/api/auth/register', {
      username: credentials.username,
      email: credentials.email,
      password: credentials.password,
    })
    const payload = decodeJwtPayload(data.accessToken)
    const username = payload?.username || payload?.email || credentials.email
    tokenStorage.setTokens(data.accessToken, data.refreshToken, username)
    return data
  },

  forgotPassword: async (email: string): Promise<void> => {
    await authApiClient.post('/api/auth/forgot-password', { email })
  },

  resetPassword: async (token: string, password: string): Promise<void> => {
    await authApiClient.post('/api/auth/reset-password', { token, password })
  },

  refreshToken: async (refreshToken: string): Promise<AuthTokens> => {
    const { data } = await authApiClient.post<AuthTokens>('/api/auth/refresh', {
      refreshToken: refreshToken,
    })
    tokenStorage.setTokens(data.accessToken, data.refreshToken)
    return data
  },

  logout: () => {
    tokenStorage.clearTokens()
  },

  getProfile: async (): Promise<UserProfile> => {
    // Extract profile from JWT token instead of making API call
    const token = tokenStorage.getAccessToken()
    if (!token) {
      throw new Error('No token found')
    }
    const payload = decodeJwtPayload(token)
    if (!payload) {
      throw new Error('Invalid token')
    }
    return {
      id: payload.sub || '',
      username: payload.username || payload.email || '',
      email: payload.email || '',
    }
  },

  isAuthenticated: (): boolean => {
    return !!tokenStorage.getAccessToken()
  },

  getUsername: (): string | null => {
    return tokenStorage.getUsername()
  },
}
