'use client'

import { QRCodeSVG } from 'qrcode.react'

interface WhatsAppQRProps {
  value: string
  instruction: string
  size?: number
}

/**
 * QR code render for the WhatsApp deep link.
 *
 * Uses SVG (not Canvas) for:
 *   - DPI-independent sharpness across desktop displays.
 *   - No canvas fingerprinting surface.
 *
 * The container forces a light backdrop with dark foreground so the QR
 * stays readable when the app is in dark mode (which is the default).
 */
export function WhatsAppQR({ value, instruction, size = 160 }: WhatsAppQRProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="rounded-xl bg-white p-3">
        <QRCodeSVG
          value={value}
          size={size}
          bgColor="#FFFFFF"
          fgColor="#14162E"
          level="M"
        />
      </div>
      <p className="text-xs text-foreground-muted text-center max-w-[200px]">
        {instruction}
      </p>
    </div>
  )
}
