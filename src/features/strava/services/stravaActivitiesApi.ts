import { runmidApiClient } from '@/shared/lib/apiClient'
import type {
  StravaActivity,
  StravaAthleteProfile,
  StravaAthleteStats,
  StravaActivityDetail,
  StravaLap,
  StravaZone,
  PaginatedActivitiesParams,
} from '../types/activities.types'

const STRAVA_API = 'https://www.strava.com/api/v3'

// Get Strava access token from runmid-api
async function getStravaToken(): Promise<string> {
  const { data } = await runmidApiClient.get<{ accessToken: string }>(
    '/api/v1/strava/access-token'
  )
  return data.accessToken
}

// Make authenticated request to Strava API
async function stravaFetch<T>(path: string, params?: Record<string, unknown>): Promise<T> {
  const token = await getStravaToken()
  const url = new URL(`${STRAVA_API}${path}`)
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value))
      }
    })
  }
  const response = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!response.ok) {
    throw new Error(`Strava API error: ${response.status}`)
  }
  return response.json()
}

export const stravaActivitiesApi = {
  getRecentActivities: async (params?: PaginatedActivitiesParams): Promise<StravaActivity[]> => {
    return stravaFetch<StravaActivity[]>('/athlete/activities', {
      page: params?.page ?? 1,
      per_page: params?.perPage ?? 30,
      before: params?.before,
      after: params?.after,
    })
  },

  getAthleteStats: async (athleteId: number): Promise<StravaAthleteStats> => {
    return stravaFetch<StravaAthleteStats>(`/athletes/${athleteId}/stats`)
  },

  getAthleteProfile: async (): Promise<StravaAthleteProfile> => {
    return stravaFetch<StravaAthleteProfile>('/athlete')
  },

  getActivityDetail: async (id: number): Promise<StravaActivityDetail> => {
    return stravaFetch<StravaActivityDetail>(`/activities/${id}`)
  },

  getActivityLaps: async (id: number): Promise<StravaLap[]> => {
    return stravaFetch<StravaLap[]>(`/activities/${id}/laps`)
  },

  getActivityZones: async (id: number): Promise<StravaZone[]> => {
    return stravaFetch<StravaZone[]>(`/activities/${id}/zones`)
  },
}
