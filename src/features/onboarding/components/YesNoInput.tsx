'use client'

import { ThumbsUp, ThumbsDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface YesNoInputProps {
  value: boolean | null
  onChange: (value: boolean) => void
  yesLabel: string
  noLabel: string
}

export function YesNoInput({ value, onChange, yesLabel, noLabel }: YesNoInputProps) {
  return (
    <div className="flex gap-3">
      <div className="flex-1 option-stagger-item motion-safe:animate-option-fade-in stagger-delay-1">
        <button
          type="button"
          onClick={() => onChange(true)}
          className={cn(
            'w-full rounded-xl px-4 py-4 text-base transition-all duration-200 min-h-[52px]',
            'flex items-center justify-center gap-2',
            value === true
              ? 'bg-white border-[2px] border-[#00F048] text-[#14162E] font-bold shadow-[0_0_0_3px_rgba(0,240,72,0.15)] motion-safe:animate-scale-bounce'
              : 'bg-[#F5F6F7] border-[1.5px] border-[rgba(20,22,46,0.09)] text-[#14162E] hover:bg-[#EBEBEF] hover:border-[rgba(20,22,46,0.15)]',
          )}
        >
          <ThumbsUp size={16} />
          <span>{yesLabel}</span>
        </button>
      </div>
      <div className="flex-1 option-stagger-item motion-safe:animate-option-fade-in stagger-delay-2">
        <button
          type="button"
          onClick={() => onChange(false)}
          className={cn(
            'w-full rounded-xl px-4 py-4 text-base transition-all duration-200 min-h-[52px]',
            'flex items-center justify-center gap-2',
            value === false
              ? 'bg-white border-[2px] border-[#00F048] text-[#14162E] font-bold shadow-[0_0_0_3px_rgba(0,240,72,0.15)] motion-safe:animate-scale-bounce'
              : 'bg-[#F5F6F7] border-[1.5px] border-[rgba(20,22,46,0.09)] text-[#14162E] hover:bg-[#EBEBEF] hover:border-[rgba(20,22,46,0.15)]',
          )}
        >
          <ThumbsDown size={16} />
          <span>{noLabel}</span>
        </button>
      </div>
    </div>
  )
}
