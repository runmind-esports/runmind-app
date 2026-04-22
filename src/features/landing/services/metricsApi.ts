import { runmidApiClient } from '@/shared/lib/apiClient'

export interface LandingMetrics {
  volume: number
  pace: number
  engagement: number
}

export const FALLBACK_METRICS: LandingMetrics = {
  volume: 125000,
  pace: 5.4,
  engagement: 94,
}

export async function fetchLandingMetrics(): Promise<LandingMetrics | null> {
  try {
    const { data } = await runmidApiClient.get<LandingMetrics>(
      '/metrics/landing',
      { timeout: 5000 },
    )
    return data
  } catch {
    console.warn('Landing metrics API unavailable, using fallback values')
    return null
  }
}
