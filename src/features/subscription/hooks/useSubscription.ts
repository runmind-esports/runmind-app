'use client'

import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { subscriptionApi } from '../services/subscriptionApi'
import { SubscriptionPlan } from '../types/subscription.types'

export function useSubscription() {
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [isOpeningPortal, setIsOpeningPortal] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { data: plansData, isLoading: isLoadingPlans } = useQuery({
    queryKey: ['subscription-plans'],
    queryFn: () => subscriptionApi.getPlans(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  })

  const plans: SubscriptionPlan[] = plansData?.plans || []

  const checkout = async (planId: string) => {
    setIsCheckingOut(true)
    setError(null)
    try {
      const { url } = await subscriptionApi.checkout(planId)
      window.location.href = url
    } catch (err) {
      console.error('Error creating checkout session:', err)
      setError('Erro ao iniciar checkout. Tente novamente.')
    } finally {
      setIsCheckingOut(false)
    }
  }

  const openPortal = async (customerId: string) => {
    setIsOpeningPortal(true)
    setError(null)
    try {
      const { url } = await subscriptionApi.openPortal(customerId)
      window.location.href = url
    } catch (err) {
      console.error('Error opening billing portal:', err)
      setError('Erro ao abrir portal de assinatura. Tente novamente.')
    } finally {
      setIsOpeningPortal(false)
    }
  }

  return {
    plans,
    isLoadingPlans,
    isCheckingOut,
    isOpeningPortal,
    error,
    checkout,
    openPortal,
  }
}
