'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getTranslations } from '../i18n/translations'

export function SuccessScreen() {
  const t = getTranslations()
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/chat')
    }, 2500)
    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      {/* Animated check circle */}
      <div className="relative w-24 h-24 mb-6">
        <div className="absolute inset-0 rounded-full bg-[#00F048]/10 motion-safe:animate-fade-in-up" />
        <svg
          viewBox="0 0 96 96"
          className="w-24 h-24"
          aria-hidden="true"
        >
          <circle
            cx="48" cy="48" r="44"
            fill="none"
            stroke="#00F048"
            strokeWidth="3"
            className="motion-safe:animate-fade-in-up"
          />
          <path
            d="M28 50 L42 64 L68 34"
            fill="none"
            stroke="#00F048"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="motion-safe:animate-success-check"
          />
        </svg>
      </div>

      <h1 className="text-2xl font-bold font-display text-[#14162E] motion-safe:animate-fade-in-up">
        {t.success.title}
      </h1>
      <p className="mt-2 text-base text-[#6B7088] motion-safe:animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        {t.success.subtitle}
      </p>

      {/* Subtle loading dots */}
      <div className="mt-8 flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-[#00F048] motion-safe:animate-pulse"
            style={{ animationDelay: `${i * 200}ms` }}
          />
        ))}
      </div>
    </div>
  )
}
