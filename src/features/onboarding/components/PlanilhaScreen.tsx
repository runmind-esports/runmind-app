'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { CheckCircle, Download, ArrowRight } from 'lucide-react'
import { useSpreadsheetDownload } from '../hooks/useSpreadsheetDownload'
import { getTranslations } from '../i18n/translations'
import { WhatsAppCTA } from '@/features/whatsapp-cta'

export function PlanilhaScreen() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const { status, error, download } = useSpreadsheetDownload()
  const t = getTranslations()

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [authLoading, isAuthenticated, router])

  if (authLoading || !isAuthenticated) return null

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-lg mx-auto px-6 py-8 lg:px-8 lg:py-12 flex flex-col min-h-screen items-center justify-center text-center">
        {/* Header */}
        <div className="absolute top-8 left-6 lg:left-8">
          <span className="font-display font-bold text-lg text-[#14162E]">RunMind</span>
        </div>

        {/* Celebration icon */}
        <div className="w-20 h-20 bg-[#00F048]/10 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-10 h-10 text-[#00F048]" />
        </div>

        {/* Heading */}
        <h1 className="font-display font-bold text-2xl text-[#14162E] mb-2">
          {t.planilha.heading}
        </h1>

        {/* Subtitle */}
        <p className="text-[#6B7088] text-base mb-8">
          {t.planilha.subtitle}
        </p>

        {/* Primary CTA - Download */}
        <button
          onClick={download}
          disabled={status === 'loading'}
          className="w-full py-4 bg-[#00F048] text-[#14162E] font-semibold rounded-2xl mb-4 flex items-center justify-center gap-2 hover:bg-[#00D840] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? (
            t.planilha.loading
          ) : (
            <>
              <Download className="w-5 h-5" />
              {t.planilha.downloadCta}
            </>
          )}
        </button>

        {/* Error display */}
        {error && (
          <p className="text-sm text-red-500 mb-4">
            {error}
          </p>
        )}

        {/* WhatsApp CTA — final do onboarding (D-F4, divergence documented in plan).
            PlanilhaScreen força bg-white, então o componente WhatsAppCTA (que usa
            CSS vars do tema dark global) ficaria com cinza-claro sobre branco.
            Opção B do plan: override via arbitrary Tailwind variants para forçar
            cores legíveis sobre fundo branco, mantendo variant="secondary"
            (WhatsApp é caminho complementar — o primário visual continua sendo
            "Baixar planilha"). */}
        <div className="w-full mt-2 mb-6 pt-6 border-t border-[#E5E7EB] flex flex-col items-center">
          <p className="text-sm text-[#6B7088] mb-3 text-center">
            Tem dúvidas? Fala com o coach no WhatsApp
          </p>
          <WhatsAppCTA
            variant="secondary"
            showQR={true}
            className="[&_a]:!bg-[#14162E] [&_a]:!text-white [&_a]:hover:!bg-[#1F2240] [&_p]:!text-[#6B7088]"
          />
        </div>

        {/* Secondary CTA - Go to chat */}
        <button
          onClick={() => router.push('/chat')}
          className="text-[#6B7088] text-sm flex items-center gap-1 hover:text-[#14162E] transition-colors"
        >
          {t.planilha.chatCta}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
