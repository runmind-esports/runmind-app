'use client'

import { useInView } from '../../hooks/useInView'

interface ScrollRevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

export function ScrollReveal({ children, className, delay = 0 }: ScrollRevealProps) {
  const [ref, isInView] = useInView({ threshold: 0.15, once: true, rootMargin: '0px 0px -60px 0px' })

  return (
    <div
      ref={ref}
      className={`scroll-reveal ${className ?? ''}`}
      data-inview={isInView || undefined}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}
