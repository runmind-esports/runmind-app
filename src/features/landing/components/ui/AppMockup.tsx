'use client'

import Image from 'next/image'

export function AppMockup() {
  return (
    <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
      <Image
        src="/images/hero-runner.jpg"
        alt="Corredor treinando com RunMind"
        fill
        className="object-cover"
        unoptimized
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#14162E]/80 via-transparent to-transparent" />
      <div className="absolute bottom-6 left-6 right-6">
        <div className="bg-[#14162E]/90 backdrop-blur-sm rounded-xl p-4 border border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
              <span className="text-[#14162E] text-sm font-bold">AI</span>
            </div>
            <div className="flex-1">
              <div className="text-[13px] text-accent font-bold">RunMind Coach</div>
              <div className="text-[13px] text-foreground-muted">Seu treino de hoje esta pronto!</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
