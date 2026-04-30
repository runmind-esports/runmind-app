'use client'

import { useQuery } from '@tanstack/react-query'
import { runPointsApi } from '../services/runPointsApi'
import { RunPointsStatus, RunPointsHistoryDay } from '../types/runPoints.types'
import { tokenStorage } from '@/shared/lib/apiClient'

const RUN_POINTS_STATUS_QUERY_KEY = ['run-points-status']
const RUN_POINTS_HISTORY_QUERY_KEY = ['run-points-history']

export function useRunPointsStatus() {
  const isAuthenticated = typeof window !== 'undefined' && !!tokenStorage.getAccessToken()

  const { data, isLoading: isLoadingStatus, error: statusError } = useQuery<RunPointsStatus>({
    queryKey: RUN_POINTS_STATUS_QUERY_KEY,
    queryFn: () => runPointsApi.getStatus(),
    staleTime: 2 * 60 * 1000,
    retry: false,
    enabled: isAuthenticated,
  })

  const { data: history = [] } = useQuery<RunPointsHistoryDay[]>({
    queryKey: RUN_POINTS_HISTORY_QUERY_KEY,
    queryFn: () => runPointsApi.getHistory(),
    staleTime: 5 * 60 * 1000,
    retry: false,
    enabled: isAuthenticated,
  })

  const currentPoints = data?.currentPoints ?? 0
  const maxPoints = data?.maxPoints ?? 100
  const percentage = maxPoints > 0 ? Math.round((currentPoints / maxPoints) * 100) : 0
  const nextResetAt = data?.nextResetAt ?? null
  const tier = data?.tier ?? 'free'

  return {
    currentPoints,
    maxPoints,
    percentage,
    nextResetAt,
    tier,
    history,
    isLoading: isLoadingStatus,
    error: statusError,
  }
}
