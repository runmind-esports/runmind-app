'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AuthLayout } from '@/features/auth/components/AuthLayout'
import { SocialLoginButton } from '@/features/auth/components/SocialLoginButton'
import { LoginDivider } from '@/features/auth/components/LoginDivider'
import { useAuth } from '@/features/auth/hooks/useAuth'

export default function LoginPage() {
  const router = useRouter()
  const {
    loginWithGoogle,
    isConnectingGoogle,
    loginWithStrava,
    isConnectingStrava,
    socialLoginError,
    isAuthenticated,
    isLoading,
  } = useAuth()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/chat')
    }
  }, [isLoading, isAuthenticated, router])

  if (!isLoading && isAuthenticated) {
    return null
  }

  return (
    <AuthLayout
      variant="login"
      badge="Coach IA ativo"
      title={<>Seu coach<br/>de corrida<br/>com <span className="text-[#00F048]">IA</span>.</>}
      description="Conecte seu Strava ou Google, e em 2 minutos você tem seu plano de treino personalizado."
      steps={[
        'Conecte sua conta',
        'Converse com o Coach IA',
        'Receba seu plano personalizado',
      ]}
      testimonial={{
        text: '"O Runmind mudou como eu treino. Meu pace de 10km saiu de 5:40 para <strong>4:52 em 10 semanas</strong>."',
        name: 'Rafael Costa',
        role: 'PR de 10km: 48:34',
        initial: 'R',
      }}
    >
      <div className="mb-8">
        <h1 className="font-display font-bold text-[26px] tracking-tight text-[#14162E] mb-1.5">
          Vamos treinar?
        </h1>
        <p className="text-sm font-light leading-relaxed text-[#6B7088]">
          Conecte sua conta para começar
        </p>
      </div>

      {socialLoginError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
          {socialLoginError}
        </div>
      )}

      <SocialLoginButton
        provider="google"
        onClick={loginWithGoogle}
        isLoading={isConnectingGoogle}
      />

      <LoginDivider />

      <SocialLoginButton
        provider="strava"
        onClick={loginWithStrava}
        isLoading={isConnectingStrava}
      />

      <p className="text-center mt-6 text-xs text-[#A8ADBE]">
        Ao entrar, você concorda com nossos{' '}
        <Link href="/terms" className="text-[#14162E] font-semibold border-b-[1.5px] border-[#00F048]">
          Termos de Uso
        </Link>
        {' '}e{' '}
        <Link href="/privacy" className="text-[#14162E] font-semibold border-b-[1.5px] border-[#00F048]">
          Privacidade
        </Link>
      </p>
    </AuthLayout>
  )
}
