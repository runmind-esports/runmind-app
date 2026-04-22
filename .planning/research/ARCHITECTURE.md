# Architecture Patterns

**Domain:** SaaS Landing Page in Existing Next.js 14 App Router Application
**Researched:** 2026-04-22

## Current State Analysis

The existing `src/app/page.tsx` is a 955-line monolithic `'use client'` component containing the entire landing page: hero, features, user flow, pricing, footer, inline SVG icons, and CSS animations. All text is hardcoded in Portuguese. There is no middleware, no i18n setup, and no route groups separating marketing pages from app pages.

The app uses feature-based organization (`src/features/{auth,chat,strava,settings}`) with barrel exports, shared UI primitives in `src/components/ui/`, and providers (Theme, Query) at the root layout. Tailwind CSS with custom design tokens (accent green `#00F048`, dark theme) drives the visual identity.

## Recommended Architecture

### High-Level Structure

```
src/
  app/
    (marketing)/           # Route group -- no URL prefix, isolates landing layout
      layout.tsx           # Marketing layout (no QueryProvider, no sidebar)
      page.tsx             # Landing page -- thin orchestrator, imports sections
    (auth)/                # EXISTING -- login, signup, etc.
    chat/                  # EXISTING -- app interface
    settings/              # EXISTING
    layout.tsx             # Root layout (html, body, ThemeProvider only)
  features/
    landing/               # New feature module
      components/
        sections/
          HeroSection.tsx
          FeaturesSection.tsx
          UserFlowSection.tsx
          BigNumbersSection.tsx
          PricingSection.tsx
          TestimonialsSection.tsx
          FooterSection.tsx
        ui/
          CTAButton.tsx
          SectionWrapper.tsx
          LanguageToggle.tsx
          AppMockup.tsx
          PricingCard.tsx
          FeatureCard.tsx
          StepCard.tsx
          TestimonialCard.tsx
        icons/
          RunmindLogo.tsx
          ArrowIcon.tsx
          CheckIcon.tsx
          XIcon.tsx
          PlayIcon.tsx
      hooks/
        useLanguage.ts     # Language state (React context + cookie)
        useBigNumbers.ts   # Fetches performance stats from API
      i18n/
        translations.ts    # Single file with pt-BR and en dictionaries
        types.ts           # TypeScript types for translation keys
      index.ts             # Barrel export
  shared/
    lib/
      apiClient.ts         # Existing -- runmidApiClient used for Big Numbers
```

### Why This Structure

**Route group `(marketing)/`** separates the landing page layout from the app layout. The marketing layout does NOT need QueryProvider or auth state -- it is a lightweight shell optimized for fast first paint. The parentheses ensure no URL prefix: the landing page stays at `/`.

**Feature module `landing/`** follows the existing codebase convention. All landing-page-specific code lives in one place, exported through a barrel file, exactly like `auth/`, `chat/`, etc.

**No `next-intl` or i18n library.** For two languages on a single page (toggle, not URL-based routing), a library is overkill. A simple dictionary object with a React context is sufficient and avoids middleware complexity, `[locale]` dynamic segments, and the SSG complications that come with next-intl's routing layer. The PROJECT.md specifies the landing page lives at `/` with a language toggle -- not locale-prefixed URLs.

### Component Boundaries

| Component | Responsibility | Communicates With |
|-----------|---------------|-------------------|
| `(marketing)/layout.tsx` | Slim layout for marketing pages: ThemeProvider only, no auth/query providers | Root layout (inherits html/body) |
| `(marketing)/page.tsx` | Orchestrates sections, wraps in LanguageProvider | Imports all sections from `features/landing` |
| `HeroSection` | Above-the-fold: headline, subheadline, CTA buttons, app mockup | LanguageContext (reads translations), links to `/signup` |
| `FeaturesSection` | 3-column grid: Chat IA 24/7, Dynamic Plans, Smart Sync | LanguageContext |
| `UserFlowSection` | 5-step timeline/carousel showing user journey | LanguageContext |
| `BigNumbersSection` | Performance stats fetched from API | `runmidApiClient` via `useBigNumbers` hook, LanguageContext |
| `PricingSection` | Free vs Premium comparison cards with CTAs | LanguageContext, links to `/signup` |
| `TestimonialsSection` | Social proof cards with user photos/quotes | LanguageContext |
| `FooterSection` | Links, badges (Strava/Garmin Connected), copyright | LanguageContext |
| `LanguageToggle` | PT/EN toggle button, persists choice to cookie | LanguageContext (writes) |
| `useLanguage` | React context providing current locale + setter + translation accessor | Cookie storage (not localStorage -- avoids SSR hydration issues) |
| `useBigNumbers` | Fetches aggregate stats from runmid API, returns formatted numbers | `runmidApiClient` |
| `translations.ts` | Static dictionary `{ 'pt-BR': {...}, 'en': {...} }` | Imported by all sections via context |

### Data Flow

```
                    Cookie (locale preference)
                           |
                           v
(marketing)/page.tsx  -->  LanguageProvider (context)
    |                          |
    |--- HeroSection           |--- reads t.hero.title
    |--- FeaturesSection       |--- reads t.features.chat
    |--- UserFlowSection       |--- reads t.flow.step1
    |--- BigNumbersSection     |--- reads t.numbers.volume
    |       |                        + calls useBigNumbers()
    |       v                              |
    |   runmidApiClient.get('/stats')      v
    |       |                        API response: { totalKm, avgPace, ... }
    |--- PricingSection        |--- reads t.pricing.free
    |--- TestimonialsSection   |--- reads t.testimonials.user1
    |--- FooterSection         |--- reads t.footer.rights
    |
    LanguageToggle (in hero or nav bar)
        |
        v
    setLocale('en') --> updates context + sets cookie
```

**Key data flow rules:**

1. **Translation data flows down** from LanguageProvider through React context. No prop drilling -- every section reads from context via `useLanguage()`.
2. **API data is isolated** to BigNumbersSection. Only one section makes network requests. All other sections are purely static content.
3. **Navigation links are outbound only.** Landing page links to `/signup`, `/login`, `/chat`. It does not import or depend on any existing feature module (auth, chat, etc.).
4. **Cookie is the persistence layer** for language choice. Not localStorage (avoids SSR hydration mismatch). Not URL segments (avoids routing complexity for existing routes).

### Rendering Strategy

The page will be a `'use client'` component tree (same as current), but the architectural improvement is decomposition into focused, testable section components.

**Client-side hydration handles two concerns:**

1. **Language toggle** -- switching translations is a client-side state change, no server round-trip needed.
2. **Big Numbers** -- fetched client-side via `useBigNumbers()` hook after hydration. Display skeleton/placeholder during load.

**Future optimization path:** If/when Big Numbers data becomes cacheable, it can be fetched server-side via a Server Component wrapper with ISR (`revalidate: 3600`), and sections without animations can become Server Components. This is a Phase 2+ concern.

### i18n Architecture (Without Library)

```typescript
// src/features/landing/i18n/translations.ts

export const translations = {
  'pt-BR': {
    hero: {
      title: 'Seu coach de corrida com IA',
      subtitle: 'Treinos personalizados...',
      cta: 'Comece Gratis',
    },
    features: {
      title: 'Funcionalidades',
      chat: { title: 'Chat IA 24/7', description: '...' },
      plans: { title: 'Planilhas Dinamicas', description: '...' },
      sync: { title: 'Sincronizacao Inteligente', description: '...' },
    },
    // ... all sections
  },
  en: {
    hero: {
      title: 'Your AI running coach',
      subtitle: 'Personalized training...',
      cta: 'Start Free',
    },
    features: {
      title: 'Features',
      chat: { title: '24/7 AI Chat', description: '...' },
      plans: { title: 'Dynamic Plans', description: '...' },
      sync: { title: 'Smart Sync', description: '...' },
    },
    // ... all sections
  },
} as const;

export type Locale = keyof typeof translations;
export type TranslationKeys = typeof translations['pt-BR'];
```

```typescript
// src/features/landing/hooks/useLanguage.ts

'use client'
import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { translations, Locale, TranslationKeys } from '../i18n/translations';

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

**Why not next-intl:** The project needs a language toggle on a single page, not locale-based URL routing. next-intl requires a `[locale]` dynamic segment, middleware configuration, and `setRequestLocale` calls in every layout/page. This is disproportionate for a bilingual landing page with a toggle. If RunMind later needs full app localization (chat UI in multiple languages), next-intl is the right upgrade path.

**Why not URL-based locales (`/en`, `/pt-BR`):** The PROJECT.md specifies the landing page at `/`. Adding locale prefixes would mean `/en` and `/pt-BR` routes, complicating the existing routing structure and SEO (canonical URLs, hreflang tags). A cookie-based toggle keeps the URL clean.

## Patterns to Follow

### Pattern 1: Section Component Convention

**What:** Each landing page section is a self-contained component that receives no props (reads from context).
**When:** All landing page sections.
**Why:** Eliminates prop drilling, makes sections independently testable, enables reordering without code changes.

```typescript
'use client'
import { useLanguage } from '../hooks/useLanguage';
import { SectionWrapper } from '../ui/SectionWrapper';

export function HeroSection() {
  const { t } = useLanguage();
  return (
    <SectionWrapper id="hero">
      <h1>{t.hero.title}</h1>
      {/* ... */}
    </SectionWrapper>
  );
}
```

### Pattern 2: SectionWrapper for Consistent Spacing

**What:** A shared wrapper that provides consistent padding, max-width, scroll-anchor IDs, and alternating background support.
**When:** Every landing page section.

```typescript
export function SectionWrapper({
  id,
  children,
  className,
  dark = false,
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
}) {
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

### Pattern 3: Isolated API Section with Graceful Degradation

**What:** Only BigNumbersSection makes API calls. All other sections are pure render.
**When:** Any section needing dynamic data.
**Why:** If the API is down, only one section degrades (shows fallback hardcoded values). Does not block page render.

```typescript
'use client';
import { useState, useEffect } from 'react';
import { runmidApiClient } from '@/shared/lib/apiClient';

export function useBigNumbers() {
  const [data, setData] = useState<BigNumbers | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    runmidApiClient.get('/metrics/landing')
      .then(r => setData(r.data))
      .catch(() => setData(FALLBACK_NUMBERS))  // graceful degradation
      .finally(() => setLoading(false));
  }, []);

  return { data: data ?? FALLBACK_NUMBERS, loading };
}

const FALLBACK_NUMBERS = { totalKm: 150000, avgPace: '5:30', engagement: 95 };
```

### Pattern 4: Translation Key Namespacing

**What:** Namespace translations by section for maintainability.
**When:** All translation content.

```typescript
// translations.ts structure:
{
  hero: { title, subtitle, cta, ctaSecondary },
  features: { title, chat: { title, description }, plans: {...}, sync: {...} },
  flow: { title, step1: { title, description }, ... },
  numbers: { title, volume, pace, engagement },
  pricing: { title, free: { title, price, features }, premium: {...} },
  testimonials: { title, items: [...] },
  footer: { product: [...], support: [...], rights },
  common: { languageToggle },
}
```

## Anti-Patterns to Avoid

### Anti-Pattern 1: Monolithic Page Component

**What:** Keeping all 955 lines in a single `page.tsx`.
**Why bad:** Untestable, unreviewable, impossible to parallelize development. Adding i18n to a monolith multiplies the complexity.
**Instead:** Break into section components within `features/landing/components/sections/`.

### Anti-Pattern 2: Importing App Features into Landing Page

**What:** Importing components from `features/auth` or `features/chat` into the landing page.
**Why bad:** Creates coupling between marketing page and app internals. Changes to chat components could break the landing page. Landing page should load fast without pulling in app code (axios interceptors, React Query, etc.).
**Instead:** Landing page has its own components. Mockups of the app are self-contained placeholders/screenshots, not live components.

### Anti-Pattern 3: Using next-intl for Two Languages on One Page

**What:** Installing next-intl, configuring middleware, adding `[locale]` dynamic segments.
**Why bad:** Massive architectural change for a simple toggle. Forces all existing routes into locale segments or requires complex routing configuration to exclude them. Middleware adds processing to every request. Overkill for 2 languages on 1 page.
**Instead:** Simple React context + dictionary object. Upgrade to next-intl only if full app localization across all routes is needed later.

### Anti-Pattern 4: Hardcoded Strings in Components

**What:** Writing PT-BR text directly in JSX.
**Why bad:** Makes the EN translation require touching every component file.
**Instead:** All user-facing text goes through `useLanguage().t` from day one. Even if you build PT-BR first, use the translation system from the start.

## Suggested Build Order

Dependencies between components dictate the build sequence:

### Phase 1: Foundation (build first -- everything depends on these)

1. **Translation dictionary** (`i18n/translations.ts`) -- all sections depend on this
2. **LanguageProvider + useLanguage hook** -- all sections consume this context
3. **SectionWrapper** -- all sections use this for consistent layout
4. **Icon components** -- extracted from current monolith, reused across sections
5. **Route group `(marketing)/layout.tsx`** -- the shell that hosts the page
6. **Page orchestrator `(marketing)/page.tsx`** -- imports and composes all sections

### Phase 2: Static Sections (no dependencies between them -- parallelizable)

7. **HeroSection** -- headline, CTA, mockup placeholder
8. **FeaturesSection** -- 3-column feature cards
9. **UserFlowSection** -- 5-step timeline
10. **PricingSection** -- Free vs Premium cards
11. **TestimonialsSection** -- social proof cards
12. **FooterSection** -- links, badges, copyright

### Phase 3: Dynamic Section (depends on API client)

13. **useBigNumbers hook** -- fetches from runmidApiClient with fallback
14. **BigNumbersSection** -- displays stats with loading skeleton

### Phase 4: Polish

15. **LanguageToggle** -- UI toggle component for switching PT-BR/EN
16. **Responsive refinements** -- mobile-first adjustments per section
17. **Scroll animations** -- intersection observer or CSS-based reveals

**Rationale:** Foundation must come first because every section depends on the translation system and layout primitives. Static sections have zero dependencies on each other and can be developed in any order. The API-dependent section is isolated later because it requires backend coordination and has a graceful fallback. Polish comes last because the page functions without animations or the toggle (defaults to PT-BR).

## Root Layout Consideration

The current root layout wraps everything in `QueryProvider`. The landing page does not need React Query (BigNumbersSection uses axios directly with a simple `useEffect`).

**Recommendation: Keep QueryProvider in root for now (Option B).**

Moving QueryProvider out of root layout into per-route-group layouts is the cleaner architecture, but it requires touching existing layouts that work fine today. Accept the minor overhead of React Query context on the landing page. Optimize later if performance profiling shows it matters.

If a future optimization pass happens:
- Root layout: only `ThemeProvider`
- `(marketing)/layout.tsx`: no additional providers
- New `(app)/layout.tsx`: wraps with `QueryProvider` for chat/settings routes

## Scalability Considerations

| Concern | Now (landing page) | Later (full app i18n) | Migration Path |
|---------|--------------------|-----------------------|----------------|
| Languages | 2 (PT-BR, EN) via toggle | 5+ via URL routing | Replace context with next-intl, add `[locale]` segment |
| Pages | 1 landing page | Landing + Blog + Docs | Add pages to `(marketing)` route group |
| API data | 1 endpoint (stats) | Multiple endpoints | Add hooks in `features/landing/hooks/` |
| SEO | Basic meta tags | hreflang, structured data per locale | Requires URL-based locales (next-intl migration) |
| Performance | Client toggle, client fetch | SSG per locale, ISR for stats | next-intl `generateStaticParams` + ISR revalidate |

## Sources

- [Next.js App Router Routing: Pages and Layouts](https://nextjs.org/docs/app/building-your-application/routing)
- [next-intl Routing Configuration](https://next-intl.dev/docs/routing/configuration) -- reviewed and intentionally deferred
- [next-intl without middleware discussion](https://github.com/amannn/next-intl/discussions/975)
- [Next.js i18n guide (Locize)](https://www.locize.com/blog/next-app-dir-i18n/)
- [Next.js at Scale: SSG, ISR, RSC & Serverless](https://aiappbuilder.com/mt/insights/nextjs-at-scale-ssg-isr-rsc-serverless-architecture)
- [Next.js Best Practices 2025](https://www.raftlabs.com/blog/building-with-next-js-best-practices-and-benefits-for-performance-first-teams/)
- [App Router Directory Design Patterns](https://dev.to/pipipi-dev/app-router-directory-design-nextjs-project-structure-patterns-31eo)
