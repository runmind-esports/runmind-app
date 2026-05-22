'use client'

import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { tokenStorage } from '@/shared/lib/apiClient'
import { whatsappCtaApi } from '../services/whatsappCtaApi'
import { InitTokenResponse } from '../types/whatsapp-cta.types'

/**
 * Known error codes surfaced by POST /api/v1/whatsapp/init-token.
 * - RATE_LIMITED: 429, backend rate limit (5/h/user). Show specific message; no auto-retry.
 * - WHATSAPP_NOT_CONFIGURED: 503, backend WhatsApp number/credentials missing or downstream
 *   unavailable. Show specific message; no auto-retry.
 * - null: any other axios error (network, 5xx, malformed body). Fallback to generic message.
 */
export type WhatsAppInitTokenErrorCode = 'RATE_LIMITED' | 'WHATSAPP_NOT_CONFIGURED' | null

interface ErrorBodyShape {
  code?: unknown
}

/**
 * Narrow the response body to extract the `code` field if present.
 * Avoids `any` cast; the body shape is server-driven and not part of axios types.
 */
function extractErrorCode(error: unknown): WhatsAppInitTokenErrorCode {
  if (!(error instanceof AxiosError)) return null
  const data = error.response?.data as ErrorBodyShape | undefined
  const code = data?.code
  if (code === 'RATE_LIMITED' || code === 'WHATSAPP_NOT_CONFIGURED') {
    return code
  }
  return null
}

/**
 * Build a per-user query key segment so cache never bleeds across logged-in users.
 * Falls back to 'anonymous' when no username is stored — the `enabled` gate
 * already prevents the query from running in that case, but the key is still
 * stable for predictable cache eviction.
 */
function getUserKey(): string {
  return tokenStorage.getUsername() ?? 'anonymous'
}

/**
 * Cache the {token, walink, expiresAt} response for 23h.
 * Slightly less than the backend's 24h TTL so we never deliver a near-expiry token.
 * `retry: false` is load-bearing: 429 / 503 must NOT auto-retry (D-F13).
 * 401 is handled transparently by the runmidApiClient response interceptor.
 */
export function useWhatsAppInitToken() {
  const isAuthenticated =
    typeof window !== 'undefined' && !!tokenStorage.getAccessToken()
  const userKey = getUserKey()

  const { data, isLoading, error } = useQuery<InitTokenResponse>({
    queryKey: ['whatsapp-init-token', userKey],
    queryFn: () => whatsappCtaApi.initToken(),
    staleTime: 23 * 60 * 60 * 1000, // 23h
    retry: false,
    enabled: isAuthenticated,
  })

  const walink = data?.walink ?? null
  const qrValue = data?.qrPayload ?? data?.walink ?? null
  const expiresAt = data?.expiresAt ?? null
  const errorCode: WhatsAppInitTokenErrorCode = error ? extractErrorCode(error) : null

  return {
    walink,
    qrValue,
    expiresAt,
    isLoading,
    error,
    errorCode,
  }
}
