'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { stravaApi } from '@/features/strava/services/stravaApi'
import { validateOAuthState, clearOAuthState } from '@/features/strava/utils/oauth'

function RunmindLogo() {
  return (
    <svg width="40" height="40" viewBox="0 0 80 80" fill="none">
      <circle cx="40" cy="40" r="40" fill="#00F048"/>
      <path d="M22 58L22 22L44 22C54 22 62 29.5 62 38.5C62 47.5 54 55 44 55L22 55" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M42 55L62 65" stroke="white" strokeWidth="6" strokeLinecap="round"/>
    </svg>
  )
}

function SpinnerIcon() {
  return (
    <svg className="animate-spin" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="#E5E5EA" strokeWidth="3"/>
      <path d="M12 2C6.48 2 2 6.48 2 12" stroke="#00F048" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  )
}

function StravaCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing')
  const [errorMessage, setErrorMessage] = useState<string>('')

  useEffect(() => {
    const processCallback = async () => {
      const code = searchParams.get('code')
      const state = searchParams.get('state')
      const error = searchParams.get('error')

      // Handle user denial
      if (error) {
        setStatus('error')
        setErrorMessage(
          error === 'access_denied'
            ? 'Voce cancelou a autorizacao do Strava.'
            : `Erro do Strava: ${error}`
        )
        clearOAuthState()
        return
      }

      // Validate required params
      if (!code) {
        setStatus('error')
        setErrorMessage('Codigo de autorizacao nao encontrado.')
        clearOAuthState()
        return
      }

      // Validate state to prevent CSRF
      if (!validateOAuthState(state)) {
        setStatus('error')
        setErrorMessage('Estado de autorizacao invalido. Tente novamente.')
        clearOAuthState()
        return
      }

      try {
        // Exchange code for tokens
        console.log('Exchanging code with backend...')
        await stravaApi.exchangeCode(code)
        clearOAuthState()
        setStatus('success')

        // Redirect to settings with success indicator
        setTimeout(() => {
          router.push('/settings?strava=connected')
        }, 1500)
      } catch (err: unknown) {
        console.error('Strava exchange error:', err)
        setStatus('error')

        // Check for specific error types
        const error = err as { response?: { status?: number; data?: { message?: string } } }
        if (error?.response?.status === 401) {
          setErrorMessage('Voce precisa estar logado para conectar o Strava.')
        } else if (error?.response?.data?.message) {
          setErrorMessage(error.response.data.message)
        } else {
          setErrorMessage('Falha ao conectar com o Strava. Tente novamente.')
        }
        clearOAuthState()
      }
    }

    processCallback()
  }, [searchParams, router])

  return (
    <div className="min-h-screen bg-[#F5F6F7] flex items-center justify-center p-5">
      <div className="w-full max-w-[400px] bg-white rounded-2xl border-[1.5px] border-[rgba(20,22,46,0.09)] shadow-[0_8px_32px_rgba(20,22,46,0.08)] p-8 text-center">
        <div className="mb-6 flex justify-center">
          <RunmindLogo />
        </div>

        {status === 'processing' && (
          <>
            <div className="mb-4 flex justify-center">
              <SpinnerIcon />
            </div>
            <h1 className="font-['Poppins',sans-serif] font-bold text-[18px] text-[#14162E] mb-2">
              Conectando com Strava...
            </h1>
            <p className="text-[14px] text-[#6B7088]">
              Aguarde enquanto finalizamos a conexao.
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="mb-4 flex justify-center">
              <div className="w-12 h-12 rounded-full bg-[#00F048] flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12L10 17L20 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <h1 className="font-['Poppins',sans-serif] font-bold text-[18px] text-[#14162E] mb-2">
              Strava conectado!
            </h1>
            <p className="text-[14px] text-[#6B7088]">
              Redirecionando...
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="mb-4 flex justify-center">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M6 18L18 6M6 6L18 18" stroke="#DC2626" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
            <h1 className="font-['Poppins',sans-serif] font-bold text-[18px] text-[#14162E] mb-2">
              Erro na conexao
            </h1>
            <p className="text-[14px] text-[#6B7088] mb-6">
              {errorMessage}
            </p>
            <button
              onClick={() => router.push('/settings')}
              className="w-full py-3 bg-[#14162E] text-white rounded-xl text-[14px] font-bold transition-all hover:bg-[#1C2040]"
            >
              Voltar para configuracoes
            </button>
          </>
        )}
      </div>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-[#F5F6F7] flex items-center justify-center p-5">
      <div className="w-full max-w-[400px] bg-white rounded-2xl border-[1.5px] border-[rgba(20,22,46,0.09)] shadow-[0_8px_32px_rgba(20,22,46,0.08)] p-8 text-center">
        <div className="mb-6 flex justify-center">
          <RunmindLogo />
        </div>
        <div className="mb-4 flex justify-center">
          <SpinnerIcon />
        </div>
        <h1 className="font-['Poppins',sans-serif] font-bold text-[18px] text-[#14162E] mb-2">
          Carregando...
        </h1>
      </div>
    </div>
  )
}

export default function StravaCallbackPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <StravaCallbackContent />
    </Suspense>
  )
}
