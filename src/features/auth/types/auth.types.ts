export interface AuthTokens {
  accessToken: string
  refreshToken: string
  userId: string
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
