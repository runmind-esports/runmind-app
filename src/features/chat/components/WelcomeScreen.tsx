'use client'

import { Zap, Target, TrendingUp, Calendar } from 'lucide-react'

interface WelcomeScreenProps {
  onSelectPrompt: (prompt: string) => void
}

interface Suggestion {
  id: string
  text: string
  icon: React.ReactNode
}

const suggestions: Suggestion[] = [
  {
    id: '1',
    text: 'Que treino devo fazer hoje?',
    icon: <Zap className="h-5 w-5" />,
  },
  {
    id: '2',
    text: 'Quero treinar para uma meia maratona',
    icon: <Target className="h-5 w-5" />,
  },
  {
    id: '3',
    text: 'Como melhorar meu pace?',
    icon: <TrendingUp className="h-5 w-5" />,
  },
  {
    id: '4',
    text: 'Monte uma planilha de treino para 10km',
    icon: <Calendar className="h-5 w-5" />,
  },
]

export function WelcomeScreen({ onSelectPrompt }: WelcomeScreenProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4">
      <div className="grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion.id}
            onClick={() => onSelectPrompt(suggestion.text)}
            className="flex items-center gap-3 rounded-xl border border-border bg-background-secondary p-4 text-left transition-colors hover:bg-background-tertiary"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-background-tertiary text-foreground-muted">
              {suggestion.icon}
            </div>
            <span className="text-sm text-foreground">{suggestion.text}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
