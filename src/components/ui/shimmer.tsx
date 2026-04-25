import { cn } from '@/lib/utils'

interface ShimmerProps {
  className?: string
}

export function Shimmer({ className }: ShimmerProps) {
  return (
    <div
      className={cn(
        'rounded-md bg-background-tertiary animate-shimmer bg-[length:200%_100%] bg-gradient-to-r from-background-tertiary via-background-secondary to-background-tertiary',
        className
      )}
    />
  )
}
