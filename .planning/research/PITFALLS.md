# Domain Pitfalls

**Domain:** SaaS landing page with i18n (bilingual PT-BR/EN) for existing Next.js 14 app
**Researched:** 2026-04-22

## Critical Pitfalls

Mistakes that cause rewrites, major regressions in the existing app, or fundamental conversion failures.

### Pitfall 1: i18n Middleware Collides with Existing Auth Flow

**What goes wrong:** next-intl requires a `middleware.ts` at the project root to handle locale detection and URL rewriting. RunMind currently has NO middleware, but the auth flow relies on client-side token storage and axios interceptors. Adding i18n middleware that rewrites all routes (e.g., `/login` becomes `/pt-BR/login`) will break every existing route -- auth, chat, settings, Strava callback -- unless explicitly excluded.

**Why it happens:** next-intl middleware applies to all routes by default. Developers add it, see the landing page work, and only discover days later that `/auth/strava/callback` is silently broken because Strava redirects to the un-prefixed URL.

**Consequences:** All existing app routes break. Strava OAuth callback fails silently. Users cannot log in.

**Prevention:**
- Scope i18n ONLY to the landing page route (`/`). Use next-intl's `pathnames` and `matcher` config to exclude `/(auth)`, `/chat`, `/settings`, `/auth/strava/*`.
- Alternatively, avoid URL-prefix-based i18n entirely: use cookie/header-based locale detection and serve the landing page at `/` without locale segments. This is simpler for a 2-locale site.
- Test every existing route after adding middleware. Strava callback is the most fragile.

**Detection:** After adding middleware, manually test: login, signup, Strava connect, chat navigation, settings page. Automated smoke tests on all existing routes.

**Phase:** Must be addressed in the very first phase (i18n setup), before any UI work begins.

---

### Pitfall 2: Root Layout `lang` Attribute Hardcoded to `pt-BR`

**What goes wrong:** The current `src/app/layout.tsx` hardcodes `<html lang="pt-BR">`. With i18n, the `lang` attribute must be dynamic based on the user's selected locale. If left hardcoded, English-language pages will have `lang="pt-BR"`, which harms SEO, screen reader behavior, and browser translation prompts.

**Why it happens:** The root layout is shared across the entire app. Developers add i18n to the landing page but forget to make the root layout locale-aware, or avoid touching it for fear of breaking existing pages.

**Consequences:** SEO penalty for language mismatch. Google may not properly index the English version. Accessibility issues for screen reader users.

**Prevention:**
- If using a `[locale]` route segment: restructure to `src/app/[locale]/layout.tsx` for i18n routes, keeping a separate layout for non-i18n routes.
- If using cookie-based locale: read the locale in the root layout server component and set `lang` dynamically. Since existing pages are all PT-BR, the default remains correct -- but the landing page must pass the correct locale.
- Simplest safe approach: create a dedicated layout for the landing page route group that sets `lang` dynamically, leaving the root layout untouched for existing routes.

**Detection:** View page source on the English version -- check if `<html lang="en">` is present.

**Phase:** Must be addressed during i18n architecture setup (Phase 1).

---

### Pitfall 3: Animation Library Bloats Bundle and Tanks Mobile Performance

**What goes wrong:** Adding Framer Motion (30-50KB gzipped) or GSAP for scroll animations on the landing page significantly increases the JavaScript bundle. On Brazilian mobile networks (often 3G/4G with high latency), this delays Time to Interactive and causes the landing page to feel sluggish -- exactly the opposite of the "fast-loading" constraint in PROJECT.md.

**Why it happens:** Developers import the full `motion` component from Framer Motion by default. Landing pages tend to accumulate scroll-triggered animations that each add weight. The animations look great on a MacBook but choke on a Moto G on Claro 4G.

**Consequences:** LCP and TTI degrade on mobile. Brazilian users (the primary market) bounce before seeing the CTA. Google penalizes Core Web Vitals.

**Prevention:**
- Use CSS animations and `@keyframes` for simple fade-in and slide-up effects. CSS animations are zero-JS-cost.
- If Framer Motion is needed, use `LazyMotion` with the `m` component (reduces initial cost from ~34KB to ~4.6KB).
- Only animate GPU-composited properties: `opacity`, `transform` (translate, scale, rotate). Never animate `width`, `height`, `top`, `left`.
- Use `IntersectionObserver` for scroll-triggered reveals instead of scroll event listeners.
- Test on a throttled connection (Chrome DevTools: Slow 3G) with a mid-range Android device.

**Detection:** Lighthouse performance score below 90 on mobile. Bundle analyzer showing animation library as a top chunk.

**Phase:** Architecture decision in Phase 1, enforced during animation implementation phase.

---

### Pitfall 4: API-Driven "Big Numbers" Section Causes Layout Shift or Stale Display

**What goes wrong:** The Performance section fetches real data (Volume Total, Pace Medio, Engajamento) from `runmidApiClient`. If rendered client-side, the numbers pop in after the page loads, causing visible layout shift (CLS). If the API is slow or down, the section shows empty space or spinners -- undermining the credibility the numbers are supposed to build.

**Why it happens:** Developers treat the numbers section like any other data-fetching component. But on a landing page, every element is a trust signal. A loading spinner where impressive numbers should be says "this product is broken."

**Consequences:** CLS score degrades (Google Core Web Vitals). Empty/loading state destroys social proof. If API is down, landing page looks broken.

**Prevention:**
- Use ISR (Incremental Static Regeneration) or `revalidate` with a reasonable interval (e.g., 3600 seconds). Numbers don't need to be real-time -- daily freshness is fine for landing page credibility.
- Always provide fallback values (last known good data, hardcoded minimums). Never show a spinner or empty state.
- Reserve exact dimensions for the numbers section in CSS so content doesn't shift when data loads.
- Add a subtle "Updated daily" label to set expectations and add credibility.

**Detection:** Lighthouse CLS score > 0.1. Visually: reload the page on a slow connection and watch if the numbers section "jumps."

**Phase:** Implementation phase for the Performance/Big Numbers section.

---

## Moderate Pitfalls

### Pitfall 5: Missing or Incorrect hreflang Tags

**What goes wrong:** The bilingual landing page needs hreflang tags so Google knows the PT-BR and EN versions are translations of each other. Common mistakes: forgetting self-referencing hreflang, using one-directional links, using wrong locale codes (e.g., `en-us` instead of `en`, or `pt` instead of `pt-BR`).

**Prevention:**
- Both pages must reference BOTH versions (bidirectional). Each page must include a self-reference.
- Use `x-default` hreflang pointing to PT-BR (the default locale).
- Validate with Google Search Console or hreflang testing tools after deployment.
- Ensure canonical URLs match the hreflang URLs exactly.

**Phase:** SEO/metadata phase, after i18n routing is stable.

---

### Pitfall 6: Translation Strings Hardcoded Instead of Externalized

**What goes wrong:** Developers start building the landing page with inline Portuguese text, planning to "add i18n later." This leads to hundreds of hardcoded strings scattered across components. Extracting them later is tedious and error-prone -- some strings get missed, others get split awkwardly across JSX.

**Prevention:**
- Set up the translation file structure (e.g., `messages/pt-BR.json`, `messages/en.json`) BEFORE writing any UI components.
- Every visible string, including alt text, aria-labels, and meta descriptions, goes through `useTranslations()` or the server-side `getTranslations()` from day one.
- Use a flat namespace structure per section: `hero.title`, `hero.subtitle`, `features.chat.title`, etc.

**Detection:** `grep -r` for Portuguese text in `.tsx` files outside of translation files.

**Phase:** Must be enforced from the very first UI component. Set up translation infrastructure before any section development.

---

### Pitfall 7: Pricing Section with Wrong Currency/Formatting per Locale

**What goes wrong:** The pricing section shows plans (Free + Premium). When switching to English, the prices still show "R$" or Brazilian formatting, or worse, the English version shows USD prices that don't match reality. Number formatting (1.000 vs 1,000) and currency symbols differ between locales.

**Prevention:**
- Use `Intl.NumberFormat` with the correct locale for all currency and number displays.
- Decide upfront: does the English version show USD or BRL? If BRL (same product, same price), make that clear ("R$ 29.90/mo" with a note about Brazilian Real).
- Store pricing data with raw numbers and format at render time based on locale.

**Phase:** Pricing section implementation.

---

### Pitfall 8: CTA Buttons Compete and Dilute Conversion

**What goes wrong:** Each section gets its own CTA -- "Start Free," "See Plans," "Connect Strava," "Sign Up Now" -- and the visitor doesn't know which action to take. The hero CTA and the pricing CTA point to different flows. Mobile users see too many buttons and none feel primary.

**Prevention:**
- One primary CTA throughout the page: "Start Free" (or equivalent) that goes to `/signup`.
- Secondary CTA only in pricing section for the Premium plan.
- All hero/mid-page CTAs should funnel to the same action. Consistency builds momentum.
- On mobile, consider a sticky bottom CTA bar that appears after scrolling past the hero.

**Detection:** Heat mapping or click tracking post-launch. Pre-launch: count the number of distinct CTAs -- if more than 2 unique actions, simplify.

**Phase:** UI implementation for each section, but the CTA strategy must be decided during design/architecture.

---

### Pitfall 9: Scroll Animations Cause Hydration Mismatches

**What goes wrong:** Scroll-triggered animations that set initial state (e.g., `opacity: 0`, `translateY: 20px`) via JavaScript create a mismatch between server-rendered HTML (visible) and client hydration (hidden). This causes a flash where content appears, disappears, then animates in.

**Prevention:**
- Set initial hidden states via CSS classes, not JS. The server-rendered HTML should already have the "pre-animation" styles.
- Use `suppressHydrationWarning` sparingly and only where truly needed.
- Prefer CSS `@starting-style` (modern browsers) or CSS-only intersection observer patterns.
- If using Framer Motion, ensure `initial` states match what CSS renders on the server.

**Detection:** Hard-refresh the page (Cmd+Shift+R) and watch for content flicker. Test with JS disabled -- the content should still be visible (just not animated).

**Phase:** Animation implementation phase.

---

## Minor Pitfalls

### Pitfall 10: Forgetting `generateStaticParams` for i18n Static Pages

**What goes wrong:** If using a `[locale]` dynamic segment, Next.js won't statically generate the landing page without `generateStaticParams` returning all supported locales. The page falls back to dynamic rendering, losing the SSG/ISR performance benefits.

**Prevention:** Export `generateStaticParams` from the landing page layout/page that returns `[{ locale: 'pt-BR' }, { locale: 'en' }]`. Call `setRequestLocale(locale)` at the top of every server component that uses translations.

**Phase:** i18n setup phase.

---

### Pitfall 11: Testimonial Images Without Dimensions Cause CLS

**What goes wrong:** Social proof photos loaded without explicit `width` and `height` cause layout shifts as they load. This is especially bad on the landing page where multiple testimonial cards load together.

**Prevention:** Always use `next/image` with explicit width/height or `fill` with a sized container. For testimonial avatars, use a consistent size (e.g., 64x64) and `placeholder="blur"` with a blurDataURL.

**Phase:** Social proof section implementation.

---

### Pitfall 12: Font Loading Causes Text Flash (FOUT)

**What goes wrong:** Custom fonts load after initial render, causing visible text reflow. On a landing page where the hero headline is the first thing visitors see, FOUT makes the page feel janky.

**Prevention:**
- Use `next/font` to self-host fonts with automatic `font-display: swap` and preloading.
- If already using a Google Font via `next/font/google`, ensure it's loaded in the root layout.
- Set explicit `line-height` and approximate `letter-spacing` in CSS so the fallback font occupies similar space.

**Phase:** Design system/typography setup, early in development.

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| i18n architecture setup | Middleware breaks existing routes (Pitfall 1) | Scope middleware to landing page only; test all existing routes |
| i18n architecture setup | Root layout lang mismatch (Pitfall 2) | Use route-group-specific layout for landing page |
| i18n architecture setup | Strings hardcoded (Pitfall 6) | Set up translation files before any UI work |
| UI section development | Animation bundle bloat (Pitfall 3) | Prefer CSS animations; if Framer Motion, use LazyMotion |
| UI section development | Hydration mismatch from animations (Pitfall 9) | Set initial states in CSS, not JS |
| UI section development | CTA dilution (Pitfall 8) | Decide single primary CTA before building sections |
| Big Numbers / API section | Layout shift and stale data (Pitfall 4) | ISR with fallback values; reserve space in CSS |
| Pricing section | Currency/locale formatting (Pitfall 7) | Use Intl.NumberFormat; decide currency strategy upfront |
| SEO / metadata | hreflang misconfiguration (Pitfall 5) | Bidirectional tags with self-reference; validate with tools |
| Social proof section | Image CLS (Pitfall 11) | next/image with explicit dimensions |
| Typography / design | Font flash (Pitfall 12) | next/font with preloading in layout |

## Sources

- [next-intl middleware composition with auth](https://github.com/amannn/next-intl/discussions/1613) -- MEDIUM confidence
- [next-intl App Router docs](https://next-intl.dev/docs/getting-started/app-router) -- HIGH confidence
- [Framer Motion bundle size reduction](https://motion.dev/docs/react-reduce-bundle-size) -- HIGH confidence
- [Framer Motion performance patterns and pitfalls](https://dev.to/whoffagents/framer-motion-animations-that-dont-kill-performance-patterns-and-pitfalls-5cki) -- MEDIUM confidence
- [Next.js CLS fixes](https://blog.stackademic.com/how-to-prevent-layout-shift-in-next-js-cls-fixes-that-actually-work-ec7f4e6f1b8e) -- MEDIUM confidence
- [hreflang duplicate content guide](https://thegray.company/blog/duplicate-content-international-seo-hreflang) -- MEDIUM confidence
- [SaaS landing page conversion mistakes](https://www.flowspark.co/blog/6-costly-saas-landing-page-mistakes-that-kill-conversions-and-how-to-fix-them) -- MEDIUM confidence
- [Next.js ISR caching for fresh data](https://nextjs.org/docs/app/getting-started/caching) -- HIGH confidence
- [Combining NextAuth and next-intl middleware](https://dev.to/0xtanzim/implementing-multiple-middleware-in-nextjs-combining-nextauth-and-internationalization-d9) -- MEDIUM confidence
