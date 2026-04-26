'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { googleHealthApi } from '@/features/google-health/services/googleHealthApi'

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

function GoogleCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing')
  const [errorMessage, setErrorMessage] = useState<string>('')

  useEffect(() => {
    const processCallback = async () => {
      const code = searchParams.get('code')
      const state = searchParams.get('state')
      const error = searchParams.get('error')

      if (error) {
        setStatus('error')
        setErrorMessage(
          error === 'access_denied'
            ? 'Voce cancelou a autorizacao do Google Health.'
            : `Erro do Google: ${error}`
        )
        return
      }

      if (!code) {
        setStatus('error')
        setErrorMessage('Codigo de autorizacao nao encontrado.')
        return
      }

      if (!state) {
        setStatus('error')
        setErrorMessage('Estado de autorizacao nao encontrado.')
        return
      }

      try {
        await googleHealthApi.exchangeCode(code, state)
        setStatus('success')

        setTimeout(() => {
          router.push('/settings?google=connected')
        }, 1500)
      } catch (err: unknown) {
        console.error('Google Health exchange error:', err)
        setStatus('error')

        const error = err as { response?: { status?: number; data?: { message?: string } } }
        if (error?.response?.status === 401) {
          setErrorMessage('Voce precisa estar logado para conectar o Google Health.')
        } else if (error?.response?.data?.message) {
          setErrorMessage(error.response.data.message)
        } else {
          setErrorMessage('Falha ao conectar com o Google Health. Tente novamente.')
        }
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
            <h1 className="font-display font-bold text-lg text-[#14162E] mb-2">
              Conectando com Google Health...
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
              Google Health conectado!
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
              onClick={() => router.push('/settings')}
              className="w-full py-3 bg-[#14162E] text-white rounded-xl text-sm font-bold font-display transition-all hover:bg-[#1C2040]"
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
