'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AuthLayout } from '@/features/auth/components/AuthLayout'
import { PasswordInput } from '@/features/auth/components/PasswordInput'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { registerSchema, type RegisterInput } from '@/features/auth/schemas/auth.schema'

export default function SignupPage() {
  const router = useRouter()
  const { register: registerUser, isRegistering, registerError, isAuthenticated, isLoading } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      acceptTerms: false,
    },
  })

  // Redirect if already authenticated
  if (!isLoading && isAuthenticated) {
    router.push('/chat')
    return null
  }

  const onSubmit = (data: RegisterInput) => {
    registerUser({
      username: data.username,
      email: data.email,
      password: data.password,
    })
  }

  return (
    <AuthLayout
      variant="signup"
      badge="Grátis para começar"
      title={<>Seu coach<br/>de corrida<br/>com <span className="text-[#00F048]">IA</span>.</>}
      description="Em 2 minutos você tem seu primeiro plano de treino personalizado, baseado nos seus dados reais."
      steps={[
        'Crie sua conta',
        'Converse com o Coach IA',
        'Receba seu plano personalizado',
      ]}
      testimonial={{
        text: '"Corri minha primeira meia maratona em 1h54 usando o plano do Runmind. A integração com o Garmin foi <strong>perfeita</strong>."',
        name: 'Ana Ribeiro',
        role: '1ª meia maratona · 1:54:38',
        initial: 'A',
      }}
    >
      <div className="form-header mb-8">
        <h1 className="font-display font-bold text-[26px] tracking-tight text-[#14162E] mb-1.5">
          Criar conta grátis
        </h1>
        <p className="text-sm font-light leading-relaxed text-[#6B7088]">
          Já tem conta?{' '}
          <Link href="/login" className="text-[#14162E] font-semibold border-b-[1.5px] border-[#00F048]">
            Entrar
          </Link>
        </p>
      </div>

      {/* Error message */}
      {registerError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
          Ocorreu um erro ao criar sua conta. Tente novamente.
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label htmlFor="username" className="block text-xs font-bold tracking-[0.04em] text-[#14162E] mb-1.5">
            Nome de usuário
          </label>
          <input
            type="text"
            id="username"
            {...register('username')}
            placeholder="joaosilva"
            autoComplete="username"
            className={`w-full px-4 py-3 bg-[#F5F6F7] border-[1.5px] rounded-xl text-sm text-[#14162E] placeholder:text-[#A8ADBE] outline-none transition-all focus:border-[#14162E] focus:bg-white focus:shadow-[0_0_0_4px_rgba(20,22,46,0.05)] ${
              errors.username ? 'border-red-400' : 'border-[rgba(20,22,46,0.09)]'
            }`}
          />
          {errors.username && (
            <p className="mt-1 text-xs text-red-500">{errors.username.message}</p>
          )}
        </div>

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
          <label htmlFor="password" className="block text-xs font-bold tracking-[0.04em] text-[#14162E] mb-1.5">
            Senha
          </label>
          <PasswordInput
            id="password"
            {...register('password')}
            placeholder="Mínimo 8 caracteres"
            autoComplete="new-password"
            showStrength
            error={errors.password?.message}
          />
        </div>

        <div className="flex items-start gap-2.5 mb-5">
          <input
            type="checkbox"
            id="terms"
            {...register('acceptTerms')}
            className="w-4 h-4 mt-0.5 rounded-[5px] border-[1.5px] border-[rgba(20,22,46,0.09)] bg-[#F5F6F7] accent-[#14162E] cursor-pointer flex-shrink-0"
          />
          <label htmlFor="terms" className="text-[12.5px] font-normal leading-relaxed text-[#6B7088] cursor-pointer">
            Concordo com os{' '}
            <Link href="/terms" className="text-[#14162E] font-semibold border-b-[1.5px] border-[#00F048]">
              Termos de Uso
            </Link>
            {' '}e a{' '}
            <Link href="/privacy" className="text-[#14162E] font-semibold border-b-[1.5px] border-[#00F048]">
              Política de Privacidade
            </Link>
            {' '}do Runmind
          </label>
        </div>
        {errors.acceptTerms && (
          <p className="-mt-3 mb-4 text-xs text-red-500">{errors.acceptTerms.message}</p>
        )}

        <button
          type="submit"
          disabled={isRegistering}
          className="w-full py-3.5 bg-[#00F048] text-[#14162E] rounded-xl text-[15px] font-bold font-display tracking-tight shadow-[0_4px_16px_rgba(0,240,72,0.22)] transition-all hover:bg-[#00D840] hover:-translate-y-px hover:shadow-[0_6px_24px_rgba(0,240,72,0.32)] active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isRegistering ? 'Criando conta...' : 'Criar conta grátis'}
        </button>
      </form>

      <p className="text-center mt-4 text-xs text-[#A8ADBE]">
        Já tem conta?{' '}
        <Link href="/login" className="text-[#14162E] font-semibold border-b-[1.5px] border-[#00F048]">
          Entrar
        </Link>
      </p>
    </AuthLayout>
  )
}
