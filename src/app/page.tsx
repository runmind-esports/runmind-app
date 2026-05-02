'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

// Runmind Logo
function RunmindLogo({ size = 40 }: { size?: number }) {
  return <img src="/brand/runmind-logo.svg" alt="Runmind" width={size} height={size} />
}

// Check icon for pricing
function CheckIcon({ color = '#14162E' }: { color?: string }) {
  return (
    <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
      <path d="M1.5 4.5 L3.5 6.5 L7.5 2.5" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

// X icon for pricing
function XIcon() {
  return (
    <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
      <path d="M2 7 L7 2 M2 2 L7 7" stroke="#A8ADBE" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  )
}

// Arrow icon
function ArrowIcon({ color = 'white' }: { color?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3 8 H13 M9 4 L13 8 L9 12" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

// Play icon
function PlayIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.5" stroke="#14162E" strokeWidth="1.5"/>
      <path d="M6.5 5.5 L10.5 8 L6.5 10.5 Z" fill="#14162E"/>
    </svg>
  )
}

// Star icon
function StarIcon() {
  return <span className="text-[#00F048] text-sm">★</span>
}

// Feature Card Component
function FeatureCard({
  icon,
  title,
  description,
  tag,
  variant = 'default'
}: {
  icon: React.ReactNode
  title: string
  description: string
  tag?: string
  variant?: 'default' | 'cta'
}) {
  if (variant === 'cta') {
    return (
      <div className="group relative overflow-hidden bg-[#14162E] p-6 sm:p-8 lg:p-10">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.07] border border-white/10">
          {icon}
        </div>
        <h3 className="mb-2 font-display text-lg font-bold text-white">{title}</h3>
        <p className="text-sm leading-relaxed text-white/45 mb-5">{description}</p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 rounded-full bg-[#14162E] border border-white/20 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-white/10"
        >
          Comece seu treino de elite agora
          <ArrowIcon />
        </Link>
      </div>
    )
  }

  return (
    <div className="group relative overflow-hidden bg-white p-6 sm:p-8 lg:p-10 transition-all hover:-translate-y-1">
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#00F048] transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100" />
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#F5F6F7] border border-[rgba(20,22,46,0.08)] transition-all group-hover:bg-[rgba(0,240,72,0.1)] group-hover:border-[rgba(0,240,72,0.3)]">
        {icon}
      </div>
      <h3 className="mb-2 font-display text-[17px] font-bold text-[#14162E]">{title}</h3>
      <p className="text-[13.5px] leading-relaxed text-[#6B7088]">{description}</p>
      {tag && (
        <span className="mt-4 inline-block px-3 py-1 rounded-full bg-[#F5F6F7] border border-[rgba(20,22,46,0.08)] text-[10px] font-bold tracking-[0.14em] uppercase text-[#A8ADBE]">
          {tag}
        </span>
      )}
    </div>
  )
}

// Integration Card
function IntegrationCard({
  name,
  description,
  tags,
  bgColor,
  icon
}: {
  name: string
  description: string
  tags: string[]
  bgColor: string
  icon: React.ReactNode
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 items-start bg-white rounded-2xl p-5 sm:p-7 lg:p-9 border-[1.5px] border-[rgba(20,22,46,0.08)] transition-all hover:border-[rgba(0,240,72,0.4)] hover:shadow-[0_8px_32px_rgba(0,240,72,0.08)]">
      <div className={`w-12 h-12 sm:w-[52px] sm:h-[52px] rounded-xl flex items-center justify-center flex-shrink-0`} style={{ background: bgColor }}>
        {icon}
      </div>
      <div>
        <h3 className="font-display font-bold text-base sm:text-[17px] text-[#14162E] mb-2">{name}</h3>
        <p className="text-[13px] sm:text-[13.5px] font-light leading-relaxed text-[#6B7088]">{description}</p>
        <div className="flex flex-wrap gap-1.5 mt-3.5">
          {tags.map((tag) => (
            <span key={tag} className="px-2 sm:px-2.5 py-1 rounded-full bg-[#F5F6F7] border border-[rgba(20,22,46,0.08)] text-[9px] sm:text-[10px] font-semibold tracking-[0.1em] uppercase text-[#6B7088]">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

// Pricing Card
function PricingCard({
  badge,
  name,
  price,
  subtitle,
  features,
  buttonText,
  featured = false
}: {
  badge: string
  name: string
  price: string
  subtitle: string
  features: { text: string; included: boolean }[]
  buttonText: string
  featured?: boolean
}) {
  return (
    <div className={`rounded-[20px] p-6 sm:p-7 lg:p-9 border-[1.5px] relative overflow-hidden transition-all hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(20,22,46,0.1)] ${
      featured
        ? 'bg-[#14162E] border-[#14162E] lg:scale-[1.03] hover:lg:scale-[1.03] hover:-translate-y-1 order-first md:order-none'
        : 'bg-white border-[rgba(20,22,46,0.08)]'
    }`}>
      <span className={`inline-block mb-5 px-3 py-1 rounded-full text-[10px] font-bold tracking-[0.14em] uppercase ${
        featured
          ? 'bg-[rgba(0,240,72,0.15)] text-[#00F048] border border-[rgba(0,240,72,0.3)]'
          : 'bg-[rgba(0,240,72,0.1)] text-[#14162E] border border-[rgba(0,240,72,0.3)]'
      }`}>
        {badge}
      </span>
      <h3 className={`font-display font-bold text-xl mb-1 ${featured ? 'text-white' : 'text-[#14162E]'}`}>{name}</h3>
      <div className={`font-display font-extrabold text-[40px] tracking-tight leading-none mt-5 mb-1 ${featured ? 'text-white' : 'text-[#14162E]'}`}>
        {price}
        <span className={`text-sm font-normal ml-0.5 ${featured ? 'text-white/40' : 'text-[#6B7088]'}`}>/mês</span>
      </div>
      <p className={`text-xs mb-7 ${featured ? 'text-white/35' : 'text-[#A8ADBE]'}`}>{subtitle}</p>
      <div className={`h-px mb-6 ${featured ? 'bg-white/[0.08]' : 'bg-[rgba(20,22,46,0.08)]'}`} />
      <ul className="flex flex-col gap-3 mb-8">
        {features.map((feature, i) => (
          <li key={i} className={`flex items-start gap-2.5 text-[13px] leading-relaxed ${
            feature.included
              ? (featured ? 'text-white/75' : 'text-[#14162E]')
              : 'text-[#A8ADBE]'
          }`}>
            <div className={`w-[18px] h-[18px] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
              feature.included
                ? (featured ? 'bg-[rgba(0,240,72,0.15)] border border-[rgba(0,240,72,0.3)]' : 'bg-[rgba(0,240,72,0.1)] border border-[rgba(0,240,72,0.3)]')
                : 'bg-[rgba(0,0,0,0.04)] border border-[rgba(20,22,46,0.08)]'
            }`}>
              {feature.included ? <CheckIcon color={featured ? '#00F048' : '#14162E'} /> : <XIcon />}
            </div>
            {feature.text}
          </li>
        ))}
      </ul>
      <Link
        href="/login"
        className={`block w-full text-center py-3.5 rounded-full text-sm font-bold transition-all ${
          featured
            ? 'bg-white text-[#14162E] hover:shadow-[0_4px_20px_rgba(255,255,255,0.2)]'
            : 'border-[1.5px] border-[rgba(20,22,46,0.08)] text-[#14162E] hover:border-[#14162E] hover:bg-[#F5F6F7]'
        }`}
      >
        {buttonText}
      </Link>
    </div>
  )
}

// Testimonial Card
function TestimonialCard({
  text,
  name,
  role,
  initial,
  gradientFrom,
  gradientTo
}: {
  text: React.ReactNode
  name: string
  role: string
  initial: string
  gradientFrom: string
  gradientTo: string
}) {
  return (
    <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl p-5 sm:p-6 lg:p-8 transition-all hover:border-[rgba(0,240,72,0.25)]">
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <StarIcon key={i} />
        ))}
      </div>
      <p className="text-[13px] sm:text-sm font-light leading-[1.75] text-white/65 mb-5 sm:mb-6">{text}</p>
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center font-display font-bold text-[13px] text-[#14162E] flex-shrink-0"
          style={{ background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})` }}
        >
          {initial}
        </div>
        <div>
          <div className="font-display font-semibold text-sm text-white">{name}</div>
          <div className="text-[11px] text-white/30">{role}</div>
        </div>
      </div>
    </div>
  )
}

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const tickerItems = [
    'Chat com IA', 'Integração Strava', 'Integração Garmin', 'Planos de Treino',
    'Dashboard Pessoal', 'Eventos de Corrida', 'Análise de Performance', 'Recomendações Inteligentes'
  ]

  return (
    <div className="min-h-screen bg-white text-[#14162E]">
      {/* Navigation */}
      <nav className={`fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-4 sm:px-6 lg:px-12 bg-white/95 backdrop-blur-xl border-b border-[rgba(20,22,46,0.08)] transition-shadow ${isScrolled ? 'shadow-[0_4px_24px_rgba(20,22,46,0.07)]' : ''}`} style={{ height: 'calc(68px + env(safe-area-inset-top, 0px))', paddingTop: 'env(safe-area-inset-top, 0px)' }}>
        <Link href="/" className="flex items-center gap-2 sm:gap-3">
          <RunmindLogo size={28} />
          <span className="font-display text-base sm:text-lg font-bold tracking-tight">runmind</span>
        </Link>

        <ul className="hidden lg:flex items-center gap-9">
          <li><a href="#features" className="text-[13.5px] font-medium text-[#6B7088] hover:text-[#14162E] transition-colors">Funcionalidades</a></li>
          <li><a href="#how" className="text-[13.5px] font-medium text-[#6B7088] hover:text-[#14162E] transition-colors">Como funciona</a></li>
          <li><a href="#integrations" className="text-[13.5px] font-medium text-[#6B7088] hover:text-[#14162E] transition-colors">Integrações</a></li>
          <li><a href="#plans" className="text-[13.5px] font-medium text-[#6B7088] hover:text-[#14162E] transition-colors">Planos</a></li>
        </ul>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/login" className="hidden sm:block text-[13.5px] font-semibold text-[#14162E] px-4 py-2">
            Entrar
          </Link>
          <Link
            href="/login"
            className="rounded-full bg-[#14162E] px-4 sm:px-6 py-2 sm:py-2.5 text-[12px] sm:text-[13.5px] font-semibold text-white transition-all hover:bg-[#1C2040] hover:-translate-y-0.5"
          >
            Começar grátis
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-dvh pt-[68px] overflow-hidden bg-white">
        {/* Background Effects */}
        <div className="absolute -top-[120px] -right-20 w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle,rgba(0,240,72,0.07)_0%,transparent_70%)] pointer-events-none" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(rgba(20,22,46,0.07) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
            maskImage: 'radial-gradient(ellipse 80% 80% at 75% 40%, black 0%, transparent 70%)',
          }}
        />

        <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-12 min-h-[calc(100vh-68px)] flex items-center">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center w-full py-12 lg:py-20">
            {/* Left Content */}
            <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 pl-2 bg-[rgba(0,240,72,0.1)] border border-[rgba(0,240,72,0.3)] rounded-full mb-5 sm:mb-7">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00F048] opacity-75"></span>
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#00F048]"></span>
                </span>
                <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.15em] sm:tracking-[0.18em] uppercase text-[#14162E]">
                  Coach de IA para corredores
                </span>
              </div>

              {/* Title */}
              <h1 className="font-display font-extrabold text-[32px] sm:text-[42px] lg:text-[clamp(42px,5vw,64px)] leading-[1.1] sm:leading-[1.05] tracking-tight mb-5 sm:mb-6">
                Treinamento de elite acessível: Seu Coach de <span className="text-[#00F048]">IA</span> 24/7 na palma da mão.
              </h1>

              {/* Subtitle */}
              <p className="text-[15px] sm:text-[17px] font-light leading-[1.7] sm:leading-[1.75] text-[#6B7088] max-w-[460px] mb-7 sm:mb-10">
                O fim das planilhas genéricas e caras. Conecte seu Strava e deixe nossa IA criar seu plano perfeito com suporte em tempo real.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-3.5 items-stretch sm:items-center">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#14162E] px-6 sm:px-8 py-3.5 sm:py-4 text-[14px] sm:text-[15px] font-semibold text-white transition-all shadow-[0_4px_20px_rgba(20,22,46,0.2)] hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(20,22,46,0.25)]"
                >
                  Começar grátis
                  <ArrowIcon />
                </Link>
                <a
                  href="#how"
                  className="inline-flex items-center justify-center gap-2 rounded-full border-[1.5px] border-[rgba(20,22,46,0.08)] px-5 sm:px-6 py-3.5 sm:py-4 text-[14px] sm:text-[15px] font-semibold text-[#14162E] transition-all hover:border-[#14162E] hover:bg-[#F5F6F7]"
                >
                  <PlayIcon />
                  Ver como funciona
                </a>
              </div>

              {/* Trust */}
              <div className="flex items-center gap-3 mt-6 sm:mt-8">
                <div className="flex">
                  {[
                    'linear-gradient(135deg, #00F048, #00B836)',
                    'linear-gradient(135deg, #14162E, #252952)',
                    'linear-gradient(135deg, #FC4C02, #E03000)',
                    'linear-gradient(135deg, #0E6DB4, #054d80)',
                  ].map((gradient, i) => (
                    <div
                      key={i}
                      className="w-6 sm:w-7 h-6 sm:h-7 rounded-full border-2 border-white -ml-2 first:ml-0"
                      style={{ background: gradient }}
                    />
                  ))}
                </div>
                <p className="text-[11px] sm:text-xs font-medium text-[#6B7088] leading-relaxed">
                  <strong className="text-[#14162E]">+1.200 corredores</strong>
                  <br />
                  já usam o Runmind
                </p>
              </div>
            </div>

            {/* Right Content - Phone Mockup */}
            <div className={`flex justify-center items-center relative transition-all duration-700 delay-150 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              {/* Glow */}
              <div className="absolute w-72 sm:w-80 h-[360px] sm:h-[400px] bg-[radial-gradient(ellipse,rgba(0,240,72,0.12)_0%,transparent_70%)] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

              {/* Float Card Left */}
              <div className="hidden sm:block absolute -left-4 lg:-left-16 top-[30%] bg-white rounded-[14px] p-3 lg:p-4 shadow-[0_8px_32px_rgba(20,22,46,0.12)] border border-[rgba(20,22,46,0.08)] animate-float z-10">
                <div className="text-[8px] lg:text-[9px] font-bold tracking-[0.16em] uppercase text-[#A8ADBE] mb-1">Pace médio</div>
                <div className="font-display font-bold text-lg lg:text-xl text-[#14162E] tracking-tight">
                  4:28<span className="text-[10px] lg:text-[11px] font-normal text-[#6B7088]">/km</span>
                </div>
                <div className="text-[9px] lg:text-[10px] font-medium text-[#00B836] mt-0.5">↑ 12s mais rápido</div>
              </div>

              {/* Float Card Right */}
              <div className="hidden sm:block absolute -right-4 lg:-right-12 bottom-[25%] bg-white rounded-[14px] p-3 lg:p-4 shadow-[0_8px_32px_rgba(20,22,46,0.12)] border border-[rgba(20,22,46,0.08)] animate-float animation-delay-2000 z-10">
                <div className="text-[8px] lg:text-[9px] font-bold tracking-[0.16em] uppercase text-[#A8ADBE] mb-1">Prontidão</div>
                <div className="font-display font-bold text-lg lg:text-xl text-[#14162E] tracking-tight">
                  94<span className="text-[10px] lg:text-[11px] font-normal text-[#6B7088]">%</span>
                </div>
                <div className="text-[9px] lg:text-[10px] font-medium text-[#00B836] mt-0.5">Ótimo para treinar</div>
              </div>

              {/* Phone */}
              <div className="w-[260px] sm:w-[280px] bg-[#14162E] rounded-[38px] sm:rounded-[42px] border-2 border-white/10 overflow-hidden shadow-[0_0_0_8px_rgba(20,22,46,0.04),0_24px_48px_rgba(20,22,46,0.15)] sm:shadow-[0_0_0_10px_rgba(20,22,46,0.04),0_40px_80px_rgba(20,22,46,0.18),0_8px_24px_rgba(20,22,46,0.1)] relative z-0">
                {/* Notch */}
                <div className="bg-[#0A0C1A] h-7 flex items-center justify-center">
                  <div className="w-16 h-1.5 bg-white/10 rounded-full" />
                </div>

                {/* Screen */}
                <div className="bg-[#14162E] min-h-[520px] sm:min-h-[560px]" style={{ background: 'radial-gradient(ellipse 100% 50% at 50% 0%, rgba(0,240,72,0.09) 0%, transparent 55%), #14162E' }}>
                  {/* Phone Header */}
                  <div className="flex items-center justify-between px-4 py-5 border-b border-white/[0.05]">
                    <div className="flex items-center gap-2 font-display font-bold text-sm text-white">
                      <RunmindLogo size={18} />
                      runmind
                    </div>
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#00F048] to-[#00B836]" />
                  </div>

                  {/* Chat */}
                  <div className="p-4 flex flex-col gap-2.5">
                    {/* User message */}
                    <div className="self-end max-w-[85%] px-3.5 py-2.5 bg-[#00F048] text-[#14162E] text-[11px] font-medium leading-relaxed rounded-2xl rounded-br-sm">
                      Que treino devo fazer hoje?
                    </div>

                    {/* AI message */}
                    <div className="self-start max-w-[85%] px-3.5 py-2.5 bg-white/[0.07] border border-white/[0.08] text-white/85 text-[11px] leading-relaxed rounded-2xl rounded-bl-sm">
                      Com base nos seus últimos 7 dias, você correu <strong className="text-white">38km</strong> e está bem recuperado (HRV normal). 💪
                      <br /><br />
                      Recomendo um <strong className="text-white">tempo run de 8km</strong> em pace controlado:

                      <div className="grid grid-cols-2 gap-1.5 mt-2">
                        <div className="bg-white/[0.06] border border-white/[0.08] rounded-lg p-2">
                          <div className="text-[8px] font-bold tracking-[0.16em] uppercase text-white/35 mb-1">Pace alvo</div>
                          <div className="font-display font-bold text-base text-white tracking-tight">5:10<span className="text-[10px] font-light text-white/30">/km</span></div>
                        </div>
                        <div className="bg-white/[0.06] border border-white/[0.08] rounded-lg p-2">
                          <div className="text-[8px] font-bold tracking-[0.16em] uppercase text-white/35 mb-1">Duração</div>
                          <div className="font-display font-bold text-base text-[#00F048] tracking-tight">~42<span className="text-[10px] font-light text-white/30">min</span></div>
                        </div>
                      </div>
                    </div>

                    {/* User message */}
                    <div className="self-end max-w-[85%] px-3.5 py-2.5 bg-[#00F048] text-[#14162E] text-[11px] font-medium leading-relaxed rounded-2xl rounded-br-sm">
                      Cria um plano para a meia maratona
                    </div>

                    {/* AI message */}
                    <div className="self-start max-w-[85%] px-3.5 py-2.5 bg-white/[0.07] border border-white/[0.08] text-white/85 text-[11px] leading-relaxed rounded-2xl rounded-bl-sm">
                      Perfeito! Plano de <strong className="text-white">12 semanas</strong> gerado com base no seu histórico. Começamos segunda-feira! 🏃
                    </div>
                  </div>

                  {/* Input */}
                  <div className="mx-4 mb-4 mt-3 bg-white/[0.06] border border-white/10 rounded-full px-4 py-2.5 flex items-center justify-between">
                    <span className="text-[10px] text-white/30">Pergunte ao seu coach...</span>
                    <div className="w-6 h-6 rounded-full bg-[#00F048] flex items-center justify-center">
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5 H8 M5.5 2.5 L8 5 L5.5 7.5" stroke="#14162E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ticker */}
      <div className="bg-[#14162E] py-3.5 overflow-hidden border-y border-white/[0.04]">
        <div className="flex animate-ticker whitespace-nowrap">
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <span key={i} className="px-9 text-[11px] font-bold tracking-[0.28em] uppercase text-white/35">
              {item}
              <span className="text-[#00F048]/60 px-1">·</span>
            </span>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-20 lg:py-24 bg-[#F5F6F7]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="mb-10 sm:mb-14">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <div className="w-5 h-0.5 bg-[#00F048] rounded-full" />
              <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] uppercase text-[#14162E]">Funcionalidades</span>
            </div>
            <h2 className="font-display font-bold text-[28px] sm:text-[36px] lg:text-[clamp(32px,4vw,48px)] tracking-tight text-[#14162E] leading-[1.15] sm:leading-[1.1] mb-3">
              Tudo que um corredor sério precisa
            </h2>
            <p className="text-[14px] sm:text-base font-light leading-[1.7] sm:leading-[1.75] text-[#6B7088] max-w-[500px]">
              Cinco funcionalidades integradas para levar sua corrida ao próximo nível — com IA no centro de tudo.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-[2px]">
            <div className="rounded-tl-2xl sm:rounded-tl-2xl overflow-hidden">
              <FeatureCard
                icon={<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M3 3 H14 C15.1 3 16 3.9 16 5 V12 C16 13.1 15.1 14 14 14 H7 L3 18 V5 C3 3.9 3.9 3 5 3Z" stroke="#14162E" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/><path d="M7 8.5 H13 M7 11 H10.5" stroke="#14162E" strokeWidth="1.5" strokeLinecap="round"/></svg>}
                title="Suporte 24/7 Personalizado"
                description="O cérebro que monitora seu desenvolvimento e tira dúvidas a qualquer hora. A IA usa seu histórico real para responder sobre treinos, pace, recuperação ou estratégia de prova."
                tag="⭐ Core feature"
              />
            </div>
            <FeatureCard
              icon={<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect x="3" y="3" width="16" height="16" rx="3" stroke="#14162E" strokeWidth="1.7"/><path d="M3 8 H19 M8 8 V19" stroke="#14162E" strokeWidth="1.5" strokeLinecap="round"/></svg>}
              title="Planilhas Dinâmicas"
              description="Opções recomendadas (5k, 10k, 21k, 42k) que se ajustam ao seu perfil. Criadas sob medida, adaptadas ao seu nível e ajustadas automaticamente se você falhar um treino."
              tag="Personalizado"
            />
            <div className="rounded-tr-2xl overflow-hidden">
              <FeatureCard
                icon={<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect x="3" y="12" width="4" height="7" rx="1" stroke="#14162E" strokeWidth="1.7"/><rect x="9" y="8" width="4" height="11" rx="1" stroke="#14162E" strokeWidth="1.7"/><rect x="15" y="4" width="4" height="15" rx="1" stroke="#14162E" strokeWidth="1.7"/></svg>}
                title="Dashboard de Evolução"
                description="Visualize KMs semanais, pace médio, recordes pessoais e conquistas. Gamificação com badges e streaks para manter sua consistência alta."
                tag="Motivação"
              />
            </div>
            <div className="rounded-bl-2xl overflow-hidden">
              <FeatureCard
                icon={<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect x="3" y="5" width="16" height="14" rx="2.5" stroke="#14162E" strokeWidth="1.7"/><path d="M7 3 V7 M15 3 V7 M3 10 H19" stroke="#14162E" strokeWidth="1.5" strokeLinecap="round"/></svg>}
                title="Eventos de Corrida"
                description="Descubra corridas próximas com base na sua localização e distância favorita. A IA sugere provas compatíveis com seu nível atual de treinamento."
                tag="Motivação"
              />
            </div>
            <FeatureCard
              icon={<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="5.5" cy="11" r="2.5" stroke="#14162E" strokeWidth="1.7"/><circle cx="16.5" cy="6" r="2.5" stroke="#14162E" strokeWidth="1.7"/><circle cx="16.5" cy="16" r="2.5" stroke="#14162E" strokeWidth="1.7"/><path d="M8 11 C10 11 12 6 14 6 M8 11 C10 11 12 16 14 16" stroke="#14162E" strokeWidth="1.5" strokeLinecap="round"/></svg>}
              title="Sincronização Inteligente"
              description="Seus dados do Strava alimentam sua evolução sem esforço manual. Importe todo o seu histórico automaticamente — seus treinos chegam direto para a IA analisar."
              tag="Automático"
            />
            <div className="rounded-br-2xl overflow-hidden">
              <FeatureCard
                icon={<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M11 3 L14 9 L21 10 L16 15 L17.5 22 L11 18.5 L4.5 22 L6 15 L1 10 L8 9 Z" stroke="#00F048" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                title="Pronto para correr?"
                description="Comece grátis agora e tenha seu primeiro plano de treino personalizado em menos de 2 minutos."
                variant="cta"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="mb-10 sm:mb-14">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <div className="w-5 h-0.5 bg-[#00F048] rounded-full" />
              <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] uppercase text-[#14162E]">Como funciona</span>
            </div>
            <h2 className="font-display font-bold text-[28px] sm:text-[36px] lg:text-[clamp(32px,4vw,48px)] tracking-tight text-[#14162E] leading-[1.15] sm:leading-[1.1] mb-3">
              De zero ao seu primeiro treino em 3 passos
            </h2>
            <p className="text-[14px] sm:text-base font-light leading-[1.7] sm:leading-[1.75] text-[#6B7088] max-w-[500px]">
              Simples, rápido e totalmente personalizado para o seu nível atual.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center">
            {/* Steps */}
            <div className="flex flex-col">
              {[
                {
                  num: 1,
                  title: 'Conecte sua plataforma',
                  desc: 'Faça login com Strava ou Garmin. O Runmind importa automaticamente todo o seu histórico de corridas — pace, distância, frequência cardíaca e muito mais.',
                  active: true
                },
                {
                  num: 2,
                  title: 'Converse com a IA',
                  desc: 'Diga seu objetivo: "quero correr uma meia maratona em maio" ou "preciso melhorar meu pace". A IA usa seus dados reais para criar uma estratégia personalizada.',
                  active: false
                },
                {
                  num: 3,
                  title: 'Receba seu plano e treine',
                  desc: 'Plano semanal com treinos detalhados. A cada corrida completa, a IA ajusta o plano com base na sua evolução real. Seu coach evolui junto com você.',
                  active: false
                }
              ].map((step) => (
                <div key={step.num} className="flex gap-5 py-7 border-b border-[rgba(20,22,46,0.08)] last:border-b-0 cursor-pointer hover:opacity-85 transition-opacity">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 font-display font-bold text-[13px] transition-all ${
                    step.active
                      ? 'bg-[#00F048] text-[#14162E] shadow-[0_0_0_4px_rgba(0,240,72,0.15)]'
                      : 'bg-[rgba(20,22,46,0.06)] border-[1.5px] border-[rgba(20,22,46,0.08)] text-[#A8ADBE]'
                  }`}>
                    {step.num}
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-base text-[#14162E] mb-1.5">{step.title}</h3>
                    <p className="text-[13.5px] font-normal leading-relaxed text-[#6B7088]">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Dashboard Visual */}
            <div className="bg-[#14162E] rounded-[16px] sm:rounded-[20px] overflow-hidden shadow-[0_16px_40px_rgba(20,22,46,0.12)] sm:shadow-[0_32px_72px_rgba(20,22,46,0.16)] border border-white/[0.06]">
              {/* Header */}
              <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-white/[0.06] flex items-center justify-between">
                <span className="font-display font-bold text-[14px] sm:text-[15px] text-white">Semana atual</span>
                <span className="text-[10px] sm:text-[11px] font-semibold tracking-[0.1em] uppercase text-white/30">Semana 6 / 12</span>
              </div>

              {/* KPIs */}
              <div className="grid grid-cols-3 gap-px bg-white/[0.04] border-b border-white/[0.04]">
                {[
                  { label: 'Distância', value: '42', unit: 'km', change: '↑ +8km' },
                  { label: 'Pace médio', value: '4:58', unit: '/km', change: '↑ 14s' },
                  { label: 'Treinos', value: '4', unit: '/5', change: '1 restante', muted: true }
                ].map((kpi) => (
                  <div key={kpi.label} className="bg-[#14162E] p-3 sm:p-5">
                    <div className="text-[8px] sm:text-[9px] font-bold tracking-[0.2em] uppercase text-white/30 mb-1 sm:mb-1.5">{kpi.label}</div>
                    <div className="font-display font-bold text-[20px] sm:text-[26px] text-white tracking-tight leading-none mb-0.5 sm:mb-1">
                      {kpi.value}
                      <span className="text-[10px] sm:text-[13px] font-light text-white/35 ml-0.5">{kpi.unit}</span>
                    </div>
                    <div className={`text-[9px] sm:text-[10px] font-semibold ${kpi.muted ? 'text-white/30' : 'text-[#00F048]'}`}>{kpi.change}</div>
                  </div>
                ))}
              </div>

              {/* Chart */}
              <div className="p-4 sm:p-6">
                <div className="text-[8px] sm:text-[9px] font-bold tracking-[0.18em] uppercase text-white/25 mb-3 sm:mb-3.5">Volume semanal (km)</div>
                <div className="flex gap-1 sm:gap-1.5 items-end h-[60px] sm:h-[72px]">
                  {[
                    { h: 30, label: 'S1' },
                    { h: 45, label: 'S2' },
                    { h: 55, label: 'S3', active: true },
                    { h: 60, label: 'S4', active: true },
                    { h: 72, label: 'S5', active: true },
                    { h: 85, label: 'S6', today: true },
                    { h: 15, label: 'S7', dim: true }
                  ].map((bar) => (
                    <div key={bar.label} className="flex-1 flex flex-col items-center gap-1 sm:gap-1.5">
                      <div
                        className={`w-full rounded-t-sm transition-colors ${
                          bar.today ? 'bg-[rgba(0,240,72,0.4)]' : bar.active ? 'bg-[#00F048]' : 'bg-white/[0.08]'
                        } ${bar.dim ? 'opacity-30' : ''}`}
                        style={{ height: `${bar.h}%` }}
                      />
                      <span className={`text-[7px] sm:text-[8px] font-semibold tracking-[0.05em] ${bar.today ? 'text-[rgba(0,240,72,0.6)]' : 'text-white/20'}`}>{bar.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Insight */}
              <div className="mx-3 sm:mx-4 mb-3 sm:mb-4 bg-[rgba(0,240,72,0.08)] border border-[rgba(0,240,72,0.18)] rounded-lg sm:rounded-xl p-3 sm:p-4 flex gap-2.5 sm:gap-3 items-start">
                <div className="w-6 sm:w-7 h-6 sm:h-7 rounded-lg bg-[rgba(0,240,72,0.15)] flex items-center justify-center flex-shrink-0">
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none" className="sm:w-[14px] sm:h-[14px]">
                    <circle cx="7" cy="5" r="2.5" stroke="#00F048" strokeWidth="1.5"/>
                    <path d="M2.5 13 C2.5 10 4.5 8.5 7 8.5 C9.5 8.5 11.5 10 11.5 13" stroke="#00F048" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <div>
                  <div className="text-[7px] sm:text-[8px] font-bold tracking-[0.2em] uppercase text-[#00F048] mb-0.5 sm:mb-1">Coach IA</div>
                  <p className="text-[9px] sm:text-[10.5px] font-normal leading-relaxed text-white/55">
                    Você está evoluindo muito bem! Semana que vem aumentamos o volume para 48km.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section id="integrations" className="py-16 sm:py-20 lg:py-24 bg-[#F5F6F7]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="mb-10 sm:mb-14">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <div className="w-5 h-0.5 bg-[#00F048] rounded-full" />
              <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] uppercase text-[#14162E]">Integrações</span>
            </div>
            <h2 className="font-display font-bold text-[28px] sm:text-[36px] lg:text-[clamp(32px,4vw,48px)] tracking-tight text-[#14162E] leading-[1.15] sm:leading-[1.1] mb-3">
              Conecta onde você já treina
            </h2>
            <p className="text-[14px] sm:text-base font-light leading-[1.7] sm:leading-[1.75] text-[#6B7088] max-w-[500px]">
              Sem migrar histórico, sem entrada manual. Seus dados chegam direto para a IA no momento em que você cria sua conta.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 sm:gap-3">
            <IntegrationCard
              name="Strava"
              description="Importe atividades, rotas, pace médio, frequência cardíaca e todo o histórico de corridas. A IA analisa seus treinos para criar planos compatíveis com sua evolução real."
              tags={['Atividades', 'Pace', 'Frequência cardíaca', 'Histórico']}
              bgColor="#FC4C02"
              icon={<svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M12 5 L17 15 L14 15 L19 25 M19 25 L24 15 L21 15 L16 5Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            />
            <IntegrationCard
              name="Garmin Connect"
              description="Dados avançados de biometria: HRV, carga de treino, qualidade do sono, VO2max estimado e muito mais. Métricas que deixam as recomendações da IA ainda mais precisas."
              tags={['HRV', 'VO2max', 'Carga de treino', 'Sono']}
              bgColor="#0E6DB4"
              icon={<svg width="28" height="28" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="9" stroke="white" strokeWidth="2"/><path d="M14 7 L14 14 L19 14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="plans" className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="text-center mb-10 sm:mb-14">
            <div className="flex items-center gap-2 justify-center mb-3 sm:mb-4">
              <div className="w-5 h-0.5 bg-[#00F048] rounded-full" />
              <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] uppercase text-[#14162E]">Planos</span>
            </div>
            <h2 className="font-display font-bold text-[28px] sm:text-[36px] lg:text-[clamp(32px,4vw,48px)] tracking-tight text-[#14162E] leading-[1.15] sm:leading-[1.1] mb-3">
              Simples, sem surpresas
            </h2>
            <p className="text-[14px] sm:text-base font-light leading-[1.7] sm:leading-[1.75] text-[#6B7088]">
              Comece grátis. Faça upgrade quando quiser mais.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-3">
            <PricingCard
              badge="Grátis"
              name="Iniciante"
              price="R$0"
              subtitle="Para começar a correr com IA"
              features={[
                { text: '100 RunPoints por dia', included: true },
                { text: '2 anexos por dia', included: true },
                { text: '5 conversas', included: true },
                { text: 'Integração Strava + Google Health', included: true },
                { text: 'Modelo inteligente', included: true },
              ]}
              buttonText="Começar grátis"
            />
            <PricingCard
              badge="Mais popular"
              name="Pro"
              price="R$29"
              subtitle="3x mais que o Gratuito"
              features={[
                { text: '300 RunPoints por dia', included: true },
                { text: '10 anexos por dia (5x mais)', included: true },
                { text: '15 conversas (3x mais)', included: true },
                { text: 'Integração Strava + Google Health', included: true },
                { text: 'Modelo inteligente', included: true },
              ]}
              buttonText="Assinar Pro"
              featured
            />
            <PricingCard
              badge="Performance"
              name="Premium"
              price="R$59"
              subtitle="10x mais que o Gratuito"
              features={[
                { text: '1.000 RunPoints por dia', included: true },
                { text: '100 anexos por dia (10x mais)', included: true },
                { text: '50 conversas (10x mais)', included: true },
                { text: 'Integração Strava + Google Health', included: true },
                { text: 'Modelo inteligente', included: true },
              ]}
              buttonText="Assinar Premium"
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 sm:py-20 lg:py-24 bg-[#14162E]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="mb-10 sm:mb-14">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <div className="w-5 h-0.5 bg-[#00F048] rounded-full" />
              <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] uppercase text-[#00F048]">Depoimentos</span>
            </div>
            <h2 className="font-display font-bold text-[28px] sm:text-[36px] lg:text-[clamp(32px,4vw,48px)] tracking-tight text-white leading-[1.15] sm:leading-[1.1]">
              O que os corredores estão dizendo
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-3">
            <TestimonialCard
              text={<>&ldquo;O Runmind mudou completamente como eu treino. Antes eu seguia planilhas genéricas da internet. Agora tenho um coach que <strong className="text-white font-semibold">sabe exatamente o que aconteceu no meu último treino</strong> e ajusta tudo em tempo real.&rdquo;</>}
              name="Marcos Oliveira"
              role="Corredor amador · 42km/semana"
              initial="M"
              gradientFrom="#00F048"
              gradientTo="#00B836"
            />
            <TestimonialCard
              text={<>&ldquo;Corri minha primeira meia maratona em 1h54 usando o plano do Runmind. A <strong className="text-white font-semibold">integração com o Garmin foi perfeita</strong> — a IA ajustava o plano toda semana com base no meu HRV e qualidade de sono.&rdquo;</>}
              name="Ana Ribeiro"
              role="1ª meia maratona · 1:54:38"
              initial="A"
              gradientFrom="#00F048"
              gradientTo="#00B836"
            />
            <TestimonialCard
              text={<>&ldquo;Melhorei meu pace de 10km de 5:40 para <strong className="text-white font-semibold">4:52 em 10 semanas</strong>. A diferença foi o chat com IA — consigo perguntar qualquer coisa sobre meu treino e recebo respostas com base nos meus dados reais.&rdquo;</>}
              name="Rafael Costa"
              role="PR de 10km: 48:34"
              initial="R"
              gradientFrom="#14162E"
              gradientTo="#252952"
            />
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-12 sm:py-16 lg:py-24 bg-[#F5F6F7]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="bg-[#14162E] rounded-2xl sm:rounded-3xl px-6 sm:px-10 lg:px-20 py-10 sm:py-14 lg:py-[72px] flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16 relative overflow-hidden text-center lg:text-left">
            {/* Glow */}
            <div className="absolute -right-20 -top-20 w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] rounded-full bg-[radial-gradient(circle,rgba(0,240,72,0.1)_0%,transparent_70%)]" />

            <div className="relative z-10">
              <div className="text-[11px] font-bold tracking-[0.22em] uppercase text-[#00F048] mb-3.5">Comece hoje</div>
              <h2 className="font-display font-bold text-[24px] sm:text-[28px] lg:text-[clamp(28px,3.5vw,40px)] text-white tracking-tight leading-[1.15] mb-3.5">
                Você está a 2 minutos
                <br />
                do seu próximo PR.
              </h2>
              <p className="text-[14px] sm:text-[15px] font-light leading-relaxed text-white/45 max-w-[400px] mx-auto lg:mx-0">
                Conecte seu Strava ou Garmin, conte seu objetivo para a IA e receba seu plano de treino personalizado agora mesmo.
              </p>
            </div>

            <div className="flex flex-col items-center gap-3 flex-shrink-0 relative z-10">
              <Link
                href="/login"
                className="px-8 sm:px-10 py-3.5 sm:py-4 bg-[#00F048] text-[#14162E] rounded-full text-[14px] sm:text-[15px] font-bold transition-all hover:shadow-[0_4px_24px_rgba(0,240,72,0.4)] hover:-translate-y-0.5 whitespace-nowrap"
              >
                Comece seu treino de elite agora →
              </Link>
              <span className="text-[10px] sm:text-[11.5px] text-white/30">Sem cartão de crédito. Cancele quando quiser.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#14162E] border-t border-white/[0.06] pt-12 sm:pt-16 pb-8 sm:pb-10 px-4 sm:px-6 lg:px-12">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 mb-10 sm:mb-14">
            {/* Brand */}
            <div className="col-span-2 sm:col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center gap-2.5 mb-4">
                <RunmindLogo size={28} />
                <span className="font-display font-bold text-[17px] text-white">runmind</span>
              </Link>
              <p className="text-[12px] sm:text-[13px] font-light leading-relaxed text-white/35 max-w-[260px] mb-6">
                Treinamento de elite acessível para o corredor brasileiro. Dados reais, planos personalizados, resultados de verdade.
              </p>
              <div className="flex gap-2.5">
                {/* Social buttons */}
                {['X', 'Instagram', 'Threads'].map((social) => (
                  <a key={social} href="#" className="w-[34px] h-[34px] rounded-lg border border-white/10 flex items-center justify-center text-white/40 hover:border-white/30 hover:text-white transition-colors">
                    {social === 'X' && (
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M12.5 1.5 L8.5 6 L13 12.5 H9.5 L7 8.5 L2.5 13.5 H1 L5.5 8.5 L1 1.5 H4.5 L7 5.5 L11 1.5 Z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    )}
                    {social === 'Instagram' && (
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="2" y="2" width="10" height="10" rx="3" stroke="currentColor" strokeWidth="1.3"/><circle cx="7" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.3"/><circle cx="10.5" cy="3.5" r="0.8" fill="currentColor"/></svg>
                    )}
                    {social === 'Threads' && (
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 11 C3 8.5 4.5 6 7 5 C8 4.5 9.5 4.5 10.5 5.5 C11.5 6.5 11.5 8 10.5 9 C9.5 10 8 10 7 9.5 C6 9 5.5 7.5 6 6.5 C7 4.5 9.5 3 12 2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
                    )}
                  </a>
                ))}
              </div>
            </div>

            {/* Produto */}
            <div>
              <h4 className="font-display font-semibold text-[13px] text-white mb-4">Produto</h4>
              <ul className="flex flex-col gap-2.5">
                {['Funcionalidades', 'Planos e Preços', 'Integrações', 'Eventos', 'Novidades'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-[13px] font-light text-white/35 hover:text-white transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Empresa */}
            <div>
              <h4 className="font-display font-semibold text-[13px] text-white mb-4">Empresa</h4>
              <ul className="flex flex-col gap-2.5">
                {['Sobre o Runmind', 'Blog', 'Carreiras', 'Imprensa', 'Contato'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-[13px] font-light text-white/35 hover:text-white transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Suporte */}
            <div>
              <h4 className="font-display font-semibold text-[13px] text-white mb-4">Suporte</h4>
              <ul className="flex flex-col gap-2.5">
                {['Central de Ajuda', 'Privacidade', 'Termos de Uso', 'Status'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-[13px] font-light text-white/35 hover:text-white transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="pt-6 sm:pt-7 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-[11px] sm:text-xs font-light text-white/25 text-center sm:text-left">© 2025 Runmind. Todos os direitos reservados.</span>
            <div className="flex items-center gap-2 flex-wrap justify-center">
              {['Strava Connected', 'Garmin Connected'].map((badge) => (
                <div key={badge} className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border border-white/10 text-[9px] sm:text-[10px] font-semibold tracking-[0.12em] uppercase text-white/30">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00F048]" />
                  {badge}
                </div>
              ))}
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animation-delay-2000 {
          animation-delay: -2s;
        }
        @keyframes ticker {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-ticker {
          animation: ticker 22s linear infinite;
        }
      `}</style>
    </div>
  )
}
