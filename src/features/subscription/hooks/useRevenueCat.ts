'use client'

import { useState, useCallback, useEffect } from 'react'
import { Capacitor } from '@capacitor/core'
import {
  initRevenueCat,
  loginRevenueCat,
  logoutRevenueCat,
  getOfferings,
  purchasePackage,
  isUserCancellation,
} from '@/lib/revenuecat'
import type { PurchasesPackage, PurchasesOfferings } from '@/lib/revenuecat'
import { tokenStorage } from '@/shared/lib/apiClient'
import { useUserTier } from './useUserTier'

// Decode JWT to get user ID (sub claim) for RevenueCat logIn (per D-02)
function getUserIdFromToken(): string | null {
  const token = tokenStorage.getAccessToken()
  if (!token) return null
  try {
    const base64Payload = token.split('.')[1]
    const bytes = Uint8Array.from(atob(base64Payload), (c) => c.charCodeAt(0))
    const payload = JSON.parse(new TextDecoder().decode(bytes))
    return payload.sub || null
  } catch {
    return null
  }
}

export function useRevenueCat() {
  const [offerings, setOfferings] = useState<PurchasesOfferings | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isPurchasing, setIsPurchasing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const { invalidateTier } = useUserTier()

  const isNative = typeof window !== 'undefined' && Capacitor.isNativePlatform()

  // Initialize SDK and login on mount (native only)
  useEffect(() => {
    if (!isNative) return

    const setup = async () => {
      try {
        await initRevenueCat()
        const userId = getUserIdFromToken()
        if (userId) {
          await loginRevenueCat(userId)
        }
        setIsInitialized(true)
      } catch (err) {
        console.error('[RevenueCat] Init error:', err)
        setError('Erro ao inicializar compras no app')
      }
    }

    setup()
  }, [isNative])

  // Fetch offerings
  const loadOfferings = useCallback(async () => {
    if (!isNative || !isInitialized) return
    setIsLoading(true)
    setError(null)
    try {
      const result = await getOfferings()
      setOfferings(result)
    } catch (err) {
      console.error('[RevenueCat] Offerings error:', err)
      setError('Erro ao carregar planos')
    } finally {
      setIsLoading(false)
    }
  }, [isNative, isInitialized])

  // Purchase a package
  const purchase = useCallback(async (pkg: PurchasesPackage) => {
    setIsPurchasing(true)
    setError(null)
    try {
      const customerInfo = await purchasePackage(pkg)
      // After successful purchase, invalidate tier cache so UI updates
      invalidateTier()
      return customerInfo
    } catch (err) {
      if (isUserCancellation(err)) {
        // User cancelled -- not an error
        return null
      }
      console.error('[RevenueCat] Purchase error:', err)
      setError('Erro ao processar compra. Tente novamente.')
      return null
    } finally {
      setIsPurchasing(false)
    }
  }, [invalidateTier])

  // Logout from RevenueCat (call on app logout)
  const logout = useCallback(async () => {
    if (!isNative) return
    try {
      await logoutRevenueCat()
    } catch (err) {
      console.error('[RevenueCat] Logout error:', err)
    }
  }, [isNative])

  return {
    offerings,
    isNative,
    isInitialized,
    isLoading,
    isPurchasing,
    error,
    loadOfferings,
    purchase,
    logout,
  }
}
