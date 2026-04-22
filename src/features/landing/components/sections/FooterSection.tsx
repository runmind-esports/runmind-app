'use client'

import Link from 'next/link'
import { useLanguage } from '@/features/landing/hooks/useLanguage'
import { SectionWrapper } from '../ui/SectionWrapper'

export function FooterSection() {
  const { t, locale } = useLanguage()

  const productLinks = t.footer.links.filter(link => link.href.startsWith('#'))
  const accountLinks = t.footer.links.filter(link => link.href.startsWith('/'))

  return (
    <SectionWrapper id="footer" dark>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-[#14162E] font-bold text-sm">
              R
            </div>
            <span className="font-display font-bold text-lg">RunMind</span>
          </div>
          <p className="text-[13px] text-foreground-muted mt-2">{t.footer.tagline}</p>
        </div>
        <nav aria-label="Product">
          <h3 className="font-bold text-sm mb-4">
            {locale === 'pt-BR' ? 'Produto' : 'Product'}
          </h3>
          <div className="space-y-3">
            {productLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                className="block text-[13px] text-foreground-muted hover:text-foreground transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </div>
        </nav>
        <nav aria-label="Account">
          <h3 className="font-bold text-sm mb-4">
            {locale === 'pt-BR' ? 'Conta' : 'Account'}
          </h3>
          <div className="space-y-3">
            {accountLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-[13px] text-foreground-muted hover:text-foreground transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>
      <div className="border-t border-border pt-8 mt-8 text-center">
        <p className="text-[13px] text-foreground-muted">{t.footer.rights}</p>
      </div>
    </SectionWrapper>
  )
}
