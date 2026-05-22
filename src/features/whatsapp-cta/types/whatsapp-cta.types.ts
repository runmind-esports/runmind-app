/**
 * Response contract from POST /api/v1/whatsapp/init-token
 * (runmid-api Phase 5). Matches the canonical shape documented in
 * .planning/phases/19-whatsapp-deep-link-handler/19-CONTEXT.md.
 */
export interface InitTokenResponse {
  /** Single-use base64url token, TTL 24h backend-side */
  token: string
  /** Full https://wa.me/{number}?text=runmid-init-{token} URL */
  walink: string
  /** ISO 8601 expiration timestamp */
  expiresAt: string
  /** Optional alternate payload for the QR code. When present, equals walink. */
  qrPayload?: string
}

/**
 * Visual variant for <WhatsAppCTAButton /> / <WhatsAppCTA />.
 * - primary: brand accent (#00F048 green), used on success-page hero CTAs
 * - secondary: muted background-tertiary, used in dense layouts / modals
 */
export type WhatsAppCTAVariant = 'primary' | 'secondary'