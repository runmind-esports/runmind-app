'use client'

import { useInView } from '../../hooks/useInView'
import { useCountUp } from '../../hooks/useCountUp'

interface AnimatedCounterProps {
  value: number
  suffix?: string
  formatter?: (n: number) => string
  duration?: number
}

const defaultFormatter = (n: number) => Math.round(n).toString()

export function AnimatedCounter({
  value,
  suffix,
  formatter = defaultFormatter,
  duration,
}: AnimatedCounterProps) {
  const [ref, isInView] = useInView({ threshold: 0.15, once: true, rootMargin: '0px 0px -60px 0px' })
  const current = useCountUp(value, { duration, enabled: isInView })

  return (
    <div ref={ref} className="text-center">
      <span
        aria-live="polite"
        className="text-[32px] md:text-[40px] font-bold font-display text-accent leading-[1.1]"
      >
        {formatter(current)}
        {suffix && <span>{suffix}</span>}
      </span>
    </div>
  )
}
