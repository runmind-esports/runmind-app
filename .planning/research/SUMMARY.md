# Project Research Summary

**Project:** RunMind Landing Page
**Domain:** SaaS Landing Page (AI Running Coach, Brazilian Market)
**Researched:** 2026-04-22
**Confidence:** HIGH

## Executive Summary

RunMind needs a bilingual (PT-BR/EN) landing page added to an existing Next.js 14 application that already has authentication, chat, and settings features. The research converges on a lean approach: only two new dependencies (next-intl and Motion), a new `(marketing)` route group to isolate the landing page from app concerns, and a feature module (`features/landing/`) following the existing codebase conventions. The critical architectural decision is to use a simple React context + dictionary for i18n instead of next-intl's full routing layer -- this avoids the single biggest risk identified: middleware colliding with existing auth, Strava OAuth, and chat routes.

The landing page is a single-page design with anchor sections (hero, features, how-it-works, pricing, social proof, footer). The Brazilian market demands mobile-first design (85%+ Android users), Portuguese as the default language, fast load times on variable 4G, and Strava integration as a first-class trust signal. The recommended build order starts with translation infrastructure and layout scaffolding, then parallelizes static content sections, and defers API-driven features (Big Numbers) and animations to later phases. This order is dictated by the dependency chain: every section needs translations, and the API section has a graceful fallback path.

The top risks are: (1) i18n middleware breaking existing routes if next-intl's routing layer is used, (2) animation libraries bloating the bundle for mobile users, and (3) the Big Numbers API section causing layout shift or showing loading states that undermine credibility. All three have clear mitigations: cookie-based locale toggle instead of URL routing, CSS-first animations with Motion only for scroll triggers using LazyMotion, and hardcoded fallback values with reserved CSS dimensions for the stats section.

## Key Findings

### Recommended Stack

The existing stack (Next.js 14, React 18, TypeScript, Tailwind CSS 3.4, Radix UI) remains unchanged. Only two new packages are needed.

**Core new technologies:**
- **Motion** (v12.38+): Scroll-triggered animations via `whileInView`, parallax via `useScroll`, number count-up via `animate()` -- replaces need for react-countup, AOS, or GSAP. Use `viewport={{ once: true }}` and respect `prefers-reduced-motion`.
- **next-intl** (v4.9+): Recommended by STACK.md but ARCHITECTURE.md argues against using its routing layer for this use case. **Resolution: install next-intl but use a simpler React context approach for the landing page toggle.** Reserve next-intl for future full-app localization.

**Explicitly avoid:** framer-motion (deprecated name), Lenis/Locomotive (scroll hijacking), GSAP (commercial license), react-countup (redundant with Motion), tailwindcss-animate (conflicts with Motion).

**STACK vs ARCHITECTURE disagreement on i18n:** STACK.md recommends next-intl; ARCHITECTURE.md recommends a custom React context. ARCHITECTURE.md's reasoning is stronger for this specific use case (2 languages, 1 page, toggle not URL-based). **Recommendation: use custom context now, migrate to next-intl when full app localization is needed.** This means only Motion needs to be installed as a new dependency.

### Expected Features

**Must have (table stakes):**
- Hero section with outcome-driven PT-BR headline + single primary CTA to `/signup`
- Mobile-first responsive layout (360px+ first)
- Feature highlights (3 pillars: Chat IA, Planilhas Dinamicas, Sincronizacao)
- Pricing section (Free vs Premium comparison)
- Social proof (Strava badge, testimonials or beta quotes)
- SEO meta tags and Open Graph (optimized for WhatsApp sharing)
- Footer with LGPD mention and essentials
- Fast load under 3 seconds on mobile 4G

**Should have (differentiators):**
- Live Big Numbers from API (total km, active runners, coach conversations)
- 5-step user journey timeline (Conecte -> Converse -> Receba -> Corra -> Evolua)
- Strava/Garmin integration showcase with official brand assets
- Bilingual toggle (PT-BR/EN) without page reload
- Coach conversation preview mockup
- LGPD/privacy trust callout (Brazil-specific competitive advantage)

**Defer (v2+):**
- Big Numbers connected to live API (use hardcoded realistic numbers for v1)
- Coach conversation preview with animation (use static screenshot for v1)
- A/B testing and analytics integration
- Blog/content section
- Interactive product demo

### Architecture Approach

The landing page lives in a `(marketing)` route group with its own lightweight layout (no QueryProvider, no auth state). All landing page code resides in `src/features/landing/` following the existing feature module pattern. Sections are self-contained components that read translations from a React context (no prop drilling). Only the BigNumbersSection makes API calls; all other sections are pure render. The page is client-rendered with a `LanguageProvider` wrapping all sections, and language preference persists via cookie (not localStorage) to avoid SSR hydration mismatches.

**Major components:**
1. **`(marketing)/layout.tsx`** -- Lightweight marketing shell, no app providers
2. **`LanguageProvider` + `useLanguage` hook** -- Cookie-based locale context, provides `t` object to all sections
3. **`translations.ts`** -- Single dictionary file with namespaced keys per section (hero, features, flow, pricing, etc.)
4. **7 section components** -- HeroSection, FeaturesSection, UserFlowSection, BigNumbersSection, PricingSection, TestimonialsSection, FooterSection
5. **`SectionWrapper`** -- Consistent padding, max-width, scroll-anchor IDs across all sections
6. **`useBigNumbers` hook** -- Isolated API fetch with hardcoded fallback values for graceful degradation

### Critical Pitfalls

1. **i18n middleware breaks existing routes** -- If next-intl middleware is added, it rewrites ALL routes by default, breaking Strava OAuth callback, auth, and chat. **Avoid by using cookie-based toggle instead of URL-prefix routing.**
2. **Animation bundle bloat on mobile** -- Motion/Framer Motion adds 30-50KB gzipped, devastating on Brazilian 4G. **Use CSS animations first; if Motion is needed, use LazyMotion (reduces to ~4.6KB). Only animate opacity and transform.**
3. **Big Numbers API causes layout shift** -- Client-side fetch makes numbers pop in late, causing CLS. **Reserve exact CSS dimensions, provide hardcoded fallback values, never show spinners.**
4. **Hardcoded strings scattered in components** -- Building UI before translation infrastructure means painful extraction later. **Set up translation dictionary and context BEFORE any section development.**
5. **CTA dilution across sections** -- Multiple competing CTAs confuse visitors. **One primary action ("Comece Gratis" to `/signup`) used consistently throughout the page.**

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Foundation (i18n + Layout Infrastructure)
**Rationale:** Every section depends on the translation system and layout shell. The dependency chain is absolute -- nothing can be built without these. This phase also makes the critical architectural decision to avoid next-intl routing.
**Delivers:** Translation dictionary (PT-BR + EN), LanguageProvider context + hook, SectionWrapper component, `(marketing)` route group with layout, page orchestrator that composes sections, icon components extracted from current monolith.
**Addresses:** PT-BR default language (table stakes), bilingual toggle infrastructure (differentiator)
**Avoids:** Pitfall 1 (middleware collision -- by not using middleware), Pitfall 2 (lang attribute -- via route-group layout), Pitfall 6 (hardcoded strings -- by building i18n first)

### Phase 2: Core Content Sections
**Rationale:** Static sections have zero dependencies on each other and can be developed in parallel once the foundation exists. These deliver the core conversion flow.
**Delivers:** HeroSection, FeaturesSection, PricingSection, FooterSection -- the minimum viable landing page.
**Addresses:** Hero with CTA (table stakes), feature highlights (table stakes), pricing transparency (table stakes), footer with LGPD (table stakes), SEO meta tags (table stakes)
**Avoids:** Pitfall 8 (CTA dilution -- decide single primary CTA before building), Pitfall 7 (currency formatting -- use Intl.NumberFormat from the start)

### Phase 3: Extended Content Sections
**Rationale:** These sections add depth and differentiation but are not required for a functional landing page. They can ship as a fast follow.
**Delivers:** UserFlowSection (5-step timeline), TestimonialsSection (social proof), Strava/Garmin integration showcase, coach conversation preview (static mockup).
**Addresses:** User journey timeline (differentiator), social proof (table stakes), Strava showcase (differentiator)
**Avoids:** Pitfall 11 (testimonial image CLS -- use next/image with explicit dimensions)

### Phase 4: Dynamic Data + API Integration
**Rationale:** The Big Numbers section requires backend API coordination and has the most complex failure modes. It ships last because hardcoded fallback values work fine initially.
**Delivers:** `useBigNumbers` hook, BigNumbersSection with API fetch, animated count-up on scroll, loading skeleton with reserved dimensions.
**Addresses:** Live Big Numbers from API (differentiator)
**Avoids:** Pitfall 4 (layout shift -- reserved CSS dimensions + fallback values)

### Phase 5: Animation + Polish
**Rationale:** Animations are pure enhancement. The page must work perfectly without them. Ship last to avoid premature optimization and bundle bloat debates.
**Delivers:** Scroll-triggered fade-in/slide-up on sections, LanguageToggle UI component, responsive refinements per section, mobile performance optimization.
**Addresses:** Fast page load (table stakes), mobile-first layout polish (table stakes)
**Avoids:** Pitfall 3 (bundle bloat -- CSS-first, LazyMotion if needed), Pitfall 9 (hydration mismatch -- initial states in CSS), Pitfall 12 (font flash -- next/font setup)

### Phase Ordering Rationale

- Foundation first because the dependency chain is absolute: translations unblock all sections, and the route group unblocks the page shell.
- Core sections before extended sections because they represent the minimum conversion path (hero -> features -> pricing -> signup).
- API integration deferred because it has graceful degradation (fallback values) and requires backend coordination that should not block frontend progress.
- Animation last because the page is fully functional without it, and premature animation work often gets reworked as section layouts change.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 1 (Foundation):** Needs research on cookie-based locale detection patterns in Next.js 14 App Router, especially SSR behavior with client-side cookie reads.
- **Phase 4 (API Integration):** Needs research on the actual `/metrics/landing` API endpoint -- does it exist? What shape is the response? May need backend coordination.

Phases with standard patterns (skip research-phase):
- **Phase 2 (Core Sections):** Standard React component development with Tailwind. Well-documented patterns.
- **Phase 3 (Extended Sections):** Same as Phase 2 -- standard UI work.
- **Phase 5 (Animation):** Motion library has excellent docs; CSS intersection observer patterns are well-established.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Only 1-2 new dependencies, both well-documented with verified compatibility. Minor disagreement on next-intl resolved in favor of simpler approach. |
| Features | HIGH | Based on extensive SaaS landing page benchmarks, Brazilian market data, and competitor analysis. Feature priorities are clear. |
| Architecture | HIGH | Follows existing codebase conventions exactly. Route groups, feature modules, and component patterns are all established Next.js patterns. |
| Pitfalls | HIGH | Critical pitfalls (middleware collision, bundle bloat, CLS) have concrete prevention strategies. Sources include official docs and community experience. |

**Overall confidence:** HIGH

### Gaps to Address

- **API endpoint for Big Numbers:** No confirmation the `/metrics/landing` endpoint exists on the backend. Phase 4 may require backend work or a different endpoint. Use hardcoded values until confirmed.
- **Testimonial content:** Real user testimonials or beta tester quotes are needed. Using fabricated testimonials is worse than having none. May need to defer TestimonialsSection until real content exists.
- **Pricing details:** Exact feature breakdown for Free vs Premium tiers needs product decision. Translation files need final copy, not placeholder text.
- **next-intl vs custom context long-term:** If full app localization is planned within 6 months, it may be worth installing next-intl from the start despite the added complexity. This is a product strategy question, not a technical one.

## Sources

### Primary (HIGH confidence)
- [Next.js App Router Routing docs](https://nextjs.org/docs/app/building-your-application/routing) -- route groups, layouts
- [Motion official docs](https://motion.dev/docs/react) -- whileInView, useScroll, LazyMotion
- [next-intl App Router docs](https://next-intl.dev/docs/getting-started/app-router) -- reviewed and intentionally deferred
- [Next.js ISR/caching docs](https://nextjs.org/docs/app/getting-started/caching) -- revalidation strategy
- [Framer Motion bundle size reduction](https://motion.dev/docs/react-reduce-bundle-size) -- LazyMotion approach

### Secondary (MEDIUM confidence)
- [KlientBoost SaaS Landing Pages](https://www.klientboost.com/landing-pages/saas-landing-page/) -- conversion best practices
- [SaaSFrame Landing Page Trends 2026](https://www.saasframe.io/blog/10-saas-landing-page-trends-for-2026-with-real-examples) -- feature expectations
- [Grand View Research Brazil Fitness Apps](https://www.grandviewresearch.com/horizon/outlook/move-to-earn-fitness-apps-market/brazil) -- market context
- [Maquina do Esporte Strava Brazil](https://maquinadoesporte.com.br/running/atletas-se-mantem-na-corrida-de-rua-gracas-a-formacao-de-comunidades-diz-executiva-do-strava/) -- Strava community data
- [next-intl middleware composition](https://github.com/amannn/next-intl/discussions/1613) -- middleware risk patterns

### Tertiary (LOW confidence)
- Animated counter implementation with Motion `animate()` -- documented in Motion API but custom implementation needed, no landing-page-specific examples found

---
*Research completed: 2026-04-22*
*Ready for roadmap: yes*
