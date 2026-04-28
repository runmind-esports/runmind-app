'use client'

interface CircularGaugeProps {
  current: number
  max: number
  percentage: number
}

function getColor(percentage: number): string {
  if (percentage > 30) return '#00F048'
  if (percentage > 10) return '#F59E0B'
  return '#EF4444'
}

export function CircularGauge({ current, max, percentage }: CircularGaugeProps) {
  const radius = 80
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (circumference * percentage / 100)
  const color = getColor(percentage)

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 200 200" className="w-[200px] h-[200px]">
        {/* Background circle */}
        <circle
          cx={100}
          cy={100}
          r={radius}
          fill="none"
          stroke="var(--border)"
          strokeWidth={12}
        />
        {/* Progress circle */}
        <circle
          cx={100}
          cy={100}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={12}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 100 100)"
          style={{ transition: 'stroke-dashoffset 1s ease-out' }}
        />
        {/* Center text */}
        {current === 0 ? (
          <text
            x={100}
            y={105}
            textAnchor="middle"
            className="fill-red-400 text-sm font-bold"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Sem calorias
          </text>
        ) : (
          <>
            <text
              x={100}
              y={95}
              textAnchor="middle"
              className="fill-foreground font-bold"
              style={{ fontSize: '36px', fontFamily: 'var(--font-display)' }}
            >
              {current}
            </text>
            <text
              x={100}
              y={120}
              textAnchor="middle"
              className="fill-foreground-muted"
              style={{ fontSize: '13px' }}
            >
              de {max} RunPoints
            </text>
          </>
        )}
      </svg>
    </div>
  )
}
