import type { LucideIcon } from 'lucide-react'

export interface TimelineStepProps {
  step: number
  icon: LucideIcon
  title: string
  description: string
  metric?: string
  isLast?: boolean
}

export function TimelineStep({ step, icon: Icon, title, description, metric, isLast }: TimelineStepProps) {
  return (
    <li className="relative flex gap-6">
      <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center flex-shrink-0 z-10">
        <Icon size={20} className="text-[#14162E]" aria-hidden="true" />
      </div>
      {!isLast && <div className="absolute left-5 top-10 bottom-0 border-l-2 border-border" />}
      <div className={isLast ? 'pb-0' : 'pb-12'}>
        <h3 className="text-base font-bold font-display">{title}</h3>
        <p className="text-base text-foreground-muted leading-relaxed mt-1">{description}</p>
        {metric && (
          <span className="inline-flex items-center px-2 py-1 bg-accent-dim rounded text-[13px] font-bold text-accent mt-2">
            {metric}
          </span>
        )}
      </div>
    </li>
  )
}
