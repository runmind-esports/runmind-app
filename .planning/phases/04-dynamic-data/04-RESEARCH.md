# Phase 4: Dynamic Data - Research

**Researched:** 2026-04-22
**Domain:** API data fetching, animated counters, locale-aware number formatting
**Confidence:** HIGH

## Summary

Phase 4 delivers a single new section (NumbersSection) that displays three "Big Numbers" -- Volume Total (km), Pace Medio (min/km), and Engajamento (%) -- fetched from the `runmidApiClient` with hardcoded fallback values. The counter animation uses `requestAnimationFrame` with easeOutCubic easing, triggered by the existing `useInView` hook from Phase 3. No new dependencies are required.

The technical surface is small and well-defined: one service function (`fetchLandingMetrics`), one custom hook (`useCountUp`), one UI primitive (`AnimatedCounter`), and one section component (`NumbersSection`). The existing infrastructure from Phases 2-3 (SectionWrapper, ScrollReveal, useInView, useLanguage, translations dictionary) provides all the scaffolding needed. The main risk is the unconfirmed API endpoint `/metrics/landing` -- but the UI-SPEC explicitly prescribes a "render fallback first, replace silently if API succeeds" pattern that eliminates this as a blocker.

**Primary recommendation:** Build the counter animation hook and service function first, then compose the NumbersSection. Zero new npm dependencies needed.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| PERF-01 | User sees Big Numbers (Volume Total, Pace Medio, Engajamento) fetched from API via runmidApiClient | Service function with axios GET + 5s timeout + null-on-failure pattern. Fallback values render immediately; API values replace silently. |
| PERF-02 | Numbers animate with counter effect when section scrolls into view | useCountUp hook using requestAnimationFrame + easeOutCubic, triggered by useInView's `isInView` boolean. prefers-reduced-motion skips animation. |
</phase_requirements>

## Standard Stack

### Core

No new packages. Phase 4 uses only what is already installed.

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| axios | ^1.13.6 (installed) | HTTP client for `runmidApiClient` | Already configured with base URL and interceptors [VERIFIED: package.json] |
| react | ^18 (installed) | Component rendering, hooks | Project standard [VERIFIED: package.json] |
| next | 14.2.21 (installed) | App Router, route groups | Project standard [VERIFIED: package.json] |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `Intl.NumberFormat` | Browser built-in | Locale-aware thousands separator | Volume metric formatting (125,000 vs 125.000) [VERIFIED: MDN, supported in all modern browsers] |
| `requestAnimationFrame` | Browser built-in | Smooth counter animation at 60fps | useCountUp hook drives number interpolation [VERIFIED: universal browser support] |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| requestAnimationFrame | Motion `animate()` | 30-50KB bundle cost for a single animation; UI-SPEC explicitly prohibits Motion dependency [VERIFIED: 04-UI-SPEC.md] |
| requestAnimationFrame | react-countup | Unnecessary dependency for a simple easing function; UI-SPEC prescribes custom hook [VERIFIED: 04-UI-SPEC.md] |
| Intl.NumberFormat | Manual string formatting | Intl handles locale edge cases (grouping separators, decimal points) correctly; no reason to hand-roll [ASSUMED] |

## Architecture Patterns

### Recommended File Structure

```
src/features/landing/
  components/
    sections/
      NumbersSection.tsx      # NEW - section component with inline NumberCard
    ui/
      AnimatedCounter.tsx      # NEW - animated number display primitive
  hooks/
    useCountUp.ts              # NEW - requestAnimationFrame counter hook
    useInView.ts               # EXISTS - reused for scroll trigger
  services/
    metricsApi.ts              # NEW - fetchLandingMetrics function
  i18n/
    translations.ts            # MODIFIED - replace [Phase 4] placeholders
  index.ts                     # MODIFIED - add new exports
```

### Pattern 1: Fallback-First Data Fetching

**What:** Render immediately with hardcoded fallback values. Fire API fetch in parallel. Replace values silently on success. Log warning on failure.
**When to use:** When API availability is uncertain and the UI must never show loading states or errors.
**Why this pattern:** The API endpoint `/metrics/landing` is not confirmed to exist. This pattern means the section works identically whether the API is up, down, or nonexistent. [VERIFIED: STATE.md blocker note + 04-UI-SPEC.md states section]

```typescript
// Source: 04-UI-SPEC.md "Data Fetching" section
const FALLBACK_METRICS: LandingMetrics = {
  volume: 125000,
  pace: 5.4,
  engagement: 94,
}

// In NumbersSection:
const [metrics, setMetrics] = useState<LandingMetrics>(FALLBACK_METRICS)

useEffect(() => {
  fetchLandingMetrics().then((data) => {
    if (data) setMetrics(data)
  })
}, [])
```

### Pattern 2: requestAnimationFrame Counter with Easing

**What:** Animate a number from 0 to target over a duration using `requestAnimationFrame` and an easing function.
**When to use:** Any animated number display where CSS transitions cannot apply (numbers are not CSS-animatable properties).
**Why this pattern:** Zero bundle cost, smooth 60fps animation, easy to respect prefers-reduced-motion. [VERIFIED: 04-UI-SPEC.md prescribes this exact approach]

```typescript
// useCountUp hook pattern
function useCountUp(target: number, options: { duration?: number; enabled?: boolean }) {
  const { duration = 2000, enabled = false } = options
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!enabled) return
    // Check prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCurrent(target)
      return
    }
    const start = performance.now()
    let rafId: number

    function tick(now: number) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // easeOutCubic
      setCurrent(eased * target)
      if (progress < 1) rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [target, duration, enabled])

  return current
}
```

### Pattern 3: Locale-Aware Number Formatting

**What:** Format numbers with correct separators for PT-BR (`.` for thousands) vs EN (`,` for thousands).
**When to use:** Any user-facing number display in a bilingual app.

```typescript
// Volume: locale-aware thousands separator
function formatVolume(n: number, locale: string): string {
  return new Intl.NumberFormat(locale).format(Math.round(n))
}
// formatVolume(125000, 'pt-BR') -> "125.000"
// formatVolume(125000, 'en')    -> "125,000"

// Pace: decimal minutes to M:SS format
function formatPace(decimal: number): string {
  const minutes = Math.floor(decimal)
  const seconds = Math.round((decimal - minutes) * 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}
// formatPace(5.4) -> "5:24"
```

### Pattern 4: runmidApiClient Without Auth for Public Endpoints

**What:** The `runmidApiClient` has auth token injection via interceptors, but it still works for unauthenticated requests -- it simply sends no Authorization header when there is no token in localStorage.
**When to use:** Public endpoints like `/metrics/landing` where the landing page visitor is not logged in.
**Why safe:** The interceptor checks `tokenStorage.getAccessToken()` and only adds the header if a token exists. No token = no header = request proceeds without auth. [VERIFIED: src/shared/lib/apiClient.ts lines 158-166]

**Important:** The response interceptor on `runmidApiClient` will redirect to `/login` on 401 if no refresh token exists. For a public endpoint that should never return 401, this is fine. But the `fetchLandingMetrics` function should catch all errors and return `null` before the interceptor can redirect. Use axios request-level config to set a timeout.

```typescript
// Service function pattern
export async function fetchLandingMetrics(): Promise<LandingMetrics | null> {
  try {
    const response = await runmidApiClient.get<LandingMetrics>(
      '/metrics/landing',
      { timeout: 5000 }
    )
    return response.data
  } catch {
    console.warn('Landing metrics API unavailable, using fallback values')
    return null
  }
}
```

### Anti-Patterns to Avoid

- **Loading spinner or skeleton for metrics:** UI-SPEC explicitly prohibits this. Fallback values render immediately. No visual loading state.
- **Re-animating counter on API response:** If counter already completed when API responds, snap to new value without re-animation. [VERIFIED: 04-UI-SPEC.md interaction contract]
- **Using React Query for this fetch:** Overkill for a single fire-and-forget fetch with no caching, refetching, or mutation needs. A simple `useEffect` + `fetch` is the prescribed pattern. [VERIFIED: 04-UI-SPEC.md]
- **Importing runmidApiClient directly in component:** Keep API calls in the services layer (`metricsApi.ts`) following existing feature module patterns. [VERIFIED: CLAUDE.md architecture section]

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Locale thousands separator | String manipulation with regex | `Intl.NumberFormat` | Handles edge cases for all locales correctly [ASSUMED] |
| IntersectionObserver wrapper | New observer setup | Existing `useInView` hook | Already built, tested, and proven in Phase 3 [VERIFIED: src/features/landing/hooks/useInView.ts] |
| Scroll-triggered fade-up | New CSS animation system | Existing `ScrollReveal` component | Established pattern from Phase 3 [VERIFIED: src/features/landing/components/ui/ScrollReveal.tsx] |

## Common Pitfalls

### Pitfall 1: runmidApiClient 401 Interceptor Redirects to /login

**What goes wrong:** If `/metrics/landing` returns 401 (unlikely but possible if endpoint requires auth), the interceptor redirects the visitor to `/login`, breaking the landing page experience.
**Why it happens:** The `runmidApiClient` response interceptor handles 401s by attempting token refresh, and if no refresh token exists, redirects to `/login`.
**How to avoid:** The `fetchLandingMetrics` function must catch ALL errors (including network errors and non-200 statuses) and return `null` before the response interceptor's async handler can trigger a redirect. The `try/catch` around the axios call ensures this.
**Warning signs:** Landing page visitors being unexpectedly redirected to `/login`.

### Pitfall 2: Counter Animation Flicker on Fast API Response

**What goes wrong:** If API responds before the section scrolls into view, the counter target changes. If the counter is mid-animation when target updates, numbers jump.
**Why it happens:** `useState` for metrics updates while `useCountUp` is tracking a different target.
**How to avoid:** The `useCountUp` hook should only read the target value once when `enabled` becomes true (when section enters viewport). Use a ref to capture the target at animation start time, not a reactive dependency.
**Warning signs:** Numbers jumping mid-animation.

### Pitfall 3: Pace Formatting During Counter Animation

**What goes wrong:** During counter animation, pace value interpolates through decimals (e.g., 2.7 -> "2:42"). The seconds portion can show values >= 60 if not clamped.
**Why it happens:** `formatPace(0.99)` would give `Math.floor(0.99)=0`, seconds=`Math.round(0.99*60)=59` which is fine. But `formatPace(4.999)` gives `Math.floor(4.999)=4`, `Math.round(0.999*60)=60` -> "4:60" which is wrong.
**How to avoid:** Clamp seconds to 59, or handle the edge case where `Math.round` produces 60 by incrementing minutes.
**Warning signs:** "X:60" appearing briefly during animation.

### Pitfall 4: Layout Shift When API Values Differ from Fallbacks

**What goes wrong:** If API returns a much larger number (e.g., 1,250,000 vs fallback 125,000), the card width/height changes, causing layout shift.
**How to avoid:** Number cards use fixed layout (grid with equal columns). The `text-[32px] md:text-[40px]` font size is constant regardless of digit count. Cards have `text-center` so wider numbers just take more space within the same card. The grid handles this natively.
**Warning signs:** Cards resizing when API data arrives.

### Pitfall 5: prefers-reduced-motion Not Checked in JS

**What goes wrong:** CSS-based scroll-reveal respects `prefers-reduced-motion` (already in globals.css), but the JS counter animation runs regardless, causing jarring number counting for users who disabled animations.
**Why it happens:** `requestAnimationFrame` is JS-only; CSS media query doesn't affect it.
**How to avoid:** Check `window.matchMedia('(prefers-reduced-motion: reduce)').matches` in the `useCountUp` hook. If true, skip animation and set final value immediately. [VERIFIED: 04-UI-SPEC.md accessibility section]
**Warning signs:** Numbers still counting for users with reduced motion preference.

## Code Examples

### fetchLandingMetrics Service Function

```typescript
// Source: 04-UI-SPEC.md API Contract
import { runmidApiClient } from '@/shared/lib/apiClient'

export interface LandingMetrics {
  volume: number
  pace: number
  engagement: number
}

export const FALLBACK_METRICS: LandingMetrics = {
  volume: 125000,
  pace: 5.4,
  engagement: 94,
}

export async function fetchLandingMetrics(): Promise<LandingMetrics | null> {
  try {
    const { data } = await runmidApiClient.get<LandingMetrics>(
      '/metrics/landing',
      { timeout: 5000 }
    )
    return data
  } catch {
    console.warn('Landing metrics API unavailable, using fallback values')
    return null
  }
}
```

### useCountUp Hook

```typescript
// Source: 04-UI-SPEC.md AnimatedCounter spec
import { useState, useEffect, useRef } from 'react'

interface UseCountUpOptions {
  duration?: number
  enabled?: boolean
}

export function useCountUp(target: number, options: UseCountUpOptions = {}) {
  const { duration = 2000, enabled = false } = options
  const [current, setCurrent] = useState(0)
  const targetRef = useRef(target)

  // Capture target when animation starts
  useEffect(() => {
    if (enabled) targetRef.current = target
  }, [enabled, target])

  useEffect(() => {
    if (!enabled) return

    // Respect prefers-reduced-motion
    if (typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCurrent(targetRef.current)
      return
    }

    const start = performance.now()
    const value = targetRef.current
    let rafId: number

    function tick(now: number) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // easeOutCubic
      setCurrent(eased * value)
      if (progress < 1) {
        rafId = requestAnimationFrame(tick)
      } else {
        setCurrent(value) // Ensure exact final value
      }
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [enabled, duration])

  return current
}
```

### Pace Formatter (handles edge case)

```typescript
export function formatPace(decimal: number): string {
  const minutes = Math.floor(decimal)
  let seconds = Math.round((decimal - minutes) * 60)
  if (seconds >= 60) {
    return `${minutes + 1}:00`
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}
```

### AnimatedCounter Component Shape

```typescript
// Source: 04-UI-SPEC.md Component Visual Specs
interface AnimatedCounterProps {
  value: number
  suffix?: string
  formatter?: (n: number) => string
  duration?: number
}

// Uses useInView to detect visibility, useCountUp to animate
// aria-live="polite" on the number element
// aria-label with full metric description
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| react-countup library | requestAnimationFrame hook | CSS-first animation trend 2024+ | Zero dependency, smaller bundle [ASSUMED] |
| Loading spinners for API data | Fallback-first rendering | UX best practice for unreliable APIs | No loading states, no layout shift |
| `toLocaleString()` | `Intl.NumberFormat` | Standardized, same underlying API | More explicit control over formatting options [VERIFIED: MDN docs] |

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `Intl.NumberFormat` handles PT-BR grouping separator correctly (`.` for thousands) | Architecture Patterns / Formatting | Low -- fallback is manual string replace; Intl is widely supported and tested |
| A2 | react-countup is unnecessary compared to a custom rAF hook | Alternatives Considered | Low -- UI-SPEC already mandates custom hook approach |

## Open Questions

1. **Does `/metrics/landing` endpoint exist on the backend?**
   - What we know: STATE.md flags this as unconfirmed. UI-SPEC acknowledges it may not exist.
   - What's unclear: Whether backend team has built or plans to build this endpoint.
   - Recommendation: Implement with fallback-first pattern. The section works identically without the API. No blocker.

2. **What response shape will the real API return?**
   - What we know: UI-SPEC defines `{ volume: number, pace: number, engagement: number }`.
   - What's unclear: Whether the real API uses different field names or nesting.
   - Recommendation: The service function can normalize any response shape. Start with the spec's interface and adjust later.

## Sources

### Primary (HIGH confidence)
- `04-UI-SPEC.md` - Complete visual, interaction, and API contract for this phase [VERIFIED: read in full]
- `src/shared/lib/apiClient.ts` - runmidApiClient configuration, interceptors, token handling [VERIFIED: read in full]
- `src/features/landing/hooks/useInView.ts` - Existing IntersectionObserver hook [VERIFIED: read in full]
- `src/features/landing/components/ui/ScrollReveal.tsx` - Existing scroll animation component [VERIFIED: read in full]
- `src/features/landing/i18n/translations.ts` - Current translation structure with Phase 4 placeholders [VERIFIED: read in full]
- `src/features/landing/hooks/useLanguage.tsx` - Language context providing `locale` and `t` [VERIFIED: read in full]
- `src/app/globals.css` - scroll-reveal CSS with prefers-reduced-motion [VERIFIED: grep]

### Secondary (MEDIUM confidence)
- MDN Intl.NumberFormat - locale-aware number formatting API
- MDN requestAnimationFrame - animation frame API

### Tertiary (LOW confidence)
- None

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - zero new dependencies, all verified in package.json and codebase
- Architecture: HIGH - UI-SPEC provides exhaustive component specs, data flow, and interaction contracts
- Pitfalls: HIGH - identified from direct code reading of runmidApiClient interceptors and animation edge cases

**Research date:** 2026-04-22
**Valid until:** 2026-05-22 (stable -- no moving parts, all browser built-ins)
