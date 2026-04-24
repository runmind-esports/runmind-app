'use client'

import { useQuery } from '@tanstack/react-query'
import { stravaActivitiesApi } from '../services/stravaActivitiesApi'
import { tokenStorage } from '@/shared/lib/apiClient'

export const stravaActivityKeys = {
  all: ['strava', 'activities'] as const,
  list: (page: number, perPage: number) => [...stravaActivityKeys.all, 'list', page, perPage] as const,
  stats: () => ['strava', 'stats'] as const,
  detail: (id: number) => [...stravaActivityKeys.all, 'detail', id] as const,
  laps: (id: number) => [...stravaActivityKeys.all, 'laps', id] as const,
  zones: (id: number) => [...stravaActivityKeys.all, 'zones', id] as const,
}

export function useStravaActivities(page = 1, perPage = 30) {
  const isAuthenticated = typeof window !== 'undefined' && !!tokenStorage.getAccessToken()

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: stravaActivityKeys.list(page, perPage),
    queryFn: () => stravaActivitiesApi.getRecentActivities({ page, perPage }),
    staleTime: 1000 * 60 * 5,
    retry: false,
    enabled: isAuthenticated,
  })

  return { activities: data ?? [], isLoading, error, refetch }
}

export function useStravaStats() {
  const isAuthenticated = typeof window !== 'undefined' && !!tokenStorage.getAccessToken()

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: stravaActivityKeys.stats(),
    queryFn: async () => {
      const profile = await stravaActivitiesApi.getAthleteProfile()
      return stravaActivitiesApi.getAthleteStats(profile.id)
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
    enabled: isAuthenticated,
  })

  return { stats: data, isLoading, error, refetch }
}

export function useActivityDetail(id: number | null) {
  const isAuthenticated = typeof window !== 'undefined' && !!tokenStorage.getAccessToken()

  const { data, isLoading, error } = useQuery({
    queryKey: stravaActivityKeys.detail(id!),
    queryFn: () => stravaActivitiesApi.getActivityDetail(id!),
    staleTime: 1000 * 60 * 5,
    retry: false,
    enabled: isAuthenticated && id !== null && id > 0,
  })

  return { activity: data, isLoading, error }
}

export function useActivityLaps(id: number | null) {
  const isAuthenticated = typeof window !== 'undefined' && !!tokenStorage.getAccessToken()

  const { data, isLoading, error } = useQuery({
    queryKey: stravaActivityKeys.laps(id!),
    queryFn: () => stravaActivitiesApi.getActivityLaps(id!),
    staleTime: 1000 * 60 * 5,
    retry: false,
    enabled: isAuthenticated && id !== null && id > 0,
  })

  return { laps: data ?? [], isLoading, error }
}

export function useActivityZones(id: number | null) {
  const isAuthenticated = typeof window !== 'undefined' && !!tokenStorage.getAccessToken()

  const { data, isLoading, error } = useQuery({
    queryKey: stravaActivityKeys.zones(id!),
    queryFn: () => stravaActivitiesApi.getActivityZones(id!),
    staleTime: 1000 * 60 * 5,
    retry: false,
    enabled: isAuthenticated && id !== null && id > 0,
  })

  return { zones: data ?? [], isLoading, error }
}
