export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  username: string
  email: string
  password: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  userId: string
  email: string
  username?: string
}

export interface UserProfile {
  id: string
  email: string
  firstName: string
  lastName: string
  avatar?: string
  createdAt: string
  connectedApps?: string[]
}

export interface AuthState {
  isAuthenticated: boolean
  isLoading: boolean
  profile: UserProfile | null
  error: string | null
}
