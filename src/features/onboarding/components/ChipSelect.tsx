'use client'

import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChipSelectProps {
  options: { key: string; label: string }[]
  value: string[]
  onChange: (next: string[]) => void
  multi?: boolean
}

export function ChipSelect({ options, value, onChange, multi = true }: ChipSelectProps) {
  const toggle = (key: string) => {
    if (!multi) {
      onChange([key])
      return
    }
    onChange(value.includes(key) ? value.filter((k) => k !== key) : [...value, key])
  }

  return (
    <div className="flex flex-wrap gap-2">
      {options.map(({ key, label }) => {
        const selected = value.includes(key)
        return (
          <button
            key={key}
            type="button"
            onClick={() => toggle(key)}
            aria-pressed={selected}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm transition-all',
              selected
                ? 'bg-[#00F048] text-[#14162E] font-bold shadow-[0_0_0_3px_rgba(0,240,72,0.15)] motion-safe:animate-scale-bounce'
                : 'bg-[#F5F6F7] border-[1.5px] border-[rgba(20,22,46,0.09)] text-[#14162E] hover:bg-[#EBEBEF]'
            )}
          >
            {selected && <Check size={14} strokeWidth={3} />}
            {label}
          </button>
        )
      })}
    </div>
  )
}
