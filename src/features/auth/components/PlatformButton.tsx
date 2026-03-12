'use client'

interface PlatformButtonProps {
  platform: 'strava' | 'garmin'
  action: string
  subtitle: string
  onClick?: () => void
}

const platformConfig = {
  strava: {
    color: '#FC4C02',
    hoverColor: '#E04400',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
      </svg>
    ),
  },
  garmin: {
    color: '#0E6DB4',
    hoverColor: '#0A5A96',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 3.6c4.638 0 8.4 3.762 8.4 8.4 0 4.638-3.762 8.4-8.4 8.4-4.638 0-8.4-3.762-8.4-8.4 0-4.638 3.762-8.4 8.4-8.4zm0 1.2c-3.978 0-7.2 3.222-7.2 7.2s3.222 7.2 7.2 7.2 7.2-3.222 7.2-7.2-3.222-7.2-7.2-7.2zm0 2.4c2.651 0 4.8 2.149 4.8 4.8s-2.149 4.8-4.8 4.8-4.8-2.149-4.8-4.8 2.149-4.8 4.8-4.8z" />
      </svg>
    ),
  },
}

export function PlatformButton({ platform, action, subtitle, onClick }: PlatformButtonProps) {
  const config = platformConfig[platform]

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl border-[1.5px] border-[rgba(20,22,46,0.09)] bg-white transition-all hover:border-[rgba(20,22,46,0.18)] hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] group"
    >
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center text-white flex-shrink-0 transition-colors"
        style={{ backgroundColor: config.color }}
      >
        {config.icon}
      </div>
      <div className="text-left flex-1">
        <div className="text-[14px] font-semibold text-[#14162E] tracking-tight">
          {action}
        </div>
        <div className="text-[11px] text-[#A8ADBE]">{subtitle}</div>
      </div>
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        className="text-[#A8ADBE] group-hover:text-[#14162E] transition-colors"
      >
        <path
          d="M6 4l4 4-4 4"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}
