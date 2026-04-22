# Technology Stack

**Project:** RunMind Landing Page
**Researched:** 2026-04-22

## Existing Stack (Do Not Change)

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 14.2.21 | Framework (App Router, standalone output) |
| React | ^18 | UI library |
| TypeScript | ^5 | Type safety |
| Tailwind CSS | ^3.4.1 | Utility-first styling |
| Radix UI | various | Headless UI primitives |
| Lucide React | ^0.312.0 | Icons |
| Axios | ^1.13.6 | HTTP client (runmidApiClient for Big Numbers) |
| React Query | ^5.90.21 | Server state (for API-driven metrics) |

## New Dependencies for Landing Page

### i18n: next-intl

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| next-intl | ^4.9 | Internationalization (PT-BR + EN) | Best-in-class for Next.js App Router. ~2KB bundle. Native Server Component support. TypeScript autocompletion for translation keys catches missing keys at compile time. `localePrefix: 'as-needed'` keeps `/` clean for PT-BR default while `/en` serves English. 30M+ monthly npm downloads. |

**Confidence:** HIGH (verified via official docs at next-intl.dev, npm registry, multiple sources)

**Setup approach:** Use `localePrefix: 'as-needed'` so PT-BR (default) has no prefix (`/`) and English uses `/en`. All landing page content lives in JSON message files (`messages/pt-BR.json`, `messages/en.json`). Middleware handles locale detection. Pages go under `[locale]` folder but existing routes remain unaffected.

### Scroll Animations: Motion (formerly Framer Motion)

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| motion | ^12.38 | Scroll-triggered animations, entrance effects, viewport detection | The successor to Framer Motion (rebranded mid-2025). Import from `motion/react`. 30M+ monthly npm downloads. Hybrid engine: JS + native browser APIs for 120fps GPU-accelerated animations. `whileInView` prop makes scroll-triggered reveals trivial. `useScroll` hook for parallax and progress-linked effects. Spring physics for natural-feeling transitions. |

**Confidence:** HIGH (verified via motion.dev official docs, npm registry)

**Key APIs for landing page:**
- `whileInView` -- fade/slide sections in as user scrolls (feature cards, steps, testimonials)
- `useScroll` + `useTransform` -- parallax effects on hero, progress indicators
- `AnimatePresence` -- language toggle transitions
- `motion.div` with `initial`, `animate`, `transition` -- hero entrance, CTA pulse

**Performance note:** Motion is lightweight for what it does, but apply `prefers-reduced-motion` media query respect. Use `viewport={{ once: true }}` on scroll animations so they fire once and don't re-trigger.

### Animated Counters: Custom with Motion (no extra dependency)

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| (use Motion) | -- | Big Numbers counter animation | Motion's `useMotionValue` + `useTransform` + `animate` can count up numbers with spring/tween physics. Avoids adding react-countup (~15KB) when Motion already provides the primitives. One fewer dependency. |

**Confidence:** MEDIUM (Motion docs confirm `animate()` function supports number interpolation; custom implementation needed but straightforward)

**Alternative if needed:** `react-countup` (^6.5) wraps CountUp.js and provides `enableScrollSpy` for viewport-triggered counting. Use only if Motion approach proves insufficient.

### No New UI Component Library

The existing stack (Radix UI + Tailwind + CVA + clsx + tailwind-merge) is sufficient for landing page components. Do NOT add shadcn/ui or any component library -- the landing page needs custom-designed sections, not generic components.

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| i18n | next-intl | react-i18next | react-i18next requires more boilerplate, no built-in Next.js routing, larger bundle. next-intl is purpose-built for Next.js App Router. |
| i18n | next-intl | next-translate | Less active maintenance, smaller community, fewer features (no type-safe keys). |
| i18n | next-intl | Intlayer | Newer/less proven, smaller ecosystem, unnecessary complexity for 2-locale setup. |
| Animation | Motion | GSAP | GSAP requires license for commercial SaaS, heavier bundle, imperative API less natural in React. Motion is declarative-first and free. |
| Animation | Motion | CSS-only (Tailwind) | Tailwind keyframes work for simple effects but scroll-triggered animations, staggered children, and spring physics require JS. Not worth fighting CSS for what Motion does in 1 line. |
| Animation | Motion | Lenis + GSAP ScrollTrigger | Overkill for a SaaS landing page. Lenis smooth-scroll changes native scroll behavior which hurts accessibility and mobile UX. Motion's `whileInView` covers 95% of needs. |
| Counters | Motion animate() | react-countup | Extra dependency for one feature. Motion already in the bundle. |
| Smooth scroll | None (native CSS) | Lenis | `scroll-behavior: smooth` in CSS handles anchor links. Lenis hijacks native scroll which causes accessibility issues and mobile jank. Do not use. |

## What NOT to Install

| Library | Why Not |
|---------|---------|
| `framer-motion` | Deprecated package name. Use `motion` instead (same library, new name). |
| `lenis` / `locomotive-scroll` | Hijacks native scroll. Accessibility nightmare. Mobile performance issues. Unnecessary for this use case. |
| `gsap` | Commercial license needed for SaaS. Imperative API. Overkill. |
| `react-countup` | Motion already provides number animation. Avoid extra dependency. |
| `aos` (Animate on Scroll) | Outdated, jQuery-era approach. Motion's `whileInView` is superior. |
| `react-intersection-observer` | Motion handles viewport detection internally via `whileInView`. |
| `next-i18next` | Built for Pages Router, not App Router. next-intl is the correct choice. |
| `tailwindcss-animate` | Already have Motion for animations. Adding CSS animation utilities creates two competing animation systems. |
| `swiper` / `embla-carousel` | Likely unnecessary. The 5-step flow can use CSS scroll-snap or Motion-animated cards. Only add if explicit carousel UX is validated. |

## Installation

```bash
# New dependencies for landing page
npm install next-intl motion

# That's it. Two packages.
```

## Configuration Required

### next-intl setup
1. Create `src/i18n/routing.ts` with locale config
2. Create `src/i18n/request.ts` for server-side message loading
3. Create `src/middleware.ts` (or extend existing) for locale detection
4. Create `messages/pt-BR.json` and `messages/en.json`
5. Wrap landing page layout with `NextIntlClientProvider`
6. Update `next.config.js` to include next-intl plugin (via `createNextIntlPlugin`)

### Motion setup
Zero config. Import and use: `import { motion } from 'motion/react'`

## Version Compatibility

| Package | Next.js 14 | React 18 | Tailwind 3.4 | Notes |
|---------|------------|----------|--------------|-------|
| next-intl ^4.9 | Yes | Yes | N/A | Supports Next.js 14-16 |
| motion ^12.38 | Yes | Yes | N/A | React 18+ required |

## Sources

- [next-intl official docs](https://next-intl.dev/docs/getting-started/app-router) -- App Router setup
- [next-intl routing config](https://next-intl.dev/docs/routing/configuration) -- localePrefix options
- [next-intl npm](https://www.npmjs.com/package/next-intl) -- v4.9.1, 9 days ago
- [Motion official site](https://motion.dev) -- docs and migration from framer-motion
- [Motion npm](https://www.npmjs.com/package/motion) -- v12.38.0
- [Motion React docs](https://motion.dev/docs/react) -- whileInView, useScroll APIs
