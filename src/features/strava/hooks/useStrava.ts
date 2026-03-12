'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { stravaApi, StravaStatus } from '../services/stravaApi'
import { buildStravaAuthUrl } from '../utils/oauth'
import { tokenStorage } from '@/shared/lib/apiClient'

export const stravaKeys = {
  status: ['strava', 'status'] as const,
}

export function useStrava() {
  const queryClient = useQueryClient()

  // Check if user is authenticated
  const isAuthenticated = typeof window !== 'undefined' && !!tokenStorage.getAccessToken()

  // Query for connection status (only if authenticated)
  const {
    data: status,
    isLoading: isLoadingStatus,
    error: statusError,
    refetch: refetchStatus,
  } = useQuery<StravaStatus>({
    queryKey: stravaKeys.status,
    queryFn: stravaApi.getStatus,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
    enabled: isAuthenticated, // Only fetch if user is logged in
  })

  // Mutation for exchanging code
  const exchangeCodeMutation = useMutation({
    mutationFn: stravaApi.exchangeCode,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: stravaKeys.status })
    },
  })

  // Mutation for disconnecting
  const disconnectMutation = useMutation({
    mutationFn: stravaApi.disconnect,
    onSuccess: () => {
      queryClient.setQueryData(stravaKeys.status, { connected: false })
    },
  })

  // Start OAuth flow
  const connect = () => {
    const authUrl = buildStravaAuthUrl()
    if (authUrl) {
      window.location.href = authUrl
    }
  }

  return {
    // Status
    isConnected: status?.connected ?? false,
    athleteId: status?.athleteId,
    isLoadingStatus,
    statusError,
    refetchStatus,

    // Actions
    connect,
    exchangeCode: exchangeCodeMutation.mutateAsync,
    isExchangingCode: exchangeCodeMutation.isPending,
    exchangeError: exchangeCodeMutation.error,

    disconnect: disconnectMutation.mutate,
    isDisconnecting: disconnectMutation.isPending,
    disconnectError: disconnectMutation.error,
  }
}
