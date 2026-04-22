'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { useLanguage } from '@/features/landing/hooks/useLanguage'

export function Navbar() {
  const { t } = useLanguage()
  const [mobileOpen, setMobileOpen] = useState(false)

  const navLinks = [
    { label: t.nav.features, href: '#features' },
    { label: t.nav.journey, href: '#flow' },
    { label: t.nav.profiles, href: '#profiles' },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
            <span className="text-[#14162E] text-sm font-bold">R</span>
          </div>
          <span className="text-lg font-bold font-display">
            run<span className="text-accent">mind</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-foreground-muted hover:text-foreground transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-semibold text-foreground hover:text-accent transition-colors"
          >
            {t.nav.login}
          </Link>
          <Link
            href="/signup"
            className="text-sm font-bold bg-accent text-[#14162E] px-5 py-2 rounded-full hover:bg-accent-hover transition-colors"
          >
            {t.nav.signup}
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-foreground"
          aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-md">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block text-base text-foreground-muted hover:text-foreground py-2"
              >
                {link.label}
              </a>
            ))}
            <hr className="border-border" />
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="block text-base font-semibold text-foreground py-2"
            >
              {t.nav.login}
            </Link>
            <Link
              href="/signup"
              onClick={() => setMobileOpen(false)}
              className="block text-center text-base font-bold bg-accent text-[#14162E] px-5 py-3 rounded-full"
            >
              {t.nav.signup}
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
