import { runmidApiClient } from '@/shared/lib/apiClient'
import type {
  GoogleHealthStatus,
  GoogleHealthTokenResponse,
  GoogleHealthAuthUrlResponse,
} from '../types'

export const googleHealthApi = {
  async getAuthUrl(): Promise<GoogleHealthAuthUrlResponse> {
    const response = await runmidApiClient.get<GoogleHealthAuthUrlResponse>(
      '/api/v1/googlehealth/auth-url'
    )
    return response.data
  },

  async exchangeCode(code: string, state: string): Promise<GoogleHealthTokenResponse> {
    const response = await runmidApiClient.post<GoogleHealthTokenResponse>(
      '/api/v1/googlehealth/token',
      { code, state }
    )
    return response.data
  },

  async getStatus(): Promise<GoogleHealthStatus> {
    try {
      const response = await runmidApiClient.get<GoogleHealthStatus>(
        '/api/v1/googlehealth/status'
      )
      return response.data
    } catch {
      return { connected: false }
    }
  },

  async disconnect(): Promise<void> {
    await runmidApiClient.delete('/api/v1/googlehealth/disconnect')
  },
}
