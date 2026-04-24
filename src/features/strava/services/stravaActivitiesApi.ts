import { runmidApiClient } from '@/shared/lib/apiClient'
import type {
  StravaActivity,
  StravaAthleteStats,
  StravaActivityDetail,
  StravaLap,
  StravaZone,
  PaginatedActivitiesParams,
} from '../types/activities.types'

export const stravaActivitiesApi = {
  /**
   * Get recent activities with pagination
   */
  getRecentActivities: async (params?: PaginatedActivitiesParams): Promise<StravaActivity[]> => {
    const { data } = await runmidApiClient.get<StravaActivity[]>(
      '/api/v1/strava/activities',
      {
        params: {
          page: params?.page ?? 1,
          per_page: params?.perPage ?? 30,
          ...(params?.before && { before: params.before }),
          ...(params?.after && { after: params.after }),
        },
      }
    )
    return data
  },

  /**
   * Get aggregated athlete statistics
   */
  getAthleteStats: async (): Promise<StravaAthleteStats> => {
    const { data } = await runmidApiClient.get<StravaAthleteStats>(
      '/api/v1/strava/athlete/stats'
    )
    return data
  },

  /**
   * Get full activity details including splits
   */
  getActivityDetail: async (id: number): Promise<StravaActivityDetail> => {
    const { data } = await runmidApiClient.get<StravaActivityDetail>(
      `/api/v1/strava/activities/${id}`
    )
    return data
  },

  /**
   * Get laps for a specific activity
   */
  getActivityLaps: async (id: number): Promise<StravaLap[]> => {
    const { data } = await runmidApiClient.get<StravaLap[]>(
      `/api/v1/strava/activities/${id}/laps`
    )
    return data
  },

  /**
   * Get heart rate and power zones for an activity
   */
  getActivityZones: async (id: number): Promise<StravaZone[]> => {
    const { data } = await runmidApiClient.get<StravaZone[]>(
      `/api/v1/strava/activities/${id}/zones`
    )
    return data
  },
}
