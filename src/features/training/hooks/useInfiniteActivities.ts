'use client'

import { useInfiniteQuery } from '@tanstack/react-query'
import { stravaActivitiesApi } from '@/features/strava'
import { tokenStorage } from '@/shared/lib/apiClient'

interface UseInfiniteActivitiesOptions {
  typeFilter?: string
  periodFilter?: 'week' | 'month' | '3months' | 'all'
}

function getAfterTimestamp(period?: string): number | undefined {
  if (!period || period === 'all') return undefined
  const now = Date.now()
  const days = period === 'week' ? 7 : period === 'month' ? 30 : 90
  return Math.floor((now - days * 24 * 60 * 60 * 1000) / 1000)
}

export function useInfiniteActivities(options: UseInfiniteActivitiesOptions = {}) {
  const { typeFilter, periodFilter } = options
  const isAuthenticated = typeof window !== 'undefined' && !!tokenStorage.getAccessToken()
  const after = getAfterTimestamp(periodFilter)

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
  } = useInfiniteQuery({
    queryKey: ['strava', 'activities', 'infinite', typeFilter, periodFilter],
    queryFn: ({ pageParam }) =>
      stravaActivitiesApi.getRecentActivities({ page: pageParam, perPage: 20, after }),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === 20 ? allPages.length + 1 : undefined,
    initialPageParam: 1,
    staleTime: 1000 * 60 * 5,
    retry: false,
    enabled: isAuthenticated,
  })

  const allActivities = data?.pages.flat() ?? []
  const activities = typeFilter
    ? allActivities.filter(
        (a) => a.type === typeFilter || a.sport_type === typeFilter,
      )
    : allActivities

  return {
    activities,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
  }
}
