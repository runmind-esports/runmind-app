'use client'

interface IntegrationBadgeProps {
  provider: 'strava' | 'garmin'
  label: string
}

const BADGE_CONFIG = {
  strava: {
    name: 'Strava',
    color: '#FC4C02',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
      </svg>
    ),
  },
  garmin: {
    name: 'Garmin',
    color: '#007CC3',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
  },
}

export function IntegrationBadge({ provider, label }: IntegrationBadgeProps) {
  const config = BADGE_CONFIG[provider]
  return (
    <div className="inline-flex items-center gap-3 rounded-xl px-5 py-3 border border-border bg-background hover:border-accent/30 transition-colors duration-200">
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center"
        style={{ backgroundColor: `${config.color}20`, color: config.color }}
      >
        {config.icon}
      </div>
      <div>
        <div className="text-sm font-bold font-display">{config.name}</div>
        <div className="text-[11px] text-foreground-muted">{label}</div>
      </div>
    </div>
  )
}
