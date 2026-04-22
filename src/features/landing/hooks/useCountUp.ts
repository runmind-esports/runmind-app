import { useState, useEffect, useRef } from 'react'

interface UseCountUpOptions {
  duration?: number
  enabled?: boolean
}

export function useCountUp(target: number, options: UseCountUpOptions = {}) {
  const { duration = 2000, enabled = false } = options
  const [current, setCurrent] = useState(0)
  const targetRef = useRef(target)

  // Capture target when animation starts
  useEffect(() => {
    if (enabled) targetRef.current = target
  }, [enabled, target])

  useEffect(() => {
    if (!enabled) return

    // Respect prefers-reduced-motion
    if (typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCurrent(targetRef.current)
      return
    }

    const start = performance.now()
    const value = targetRef.current
    let rafId: number

    function tick(now: number) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // easeOutCubic
      setCurrent(eased * value)
      if (progress < 1) {
        rafId = requestAnimationFrame(tick)
      } else {
        setCurrent(value) // Ensure exact final value
      }
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [enabled, duration])

  return current
}
