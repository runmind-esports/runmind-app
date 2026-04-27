'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useStrava } from '@/features/strava/hooks/useStrava'

// Platform configuration
interface PlatformTag {
  label: string
  hot?: boolean
}

interface Platform {
  name: string
  description: string
  color: string
  tags: PlatformTag[]
  icon: React.ReactNode
}

const PLATFORMS: Record<string, Platform> = {
  strava: {
    name: 'Strava',
    description: 'Atividades, rotas, pace e historico completo de corridas.',
    color: '#FC4C02',
    tags: [
      { label: 'Recomendado', hot: true },
      { label: 'Pace' },
      { label: 'Distancia' },
      { label: 'Historico' },
    ],
    icon: (
      <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
        <path d="M12 5L17 15H14L19 25M19 25L24 15H21L16 5Z" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  garmin: {
    name: 'Garmin Connect',
    description: 'HRV, VO2max, carga de treino, qualidade do sono e biometria avancada.',
    color: '#0E6DB4',
    tags: [
      { label: 'HRV' },
      { label: 'VO2max' },
      { label: 'Sono' },
      { label: 'Biometria' },
    ],
    icon: (
      <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="9" stroke="white" strokeWidth="2"/>
        <path d="M14 7L14 14L19 14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  nike: {
    name: 'Nike Run Club',
    description: 'Corridas, desafios e historico completo da plataforma Nike.',
    color: '#111111',
    tags: [
      { label: 'Corridas' },
      { label: 'Desafios' },
      { label: 'Trofeus NRC' },
    ],
    icon: (
      <svg width="34" height="22" viewBox="0 0 52 28" fill="none">
        <path d="M3 23C11 8 25 1 40 6C48 9 53 14 50 19C47 24 36 21 25 17C14 13 7 17 3 23Z" fill="white"/>
      </svg>
    ),
  },
}

type PlatformKey = 'strava' | 'garmin' | 'nike'

function RunmindLogo() {
  return <img src="/brand/runmind-logo.svg" alt="Runmind" width={26} height={26} />
}

function CheckIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <path d="M2 5L4.5 7.5L9 2.5" stroke="#14162E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function SpinnerIcon() {
  return (
    <svg className="animate-spin" width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="5.5" stroke="#A8ADBE" strokeWidth="1.5" strokeDasharray="8 6"/>
    </svg>
  )
}

interface PlatformCardProps {
  platformKey: PlatformKey
  isConnected: boolean
  isLoading: boolean
  onConnect: () => void
}

function PlatformCard({ platformKey, isConnected, isLoading, onConnect }: PlatformCardProps) {
  const platform = PLATFORMS[platformKey]

  return (
    <div
      onClick={() => !isConnected && !isLoading && onConnect()}
      className={`
        relative flex items-center gap-4 p-5 rounded-2xl border-[1.5px] bg-white
        transition-all duration-200
        ${isConnected
          ? 'border-[rgba(0,240,72,0.45)] bg-[rgba(0,240,72,0.025)]'
          : 'border-[rgba(20,22,46,0.09)] hover:border-[rgba(20,22,46,0.2)] hover:shadow-[0_4px_20px_rgba(20,22,46,0.06)]'
        }
        ${!isConnected && !isLoading ? 'cursor-pointer' : 'cursor-default'}
      `}
    >
      {/* Connected badge */}
      {isConnected && (
        <div className="absolute -top-2 -right-2 w-[22px] h-[22px] rounded-full bg-[#00F048] border-[2.5px] border-white flex items-center justify-center">
          <CheckIcon />
        </div>
      )}

      {/* Platform logo */}
      <div
        className={`w-[50px] h-[50px] rounded-[14px] flex items-center justify-center flex-shrink-0 transition-transform duration-200 ${!isConnected && !isLoading ? 'group-hover:scale-[1.04]' : ''}`}
        style={{ backgroundColor: platform.color }}
      >
        {platform.icon}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-['Poppins',sans-serif] font-bold text-[15px] text-[#14162E] tracking-tight mb-1">
          {platform.name}
        </h3>
        <p className="text-[12px] text-[#6B7088] leading-[1.45] mb-2">
          {platform.description}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {platform.tags.map((tag) => (
            <span
              key={tag.label}
              className={`px-2 py-0.5 rounded-[5px] text-[9px] font-bold tracking-[0.1em] uppercase ${
                tag.hot
                  ? 'bg-[rgba(0,240,72,0.08)] border border-[rgba(0,240,72,0.25)] text-[#007A30]'
                  : 'bg-[#F5F6F7] border border-[rgba(20,22,46,0.08)] text-[#A8ADBE]'
              }`}
            >
              {tag.hot && '\u2B50 '}{tag.label}
            </span>
          ))}
        </div>
      </div>

      {/* Action button */}
      <div className="flex-shrink-0">
        {isLoading ? (
          <div className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#F5F6F7] text-[#6B7088] text-[12px] font-bold min-w-[106px] justify-center">
            <SpinnerIcon />
            Conectando
          </div>
        ) : isConnected ? (
          <div className="px-4 py-2.5 rounded-full bg-[rgba(0,240,72,0.12)] border border-[rgba(0,240,72,0.3)] text-[#007A30] text-[12px] font-bold">
            Conectado
          </div>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onConnect()
            }}
            className="px-4 py-2.5 rounded-full bg-[#14162E] text-white text-[12px] font-bold transition-all hover:bg-[#1C2040] hover:shadow-[0_3px_12px_rgba(20,22,46,0.18)] hover:scale-[1.02]"
          >
            Conectar
          </button>
        )}
      </div>
    </div>
  )
}

function ConnectAppsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isConnected: isStravaConnected, isLoadingStatus, connect: connectStrava, refetchStatus } = useStrava()

  // Mock state for Garmin and Nike (not implemented yet)
  const [mockConnected, setMockConnected] = useState<Set<'garmin' | 'nike'>>(new Set())
  const [mockLoading, setMockLoading] = useState<'garmin' | 'nike' | null>(null)

  // Show success message from callback
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    if (searchParams.get('strava') === 'connected') {
      setShowSuccess(true)
      // Clear the URL parameter
      const url = new URL(window.location.href)
      url.searchParams.delete('strava')
      window.history.replaceState({}, '', url.pathname)

      // Refetch Strava status
      refetchStatus()

      // Hide success after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000)
    }
  }, [searchParams, refetchStatus])

  // Calculate connected count
  const connectedCount = (isStravaConnected ? 1 : 0) + mockConnected.size
  const progressWidth = Math.min(55 + connectedCount * 14, 97)

  const handleConnect = (platform: PlatformKey) => {
    if (platform === 'strava') {
      connectStrava()
      return
    }

    // Mock connection for Garmin and Nike
    if (mockConnected.has(platform) || mockLoading) return
    setMockLoading(platform)
    setTimeout(() => {
      setMockConnected((prev) => new Set([...prev, platform]))
      setMockLoading(null)
    }, 1400)
  }

  const isConnected = (platform: PlatformKey): boolean => {
    if (platform === 'strava') return isStravaConnected
    return mockConnected.has(platform)
  }

  const isLoading = (platform: PlatformKey): boolean => {
    if (platform === 'strava') return isLoadingStatus
    return mockLoading === platform
  }

  const handleContinue = () => {
    router.push('/onboarding')
  }

  const getConnectedNames = (): string[] => {
    const names: string[] = []
    if (isStravaConnected) names.push('Strava')
    if (mockConnected.has('garmin')) names.push('Garmin')
    if (mockConnected.has('nike')) names.push('Nike')
    return names
  }

  const getAlertText = () => {
    const names = getConnectedNames()
    if (names.length === 1) {
      return `${names[0]} conectado - seu coach ja tem dados para trabalhar!`
    }
    if (names.length === 2) {
      return `${names.join(' e ')} conectados - incrivel!`
    }
    if (names.length === 3) {
      return 'Todos os 3 apps conectados! Seu coach tem tudo que precisa.'
    }
    return ''
  }

  const getCtaText = () => {
    if (connectedCount === 0) return 'Continuar sem conectar'
    if (connectedCount === 1) {
      return `Continuar com ${getConnectedNames()[0]}`
    }
    if (connectedCount === 2) {
      return `Ir para o dashboard com ${connectedCount} apps conectados`
    }
    return 'Tudo pronto! Ir para o dashboard'
  }

  const getCtaClass = () => {
    if (connectedCount === 0) return 'bg-[rgba(20,22,46,0.06)] text-[#A8ADBE] cursor-not-allowed'
    if (connectedCount === 1) return 'bg-[#14162E] text-white shadow-[0_4px_16px_rgba(20,22,46,0.15)] hover:bg-[#1C2040] hover:-translate-y-px'
    return 'bg-[#00F048] text-[#14162E] shadow-[0_4px_16px_rgba(0,240,72,0.25)] hover:bg-[#00DC42] hover:shadow-[0_6px_24px_rgba(0,240,72,0.35)] hover:-translate-y-px'
  }

  return (
    <div className="min-h-screen bg-[#F5F6F7] flex items-center justify-center p-5 sm:p-10 font-['Manrope',sans-serif]">
      <div className="w-full max-w-[580px] bg-white rounded-3xl border-[1.5px] border-[rgba(20,22,46,0.09)] shadow-[0_12px_56px_rgba(20,22,46,0.09)] overflow-hidden animate-fadeIn">
        {/* Progress bar */}
        <div className="h-[3px] bg-[#F5F6F7]">
          <div
            className="h-full bg-gradient-to-r from-[#00F048] to-[#00D840] rounded-r-sm transition-all duration-500 ease-out"
            style={{ width: `${progressWidth}%` }}
          />
        </div>

        <div className="p-6 sm:p-10 sm:pb-8">
          {/* Top row */}
          <div className="flex items-center justify-between mb-8 sm:mb-9">
            <Link href="/" className="flex items-center gap-2.5">
              <RunmindLogo />
              <span className="font-['Poppins',sans-serif] font-bold text-[16px] text-[#14162E] tracking-tight">
                runmind
              </span>
            </Link>
            <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-[#A8ADBE]">
              Passo 2 de 3
            </span>
          </div>

          {/* Header */}
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#00F048] mb-2">
            Configuracao da conta
          </p>
          <h1 className="font-['Poppins',sans-serif] font-bold text-[22px] sm:text-[24px] text-[#14162E] tracking-tight leading-[1.15] mb-2">
            Conecte seus apps de corrida
          </h1>
          <p className="text-[13.5px] font-light leading-[1.65] text-[#6B7088] mb-6">
            A IA usa seus dados reais para criar planos precisos. Quanto mais voce conectar, melhor o seu coach.
          </p>

          {/* Benefit pills */}
          <div className="flex flex-wrap gap-2 mb-6">
            {['Historico importado', 'Planos personalizados', 'Sem entrada manual'].map((text) => (
              <div key={text} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F5F6F7] border border-[rgba(20,22,46,0.09)]">
                <div className="w-[5px] h-[5px] rounded-full bg-[#00F048]" />
                <span className="text-[11px] font-semibold text-[#14162E]">{text}</span>
              </div>
            ))}
          </div>

          {/* Success message from callback */}
          {showSuccess && (
            <div className="flex items-center gap-2.5 p-4 mb-5 bg-[rgba(0,240,72,0.12)] border border-[rgba(0,240,72,0.35)] rounded-xl animate-fadeIn">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="9" r="9" fill="#00F048"/>
                <path d="M5 9L8 12L13 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-[13px] font-semibold text-[#14162E]">
                Strava conectado com sucesso!
              </span>
            </div>
          )}

          {/* Connected alert */}
          {connectedCount > 0 && !showSuccess && (
            <div className="flex items-center gap-2.5 p-4 mb-5 bg-[rgba(0,240,72,0.07)] border border-[rgba(0,240,72,0.25)] rounded-xl animate-fadeIn">
              <div className="w-[7px] h-[7px] rounded-full bg-[#00F048] flex-shrink-0" />
              <span className="text-[12px] font-semibold text-[#14162E]">
                {getAlertText()}
              </span>
            </div>
          )}

          {/* Platform cards */}
          <div className="flex flex-col gap-2.5">
            {(Object.keys(PLATFORMS) as PlatformKey[]).map((key) => (
              <PlatformCard
                key={key}
                platformKey={key}
                isConnected={isConnected(key)}
                isLoading={isLoading(key)}
                onConnect={() => handleConnect(key)}
              />
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="p-6 sm:px-10 sm:pb-9 pt-5 border-t border-[rgba(20,22,46,0.09)]">
          <button
            onClick={handleContinue}
            disabled={connectedCount === 0}
            className={`w-full py-3.5 rounded-xl font-['Poppins',sans-serif] font-bold text-[15px] transition-all duration-200 mb-2.5 ${getCtaClass()}`}
          >
            {getCtaText()}
          </button>

          <button
            onClick={handleContinue}
            className="block w-full text-center py-1 text-[13px] font-medium text-[#A8ADBE] hover:text-[#6B7088] transition-colors"
          >
            Pular e ir para o dashboard
          </button>

          <p className="text-center text-[11px] text-[#A8ADBE] mt-3 leading-[1.5]">
            {connectedCount > 0
              ? 'Voce pode adicionar mais integrações depois nas Configurações.'
              : 'Voce pode adicionar ou remover integrações a qualquer momento em Configurações.'
            }
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease both;
        }
      `}</style>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-[#F5F6F7] flex items-center justify-center p-5 sm:p-10">
      <div className="w-full max-w-[580px] bg-white rounded-3xl border-[1.5px] border-[rgba(20,22,46,0.09)] shadow-[0_12px_56px_rgba(20,22,46,0.09)] p-10 text-center">
        <div className="mb-6 flex justify-center">
          <RunmindLogo />
        </div>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    </div>
  )
}

export default function ConnectAppsPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ConnectAppsContent />
    </Suspense>
  )
}
