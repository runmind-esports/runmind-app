'use client'

import { useState } from 'react'
import { icons } from 'lucide-react'

const CURATED_ICONS = [
  'Folder', 'Target', 'Zap', 'Heart', 'Star', 'Trophy', 'Flame', 'Rocket',
  'Compass', 'Map', 'Mountain', 'Timer', 'Activity', 'TrendingUp', 'Flag',
  'Bookmark', 'Dumbbell', 'Footprints', 'Bike', 'Calendar', 'Clock', 'Sun',
  'Moon', 'Cloud', 'Music', 'Camera', 'Book', 'Code', 'Briefcase',
  'GraduationCap', 'Gift', 'Shield', 'Crown', 'Leaf', 'Palette', 'Globe',
  'Users', 'Sparkles', 'Medal',
] as const

interface IconPickerProps {
  selectedIcon: string
  onSelect: (iconName: string) => void
}

export function IconPicker({ selectedIcon, onSelect }: IconPickerProps) {
  const [filter, setFilter] = useState('')

  const filteredIcons = CURATED_ICONS.filter((name) =>
    name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      <input
        type="text"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Buscar ícone..."
        className="w-full rounded-lg bg-background-secondary px-4 py-3 text-sm text-foreground placeholder:text-foreground-muted outline-none focus:ring-2 focus:ring-accent/30 mb-3"
      />
      <div className="grid grid-cols-6 gap-2 max-h-[200px] overflow-y-auto p-1">
        {filteredIcons.map((name) => {
          const IconComponent = icons[name as keyof typeof icons]
          if (!IconComponent) return null

          const isSelected = selectedIcon === name

          return (
            <button
              key={name}
              type="button"
              onClick={() => onSelect(name)}
              className={`flex items-center justify-center rounded-lg p-2.5 min-h-[44px] transition-colors ${
                isSelected
                  ? 'ring-2 ring-accent bg-accent/10'
                  : 'bg-background-secondary hover:bg-background-tertiary'
              }`}
              title={name}
            >
              <IconComponent className={`h-5 w-5 ${isSelected ? 'text-accent' : 'text-foreground'}`} />
            </button>
          )
        })}
      </div>
    </div>
  )
}
