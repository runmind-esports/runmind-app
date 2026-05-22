'use client'

import { MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { WhatsAppCTAVariant } from '../types/whatsapp-cta.types'

interface WhatsAppCTAButtonProps {
  walink: string
  label: string
  variant?: WhatsAppCTAVariant
  onClick?: () => void
  className?: string
}

/**
 * Standalone WhatsApp CTA anchor.
 *
 * Renders as `<a target="_blank" rel="noopener noreferrer">` so:
 *   - Mobile OSes resolve `wa.me/{number}?text=runmid-init-{token}` via their
 *     WhatsApp app protocol handler and open the conversation directly.
 *   - Desktop browsers open WhatsApp Web in a new tab.
 *   - `rel="noopener noreferrer"` mitigates window.opener hijack (T-19-02)
 *     and prevents the target page from reading the page-of-origin (T-19-01).
 */
export function WhatsAppCTAButton({
  walink,
  label,
  variant = 'primary',
  onClick,
  className,
}: WhatsAppCTAButtonProps) {
  const primaryStyles =
    'bg-[#00F048] text-[#14162E] hover:bg-[#00F048]/90'
  const secondaryStyles =
    'bg-background-tertiary text-foreground hover:bg-background-tertiary/80'

  return (
    <a
      href={walink}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      className={cn(
        'inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold transition-colors',
        variant === 'primary' ? primaryStyles : secondaryStyles,
        className
      )}
    >
      <MessageCircle className="w-4 h-4" aria-hidden="true" />
      <span>{label}</span>
    </a>
  )
}