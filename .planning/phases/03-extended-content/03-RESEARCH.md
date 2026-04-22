# Phase 3: Extended Content - Research

**Researched:** 2026-04-22
**Domain:** CSS scroll animations, IntersectionObserver, React component composition, i18n dictionary expansion
**Confidence:** HIGH

## Summary

Phase 3 adds two new section components (FlowSection, GapSection), a scroll-reveal animation system using CSS transitions + IntersectionObserver, and hero entrance animations. No new npm dependencies are needed. The UI-SPEC is exceptionally detailed, specifying exact Tailwind classes, copy in both languages, animation durations, and accessibility requirements.

The primary technical work is: (1) a `useInView` custom hook wrapping IntersectionObserver, (2) a `ScrollReveal` wrapper component using CSS transitions triggered by a data attribute, (3) two section components following the established pattern (own their SectionWrapper, read from useLanguage context), (4) expansion of the translation dictionary to populate currently-empty `flow.steps` and `gap.stats` arrays, and (5) modifying HeroSection to wrap its children in ScrollReveal with staggered delays.

**Primary recommendation:** Build the animation infrastructure (useInView hook + ScrollReveal component + CSS) first, then build sections that consume it, then wire into the page orchestrator. This mirrors the Phase 2 pattern of primitives-first, sections-second.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| JRNY-01 | 5-step visual timeline: Login -> Onboarding -> Interface -> Planilha -> Perfil | FlowSection with TimelineStep components, all 5 steps defined in UI-SPEC with exact copy, icons, and metrics |
| JRNY-02 | Journey steps reveal progressively on scroll | ScrollReveal wrapper + useInView hook, staggered delays (0-400ms across 5 steps) per UI-SPEC interaction contract |
| JRNY-03 | Brazilian amateur runner metrics displayed in timeline | Inline metric badges on steps 3-5 (82% 5K-10K, 3.4x/semana, 43% before 8am) per UI-SPEC copy |
| SOCL-01 | "Gap da Solidao" section with solo runner stats | GapSection with 3 StatCards (30%, 44%, R$300+) + democratization callout per UI-SPEC |
| ONBR-01 | Onboarding captures data Strava doesn't provide | Step 2 description explicitly states "Dados que o Strava nao captura" + metric badge "Dados exclusivos RunMind" per UI-SPEC |
| HERO-03 | Hero entrance animations (fade/slide-in) | Wrap HeroSection children in ScrollReveal with 0/100/200/300ms stagger per UI-SPEC |
</phase_requirements>

## Standard Stack

### Core

No new dependencies. Everything uses the existing stack:

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React 18 | 18.x (installed) | Component framework | Already in project [VERIFIED: package.json] |
| Next.js 14 | 14.x (installed) | App framework | Already in project [VERIFIED: package.json] |
| Tailwind CSS | 3.4.x (installed) | Utility-first styling | Already in project [VERIFIED: package.json] |
| lucide-react | 0.312.0 (installed) | Icons (Link, UserCircle, MapPin, Calendar, TrendingUp) | Already in project, all 5 icons verified present [VERIFIED: npm ls + require check] |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| IntersectionObserver API | Native browser API | Scroll detection for reveal animations | useInView hook -- 97%+ browser support [CITED: caniuse.com/intersectionobserver] |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| CSS transitions + IO | Motion (framer-motion) | 30-50KB bundle cost, overkill for fade-up reveals. UI-SPEC explicitly chose CSS-first. |
| Custom useInView hook | react-intersection-observer | Extra dependency for trivial wrapper (~20 lines). Not justified. |

**Installation:**
```bash
# No new packages needed
```

## Architecture Patterns

### Project Structure (New Files)

```
src/features/landing/
  components/
    ui/
      TimelineStep.tsx       # NEW - individual timeline step
      StatCard.tsx            # NEW - stat display card
      ScrollReveal.tsx        # NEW - scroll-triggered animation wrapper
    sections/
      FlowSection.tsx         # NEW - 5-step user journey
      GapSection.tsx          # NEW - gap da solidao social proof
      HeroSection.tsx         # MODIFIED - add ScrollReveal wrappers
  hooks/
    useInView.ts              # NEW - IntersectionObserver hook
    useLanguage.tsx           # UNCHANGED
  i18n/
    translations.ts           # MODIFIED - populate flow.steps, gap.stats, gap.message
    types.ts                  # UNCHANGED (DeepWiden already handles readonly object arrays)
  index.ts                    # MODIFIED - add new exports
src/app/
  (marketing)/
    page.tsx                  # MODIFIED - replace placeholder SectionWrappers
  globals.css                 # MODIFIED - add scroll-reveal CSS classes
```

### Pattern 1: Section Component Pattern (Established in Phase 2)

**What:** Each section component owns its SectionWrapper, reads translations from context.
**When to use:** All new sections.
**Example:**
```typescript
// Source: Phase 2 established pattern (HeroSection.tsx, FeaturesSection.tsx)
'use client'
import { useLanguage } from '@/features/landing/hooks/useLanguage'
import { SectionWrapper } from '../ui/SectionWrapper'

export function FlowSection() {
  const { t } = useLanguage()
  return (
    <SectionWrapper id="flow" dark>
      {/* section content using t.flow.* */}
    </SectionWrapper>
  )
}
```

### Pattern 2: ScrollReveal with Data Attribute

**What:** CSS transition triggered by data attribute set via IntersectionObserver.
**When to use:** All scroll-reveal animations.
**Example:**
```typescript
// Source: UI-SPEC Phase 3 Component Visual Specs
'use client'
import { useInView } from '../../hooks/useInView'

interface ScrollRevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

export function ScrollReveal({ children, className, delay = 0 }: ScrollRevealProps) {
  const [ref, isInView] = useInView({ threshold: 0.15, once: true, rootMargin: '0px 0px -60px 0px' })
  return (
    <div
      ref={ref}
      className={`scroll-reveal ${className ?? ''}`}
      data-inview={isInView || undefined}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}
```

### Pattern 3: useInView Hook

**What:** Lightweight IntersectionObserver wrapper returning `[ref, isInView]` tuple.
**When to use:** ScrollReveal component (and potentially Phase 4 counter animations).
**Example:**
```typescript
// Source: Standard React IntersectionObserver pattern [ASSUMED]
import { useRef, useState, useEffect } from 'react'

interface UseInViewOptions {
  threshold?: number
  once?: boolean
  rootMargin?: string
}

export function useInView(options: UseInViewOptions = {}): [React.RefObject<HTMLDivElement | null>, boolean] {
  const { threshold = 0.15, once = true, rootMargin = '0px 0px -60px 0px' } = options
  const ref = useRef<HTMLDivElement | null>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          if (once) observer.unobserve(el)
        }
      },
      { threshold, rootMargin }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, once, rootMargin])

  return [ref, isInView]
}
```

### Pattern 4: Translation Dictionary Array Population

**What:** Expanding `as const` arrays from empty `[]` to populated objects.
**When to use:** `flow.steps` and `gap.stats` in translations.ts.
**Key constraint:** The `DeepStringify<T>` utility in translations.ts and `DeepWiden<T>` in types.ts already handle `readonly (infer U)[]` for populated arrays -- this was established when `profiles.items` was added in Phase 2. The `en` satisfies check will enforce structural match. [VERIFIED: types.ts and translations.ts code inspection]

### Anti-Patterns to Avoid

- **Double-wrapping with SectionWrapper:** Section components own their SectionWrapper. Do NOT wrap them again in the page orchestrator. [VERIFIED: Phase 2 decision in 02-02-SUMMARY.md]
- **Using `visibility: hidden` or `display: none` for initial animation state:** Use `opacity: 0` only so screen readers can still access content. [CITED: UI-SPEC Accessibility section]
- **Hardcoding copy in components:** All text must come from `t` (translation context). Zero hardcoded strings. [VERIFIED: Phase 2 pattern]
- **Setting `data-inview="false"`:** Use `data-inview={isInView || undefined}` so the attribute is absent (not "false") when not in view. CSS targets `[data-inview="true"]` specifically.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Scroll detection | Manual scroll event listeners + getBoundingClientRect | IntersectionObserver API via useInView hook | Scroll listeners cause jank, IO is async and performant [CITED: MDN IntersectionObserver docs] |
| Animation library | Install Motion/framer-motion for simple reveals | CSS transitions with data-attribute trigger | UI-SPEC mandates CSS-first, avoids 30-50KB bundle on Brazilian mobile 4G |
| Reduced motion handling | Custom media query JS detection | CSS `@media (prefers-reduced-motion: reduce)` | CSS-only approach is simpler and cannot be missed |

## Common Pitfalls

### Pitfall 1: Empty Array Type Mismatch in translations.ts

**What goes wrong:** Populating `flow.steps` in ptBR changes it from `readonly []` to `readonly {title:..., description:..., metric:...}[]`. If `en.flow.steps` doesn't match the exact same structure, `satisfies DeepStringify<typeof ptBR>` fails.
**Why it happens:** TypeScript literal types with `as const` are strict. Each step object must have identical keys.
**How to avoid:** Populate both `ptBR.flow.steps` and `en.flow.steps` with exactly 5 objects having identical keys (`title`, `description`, `metric`). Step 1 has no metric -- use empty string `''` (not undefined) for consistency.
**Warning signs:** TypeScript error on the `satisfies` line in translations.ts.

### Pitfall 2: ScrollReveal Triggering Immediately for Above-the-Fold Content

**What goes wrong:** Hero elements are already in the viewport on page load, so IntersectionObserver fires instantly with `isIntersecting: true`. This is actually the DESIRED behavior for hero animations (they should play immediately).
**Why it happens:** IO reports elements already in viewport as intersecting on observe.
**How to avoid:** This is correct behavior for hero. Ensure `once: true` so it doesn't re-trigger. The 0/100/200/300ms stagger delays create the sequential entrance effect.
**Warning signs:** All hero elements appearing simultaneously (missing stagger delays).

### Pitfall 3: CSS Transition Delay Not Applying on First Paint

**What goes wrong:** If `data-inview="true"` is set before the CSS class is applied (e.g., during SSR or hydration), the transition won't animate -- elements just appear.
**Why it happens:** CSS transitions only animate property changes, not initial states.
**How to avoid:** The `useInView` hook initializes `isInView` to `false` and only sets `true` after IntersectionObserver callback fires. Since this is client-side (`useEffect`), the initial render always has `opacity: 0` and transitions to `opacity: 1` on the next frame.
**Warning signs:** Elements visible without animation on first load.

### Pitfall 4: SectionWrapper Background Alternation

**What goes wrong:** Incorrect `dark` prop on new sections breaks the visual alternation pattern.
**Why it happens:** Easy to forget which sections are dark vs light.
**How to avoid:** Follow the UI-SPEC exactly: FlowSection and GapSection both get `dark` prop. The sequence is: Hero (light) -> Features (dark) -> Profiles (light) -> Flow (dark) -> Numbers (light) -> Gap (dark) -> CTA (light) -> Footer (dark).
**Warning signs:** Two adjacent sections with the same background color.

### Pitfall 5: Timeline Connector Line on Last Step

**What goes wrong:** Vertical connector line extends below the last step, creating visual noise.
**Why it happens:** Connector is `absolute left-5 top-10 bottom-0` on all steps.
**How to avoid:** TimelineStep accepts `isLast` prop -- when true, hide the connector. UI-SPEC specifies this explicitly.
**Warning signs:** Visual line extending past the last timeline step.

## Code Examples

### CSS for globals.css

```css
/* Source: UI-SPEC Animation CSS section */
.scroll-reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 700ms ease-out, transform 700ms ease-out;
}

.scroll-reveal[data-inview="true"] {
  opacity: 1;
  transform: translateY(0);
}

@media (prefers-reduced-motion: reduce) {
  .scroll-reveal {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
```

### TimelineStep Component Shape

```typescript
// Source: UI-SPEC Component Visual Specs
interface TimelineStepProps {
  step: number
  icon: LucideIcon
  title: string
  description: string
  metric?: string
  isLast?: boolean
}
```

### StatCard Component Shape

```typescript
// Source: UI-SPEC Component Visual Specs
interface StatCardProps {
  number: string
  label: string
}
```

### Translation Dictionary Structure for flow.steps

```typescript
// Source: UI-SPEC Copywriting Contract
flow: {
  title: 'Como Funciona',
  subtitle: 'Em poucos passos voce esta treinando com inteligencia',
  steps: [
    { title: 'Conecte com Strava', description: '...', metric: '' },
    { title: 'Complete seu Perfil', description: '...', metric: 'Dados exclusivos RunMind' },
    { title: 'Escolha sua Distancia', description: '...', metric: '82% focam 5K-10K' },
    { title: 'Receba seu Treino', description: '...', metric: '3.4x/semana | 9.2km/sessao' },
    { title: 'Acompanhe sua Evolucao', description: '...', metric: '43% treinam antes das 8h' },
  ] as const,
},
```

### Translation Dictionary Structure for gap

```typescript
// Source: UI-SPEC Copywriting Contract
gap: {
  title: 'O Gap da Corrida Solo',
  subtitle: 'Milhoes correm sozinhos no Brasil. O suporte tecnico de elite sempre foi exclusivo de poucos.',
  stats: [
    { number: '30%', label: 'correm completamente sozinhos' },
    { number: '44%', label: 'sentem-se despreparados tecnicamente' },
    { number: 'R$300+', label: 'custo mensal de um coach humano' },
  ] as const,
  message: 'RunMind democratiza o acesso ao suporte tecnico de elite. IA que entende corrida, acessivel para todos.',
},
```

### Page Orchestrator Update

```typescript
// Replace placeholder SectionWrappers with real components
import { FlowSection } from '@/features/landing/components/sections/FlowSection'
import { GapSection } from '@/features/landing/components/sections/GapSection'

// In render: replace <SectionWrapper id="flow" dark> with <FlowSection />
// In render: replace <SectionWrapper id="gap" dark> with <GapSection />
```

### HeroSection ScrollReveal Modification

```typescript
// Source: UI-SPEC Interaction Contract
// Wrap each hero element group in ScrollReveal with staggered delays:
<ScrollReveal delay={0}>
  <h1>...</h1>
</ScrollReveal>
<ScrollReveal delay={100}>
  <p>...</p>
</ScrollReveal>
<ScrollReveal delay={200}>
  <div className="flex flex-wrap gap-4 mt-6">...</div>
</ScrollReveal>
<ScrollReveal delay={300}>
  <AppMockup />
</ScrollReveal>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Scroll event listeners for reveals | IntersectionObserver API | Broadly supported since 2019 | No jank, async, battery-friendly |
| framer-motion for all animations | CSS transitions for simple reveals | Industry trend 2024+ | 30-50KB saved, native browser performance |
| AOS/WOW.js libraries | Custom useInView + CSS | jQuery-era libraries deprecated | Zero dependency, full control |

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | IntersectionObserver initializes `isIntersecting: true` for already-visible elements | Pitfall 2 | Hero animations might not play -- easy to test and fix |
| A2 | useInView hook pattern with useRef + useEffect + useState is the standard React approach | Architecture Patterns | Low risk -- well-established pattern, many community examples |
| A3 | `data-inview={isInView || undefined}` correctly removes attribute when false | Architecture Patterns | If wrong, CSS selector `[data-inview="true"]` still works correctly since `undefined` won't set the attribute |

## Open Questions

1. **Timeline semantic markup**
   - What we know: UI-SPEC says use `<ol>` + `<li>` for timeline steps
   - What's unclear: Whether the connector line (absolute positioned border) works cleanly with `<li>` elements or needs a wrapper `<div>` inside each `<li>`
   - Recommendation: Use `<li>` with `relative` positioning, connector as pseudo-element or absolutely positioned child div. Standard CSS pattern, test during implementation.

2. **gap.message key addition to type system**
   - What we know: Adding `gap.message` is a new string key not present in current ptBR object
   - What's unclear: Whether DeepStringify/DeepWiden handle this automatically
   - Recommendation: Since both ptBR and en will have the key, and `en satisfies DeepStringify<typeof ptBR>`, it will work. The type system infers from ptBR structure. No type changes needed.

## Project Constraints (from CLAUDE.md)

- Output mode: `standalone` (Docker deployment) -- no impact on Phase 3
- Feature-based organization: all code in `src/features/landing/`
- Barrel file exports through `index.ts`
- API clients use axios with JWT injection -- not relevant to Phase 3 (no API calls)
- Build commands: `npm run build` for verification, `npm run lint` for linting

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - no new dependencies, all tools verified present
- Architecture: HIGH - follows established Phase 2 patterns exactly, UI-SPEC provides pixel-level detail
- Pitfalls: HIGH - all pitfalls are well-understood CSS/React patterns with clear mitigations
- Copy/translations: HIGH - UI-SPEC provides exact bilingual copy for every element

**Research date:** 2026-04-22
**Valid until:** 2026-05-22 (stable -- no external dependencies or fast-moving libraries)

## Sources

### Primary (HIGH confidence)
- UI-SPEC (`03-UI-SPEC.md`) -- complete visual, copy, and interaction contract for Phase 3
- Phase 2 SUMMARY files -- established patterns for section components, translations, barrel exports
- Codebase inspection -- translations.ts, types.ts, HeroSection.tsx, page.tsx, globals.css, index.ts
- npm ls / require verification -- lucide-react 0.312.0 with all 5 required icons confirmed present

### Secondary (MEDIUM confidence)
- MDN IntersectionObserver documentation -- API behavior for already-visible elements
- caniuse.com -- IntersectionObserver 97%+ global support

### Tertiary (LOW confidence)
- None -- all findings verified against codebase or UI-SPEC
