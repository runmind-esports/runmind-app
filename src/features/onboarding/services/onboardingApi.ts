import { runmidApiClient } from '@/shared/lib/apiClient'
import type { SaveProfileRequest, RunnerProfileResponse } from '../types/onboarding.types'

export const onboardingApi = {
  /**
   * Save runner profile (creates or updates)
   * POST /api/v1/training/profile
   */
  saveProfile: async (data: SaveProfileRequest): Promise<RunnerProfileResponse> => {
    const { data: response } = await runmidApiClient.post<RunnerProfileResponse>(
      '/api/v1/training/profile',
      data,
    )
    return response
  },

  /**
   * Download personalized training spreadsheet as XLSX blob
   * GET /api/v1/training/profile/spreadsheet
   */
  downloadSpreadsheet: async (): Promise<Blob> => {
    const { data } = await runmidApiClient.get('/api/v1/training/profile/spreadsheet', {
      responseType: 'blob',
    })
    return data
  },
}
