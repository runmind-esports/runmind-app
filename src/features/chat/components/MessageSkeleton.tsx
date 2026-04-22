'use client'

import { cn } from '@/lib/utils'

export function MessageSkeleton() {
  return (
    <div className="flex w-full justify-start">
      <div className="max-w-[85%] py-1 space-y-2">
        <div className="h-4 w-64 animate-shimmer rounded bg-gradient-to-r from-background-secondary via-background-tertiary to-background-secondary bg-[length:200%_100%]" />
        <div className="h-4 w-48 animate-shimmer rounded bg-gradient-to-r from-background-secondary via-background-tertiary to-background-secondary bg-[length:200%_100%]" />
        <div className="h-4 w-56 animate-shimmer rounded bg-gradient-to-r from-background-secondary via-background-tertiary to-background-secondary bg-[length:200%_100%]" />
      </div>
    </div>
  )
}
