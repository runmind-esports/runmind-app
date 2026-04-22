'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'

interface CTAButtonProps {
  variant: 'primary' | 'secondary'
  href: string
  children: React.ReactNode
}

export function CTAButton({ variant, href, children }: CTAButtonProps) {
  const classes = cn(
    'inline-flex items-center justify-center rounded-full px-8 py-3 text-base font-bold transition-colors duration-200',
    variant === 'primary' && 'bg-accent text-[#14162E] hover:bg-accent-hover',
    variant === 'secondary' && 'border border-border text-foreground hover:bg-background-secondary'
  )

  if (href.startsWith('#')) {
    return <a href={href} className={classes}>{children}</a>
  }

  return <Link href={href} className={classes}>{children}</Link>
}
