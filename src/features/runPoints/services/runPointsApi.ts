import { chatApiClient } from '@/shared/lib/apiClient'
import { RunPointsStatus } from '../types/runPoints.types'

export const runPointsApi = {
  async getStatus(): Promise<RunPointsStatus> {
    const response = await chatApiClient.get<RunPointsStatus>('/api/v1/mana/status')
    return response.data
  },
}
