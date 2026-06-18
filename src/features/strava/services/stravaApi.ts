import { runmidApiClient } from '@/shared/lib/apiClient'

export interface StravaStatus {
  connected: boolean
  athleteId?: number
  expiresAt?: string
  isExpired?: boolean
}

export interface StravaTokenResponse {
  accessToken: string
  athleteId: number
  expiresAt: string
}

export interface StravaError {
  error: string
  code: 'STRAVA_NOT_CONNECTED' | 'STRAVA_TOKEN_EXPIRED' | string
}

/**
 * Response from POST /api/v1/auth/strava — the primary-auth login endpoint.
 * Mirrors googlehealth's login response: JWT pair + the user the backend
 * upserted (by athlete_id) + the Strava athlete profile that backed the
 * login. The callback page uses accessToken/refreshToken/username to seed
 * tokenStorage and then routes onboarding vs. /chat the same way Google
 * login does.
 */
export interface StravaLoginResponse {
  accessToken: string
  refreshToken: string
  expiresIn: number
  tokenType: string
  user: {
    id: string
    username: string
    firstName: string
    lastName: string
    fullName: string
    profile?: string
    city?: string
    state?: string
    country?: string
  }
  athlete: {
    id: number
    username: string
    firstName: string
    lastName: string
    fullName: string
    city: string
    state: string
    country: string
    sex: string
    premium: boolean
    profileMedium: string
    profile: string
    weight: number
  }
}

export const stravaApi = {
  /**
   * Exchange authorization code for access token (ATTACH flow).
   * Requires the caller to already be authenticated (JWT in storage) —
   * this connects Strava to an existing RunMid account.
   */
  exchangeCode: async (code: string): Promise<StravaTokenResponse> => {
    const redirectUri = typeof window !== 'undefined'
      ? `${window.location.origin}/auth/strava/callback`
      : ''

    const { data } = await runmidApiClient.post<StravaTokenResponse>(
      '/api/v1/strava/token',
      { code, redirectUri }
    )
    return data
  },

  /**
   * Primary-auth login via Strava (LOGIN flow). No prior JWT required —
   * backend upserts the user keyed by athlete_id and returns a fresh
   * JWT pair the client should persist via tokenStorage. Used when the
   * Strava OAuth callback fires on a logged-out session (the user
   * clicked "Continuar com Strava" on /login).
   */
  login: async (code: string): Promise<StravaLoginResponse> => {
    const { data } = await runmidApiClient.post<StravaLoginResponse>(
      '/api/v1/auth/strava',
      { code }
    )
    return data
  },

  /**
   * Get Strava connection status
   */
  getStatus: async (): Promise<StravaStatus> => {
    try {
      const { data } = await runmidApiClient.get<StravaTokenResponse>(
        '/api/v1/strava/access-token'
      )
      return {
        connected: true,
        athleteId: data.athleteId,
        expiresAt: data.expiresAt,
        isExpired: false,
      }
    } catch (error) {
      // Not connected or token issues
      return {
        connected: false,
      }
    }
  },

  /**
   * Disconnect from Strava
   */
  disconnect: async (): Promise<void> => {
    await runmidApiClient.delete('/api/v1/strava/disconnect')
  },
}
