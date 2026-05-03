import { Purchases, LOG_LEVEL, PURCHASES_ERROR_CODE } from '@revenuecat/purchases-capacitor'
import type { PurchasesOfferings, PurchasesPackage, CustomerInfo } from '@revenuecat/purchases-capacitor'
import { Capacitor } from '@capacitor/core'

const REVENUECAT_IOS_KEY = process.env.NEXT_PUBLIC_REVENUECAT_IOS_KEY || ''
const REVENUECAT_ANDROID_KEY = process.env.NEXT_PUBLIC_REVENUECAT_ANDROID_KEY || ''

/**
 * Initialize RevenueCat SDK. Call once at app startup.
 * Only runs on native platforms (iOS/Android). Skipped on web.
 */
export async function initRevenueCat(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return

  const isDev = process.env.NODE_ENV === 'development'
  if (isDev) {
    await Purchases.setLogLevel({ level: LOG_LEVEL.DEBUG })
  }

  const apiKey = Capacitor.getPlatform() === 'ios'
    ? REVENUECAT_IOS_KEY
    : REVENUECAT_ANDROID_KEY

  if (!apiKey) {
    console.warn('[RevenueCat] No API key configured for platform:', Capacitor.getPlatform())
    return
  }

  await Purchases.configure({ apiKey })
}

/**
 * Identify user in RevenueCat. Call after JWT authentication.
 * Uses internal user ID from JWT (per D-02), NOT email.
 */
export async function loginRevenueCat(userId: string): Promise<CustomerInfo | null> {
  if (!Capacitor.isNativePlatform()) return null
  const result = await Purchases.logIn({ appUserID: userId })
  return result.customerInfo
}

/**
 * Log out user from RevenueCat. Call on app logout.
 */
export async function logoutRevenueCat(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return
  await Purchases.logOut()
}

/**
 * Get available offerings (product packages) from RevenueCat.
 */
export async function getOfferings(): Promise<PurchasesOfferings | null> {
  if (!Capacitor.isNativePlatform()) return null
  const offerings = await Purchases.getOfferings()
  return offerings
}

/**
 * Purchase a package. Returns updated CustomerInfo on success.
 * Throws on cancellation or error.
 */
export async function purchasePackage(pkg: PurchasesPackage): Promise<CustomerInfo> {
  const result = await Purchases.purchasePackage({ aPackage: pkg })
  return result.customerInfo
}

/**
 * Get current customer info (entitlements, active subscriptions).
 */
export async function getCustomerInfo(): Promise<CustomerInfo | null> {
  if (!Capacitor.isNativePlatform()) return null
  const info = await Purchases.getCustomerInfo()
  return info.customerInfo
}

/**
 * Check if a purchase error is a user cancellation (not a real error).
 */
export function isUserCancellation(error: unknown): boolean {
  if (error && typeof error === 'object' && 'code' in error) {
    return (error as { code: number }).code === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR
  }
  return false
}

export type { PurchasesOfferings, PurchasesPackage, CustomerInfo }
