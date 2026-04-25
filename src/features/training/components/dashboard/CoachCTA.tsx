'use client'

import { useRouter } from 'next/navigation'
import { MessageCircle, ChevronRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import type { CoachSuggestion } from '../../utils/dashboardHelpers'

interface CoachCTAProps {
  suggestion: CoachSuggestion
}

export function CoachCTA({ suggestion }: CoachCTAProps) {
  const router = useRouter()

  const handleClick = () => {
    router.push(`/chat?prompt=${encodeURIComponent(suggestion.chatPrompt)}`)
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => { if (e.key === 'Enter') handleClick() }}
    >
    <Card className="cursor-pointer transition-transform duration-200 hover:scale-[1.02]">
      {/* Accent gradient glow */}
      <div className="absolute -top-6 -right-6 h-20 w-20 rounded-full bg-gradient-to-br from-[#3B82F6]/15 to-transparent opacity-60" />

      <div className="relative">
        <div className="flex items-center gap-2">
          <span className="text-lg">{suggestion.emoji}</span>
          <span className="text-xs font-medium uppercase tracking-wider text-accent">
            Coach IA
          </span>
        </div>

        <p className="text-sm font-medium text-foreground mt-2">
          {suggestion.message}
        </p>

        <div className="flex items-center gap-1 mt-3">
          <MessageCircle size={14} className="text-accent" />
          <span className="text-xs text-accent font-medium">Conversar com o coach</span>
          <ChevronRight size={14} className="text-accent" />
        </div>
      </div>
    </Card>
    </div>
  )
}
