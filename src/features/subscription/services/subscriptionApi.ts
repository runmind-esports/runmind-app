import { runmidApiClient } from '@/shared/lib/apiClient'
import { PlansResponse, CheckoutResponse, PortalResponse, TierResponse } from '../types/subscription.types'

export const subscriptionApi = {
  async getPlans(): Promise<PlansResponse> {
    const response = await runmidApiClient.get<PlansResponse>('/api/v1/subscription/plans')
    return response.data
  },

  async checkout(planId: string): Promise<CheckoutResponse> {
    const response = await runmidApiClient.post<CheckoutResponse>('/api/v1/subscription/checkout', { planId })
    return response.data
  },

  async openPortal(customerId: string): Promise<PortalResponse> {
    const response = await runmidApiClient.post<PortalResponse>('/api/v1/subscription/portal', { customerId })
    return response.data
  },

  async getUserTier(): Promise<TierResponse> {
    const response = await runmidApiClient.get<TierResponse>('/api/v1/subscriptions/user/me/tier')
    return response.data
  },
}
