import { chatApiClient, backofficeApiClient } from '@/shared/lib/apiClient'
import { RunPointsStatus, RunPointsHistoryDay } from '../types/runPoints.types'

interface ManaStatusResponse {
  currentMana: number
  maxMana: number
  periodType: string
  periodStart: string
  nextResetAt: string
  tier: string
}

interface DailyTrendResponse {
  days: { date: string; mana_cost: number }[]
}

const DAY_LABELS: Record<number, string> = {
  0: 'Dom', 1: 'Seg', 2: 'Ter', 3: 'Qua', 4: 'Qui', 5: 'Sex', 6: 'Sab',
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

  async getHistory(): Promise<RunPointsHistoryDay[]> {
    const response = await backofficeApiClient.get<DailyTrendResponse>('/api/v1/mana/analytics/daily', {
      params: { period: '7d' },
    })
    return response.data.days.map((d) => {
      const date = new Date(d.date)
      return {
        day: DAY_LABELS[date.getUTCDay()] || d.date,
        used: d.mana_cost,
      }
    })
  },
}
