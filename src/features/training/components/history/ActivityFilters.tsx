'use client'

interface ActivityFiltersProps {
  typeFilter: string
  periodFilter: string
  onTypeChange: (type: string) => void
  onPeriodChange: (period: string) => void
}

const typeOptions = [
  { value: '', label: 'Todos' },
  { value: 'Run', label: 'Corrida' },
  { value: 'Walk', label: 'Caminhada' },
  { value: 'Ride', label: 'Ciclismo' },
]

const periodOptions = [
  { value: 'all', label: 'Tudo' },
  { value: 'week', label: 'Semana' },
  { value: 'month', label: 'Mes' },
  { value: '3months', label: '3 meses' },
]

function PillButton({
  active,
  label,
  onClick,
}: {
  active: boolean
  label: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`whitespace-nowrap rounded-full px-3 py-2 text-xs font-medium transition-colors ${
        active
          ? 'bg-accent text-white'
          : 'border border-border bg-background-secondary text-foreground-muted'
      }`}
    >
      {label}
    </button>
  )
}

export function ActivityFilters({
  typeFilter,
  periodFilter,
  onTypeChange,
  onPeriodChange,
}: ActivityFiltersProps) {
  return (
    <div className="space-y-2">
      <div
        className="flex gap-2 overflow-x-auto pb-2 no-scrollbar"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {typeOptions.map((opt) => (
          <PillButton
            key={opt.value}
            active={typeFilter === opt.value}
            label={opt.label}
            onClick={() => onTypeChange(opt.value)}
          />
        ))}
      </div>

      <div
        className="flex gap-2 overflow-x-auto pb-2 no-scrollbar"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {periodOptions.map((opt) => (
          <PillButton
            key={opt.value}
            active={periodFilter === opt.value}
            label={opt.label}
            onClick={() => onPeriodChange(opt.value)}
          />
        ))}
      </div>
    </div>
  )
}
