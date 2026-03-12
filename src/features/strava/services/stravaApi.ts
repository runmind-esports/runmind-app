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

export const stravaApi = {
  /**
   * Exchange authorization code for access token
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
