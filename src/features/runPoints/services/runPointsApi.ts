import { chatApiClient } from '@/shared/lib/apiClient'
import { RunPointsStatus } from '../types/runPoints.types'

interface ManaStatusResponse {
  currentMana: number
  maxMana: number
  periodType: string
  periodStart: string
  nextResetAt: string
  tier: string
}

export const runPointsApi = {
  async getStatus(): Promise<RunPointsStatus> {
    const response = await chatApiClient.get<ManaStatusResponse>('/api/v1/mana/status')
    const d = response.data
    return {
      currentPoints: d.currentMana,
      maxPoints: d.maxMana,
      periodType: d.periodType,
      periodStart: d.periodStart,
      nextResetAt: d.nextResetAt,
      tier: d.tier,
    }
  },
}
