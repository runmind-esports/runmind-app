'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { AuthLayout } from '@/features/auth/components/AuthLayout'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { forgotPasswordSchema, type ForgotPasswordInput } from '@/features/auth/schemas/auth.schema'

export default function ForgotPasswordPage() {
  const {
    forgotPassword,
    isSendingForgotPassword,
    forgotPasswordError,
    forgotPasswordSuccess
  } = useAuth()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  const email = watch('email')

  const onSubmit = (data: ForgotPasswordInput) => {
    forgotPassword(data.email)
  }

  const handleResend = () => {
    if (email) {
      forgotPassword(email)
    }
  }

  return (
    <AuthLayout
      variant="forgot"
      badge="Segurança da conta"
      title={<>Sem<br/>problema,<br/><span className="text-[#00F048]">acontece</span>.</>}
      description="Enviaremos um link seguro para você redefinir sua senha e voltar a treinar com IA em segundos."
      infoCards={[
        {
          icon: (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1L8 8M5 5L8 2L11 5" stroke="#00F048" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              <rect x="2" y="8" width="12" height="7" rx="2" stroke="#00F048" strokeWidth="1.5"/>
            </svg>
          ),
          title: 'Link enviado por e-mail',
          subtitle: 'Válido por 30 minutos',
        },
        {
          icon: (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1C5.2 1 3 3.2 3 6V9H2V15H14V9H13V6C13 3.2 10.8 1 8 1ZM5 6C5 4.3 6.3 3 8 3C9.7 3 11 4.3 11 6V9H5V6Z" stroke="#00F048" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
          ),
          title: 'Conexão segura (HTTPS)',
          subtitle: 'Seus dados estão protegidos',
        },
      ]}
    >
      {/* Back link */}
      <Link
        href="/login"
        className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-[#6B7088] hover:text-[#14162E] transition-colors mb-7"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M12 7H2M6 3L2 7L6 11" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Voltar para o login
      </Link>

      {!forgotPasswordSuccess ? (
        <>
          <div className="form-header mb-8">
            <h1 className="font-display font-bold text-[26px] tracking-tight text-[#14162E] mb-1.5">
              Esqueceu a senha?
            </h1>
            <p className="text-sm font-light leading-relaxed text-[#6B7088]">
              Digite seu e-mail e enviaremos um link para redefinir sua senha.
            </p>
          </div>

          {/* Error message */}
          {forgotPasswordError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
              Ocorreu um erro. Verifique o e-mail e tente novamente.
            </div>
          )}

          {/* Info box */}
          <div className="flex gap-3 items-start bg-[rgba(0,240,72,0.10)] border border-[rgba(0,240,72,0.25)] rounded-xl p-4 mb-5">
            <div className="w-5 h-5 rounded-full bg-[rgba(0,240,72,0.2)] flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <circle cx="5" cy="5" r="4.5" stroke="#00F048" strokeWidth="1"/>
                <path d="M5 4.5V7" stroke="#00F048" strokeWidth="1.2" strokeLinecap="round"/>
                <circle cx="5" cy="3" r="0.6" fill="#00F048"/>
              </svg>
            </div>
            <p className="text-[12.5px] font-normal leading-relaxed text-[#14162E]">
              Informe o <strong className="font-bold">mesmo e-mail</strong> que você usou para criar sua conta no Runmind.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-xs font-bold tracking-[0.04em] text-[#14162E] mb-1.5">
                E-mail da conta
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

            <button
              type="submit"
              disabled={isSendingForgotPassword}
              className="w-full py-3.5 bg-[#14162E] text-white rounded-xl text-[15px] font-bold font-display tracking-tight shadow-[0_4px_16px_rgba(20,22,46,0.18)] transition-all hover:bg-[#1C2040] hover:-translate-y-px hover:shadow-[0_6px_22px_rgba(20,22,46,0.22)] active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSendingForgotPassword ? 'Enviando...' : 'Enviar link de redefinição'}
            </button>
          </form>

          <p className="text-center mt-5 text-xs text-[#A8ADBE]">
            Lembrou a senha?{' '}
            <Link href="/login" className="text-[#14162E] font-semibold border-b-[1.5px] border-[#00F048]">
              Voltar ao login
            </Link>
          </p>
        </>
      ) : (
        <div className="text-center py-5 animate-fadeIn">
          {/* Success icon */}
          <div className="w-16 h-16 rounded-full bg-[rgba(0,240,72,0.1)] border-[1.5px] border-[rgba(0,240,72,0.3)] flex items-center justify-center mx-auto mb-5">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <circle cx="14" cy="14" r="12" stroke="#00F048" strokeWidth="1.8"/>
              <path d="M8 14L12 18L20 10" stroke="#00F048" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <h2 className="font-display font-bold text-xl text-[#14162E] mb-2 tracking-tight">
            E-mail enviado!
          </h2>
          <p className="text-[13.5px] leading-relaxed text-[#6B7088] mb-7">
            Enviamos um link para <strong className="text-[#14162E] font-semibold">{email || 'seu@email.com'}</strong>.
            Verifique sua caixa de entrada — e também o spam, caso não encontre.
          </p>

          {/* Info box */}
          <div className="flex gap-3 items-start bg-[rgba(0,240,72,0.10)] border border-[rgba(0,240,72,0.25)] rounded-xl p-4 mb-6 text-left">
            <div className="w-5 h-5 rounded-full bg-[rgba(0,240,72,0.2)] flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <circle cx="5" cy="5" r="4.5" stroke="#00F048" strokeWidth="1"/>
                <path d="M5 4.5V7" stroke="#00F048" strokeWidth="1.2" strokeLinecap="round"/>
                <circle cx="5" cy="3" r="0.6" fill="#00F048"/>
              </svg>
            </div>
            <p className="text-[12.5px] font-normal leading-relaxed text-[#14162E]">
              O link expira em <strong className="font-bold">30 minutos</strong>. Se não receber, verifique a pasta de spam ou solicite um novo link.
            </p>
          </div>

          <button
            onClick={handleResend}
            disabled={isSendingForgotPassword}
            className="w-full py-3.5 bg-[#14162E] text-white rounded-xl text-[15px] font-bold font-display tracking-tight shadow-[0_4px_16px_rgba(20,22,46,0.18)] transition-all hover:bg-[#1C2040] hover:-translate-y-px hover:shadow-[0_6px_22px_rgba(20,22,46,0.22)] active:translate-y-0 mb-3 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSendingForgotPassword ? 'Reenviando...' : 'Reenviar e-mail'}
          </button>

          <Link
            href="/login"
            className="block w-full py-3.5 bg-transparent text-[#14162E] border-[1.5px] border-[rgba(20,22,46,0.09)] rounded-xl text-[15px] font-bold font-display tracking-tight transition-all hover:border-[#14162E] hover:bg-[#F5F6F7] text-center"
          >
            Voltar ao login
          </Link>
        </div>
      )}

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
    </AuthLayout>
  )
}
