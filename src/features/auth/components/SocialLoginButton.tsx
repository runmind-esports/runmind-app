'use client'

import { Loader2 } from 'lucide-react'

interface SocialLoginButtonProps {
  provider: 'google' | 'strava'
  onClick: () => void
  isLoading: boolean
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A11.96 11.96 0 0 0 1 12c0 1.94.46 3.77 1.18 5.27l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

function StravaIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066l-2.084 4.116z" fill="white" fillOpacity="0.6"/>
      <path d="M7.463 13.828l3.159-6.243L13.78 13.828h3.564L10.622 3 3.9 13.828h3.563z" fill="white"/>
    </svg>
  )
}

const config = {
  google: {
    icon: <GoogleIcon />,
    label: 'Entrar com Google',
    loadingLabel: 'Conectando...',
    className: 'bg-white border-[1.5px] border-[rgba(20,22,46,0.09)] text-[#14162E] hover:border-[#14162E] hover:shadow-[0_2px_8px_rgba(20,22,46,0.08)]',
  },
  strava: {
    icon: <StravaIcon />,
    label: 'Entrar com Strava',
    loadingLabel: 'Conectando...',
    className: 'bg-[#FC4C02] text-white hover:opacity-90 hover:shadow-[0_2px_8px_rgba(252,76,2,0.3)]',
  },
}

export function SocialLoginButton({ provider, onClick, isLoading }: SocialLoginButtonProps) {
  const { icon, label, loadingLabel, className } = config[provider]

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLoading}
      aria-label={label}
      aria-busy={isLoading}
      className={`w-full h-12 rounded-xl text-sm font-bold font-display tracking-tight flex items-center justify-center gap-3 transition-all disabled:opacity-70 disabled:cursor-not-allowed ${className}`}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          {loadingLabel}
        </>
      ) : (
        <>
          {icon}
          {label}
        </>
      )}
    </button>
  )
}
