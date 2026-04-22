# Phase 2: Core Landing Page - Research

**Researched:** 2026-04-22
**Domain:** React component development (Next.js 14, Tailwind CSS, i18n)
**Confidence:** HIGH

## Summary

Phase 2 builds 5 section components (HeroSection, FeaturesSection, ProfilesSection, CTASection, FooterSection) and 5 UI primitives (CTAButton, FeatureCard, ProfileCard, AppMockup, IntegrationBadge) on top of the Phase 1 foundation (LanguageProvider, SectionWrapper, translation dictionary, marketing route group). All components are static/presentational -- no API calls, no animations, no complex state. The work is updating the translation dictionary with final copy, building the components using Tailwind classes from the UI-SPEC, and wiring them into the existing page orchestrator.

The primary technical challenge is the translation dictionary type system: the `profiles.items` and `footer.links` arrays are currently `readonly []` (empty tuples), so changing them to populated arrays requires updating the `DeepStringify` type utility in `translations.ts` and the `DeepWiden` type in `types.ts` to handle readonly object arrays, not just empty readonly arrays.

**Primary recommendation:** Build translation dictionary updates first (unblocks all components), then UI primitives (shared building blocks), then section components (compose primitives), then wire into page orchestrator. All Tailwind classes and copy are fully specified in the UI-SPEC -- this is a straightforward implementation phase.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| HERO-01 | Outcome-driven headline, subheadline, CTA to `/signup` | UI-SPEC Copywriting Contract (hero section), Layout Contract (HeroSection), CTAButton spec |
| HERO-02 | Stylized app mockup with Strava social login visible | UI-SPEC AppMockup spec (pure CSS/HTML, no images), Layout Contract (hidden on mobile) |
| FEAT-01 | 3 feature cards with icons (Chat IA, Planilhas, Sincronizacao) | UI-SPEC FeatureCard spec, Lucide icons (MessageCircle, Calendar, RefreshCw), grid layout |
| FEAT-02 | Strava and Garmin badges with "Parceiro Oficial" | UI-SPEC IntegrationBadge spec, brand SVGs exist at `/public/brand/` |
| FEAT-03 | 4 runner profile cards with Brazilian market stats | UI-SPEC ProfileCard spec, Copywriting Contract profiles section, profiles.items array population |
| CONV-01 | Bottom CTA "Comece seu treino de elite agora" to `/signup` | UI-SPEC CTASection layout, CTAButton primary variant |
| SOCL-02 | Footer with nav links, logo, tagline | UI-SPEC FooterSection layout, footer.links array population, link targets defined |
</phase_requirements>

## Project Constraints (from CLAUDE.md)

- **Framework:** Next.js 14, React 18, TypeScript, Tailwind CSS [VERIFIED: package.json]
- **Feature module pattern:** Code organized in `src/features/` with barrel file exports via `index.ts`
- **API layer:** Multiple axios clients in `src/shared/lib/apiClient.ts` (not needed for Phase 2 -- all static content)
- **Build verification:** `npm run build` must pass after changes
- **Deployment:** Cloud Run via `./scripts/deploy.sh`

## Standard Stack

### Core (already installed -- no new dependencies)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 14.2.21 | App framework, `Link` for navigation | Already installed [VERIFIED: package.json] |
| React | ^18 | Component library | Already installed [VERIFIED: package.json] |
| TypeScript | ^5 | Type safety | Already installed [VERIFIED: package.json] |
| Tailwind CSS | ^3.4.1 | Utility-first styling | Already installed [VERIFIED: package.json] |
| Lucide React | ^0.312.0 | Icon library (MessageCircle, Calendar, RefreshCw) | Already installed [VERIFIED: package.json] |
| next/image | (bundled) | Brand SVG rendering for IntegrationBadge | Part of Next.js, `unoptimized: true` in config [VERIFIED: next.config.js] |
| next/link | (bundled) | CTA navigation to `/signup`, `/login` | Part of Next.js |

### Alternatives Considered

None. Phase 2 requires zero new dependencies. All visual specs are achievable with Tailwind utility classes and existing libraries.

**Installation:** None needed.

## Architecture Patterns

### Project Structure

```
src/features/landing/
  components/
    sections/
      HeroSection.tsx        # NEW
      FeaturesSection.tsx     # NEW
      ProfilesSection.tsx     # NEW
      CTASection.tsx          # NEW
      FooterSection.tsx       # NEW
    ui/
      SectionWrapper.tsx      # EXISTS
      CTAButton.tsx           # NEW
      FeatureCard.tsx         # NEW
      ProfileCard.tsx         # NEW
      AppMockup.tsx           # NEW
      IntegrationBadge.tsx    # NEW
  hooks/
    useLanguage.tsx           # EXISTS
  i18n/
    types.ts                  # EXISTS (needs update)
    translations.ts           # EXISTS (needs update)
  index.ts                    # EXISTS (needs update)
```

### Pattern 1: Section Components Read from Language Context

**What:** Every section component calls `useLanguage()` to get the `t` translation object. No props needed -- sections are self-contained.
**When to use:** All 5 section components.
**Example:**
```typescript
// Source: Phase 1 established pattern (useLanguage.tsx)
'use client'
import { useLanguage } from '@/features/landing/hooks/useLanguage'
import { SectionWrapper } from '@/features/landing/components/ui/SectionWrapper'

export function HeroSection() {
  const { t } = useLanguage()
  return (
    <SectionWrapper id="hero">
      <h1 className="text-[40px] font-bold font-display leading-[1.1]">
        {t.hero.title}
      </h1>
      {/* ... */}
    </SectionWrapper>
  )
}
```
[VERIFIED: useLanguage.tsx pattern from Phase 1 codebase]

### Pattern 2: UI Primitives Accept Props (Not Context)

**What:** Reusable UI primitives (CTAButton, FeatureCard, ProfileCard, IntegrationBadge) receive data via props for reusability. Section components pass translated strings to them.
**When to use:** All 5 UI primitive components.
**Example:**
```typescript
// CTAButton receives href and variant via props
import Link from 'next/link'

interface CTAButtonProps {
  variant: 'primary' | 'secondary'
  href: string
  children: React.ReactNode
}

export function CTAButton({ variant, href, children }: CTAButtonProps) {
  const isExternal = href.startsWith('#')
  // For anchor links, use <a>; for routes, use <Link>
  // ...
}
```
[ASSUMED: standard React component pattern]

### Pattern 3: Page Orchestrator Replaces Placeholder Slots

**What:** The existing `(marketing)/page.tsx` has 8 SectionWrapper placeholder slots. Phase 2 replaces 5 of them (hero, features, profiles, cta-section, footer) with actual section components. The remaining 3 (flow, numbers, gap) stay as placeholders for Phase 3/4.
**Example:**
```typescript
// Current: <SectionWrapper id="hero">{/* Phase 2: HeroSection */}</SectionWrapper>
// After:   <HeroSection />
```
**Important:** Each section component wraps itself in SectionWrapper internally, so the page orchestrator imports section components directly, not wrapped in SectionWrapper.
[VERIFIED: current page.tsx structure]

### Anti-Patterns to Avoid

- **Prop-drilling translations:** Do NOT pass `t` as props through component trees. Each component calls `useLanguage()` directly or receives pre-translated strings via props. [VERIFIED: Phase 1 pattern]
- **Inline copy strings:** Do NOT write copy directly in JSX. All user-visible strings come from the translation dictionary. [VERIFIED: REQUIREMENTS INFRA-01]
- **Importing SectionWrapper in page.tsx AND in section components:** Section components OWN their SectionWrapper. The page orchestrator just renders `<HeroSection />`, not `<SectionWrapper id="hero"><HeroSection /></SectionWrapper>`. Avoids double-wrapping.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Navigation routing | Custom `<a>` tags with `window.location` | `next/link` `Link` component | Handles client-side navigation, prefetching [VERIFIED: Next.js standard] |
| Smooth scrolling to anchors | JavaScript scroll handlers | CSS `scroll-behavior: smooth` on `html` + anchor `href="#id"` | Zero JS, browser-native, accessible [ASSUMED] |
| Icon rendering | Custom SVG components | `lucide-react` named imports | Already in stack, tree-shakes unused icons [VERIFIED: package.json] |
| Brand logo rendering | Inline SVG markup | `next/image` with `/public/brand/*.svg` | Proper alt text, consistent sizing [VERIFIED: brand SVGs exist] |
| Conditional class merging | Template literal concatenation | `cn()` utility from `@/lib/utils` (clsx + tailwind-merge) | Already in codebase, handles merge conflicts [VERIFIED: SectionWrapper uses cn()] |

## Common Pitfalls

### Pitfall 1: Translation Type System Breaks on Array Population

**What goes wrong:** The `DeepStringify` and `DeepWiden` type utilities currently handle `readonly []` (empty tuple) as a special case. When `profiles.items` and `footer.links` change from empty arrays to populated arrays of objects, TypeScript will error because the type utilities don't know how to deeply widen object array elements.
**Why it happens:** Phase 1 intentionally used `[] as const` as placeholders. The type utilities short-circuit on `readonly []` without handling `readonly [{...}, ...]`.
**How to avoid:** Update `DeepStringify` in `translations.ts` and `DeepWiden` in `types.ts` to recursively handle `readonly` arrays of objects. The type should map over array element types, not just handle empty arrays.
**Warning signs:** TypeScript errors on `satisfies DeepStringify<typeof ptBR>` line in translations.ts after adding profile items.

### Pitfall 2: Missing `scroll-behavior: smooth` CSS

**What goes wrong:** The "Saiba Mais" secondary CTA in the hero and footer anchor links (`#features`, `#flow`, `#pricing`) will jump instantly instead of smooth-scrolling.
**Why it happens:** The UI-SPEC states smooth scroll is "already set in Phase 1" but it is NOT present in `globals.css`. [VERIFIED: grep found no `scroll-behavior` in any CSS file]
**How to avoid:** Add `scroll-behavior: smooth` to the `html` element in `globals.css` as part of Phase 2.
**Warning signs:** Clicking "Saiba Mais" causes jarring page jump.

### Pitfall 3: SectionWrapper Double-Wrapping

**What goes wrong:** Current page.tsx wraps each section in `<SectionWrapper>`. If section components also wrap in `<SectionWrapper>`, you get doubled padding and max-width constraints.
**Why it happens:** Unclear ownership of SectionWrapper between page orchestrator and section component.
**How to avoid:** Section components OWN their SectionWrapper. The page orchestrator's existing `<SectionWrapper>` elements are replaced entirely by section component imports. Phase 2 must modify page.tsx to remove the wrapping SectionWrappers.

### Pitfall 4: Anchor Links vs Next.js Link for Hash Navigation

**What goes wrong:** Using `next/link` `Link` component for `href="#features"` may cause unexpected behavior (full route re-render) in some Next.js versions.
**Why it happens:** `Link` is designed for route navigation, not in-page anchors.
**How to avoid:** For `href="#features"` style links, use a plain `<a>` tag. For `href="/signup"` style links, use `Link` from `next/link`. The CTAButton component should handle both cases based on whether `href` starts with `#`.
[ASSUMED: standard Next.js behavior -- verify during implementation]

### Pitfall 5: Dark Mode Context Not Set for Landing Page

**What goes wrong:** The landing page may render in light mode by default, not matching the UI-SPEC's dark theme specs.
**Why it happens:** The `darkMode: 'class'` config in tailwind.config.ts means the `.dark` class must be on a parent element. The marketing layout does not set this.
**How to avoid:** Verify which theme the landing page should default to. If dark, the marketing layout needs `<div className="dark">` wrapper or the `<html>` tag needs the class. The UI-SPEC provides both light and dark values, suggesting the landing page should support both via the existing theme toggle.
[VERIFIED: tailwind.config.ts uses `darkMode: 'class'`]

### Pitfall 6: IntegrationBadge Brand SVGs May Not Have Proper Viewbox

**What goes wrong:** Strava/Garmin SVGs rendered at 24px height may look distorted if the source SVG has unexpected viewBox or aspect ratio.
**Why it happens:** Downloaded brand assets may have arbitrary dimensions.
**How to avoid:** Test SVG rendering at the specified 24px height before committing. Use `next/image` with explicit `width` and `height` props to maintain aspect ratio.
[VERIFIED: SVG files exist at /public/brand/ -- content not inspected]

## Code Examples

### Translation Dictionary Array Structure

The key technical challenge: updating the type utilities to handle populated arrays.

```typescript
// translations.ts -- Updated DeepStringify to handle object arrays
type DeepStringify<T> = {
  [K in keyof T]: T[K] extends string
    ? string
    : T[K] extends readonly []
      ? readonly []
      : T[K] extends readonly (infer U)[]
        ? readonly DeepStringify<U>[]
        : DeepStringify<T[K]>
}

// profiles.items will look like:
profiles: {
  title: 'Qual e o Seu Perfil?',
  items: [
    { name: 'Corpo & Alma', emoji: '\u{1F3C3}', stat: '88% influenciam amigos a correr', description: '...' },
    // ... 3 more
  ] as const,
},
```
[ASSUMED: TypeScript generic inference for readonly arrays]

```typescript
// types.ts -- Updated DeepWiden to handle object arrays
type DeepWiden<T> = {
  readonly [K in keyof T]: T[K] extends string
    ? string
    : T[K] extends readonly []
      ? readonly []
      : T[K] extends readonly (infer U)[]
        ? readonly DeepWiden<U>[]
        : DeepWiden<T[K]>
}
```

### CTAButton with Anchor vs Route Detection

```typescript
// Source: UI-SPEC Component Visual Specs
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

  // Anchor links use <a>, route links use <Link>
  if (href.startsWith('#')) {
    return <a href={href} className={classes}>{children}</a>
  }

  return <Link href={href} className={classes}>{children}</Link>
}
```
[VERIFIED: classes match UI-SPEC CTAButton spec exactly]

### FeatureCard Structure

```typescript
// Source: UI-SPEC Component Visual Specs
import type { LucideIcon } from 'lucide-react'

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
}

export function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <div className="rounded-xl border border-border bg-background p-6 hover:border-accent/30 transition-colors duration-200">
      <div className="w-12 h-12 rounded-lg bg-accent-dim flex items-center justify-center">
        <Icon size={24} className="text-accent" aria-hidden="true" />
      </div>
      <h3 className="text-base font-bold font-display mt-4">{title}</h3>
      <p className="text-base text-foreground-muted leading-relaxed mt-2">{description}</p>
    </div>
  )
}
```
[VERIFIED: classes match UI-SPEC FeatureCard spec exactly]

### AppMockup Pure CSS Implementation

```typescript
// Source: UI-SPEC -- "pure CSS/HTML mockup, no images"
export function AppMockup() {
  return (
    <div className="rounded-2xl border border-border bg-background-secondary aspect-[4/3] p-6 flex flex-col justify-between">
      {/* Fake chat bubbles */}
      <div className="space-y-3">
        <div className="bg-background rounded-lg p-3 w-3/4 h-8" />
        <div className="bg-accent-dim rounded-lg p-3 w-2/3 h-8 ml-auto" />
        <div className="bg-background rounded-lg p-3 w-1/2 h-8" />
      </div>
      {/* Strava connect button silhouette */}
      <div className="flex justify-center">
        <div className="bg-[#FC4C02]/20 rounded-full px-6 py-2 flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-[#FC4C02]/40" />
          <div className="w-24 h-3 rounded bg-[#FC4C02]/30" />
        </div>
      </div>
    </div>
  )
}
```
[ASSUMED: creative implementation matching UI-SPEC description "simplified representation of chat interface with 2-3 fake message bubbles and a Strava connect button shape"]

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| CSS-in-JS (styled-components) | Utility-first (Tailwind CSS) | 2023+ | Faster builds, smaller bundles, already in project |
| `<img>` tags for SVGs | `next/image` with `unoptimized` | Next.js 13+ | Consistent API, alt text enforcement |
| Manual responsive classes | Tailwind responsive prefixes | Standard | `md:grid-cols-2 lg:grid-cols-3` pattern |

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `DeepStringify`/`DeepWiden` can be extended with `readonly (infer U)[]` branch to handle populated arrays | Code Examples | TypeScript compilation fails -- would need alternative type approach |
| A2 | `next/link` for hash anchors (`#features`) may cause re-render issues | Pitfall 4 | Minor UX issue -- fallback is always using `<a>` for anchors |
| A3 | AppMockup CSS-only implementation adequately communicates "chat app with Strava" | Code Examples | Might look too abstract -- can iterate on visual quality |
| A4 | Profile card emojis render consistently across browsers | Architecture | Emoji rendering varies by OS -- could use Lucide icons as fallback |

## Open Questions (RESOLVED)

1. **Dark mode default for landing page**
   - What we know: `tailwind.config.ts` uses `darkMode: 'class'`, globals.css defines both light and dark variables, UI-SPEC provides both themes
   - RESOLVED: Landing page uses SectionWrapper `dark` prop for alternating section backgrounds. Follows system/app theme preference via existing ThemeProvider in root layout.

2. **Profile card emojis**
   - What we know: UI-SPEC says "emoji/avatar: 48px circle, centered at top" but `ProfileCard` prop is `emoji: string`
   - RESOLVED: Emojis defined in plans as runner-themed: runner, lotus, trophy, wind.

3. **Footer "Precos"/"Pricing" link target**
   - What we know: UI-SPEC specifies `#pricing` as the anchor target
   - RESOLVED: Link included as `#pricing` — no-op until pricing section is built in a future phase. Low risk.

## Environment Availability

Step 2.6: SKIPPED (no external dependencies identified -- Phase 2 is purely code/UI component work using existing installed packages)

## Sources

### Primary (HIGH confidence)
- `02-UI-SPEC.md` -- complete visual specs, copy, layout contracts, component inventory
- `src/features/landing/i18n/translations.ts` -- current translation dictionary structure
- `src/features/landing/i18n/types.ts` -- current type system for translations
- `src/app/(marketing)/page.tsx` -- current page orchestrator with placeholder slots
- `src/features/landing/components/ui/SectionWrapper.tsx` -- existing layout primitive
- `src/app/globals.css` -- CSS variables, confirmed no `scroll-behavior: smooth`
- `tailwind.config.ts` -- theme configuration, confirmed all needed colors/fonts defined
- `package.json` -- dependency versions verified
- `/public/brand/` -- brand SVG assets confirmed present

### Secondary (MEDIUM confidence)
- Phase 1 summaries (01-01-SUMMARY.md, 01-02-SUMMARY.md) -- patterns established

### Tertiary (LOW confidence)
- None

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - zero new dependencies, all verified in package.json
- Architecture: HIGH - extends Phase 1 patterns exactly, UI-SPEC fully specifies all components
- Pitfalls: HIGH - verified by inspecting actual codebase (missing scroll-behavior, type system limitations, SectionWrapper ownership)

**Research date:** 2026-04-22
**Valid until:** 2026-05-22 (stable -- no moving targets, all static UI)
