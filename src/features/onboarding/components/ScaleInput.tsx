'use client'

import { cn } from '@/lib/utils'

interface ScaleInputProps {
  value: number | null
  onChange: (value: number) => void
  labels: string[]
}

export function ScaleInput({ value, onChange, labels }: ScaleInputProps) {
  return (
    <div role="radiogroup" className="flex gap-2 justify-between">
      {labels.map((label, index) => {
        const scaleValue = index + 1
        const isSelected = value === scaleValue

        return (
          <div
            key={scaleValue}
            className={cn('flex flex-col items-center option-stagger-item motion-safe:animate-option-fade-in', `stagger-delay-${index + 1}`)}
          >
            <button
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onChange(scaleValue)}
              className={cn(
                'w-12 h-12 rounded-full flex items-center justify-center text-base transition-all duration-200',
                isSelected
                  ? 'bg-[#00F048] border-[2px] border-[#00F048] text-[#14162E] font-bold shadow-[0_0_0_3px_rgba(0,240,72,0.15)] motion-safe:animate-scale-bounce'
                  : 'bg-[#F5F6F7] border-[1.5px] border-[rgba(20,22,46,0.09)] text-[#14162E]',
              )}
            >
              {scaleValue}
            </button>
            <span className="text-[13px] text-[#6B7088] text-center mt-1">
              {label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
