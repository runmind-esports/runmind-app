import { useRef, useState, useEffect } from 'react'

interface UseInViewOptions {
  threshold?: number
  once?: boolean
  rootMargin?: string
}

export function useInView(options: UseInViewOptions = {}): [React.RefObject<HTMLDivElement>, boolean] {
  const { threshold = 0.15, once = true, rootMargin = '0px 0px -60px 0px' } = options
  const ref = useRef<HTMLDivElement>(null!)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          if (once) {
            observer.unobserve(el)
          }
        }
      },
      { threshold, rootMargin },
    )

    observer.observe(el)

    return () => {
      observer.disconnect()
    }
  }, [threshold, once, rootMargin])

  return [ref, isInView]
}
