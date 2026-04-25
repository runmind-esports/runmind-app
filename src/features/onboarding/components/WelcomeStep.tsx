'use client'

import { useState } from 'react'
import { getTranslations } from '../i18n/translations'
import { WelcomeHeroIllustration } from '../assets'

export function WelcomeStep({
  name,
  onConfirm,
}: {
  name: string
  onConfirm: (name: string) => void
}) {
  const t = getTranslations()
  const [inputName, setInputName] = useState(name)
  const [nameError, setNameError] = useState('')

  const handleConfirm = () => {
    if (!inputName.trim()) {
      setNameError(t.welcome.nameRequired)
      return
    }
    setNameError('')
    onConfirm(inputName.trim())
  }

  return (
    <>
      <div className="relative -mx-6 -mt-8 mb-6 h-[40vh] min-h-[200px] max-h-[320px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#14162E] via-[#14162E]/80 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <WelcomeHeroIllustration className="w-48 h-48 motion-safe:animate-fade-in-up" />
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold font-display leading-[1.2] text-[#14162E] motion-safe:animate-fade-in-up">
            {t.welcome.greeting.replace('{name}', inputName || '...')}
          </h1>
          <p className="mt-2 text-base text-[#6B7088] leading-relaxed">
            {t.welcome.subtitle}
          </p>
        </div>

        <div>
          <label
            htmlFor="onboarding-name"
            className="block text-[13px] font-bold tracking-[0.04em] text-[#14162E] mb-1.5"
          >
            {t.welcome.nameLabel}
          </label>
          <input
            id="onboarding-name"
            type="text"
            value={inputName}
            onChange={(e) => {
              setInputName(e.target.value)
              if (nameError) setNameError('')
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleConfirm()
            }}
            placeholder={t.welcome.namePlaceholder}
            className={`w-full px-4 py-3 bg-[#F5F6F7] border-[1.5px] rounded-xl text-base text-[#14162E] placeholder:text-[#A8ADBE] outline-none transition-all focus:border-[#14162E] focus:bg-white focus:shadow-[0_0_0_4px_rgba(20,22,46,0.05)] ${
              nameError ? 'border-red-400' : 'border-[rgba(20,22,46,0.09)]'
            }`}
          />
          {nameError && (
            <p className="mt-1 text-xs text-red-500">{nameError}</p>
          )}
        </div>

        <button
          type="button"
          onClick={handleConfirm}
          className="w-full py-3.5 bg-[#00F048] text-[#14162E] rounded-xl text-[15px] font-bold font-display tracking-tight shadow-[0_4px_16px_rgba(0,240,72,0.22)] transition-all hover:bg-[#00D840] hover:-translate-y-px hover:shadow-[0_6px_24px_rgba(0,240,72,0.32)] active:motion-safe:animate-button-press"
        >
          {t.welcome.cta}
        </button>
      </div>
    </>
  )
}
