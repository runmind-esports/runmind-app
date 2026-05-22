'use client'

import { cn } from '@/lib/utils'
import { useWhatsAppInitToken } from '../hooks/useWhatsAppInitToken'
import { getTranslations } from '../i18n/translations'
import { WhatsAppCTAVariant } from '../types/whatsapp-cta.types'
import { WhatsAppCTAButton } from './WhatsAppCTAButton'
import { WhatsAppQR } from './WhatsAppQR'

interface WhatsAppCTAProps {
  variant?: WhatsAppCTAVariant
  /**
   * Whether to render the QR code alongside the button on `md+` viewports.
   * On viewports below `md` the QR is never rendered, regardless of this flag.
   * Defaults to `true`.
   */
  showQR?: boolean
  className?: string
  /**
   * Optional click callback. The feature itself does NOT fire any analytics
   * SDK call (D-F15: no tracker installed in runmid-app). Consumers in
   * future plans can pass a callback to log `whatsapp_cta_clicked` once an
   * analytics provider exists.
   */
  onCtaClick?: () => void
}

/**
 * Top-level WhatsApp conversion CTA. Encapsulates:
 *   - Fetching + caching of the init-token via TanStack Query (23h staleTime)
 *   - Loading skeleton
 *   - Error banners mapped from errorCode (RATE_LIMITED, WHATSAPP_NOT_CONFIGURED, generic)
 *   - Adaptive layout via Tailwind responsive classes — NO user-agent detection (D-F9)
 *
 * Consumers (Plan 02) only need:
 *   `<WhatsAppCTA />` — picks up auth state from tokenStorage automatically.
 */
export function WhatsAppCTA({
  variant = 'primary',
  showQR = true,
  className,
  onCtaClick,
}: WhatsAppCTAProps) {
  const t = getTranslations()
  const { walink, qrValue, isLoading, error, errorCode } = useWhatsAppInitToken()

  if (isLoading) {
    return (
      <div
        className={cn('flex flex-col items-center gap-2 w-full', className)}
        aria-live="polite"
      >
        <div className="animate-pulse bg-background-tertiary h-12 w-full max-w-xs rounded-full" />
        <p className="text-xs text-foreground-muted">{t.loading}</p>
      </div>
    )
  }

  if (error) {
    const message =
      errorCode === 'RATE_LIMITED'
        ? t.errorRateLimited
        : errorCode === 'WHATSAPP_NOT_CONFIGURED'
        ? t.errorUnavailable
        : t.errorGeneric

    return (
      <div
        role="alert"
        className={cn(
          'p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center max-w-md mx-auto',
          className
        )}
      >
        {message}
      </div>
    )
  }

  // Defensive: query disabled (unauth) or no data yet — render nothing rather than a broken anchor.
  if (!walink) {
    return null
  }

  return (
    <div
      className={cn(
        'flex flex-col items-center gap-4 md:flex-row md:items-center md:justify-center md:gap-8',
        className
      )}
    >
      <WhatsAppCTAButton
        walink={walink}
        label={t.buttonLabel}
        variant={variant}
        onClick={onCtaClick}
      />
      {showQR && qrValue && (
        <div className="hidden md:block">
          <WhatsAppQR value={qrValue} instruction={t.qrInstruction} />
        </div>
      )}
    </div>
  )
}
