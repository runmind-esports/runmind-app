export interface GoogleHealthStatus {
  connected: boolean
  googleUserId?: string
  googleEmail?: string
  expiresAt?: string
  isExpired?: boolean
}

export interface GoogleHealthTokenResponse {
  message: string
  connected: boolean
}

export interface GoogleHealthAuthUrlResponse {
  url: string
}

export interface GoogleHealthError {
  error: string
  code:
    | 'GOOGLE_HEALTH_INVALID_STATE'
    | 'GOOGLE_HEALTH_INVALID_CODE'
    | 'GOOGLE_HEALTH_NOT_CONNECTED'
    | 'GOOGLE_HEALTH_API_FAILED'
    | string
}
