import { cn } from '@/lib/utils'

interface SectionWrapperProps {
  id: string
  children?: React.ReactNode
  className?: string
  dark?: boolean
}

export function SectionWrapper({ id, children, className, dark = false }: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={cn(
        'px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24',
        'max-w-7xl mx-auto',
        dark && 'bg-background-secondary',
        className
      )}
    >
      {children}
    </section>
  )
}
