'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { subscriptionApi } from '../services/subscriptionApi'
import { UserTier, TierResponse } from '../types/subscription.types'

const TIER_QUERY_KEY = ['user-tier']

export function useUserTier() {
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery<TierResponse>({
    queryKey: TIER_QUERY_KEY,
    queryFn: () => subscriptionApi.getUserTier(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  })

  const tier: UserTier = (data?.tier as UserTier) || 'free'
  const status = data?.status || null
  const interval = data?.interval || null
  const expiresAt = data?.expiresAt || null
  const customerId = data?.customerId || null

  const invalidateTier = () => {
    queryClient.invalidateQueries({ queryKey: TIER_QUERY_KEY })
  }

  return {
    tier,
    status,
    interval,
    expiresAt,
    customerId,
    isLoading,
    error,
    invalidateTier,
  }
}
