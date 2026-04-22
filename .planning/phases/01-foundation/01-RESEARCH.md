# Phase 1: Foundation - Research

**Researched:** 2026-04-22
**Domain:** Next.js 14 App Router route groups, React context-based i18n, marketing layout isolation
**Confidence:** HIGH

## Summary

Phase 1 delivers the infrastructure that all subsequent phases depend on: a `(marketing)` route group that isolates the landing page from app concerns (no QueryProvider, no auth state), a LanguageProvider React context with cookie-based PT-BR/EN toggling, a translation dictionary with the full namespace structure, and a SectionWrapper component for consistent section layout. No visual content is delivered -- only the shell and primitives.

The primary technical challenge is the route conflict: the existing `src/app/page.tsx` (955-line monolithic landing page) serves `/`, and the new `(marketing)/page.tsx` also needs to serve `/`. Next.js does not allow two `page.tsx` files at the same route. The solution is to move (not copy) the existing `page.tsx` into the `(marketing)` route group, then progressively replace its contents with the new component architecture. In Phase 1, the page orchestrator renders placeholder `<div>` elements for each section slot.

The second consideration is the root layout: it currently wraps everything in `QueryProvider`. The ARCHITECTURE.md research recommends keeping `QueryProvider` in root layout for now (the landing page does not use it, but the overhead is negligible). This avoids touching existing layouts that work. The `(marketing)/layout.tsx` simply wraps children in `LanguageProvider` and sets marketing-specific metadata.

**Primary recommendation:** Create `(marketing)` route group, move existing page.tsx there temporarily, build LanguageProvider + translations + SectionWrapper as the foundation, then replace page.tsx content with the thin orchestrator pattern.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| INFRA-01 | Landing page uses translation dictionary (PT-BR + EN) with LanguageProvider React context | LanguageProvider pattern documented in ARCHITECTURE.md with full code examples. Cookie-based persistence via `runmind_locale`. Translation dictionary with namespaced keys per section. TypeScript types for compile-time key safety. |
| INFRA-02 | Landing page lives in `(marketing)` route group, isolated from existing app routes | Next.js App Router route groups confirmed to have no URL prefix. Marketing layout excludes QueryProvider and auth state. Existing routes remain in their current locations unchanged. |
</phase_requirements>

## Project Constraints (from CLAUDE.md)

- **Build/dev commands:** `npm run dev`, `npm run build`, `npm run lint`, `npm start`
- **Deployment:** `./scripts/deploy.sh prod` for Cloud Run; project ID `runmind-483617`
- **Output mode:** `standalone` (for Docker deployment)
- **Feature organization:** Code organized by feature modules in `src/features/` with barrel file exports
- **API layer:** Multiple axios clients in `src/shared/lib/apiClient.ts` -- landing page must NOT depend on these (except Phase 4 BigNumbers)
- **Path alias:** `@/*` maps to `./src/*`
- **Styling:** Tailwind CSS with custom design tokens in `globals.css` and `tailwind.config.ts`

## Standard Stack

### Core (Already Installed -- No New Dependencies for Phase 1)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| next | 14.2.21 | App Router, route groups, layouts | Already installed [VERIFIED: package.json] |
| react | ^18 | UI components, context API | Already installed [VERIFIED: package.json] |
| typescript | ^5 | Type safety for translation keys | Already installed [VERIFIED: package.json] |
| tailwindcss | ^3.4.1 | Utility-first styling, responsive breakpoints | Already installed [VERIFIED: package.json] |
| clsx + tailwind-merge | ^2.1.0 / ^2.2.0 | `cn()` class merging utility | Already installed at `src/lib/utils.ts` [VERIFIED: codebase] |

### Supporting (No New Dependencies)

Phase 1 requires zero new npm packages. The LanguageProvider uses React's built-in `createContext`, `useState`, and `useCallback`. Cookie read/write uses the `document.cookie` API. Translation types use TypeScript's `as const` assertion and mapped types.

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Custom React context for i18n | next-intl | next-intl requires middleware, `[locale]` dynamic segments, and `setRequestLocale` calls -- disproportionate for 2 languages on 1 page. Risk of breaking existing routes. [CITED: .planning/research/ARCHITECTURE.md] |
| Cookie persistence | localStorage | localStorage causes SSR hydration mismatches. Cookies are readable on both server and client. [CITED: .planning/research/ARCHITECTURE.md] |
| Cookie persistence | URL-based locales (`/en`, `/pt-BR`) | PROJECT.md specifies landing page at `/`. URL prefixes complicate existing routing and SEO. [CITED: .planning/research/ARCHITECTURE.md] |

**Installation:** None required. Phase 1 uses only existing dependencies.

## Architecture Patterns

### Recommended Project Structure

```
src/
  app/
    (marketing)/           # NEW: Route group for landing page
      layout.tsx           # Marketing layout (LanguageProvider, no QueryProvider)
      page.tsx             # Thin orchestrator importing sections
    (auth)/                # EXISTING -- unchanged
    auth/                  # EXISTING -- unchanged
    chat/                  # EXISTING -- unchanged
    settings/              # EXISTING -- unchanged
    privacy/               # EXISTING -- unchanged
    terms/                 # EXISTING -- unchanged
    layout.tsx             # EXISTING root layout -- unchanged
    globals.css            # EXISTING -- unchanged
  features/
    landing/               # NEW: Landing page feature module
      components/
        sections/          # Section components (Phase 2+ populates these)
        ui/
          SectionWrapper.tsx  # Consistent section padding/layout
      hooks/
        useLanguage.ts     # LanguageProvider context + hook
      i18n/
        translations.ts    # PT-BR + EN dictionary
        types.ts           # TypeScript types for translation keys
      index.ts             # Barrel export
```

[VERIFIED: follows existing feature module pattern from codebase analysis]

### Pattern 1: Route Group Isolation

**What:** `(marketing)` route group with its own layout that excludes app providers
**When to use:** Landing page and any future marketing pages
**Why:** Prevents QueryProvider, auth state, and React Query from loading on marketing pages. Reduces bundle and avoids unnecessary client-side JS.

```typescript
// src/app/(marketing)/layout.tsx
import type { Metadata } from 'next'
import { LanguageProvider } from '@/features/landing/hooks/useLanguage'

export const metadata: Metadata = {
  title: 'RunMind - Seu Coach de Corrida com IA',
  description: 'Treinamento de elite acessivel. Planilhas personalizadas, coach IA 24/7, sincronizacao com Strava e Garmin.',
}

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <LanguageProvider>
      {children}
    </LanguageProvider>
  )
}
```

[CITED: Next.js App Router route group docs -- route groups use parenthesized folder names and do not affect URL structure]

### Pattern 2: Cookie-Based Language Context

**What:** React context providing locale state, setter, and typed translation object. Persists to cookie.
**When to use:** All landing page components that render user-facing text.
**Critical detail:** The `useState` initializer reads from `document.cookie` only on client side. Default is `'pt-BR'` when no cookie exists or during SSR.

```typescript
// src/features/landing/hooks/useLanguage.ts
'use client'
import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { translations, type Locale, type TranslationKeys } from '../i18n/translations';

type LanguageContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: TranslationKeys;
};

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof document !== 'undefined') {
      const cookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('runmind_locale='));
      return (cookie?.split('=')[1] as Locale) || 'pt-BR';
    }
    return 'pt-BR';
  });

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    document.cookie = `runmind_locale=${newLocale};path=/;max-age=31536000`;
  }, []);

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t: translations[locale] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
```

[CITED: .planning/research/ARCHITECTURE.md -- verified code pattern]

### Pattern 3: Typed Translation Dictionary

**What:** Single `translations.ts` file with `as const` assertion for full type safety. TypeScript infers all valid key paths at compile time.
**When to use:** All translatable content.

```typescript
// src/features/landing/i18n/translations.ts
export const translations = {
  'pt-BR': {
    meta: { title: 'RunMind - Seu Coach de Corrida com IA', description: '...' },
    nav: { languageToggle: 'EN' },
    hero: { title: '...', subtitle: '...', cta: 'Comece Gratis', ctaSecondary: '...' },
    features: { title: '...', subtitle: '...', chat: { title: '...', description: '...' }, plans: { title: '...', description: '...' }, sync: { title: '...', description: '...' } },
    profiles: { title: '...', items: [] },
    flow: { title: '...', subtitle: '...', steps: [] },
    numbers: { title: '...', volume: '...', pace: '...', engagement: '...' },
    gap: { title: '...', subtitle: '...', stats: [] },
    cta: { title: '...', subtitle: '...', button: '...' },
    footer: { tagline: '...', links: [], rights: '...' },
  },
  en: {
    // Mirror structure exactly
  },
} as const;

export type Locale = keyof typeof translations;
export type TranslationKeys = typeof translations['pt-BR'];
```

[CITED: .planning/phases/01-foundation/01-UI-SPEC.md -- translation key namespace contract]

### Pattern 4: SectionWrapper Component

**What:** Shared wrapper providing consistent responsive padding, max-width, scroll anchors, and alternating backgrounds.
**When to use:** Every landing page section.

```typescript
// src/features/landing/components/ui/SectionWrapper.tsx
import { cn } from '@/lib/utils';

interface SectionWrapperProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
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
  );
}
```

[CITED: .planning/phases/01-foundation/01-UI-SPEC.md -- SectionWrapper padding contract]

### Pattern 5: Page Orchestrator

**What:** Thin `page.tsx` that imports and composes section components in order. In Phase 1, renders placeholder `<div>` elements for each section slot.
**When to use:** The `(marketing)/page.tsx` file.

```typescript
// src/app/(marketing)/page.tsx
'use client'

import { SectionWrapper } from '@/features/landing/components/ui/SectionWrapper';

export default function LandingPage() {
  return (
    <main>
      <SectionWrapper id="hero">
        {/* Phase 2: HeroSection */}
      </SectionWrapper>
      <SectionWrapper id="features" dark>
        {/* Phase 2: FeaturesSection */}
      </SectionWrapper>
      <SectionWrapper id="profiles">
        {/* Phase 2: ProfilesSection */}
      </SectionWrapper>
      <SectionWrapper id="flow" dark>
        {/* Phase 3: FlowSection */}
      </SectionWrapper>
      <SectionWrapper id="numbers">
        {/* Phase 4: NumbersSection */}
      </SectionWrapper>
      <SectionWrapper id="gap" dark>
        {/* Phase 3: GapSection */}
      </SectionWrapper>
      <SectionWrapper id="cta-section">
        {/* Phase 2: CTASection */}
      </SectionWrapper>
      <SectionWrapper id="footer" dark>
        {/* Phase 2: FooterSection */}
      </SectionWrapper>
    </main>
  );
}
```

### Anti-Patterns to Avoid

- **Importing from `features/auth` or `features/chat` into landing page:** Creates coupling, pulls in app bundle (axios interceptors, React Query). Landing page must be self-contained. [CITED: .planning/research/ARCHITECTURE.md]
- **Using next-intl middleware:** Rewrites ALL routes by default, breaks Strava OAuth callback, auth, and chat routes. [CITED: .planning/research/ARCHITECTURE.md]
- **Hardcoded strings in components:** Even for Phase 1 placeholder content, use the translation system. Avoids painful extraction later. [CITED: .planning/research/SUMMARY.md]
- **Moving QueryProvider out of root layout in this phase:** Unnecessary refactor. Accept minor overhead. Optimize later if needed. [CITED: .planning/research/ARCHITECTURE.md]

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| CSS class merging | String concatenation | `cn()` from `src/lib/utils.ts` (clsx + tailwind-merge) | Already in codebase, handles Tailwind class conflicts correctly [VERIFIED: codebase] |
| Cookie parsing | Custom parser | `document.cookie` API with standard split pattern | Two cookies max (locale). No library needed. [ASSUMED] |
| Type-safe translations | Manual type annotations | `as const` + `typeof translations['pt-BR']` | TypeScript infers all keys automatically, catches typos at compile time [VERIFIED: TypeScript docs] |
| Responsive padding | Per-component padding values | SectionWrapper component | Single source of truth for section spacing per UI-SPEC contract [CITED: 01-UI-SPEC.md] |

## Common Pitfalls

### Pitfall 1: Route Conflict -- Two page.tsx Files at `/`

**What goes wrong:** Creating `(marketing)/page.tsx` while the existing `src/app/page.tsx` still exists causes a Next.js build error. Both resolve to the `/` route.
**Why it happens:** Route groups `(marketing)/` strip the parenthesized name from the URL path. Two `page.tsx` files cannot serve the same route.
**How to avoid:** Move (delete) the existing `src/app/page.tsx` when creating `(marketing)/page.tsx`. The existing landing page content is replaced by the new orchestrator in Phase 1. The old 955-line monolith is not needed -- its content will be rebuilt as section components in Phase 2+.
**Warning signs:** `Error: Conflicting route path` during `next build`.

### Pitfall 2: SSR Hydration Mismatch with Cookie Reading

**What goes wrong:** `LanguageProvider` reads `document.cookie` in `useState` initializer. On the server, `document` is undefined, so it defaults to `'pt-BR'`. If the client has a cookie set to `'en'`, the server-rendered HTML says PT-BR but the client hydrates with EN, causing a mismatch.
**Why it happens:** Server and client disagree on initial state.
**How to avoid:** The page is `'use client'` -- it does not SSR content. The `typeof document !== 'undefined'` guard in the initializer handles this. Additionally, since the `(marketing)/layout.tsx` is a server component but its children are client components, the initial render happens on the client. The `suppressHydrationWarning` on the root `<html>` tag (already present) handles any residual mismatch.
**Warning signs:** Console warning about hydration mismatch, brief flash of wrong language text.

### Pitfall 3: LanguageProvider Placement

**What goes wrong:** Placing `LanguageProvider` in root layout means ALL routes (chat, settings, auth) get wrapped in it unnecessarily. Placing it in `page.tsx` means the layout metadata cannot be locale-aware.
**Why it happens:** Unclear where the provider boundary should be.
**How to avoid:** Place `LanguageProvider` in `(marketing)/layout.tsx`. This scopes it to marketing pages only. Root layout and app routes are unaffected. Metadata in the marketing layout can use static PT-BR defaults (dynamic locale-aware metadata is a v2 concern per REQUIREMENTS.md I18N-03).
**Warning signs:** `useLanguage` throwing "must be used within LanguageProvider" error on non-marketing pages.

### Pitfall 4: Barrel File Export Pollution

**What goes wrong:** Exporting everything from `features/landing/index.ts` including internal types and utilities, making the public API unclear.
**Why it happens:** Following the pattern blindly without considering what consumers actually need.
**How to avoid:** Only export components, hooks, and types that pages/layouts import directly. Internal utilities stay internal.
**Warning signs:** Other feature modules importing from `@/features/landing` internals.

### Pitfall 5: Translation Dictionary Incompleteness

**What goes wrong:** PT-BR dictionary is complete but EN dictionary is missing keys. TypeScript does not catch this if the type is only derived from `'pt-BR'`.
**Why it happens:** `as const` gives each locale its own inferred shape. If EN is missing a key, TypeScript may not complain depending on how types are structured.
**How to avoid:** Define a `TranslationKeys` type from `'pt-BR'` and explicitly type the `en` dictionary to satisfy that same type. Use `satisfies` operator: `en: { ... } satisfies TranslationKeys`.
**Warning signs:** Runtime `undefined` when accessing `t.section.key` in EN mode.

## Code Examples

### Marketing Layout (Complete)

```typescript
// src/app/(marketing)/layout.tsx
import type { Metadata } from 'next'
import { LanguageProvider } from '@/features/landing/hooks/useLanguage'

export const metadata: Metadata = {
  title: 'RunMind - Seu Coach de Corrida com IA',
  description: 'Treinamento de elite acessivel. Planilhas personalizadas, coach IA 24/7, sincronizacao com Strava e Garmin.',
}

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <LanguageProvider>
      {children}
    </LanguageProvider>
  )
}
```

Source: [CITED: .planning/research/ARCHITECTURE.md pattern]

### Translation Type Safety with `satisfies`

```typescript
// src/features/landing/i18n/types.ts
import type { translations } from './translations';

export type Locale = keyof typeof translations;
export type TranslationKeys = (typeof translations)['pt-BR'];
```

```typescript
// In translations.ts -- ensure EN matches PT-BR structure
import type { TranslationKeys } from './types';

const ptBR = { /* ... full dictionary ... */ } as const;
const en = { /* ... full dictionary ... */ } as const satisfies TranslationKeys;

export const translations = { 'pt-BR': ptBR, en } as const;
```

Source: [VERIFIED: TypeScript 4.9+ `satisfies` operator]

### Barrel File Export Pattern

```typescript
// src/features/landing/index.ts
// Components
export { SectionWrapper } from './components/ui/SectionWrapper';

// Hooks
export { LanguageProvider, useLanguage } from './hooks/useLanguage';

// Types
export type { Locale, TranslationKeys } from './i18n/types';
```

Source: [VERIFIED: existing barrel file pattern in src/features/chat/index.ts]

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| next-intl with middleware for all i18n | Cookie-based React context for simple toggles | 2024+ (community pattern) | Avoids middleware complexity for 2-language single-page use cases [CITED: .planning/research/ARCHITECTURE.md] |
| `framer-motion` package name | `motion` package name | 2024 (v11+) | Not relevant for Phase 1 (no animations), but noted for Phase 3+ [CITED: .planning/research/SUMMARY.md] |
| localStorage for client preferences | Cookie for SSR-compatible preferences | Next.js App Router adoption | Cookies readable on server during SSR, localStorage is client-only [ASSUMED] |

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Cookie parsing with `document.cookie.split('; ')` is sufficient (no library needed) | Architecture Patterns | LOW -- standard browser API, well-documented. Only risk is edge cases with cookie encoding, but locale values are simple ASCII strings. |
| A2 | QueryProvider overhead on landing page is negligible | Architecture Patterns | LOW -- QueryProvider only instantiates a QueryClient. No queries are made on the landing page. Worst case: a few KB of unused JS. |
| A3 | `suppressHydrationWarning` on root html tag covers any locale-based hydration mismatch | Common Pitfalls | MEDIUM -- if the mismatch extends beyond the html tag attributes to actual content, it may cause visible flicker. Mitigation: landing page is fully `'use client'`. |

## Open Questions

1. **What happens to the existing page.tsx content?**
   - What we know: The current `src/app/page.tsx` is a 955-line monolithic landing page with hardcoded PT-BR text, inline SVGs, and CSS animations. It serves `/`.
   - What's unclear: Should we preserve any of this content for reference during Phase 2 section development?
   - Recommendation: Delete `src/app/page.tsx` when creating `(marketing)/page.tsx`. The ARCHITECTURE.md already documents the section structure. Phase 2 will rebuild sections from scratch following the new component architecture. The old file can be referenced via git history if needed.

2. **Should Phase 1 populate the full translation dictionary with final copy, or use placeholder text?**
   - What we know: UI-SPEC says "Phase 1 populates the full dictionary structure with final PT-BR copy and EN copy." The copywriting contract in UI-SPEC provides some final copy (CTA, meta tags, language toggle labels).
   - What's unclear: Full copy for all sections (hero headline, feature descriptions, etc.) is not provided in the UI-SPEC for Phase 1 since those sections are Phase 2+.
   - Recommendation: Populate the dictionary structure with all namespace keys. Use final copy where available from UI-SPEC (meta, nav, CTA). Use descriptive placeholder strings for Phase 2+ sections (e.g., `"[Phase 2] Hero title"`) so the structure is complete and typed, but content is clearly marked as pending.

## Sources

### Primary (HIGH confidence)
- Existing codebase analysis: `src/app/layout.tsx`, `src/app/page.tsx`, `tailwind.config.ts`, `globals.css`, `package.json` -- verified current state
- `.planning/research/ARCHITECTURE.md` -- verified architecture patterns and i18n approach
- `.planning/phases/01-foundation/01-UI-SPEC.md` -- verified design contract (spacing, colors, typography, SectionWrapper spec)
- `.planning/research/SUMMARY.md` -- verified stack decisions and pitfall analysis

### Secondary (MEDIUM confidence)
- Next.js App Router route groups documentation -- confirmed route groups use parenthesized names with no URL prefix [CITED: nextjs.org/docs/app/building-your-application/routing]
- TypeScript `satisfies` operator -- confirmed available in TS 4.9+ (project uses ^5) [VERIFIED: TypeScript docs]

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- zero new dependencies, all patterns verified in existing codebase
- Architecture: HIGH -- route groups and feature modules are established Next.js/project patterns, thoroughly documented in research
- Pitfalls: HIGH -- route conflict is a known Next.js behavior, hydration mismatch patterns are well-documented, provider placement is architectural decision with clear guidance

**Research date:** 2026-04-22
**Valid until:** 2026-05-22 (stable -- no external dependencies or fast-moving libraries)
