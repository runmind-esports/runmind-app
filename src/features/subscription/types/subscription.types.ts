export type BillingInterval = 'monthly' | 'semestral' | 'yearly'

export interface SubscriptionPlan {
  id: string          // e.g. "pro_monthly"
  name: string        // e.g. "Pro"
  tier: string        // "pro" | "premium"
  amount: number      // in centavos (2990 = R$ 29,90)
  interval: BillingInterval
  features: string[]
  highlighted?: boolean
}

export interface PlansResponse {
  plans: SubscriptionPlan[]
}

export interface CheckoutResponse {
  url: string
}

export interface PortalResponse {
  url: string
}

export interface TierResponse {
  tier: string        // "free" | "pro" | "premium"
  status: string      // "active" | "canceled" | "past_due"
  interval: string | null // "monthly" | "yearly"
  expiresAt: string | null
  customerId: string | null
}

export type UserTier = 'free' | 'pro' | 'premium'
