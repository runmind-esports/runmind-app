'use client'

import Link from 'next/link'
import { ReactNode } from 'react'

interface InfoCard {
  icon: ReactNode
  title: string
  subtitle: string
}

interface Stat {
  value: string
  unit?: string
  label: string
  highlight?: boolean
}

interface Testimonial {
  text: string
  name: string
  role: string
  initial: string
}

interface AuthLayoutProps {
  children: ReactNode
  variant: 'login' | 'signup' | 'forgot'
  badge: string
  title: ReactNode
  description: string
  stats?: Stat[]
  steps?: string[]
  infoCards?: InfoCard[]
  testimonial?: Testimonial
}

export function AuthLayout({
  children,
  variant,
  badge,
  title,
  description,
  stats,
  steps,
  infoCards,
  testimonial,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex font-['Manrope',sans-serif]">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-[52%] bg-[#14162E] relative overflow-hidden flex-col justify-between p-10">
        {/* Runner background photo */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1200&q=80&auto=format)',
          }}
        />

        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#14162E] via-[#14162E]/80 to-[#14162E]/60" />

        {/* Glow effects */}
        <div className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(0,240,72,0.12)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute bottom-[-150px] right-[-150px] w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(0,240,72,0.08)_0%,transparent_70%)] pointer-events-none" />

        {/* Logo */}
        <Link href="/" className="relative z-10 flex items-center gap-2">
          <img src="/brand/runmind-logo.svg" alt="Runmind" width={32} height={32} />
          <span className="font-['Poppins',sans-serif] font-bold text-[18px] text-white tracking-tight">
            Runmind
          </span>
        </Link>

        {/* Main content */}
        <div className="relative z-10 max-w-[420px]">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[rgba(0,240,72,0.12)] border border-[rgba(0,240,72,0.25)] rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00F048] animate-pulse" />
            <span className="text-[11px] font-semibold tracking-[0.06em] text-[#00F048] uppercase">
              {badge}
            </span>
          </div>

          {/* Title */}
          <h1 className="font-['Poppins',sans-serif] font-bold text-[42px] leading-[1.08] tracking-tight text-white mb-4">
            {title}
          </h1>

          {/* Description */}
          <p className="text-[15px] leading-relaxed text-[rgba(255,255,255,0.7)] mb-8">
            {description}
          </p>

          {/* Stats (for login) */}
          {stats && (
            <div className="flex gap-5 mb-8">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className={`flex-1 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-xl p-4 ${
                    stat.highlight ? 'border-[rgba(0,240,72,0.3)]' : ''
                  }`}
                >
                  <div className="flex items-baseline gap-0.5 mb-1">
                    <span className={`font-['Poppins',sans-serif] font-bold text-[22px] tracking-tight ${
                      stat.highlight ? 'text-[#00F048]' : 'text-white'
                    }`}>
                      {stat.value}
                    </span>
                    {stat.unit && (
                      <span className="text-xs text-[rgba(255,255,255,0.5)]">{stat.unit}</span>
                    )}
                  </div>
                  <span className="text-[11px] text-[rgba(255,255,255,0.5)]">{stat.label}</span>
                </div>
              ))}
            </div>
          )}

          {/* Steps (for signup) */}
          {steps && (
            <div className="space-y-3 mb-8">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[rgba(0,240,72,0.15)] border border-[rgba(0,240,72,0.3)] flex items-center justify-center">
                    <span className="text-[11px] font-bold text-[#00F048]">{index + 1}</span>
                  </div>
                  <span className="text-[13.5px] text-[rgba(255,255,255,0.85)]">{step}</span>
                </div>
              ))}
            </div>
          )}

          {/* Info Cards (for forgot password) */}
          {infoCards && (
            <div className="space-y-3 mb-8">
              {infoCards.map((card, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3.5 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] rounded-xl p-3.5"
                >
                  <div className="w-9 h-9 rounded-lg bg-[rgba(0,240,72,0.1)] border border-[rgba(0,240,72,0.2)] flex items-center justify-center flex-shrink-0">
                    {card.icon}
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-white">{card.title}</div>
                    <div className="text-[11px] text-[rgba(255,255,255,0.5)]">{card.subtitle}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Testimonial */}
          {testimonial && (
            <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] rounded-2xl p-5">
              <p
                className="text-[14px] leading-relaxed text-[rgba(255,255,255,0.85)] mb-4"
                dangerouslySetInnerHTML={{ __html: testimonial.text }}
              />
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[rgba(0,240,72,0.15)] border border-[rgba(0,240,72,0.3)] flex items-center justify-center">
                  <span className="text-[13px] font-bold text-[#00F048]">{testimonial.initial}</span>
                </div>
                <div>
                  <div className="text-[13px] font-semibold text-white">{testimonial.name}</div>
                  <div className="text-[11px] text-[rgba(255,255,255,0.5)]">{testimonial.role}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="relative z-10 text-[11px] text-[rgba(255,255,255,0.35)]">
          © 2024 Runmind · Treine com inteligência
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex flex-col bg-white min-h-screen lg:min-h-0">
        {/* Mobile hero image */}
        <div
          className="lg:hidden relative h-[200px] bg-[#14162E] overflow-hidden"
        >
          <div
            className="absolute inset-0 bg-cover bg-center opacity-40"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&q=80&auto=format)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display font-bold text-[32px] text-white tracking-tight drop-shadow-lg"><span className="text-[#00F048]">R</span>unmind</span>
          </div>
        </div>

        {/* Form content */}
        <div className="flex-1 flex items-center justify-center px-6 py-8 lg:p-10">
          <div className="w-full max-w-[400px]">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
