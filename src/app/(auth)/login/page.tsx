'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AuthLayout } from '@/features/auth/components/AuthLayout'
import { PasswordInput } from '@/features/auth/components/PasswordInput'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { loginSchema, type LoginInput } from '@/features/auth/schemas/auth.schema'

export default function LoginPage() {
  const router = useRouter()
  const { login, isLoggingIn, loginError, isAuthenticated, isLoading } = useAuth()
  const [rememberMe, setRememberMe] = useState(true)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/chat')
    }
  }, [isLoading, isAuthenticated, router])

  if (!isLoading && isAuthenticated) {
    return null
  }

  const onSubmit = (data: LoginInput) => {
    login(data)
  }

  return (
    <AuthLayout
      variant="login"
      badge="Coach IA ativo"
      title={<>Bem-vindo<br/>de <span className="text-[#00F048]">volta</span>,<br/>atleta.</>}
      description="Seus treinos, dados e plano te esperam. Continue de onde parou."
      stats={[
        { value: '4:28', unit: '/km', label: 'Seu melhor pace' },
        { value: '94%', label: 'Prontidão hoje', highlight: true },
        { value: '42', unit: 'km', label: 'Semana atual' },
      ]}
      testimonial={{
        text: '"O Runmind mudou como eu treino. Meu pace de 10km saiu de 5:40 para <strong>4:52 em 10 semanas</strong>."',
        name: 'Rafael Costa',
        role: 'PR de 10km: 48:34',
        initial: 'R',
      }}
    >
      <div className="form-header mb-8">
        <h1 className="font-display font-bold text-[26px] tracking-tight text-[#14162E] mb-1.5">
          Entrar na conta
        </h1>
        <p className="text-sm font-light leading-relaxed text-[#6B7088]">
          Não tem conta?{' '}
          <Link href="/signup" className="text-[#14162E] font-semibold border-b-[1.5px] border-[#00F048]">
            Criar agora
          </Link>
        </p>
      </div>

      {/* Error message */}
      {loginError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
          Email ou senha incorretos. Tente novamente.
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-xs font-bold tracking-[0.04em] text-[#14162E] mb-1.5">
            E-mail
          </label>
          <input
            type="email"
            id="email"
            {...register('email')}
            placeholder="seu@email.com"
            autoComplete="email"
            className={`w-full px-4 py-3 bg-[#F5F6F7] border-[1.5px] rounded-xl text-sm text-[#14162E] placeholder:text-[#A8ADBE] outline-none transition-all focus:border-[#14162E] focus:bg-white focus:shadow-[0_0_0_4px_rgba(20,22,46,0.05)] ${
              errors.email ? 'border-red-400' : 'border-[rgba(20,22,46,0.09)]'
            }`}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="password" className="text-xs font-bold tracking-[0.04em] text-[#14162E]">
              Senha
            </label>
            <Link href="/forgot-password" className="text-xs font-semibold text-[#6B7088] hover:text-[#14162E] transition-colors">
              Esqueceu a senha?
            </Link>
          </div>
          <PasswordInput
            id="password"
            {...register('password')}
            placeholder="••••••••"
            autoComplete="current-password"
            error={errors.password?.message}
          />
        </div>

        <div className="flex items-start gap-2.5 mb-5">
          <input
            type="checkbox"
            id="remember"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 mt-0.5 rounded-[5px] border-[1.5px] border-[rgba(20,22,46,0.09)] bg-[#F5F6F7] accent-[#14162E] cursor-pointer flex-shrink-0"
          />
          <label htmlFor="remember" className="text-[12.5px] font-normal leading-relaxed text-[#6B7088] cursor-pointer">
            Manter conectado por 30 dias
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoggingIn}
          className="w-full py-3.5 bg-[#14162E] text-white rounded-xl text-[15px] font-bold font-display tracking-tight shadow-[0_4px_16px_rgba(20,22,46,0.18)] transition-all hover:bg-[#1C2040] hover:-translate-y-px hover:shadow-[0_6px_22px_rgba(20,22,46,0.22)] active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoggingIn ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <p className="text-center mt-5 text-xs text-[#A8ADBE]">
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
