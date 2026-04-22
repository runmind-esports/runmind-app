'use client'

import type { LucideIcon } from 'lucide-react'

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
}

export function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <div className="rounded-xl border border-border bg-background p-6 hover:border-accent/30 transition-colors duration-200">
      <div className="w-12 h-12 rounded-lg bg-accent-dim flex items-center justify-center">
        <Icon size={24} className="text-accent" aria-hidden="true" />
      </div>
      <h3 className="text-base font-bold font-display mt-4">{title}</h3>
      <p className="text-base text-foreground-muted leading-relaxed mt-2">{description}</p>
    </div>
  )
}
