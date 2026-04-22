'use client'

interface ProfileCardProps {
  emoji: string
  name: string
  stat: string
  description: string
}

export function ProfileCard({ emoji, name, stat, description }: ProfileCardProps) {
  return (
    <div className="rounded-xl border border-border bg-background-secondary p-6 text-center">
      <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center mx-auto text-2xl">
        {emoji}
      </div>
      <h3 className="text-base font-bold font-display mt-4">{name}</h3>
      <p className="text-accent text-[13px] mt-1">{stat}</p>
      <p className="text-base text-foreground-muted leading-relaxed mt-3">{description}</p>
    </div>
  )
}
