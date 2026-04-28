'use client'

import { useQuery } from '@tanstack/react-query'
import { runPointsApi } from '../services/runPointsApi'
import { RunPointsStatus, RunPointsHistoryDay } from '../types/runPoints.types'
import { tokenStorage } from '@/shared/lib/apiClient'

const RUN_POINTS_STATUS_QUERY_KEY = ['run-points-status']

// TODO: Replace with real endpoint when backend supports GET /api/v1/mana/history (per D-04)
function getMockHistory(currentPoints: number, maxPoints: number): RunPointsHistoryDay[] {
  const days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom']
  return days.map((day) => ({
    day,
    used: Math.floor(Math.random() * maxPoints * 0.8),
  }))
}

export function useRunPointsStatus() {
  const isAuthenticated = typeof window !== 'undefined' && !!tokenStorage.getAccessToken()

  const { data, isLoading, error } = useQuery<RunPointsStatus>({
    queryKey: RUN_POINTS_STATUS_QUERY_KEY,
    queryFn: () => runPointsApi.getStatus(),
    staleTime: 2 * 60 * 1000,
    retry: false,
    enabled: isAuthenticated,
  })

  const currentPoints = data?.currentPoints ?? 0
  const maxPoints = data?.maxPoints ?? 100
  const percentage = maxPoints > 0 ? Math.round((currentPoints / maxPoints) * 100) : 0
  const nextResetAt = data?.nextResetAt ?? null
  const tier = data?.tier ?? 'free'
  const history = data ? getMockHistory(currentPoints, maxPoints) : []

  return {
    currentPoints,
    maxPoints,
    percentage,
    nextResetAt,
    tier,
    history,
    isLoading,
    error,
  }
}
