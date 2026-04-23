'use client'

import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface OptionButtonProps {
  label: string
  selected: boolean
  onClick: () => void
}

export function OptionButton({ label, selected, onClick }: OptionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-xl px-4 py-4 w-full text-base text-left transition-all duration-200 min-h-[52px]',
        'flex items-center justify-between',
        selected
          ? 'bg-white border-[2px] border-[#00F048] text-[#14162E] font-bold'
          : 'bg-[#F5F6F7] border-[1.5px] border-[rgba(20,22,46,0.09)] text-[#14162E] hover:bg-[#EBEBEF] hover:border-[rgba(20,22,46,0.15)]',
      )}
    >
      <span>{label}</span>
      {selected && <Check size={16} className="text-[#00F048] flex-shrink-0 ml-2" />}
    </button>
  )
}
