import { runmidApiClient } from '@/shared/lib/apiClient'
import { InitTokenResponse } from '../types/whatsapp-cta.types'

/**
 * WhatsApp CTA service. Wraps the runmid-api Phase 5 endpoint.
 *
 * Auth is handled transparently by runmidApiClient (Bearer JWT injected
 * via request interceptor, 401 -> refresh-token flow via response
 * interceptor). Axios throws on status >= 400; the hook layer is
 * responsible for mapping error responses to user-facing messages.
 */
export const whatsappCtaApi = {
  async initToken(): Promise<InitTokenResponse> {
    const response = await runmidApiClient.post<InitTokenResponse>(
      '/api/v1/whatsapp/init-token',
      {}
    )
    return response.data
  },
}