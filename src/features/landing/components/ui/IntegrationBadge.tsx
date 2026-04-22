'use client'

import Image from 'next/image'

interface IntegrationBadgeProps {
  provider: 'strava' | 'garmin'
  label: string
}

const BADGE_CONFIG = {
  strava: { src: '/brand/strava-compatible.svg', alt: 'Strava', width: 80, height: 24 },
  garmin: { src: '/brand/garmin-connect-iq.svg', alt: 'Garmin Connect IQ', width: 80, height: 24 },
}

export function IntegrationBadge({ provider, label }: IntegrationBadgeProps) {
  const config = BADGE_CONFIG[provider]
  return (
    <div className="inline-flex items-center gap-2 bg-background-secondary/50 rounded-full px-4 py-2 border border-border">
      <Image
        src={config.src}
        alt={config.alt}
        width={config.width}
        height={config.height}
        unoptimized
      />
      <span className="text-[13px] text-foreground-muted">{label}</span>
    </div>
  )
}
