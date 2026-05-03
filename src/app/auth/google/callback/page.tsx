'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { authApi } from '@/features/auth/services/authApi'
import { googleHealthApi } from '@/features/google-health/services/googleHealthApi'

function RunmindLogo() {
  return <img src="/brand/runmind-logo.svg" alt="Runmind" width={40} height={40} />
}

function SpinnerIcon() {
  return (
    <svg className="animate-spin" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="#E5E5EA" strokeWidth="3"/>
      <path d="M12 2C6.48 2 2 6.48 2 12" stroke="#00F048" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  )
}

function GoogleCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing')
  const [errorMessage, setErrorMessage] = useState<string>('')

  useEffect(() => {
    const processCallback = async () => {
      const error = searchParams.get('error')

      if (error) {
        setStatus('error')
        setErrorMessage(
          error === 'access_denied'
            ? 'Voce cancelou a autorizacao do Google.'
            : `Erro do Google: ${error}`
        )
        return
      }

      // Login flow: backend redirects with tokens in URL
      const accessToken = searchParams.get('accessToken')
      const refreshToken = searchParams.get('refreshToken')
      const username = searchParams.get('username')

      if (accessToken && refreshToken) {
        authApi.processGoogleCallback({
          accessToken,
          refreshToken,
          userId: searchParams.get('userId') || '',
          username: username || '',
        })

        // Close in-app browser on native platforms
        try {
          const { Capacitor } = await import('@capacitor/core')
          if (Capacitor.isNativePlatform()) {
            const { Browser } = await import('@capacitor/browser')
            await Browser.close()
          }
        } catch {}

        // Check if user has completed onboarding
        try {
          const { runmidApiClient } = await import('@/shared/lib/apiClient')
          await runmidApiClient.get('/api/v1/training/profile')
          router.replace('/chat')
        } catch {
          // Profile not found — first time user, go to onboarding
          router.replace('/onboarding')
        }
        return
      }

      // Health connection flow: code + state from Google OAuth
      const code = searchParams.get('code')
      const state = searchParams.get('state')

      if (code && state) {
        try {
          await googleHealthApi.exchangeCode(code, state)
          setStatus('success')
          setTimeout(() => {
            router.push('/settings?google=connected')
          }, 1500)
        } catch (err: unknown) {
          console.error('Google Health exchange error:', err)
          setStatus('error')
          const apiErr = err as { response?: { status?: number; data?: { message?: string } } }
          if (apiErr?.response?.status === 401) {
            setErrorMessage('Voce precisa estar logado para conectar o Google Health.')
          } else if (apiErr?.response?.data?.message) {
            setErrorMessage(apiErr.response.data.message)
          } else {
            setErrorMessage('Falha ao conectar com o Google. Tente novamente.')
          }
        }
        return
      }

      // No valid params
      setStatus('error')
      setErrorMessage('Dados de autenticacao incompletos.')
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
            <h1 className="font-display font-bold text-lg text-[#14162E] mb-2">
              Conectando com Google...
            </h1>
            <p className="text-sm text-[#6B7088]">
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
            <h1 className="font-display font-bold text-lg text-[#14162E] mb-2">
              Conectado!
            </h1>
            <p className="text-sm text-[#6B7088]">
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
            <h1 className="font-display font-bold text-lg text-[#14162E] mb-2">
              Erro na conexao
            </h1>
            <p className="text-sm text-[#6B7088] mb-6">
              {errorMessage}
            </p>
            <button
              onClick={() => router.push('/login')}
              className="w-full py-3 bg-[#14162E] text-white rounded-xl text-sm font-bold font-display transition-all hover:bg-[#1C2040]"
            >
              Tentar novamente
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
        <h1 className="font-display font-bold text-lg text-[#14162E] mb-2">
          Carregando...
        </h1>
      </div>
    </div>
  )
}

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <GoogleCallbackContent />
    </Suspense>
  )
}
