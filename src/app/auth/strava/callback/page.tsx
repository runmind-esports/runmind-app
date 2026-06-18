'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { stravaApi } from '@/features/strava/services/stravaApi'
import { validateOAuthState, clearOAuthState } from '@/features/strava/utils/oauth'
import { authApi } from '@/features/auth/services/authApi'
import { tokenStorage, runmidApiClient } from '@/shared/lib/apiClient'

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

      // Branch on auth state: callback fires for two distinct flows.
      //   1. ATTACH — user already logged-in (Google JWT in storage) and
      //      came back from /settings clicking "Conectar Strava". Hit the
      //      protected /strava/token route to bind Strava to that account
      //      and return to /settings.
      //   2. LOGIN — user is logged-out and came back from /login clicking
      //      "Continuar com Strava". Hit the public /auth/strava route to
      //      upsert a user and receive a fresh JWT pair, then route the
      //      same way Google login does (onboarding vs. /chat).
      const isLoggedIn = authApi.isAuthenticated()

      try {
        if (isLoggedIn) {
          console.log('Attaching Strava to existing account...')
          await stravaApi.exchangeCode(code)
          clearOAuthState()
          setStatus('success')

          setTimeout(() => {
            router.push('/settings?strava=connected')
          }, 1500)
        } else {
          console.log('Logging in with Strava...')
          const { accessToken, refreshToken, user } = await stravaApi.login(code)
          tokenStorage.setTokens(accessToken, refreshToken, user.username)
          clearOAuthState()
          setStatus('success')

          // Mirrors Google callback's onboarding check: a 200 on training/
          // profile means the user has finished onboarding; a 404 (or any
          // failure) routes the user there. The same backend rule applies
          // to a brand-new Strava account, so the UX stays consistent.
          try {
            await runmidApiClient.get('/api/v1/training/profile')
            router.replace('/chat')
          } catch {
            router.replace('/onboarding')
          }
        }
      } catch (err: unknown) {
        console.error('Strava callback error:', err)
        setStatus('error')

        const error = err as { response?: { status?: number; data?: { message?: string } } }
        if (error?.response?.data?.message) {
          setErrorMessage(error.response.data.message)
        } else {
          setErrorMessage(
            isLoggedIn
              ? 'Falha ao conectar com o Strava. Tente novamente.'
              : 'Falha ao entrar com o Strava. Tente novamente.'
          )
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
              className="w-full py-3 bg-[#14162E] text-white rounded-xl text-[14px] font-bold transition-all hover:bg-[#1C2040]">
              Voltar para configurações
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
