'use client'

import { useState, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { googleHealthApi } from '../services/googleHealthApi'
import type { GoogleHealthStatus, GoogleHealthTokenResponse } from '../types'

export const googleHealthKeys = {
  status: ['google-health', 'status'] as const,
}

export function useGoogleHealth() {
  const queryClient = useQueryClient()
  const { isAuthenticated } = useAuth()
  const [isConnecting, setIsConnecting] = useState(false)

  const {
    data: status,
    isLoading: isLoadingStatus,
    error: statusError,
    refetch: refetchStatus,
  } = useQuery({
    queryKey: googleHealthKeys.status,
    queryFn: googleHealthApi.getStatus,
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5,
    retry: false,
  })

  const exchangeCodeMutation = useMutation({
    mutationFn: ({ code, state }: { code: string; state: string }) =>
      googleHealthApi.exchangeCode(code, state),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: googleHealthKeys.status })
    },
  })

  const disconnectMutation = useMutation({
    mutationFn: googleHealthApi.disconnect,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: googleHealthKeys.status })
      queryClient.setQueryData<GoogleHealthStatus>(googleHealthKeys.status, {
        connected: false,
      })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: googleHealthKeys.status })
    },
  })

  const connect = useCallback(async () => {
    try {
      setIsConnecting(true)
      const { url } = await googleHealthApi.getAuthUrl()
      window.location.href = url
    } catch (error) {
      console.error('Error getting Google Health auth URL:', error)
      setIsConnecting(false)
    }
  }, [])

  const exchangeCode = useCallback(
    async (code: string, state: string): Promise<GoogleHealthTokenResponse> => {
      return exchangeCodeMutation.mutateAsync({ code, state })
    },
    [exchangeCodeMutation]
  )

  return {
    isConnected: status?.connected ?? false,
    googleEmail: status?.googleEmail,
    isLoadingStatus,
    statusError: statusError as Error | null,
    refetchStatus,

    connect,
    isConnecting,

    exchangeCode,
    isExchangingCode: exchangeCodeMutation.isPending,
    exchangeError: exchangeCodeMutation.error as Error | null,

    disconnect: disconnectMutation.mutate,
    isDisconnecting: disconnectMutation.isPending,
    disconnectError: disconnectMutation.error as Error | null,
  }
}
