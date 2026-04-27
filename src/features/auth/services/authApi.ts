import { runmidApiClient, tokenStorage } from '@/shared/lib/apiClient'
import type { UserProfile } from '../types/auth.types'

// Decode JWT payload to extract user data
function decodeJwtPayload(token: string): { sub?: string; username?: string; email?: string; exp?: number } | null {
  try {
    const base64Payload = token.split('.')[1]
    const payload = JSON.parse(atob(base64Payload))
    return payload
  } catch {
    return null
  }
}

// Check if JWT token is expired
function isTokenExpired(token: string): boolean {
  const payload = decodeJwtPayload(token)
  if (!payload || !payload.exp) {
    return true
  }
  return payload.exp * 1000 < Date.now()
}

export const authApi = {
  getGoogleAuthUrl: async (): Promise<{ url: string }> => {
    const { data } = await runmidApiClient.get<{ url: string }>('/api/v1/auth/google')
    return data
  },

  processGoogleCallback: (params: {
    accessToken: string
    refreshToken: string
    userId: string
    username: string
  }) => {
    tokenStorage.setTokens(params.accessToken, params.refreshToken, params.username)
  },

  logout: () => {
    tokenStorage.clearTokens()
  },

  getProfile: async (): Promise<UserProfile> => {
    const token = tokenStorage.getAccessToken()
    if (!token) {
      throw new Error('No token found')
    }
    const payload = decodeJwtPayload(token)
    if (!payload) {
      throw new Error('Invalid token')
    }
    const username = payload.username || payload.email?.split('@')[0] || ''
    return {
      id: payload.sub || '',
      email: payload.email || '',
      firstName: username,
      lastName: '',
      createdAt: new Date().toISOString(),
    }
  },

  isAuthenticated: (): boolean => {
    const token = tokenStorage.getAccessToken()
    if (!token) return false
    if (isTokenExpired(token)) {
      tokenStorage.clearTokens()
      return false
    }
    return true
  },

  getUsername: (): string | null => {
    return tokenStorage.getUsername()
  },
}
