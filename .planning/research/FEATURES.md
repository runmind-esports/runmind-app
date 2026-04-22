# Feature Landscape

**Domain:** SaaS Landing Page for AI Running Coach (Brazilian Market)
**Researched:** 2026-04-22

## Table Stakes

Features users expect on any credible SaaS/fitness landing page. Missing = visitors bounce.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Hero section with outcome-driven headline | Visitors decide in 3-5 seconds if they stay. 2026 best practice: headlines under 44 chars that communicate transformation, not features. Subheadline explains the product, single primary CTA. | Low | Must communicate "AI running coach" + "personalized" + "Strava connected" instantly. Outcome-driven: "Corra mais rapido com um coach que nunca dorme" not "AI-powered training plans". |
| Primary CTA above the fold | Personalized CTAs outperform generic ones by 202%. "Comece gratis" or "Crie sua conta" -- one button, prominent, contrasting color (green neon fits brand). | Low | Link directly to `/signup`. Do NOT use "Saiba mais" as primary -- that delays conversion. |
| Product screenshot/mockup in hero | Highest-converting SaaS pages in 2026 show the actual product UI. Visitors need to see what they get before signing up. | Low | PROJECT.md plans placeholders -- acceptable for v1. Style them to look like real app: dark UI, chat bubbles, Strava data overlay. |
| Mobile-first responsive layout | 85%+ of Brazilian users are on Android/mobile. A landing page that breaks on mobile loses the primary market entirely. | Medium | Design for 360px width FIRST, then scale up. Tailwind mobile-first utilities handle this. Test on slow 4G connections. |
| Social proof section | 83% of people trust peer recommendations (Nielsen). Without testimonials or trust signals, the page feels like vaporware. | Low | Real user quotes (even from beta testers), Strava integration badge, user/run count. Fake testimonials are worse than none -- use real data or skip until you have it. |
| Feature/benefit highlights (3 pillars) | Visitors need to understand what the product does in a scannable format. Standard: icon + short benefit copy. | Low | Three pillars: Chat IA 24/7, Planilhas Dinamicas, Sincronizacao Strava/Garmin. Benefits not features: "Seu plano se adapta ao seu ritmo" not "Dynamic plan adjustment". |
| Pricing section with Free vs Premium | Visitors expect pricing transparency before committing. Freemium conversion rate is 1-2% (First Page Sage 2026), so Free tier must be genuinely useful to drive volume. | Medium | Clear feature comparison table. Highlight Premium visually but keep Free CTA equally accessible. Monthly/annual toggle if annual pricing exists. |
| Fast page load under 3 seconds | Pages over 3s lose visitors before they see the headline. Critical for Brazilian mobile users on variable 4G connections. | Medium | SSG the landing page (Next.js static generation). Lazy-load below-fold images. Minimize JS bundle for `/` route. No heavy animation libraries loading upfront. |
| PT-BR as default language | Brazil is the primary market. An English-first page with a PT-BR toggle is a conversion killer -- Brazilian users expect Portuguese natively. | Low | PT-BR default, EN as secondary. ALL copy, CTAs, testimonials in Portuguese first. |
| Minimal navigation (landing page mode) | Landing pages with fewer distractions convert higher. Top bar: logo + single "Comece gratis" CTA. No full site nav. | Low | Do NOT link to /chat, /settings (authenticated routes). Only: logo, language toggle, login link (small), primary CTA (prominent). |
| SEO meta tags and Open Graph | Discoverability via search and social sharing. Standard expectation for any modern web page. | Low | Next.js metadata API. Portuguese meta description. OG image with RunMind branding for WhatsApp/social sharing (WhatsApp is dominant in Brazil). |
| Footer with essentials | Standard web convention. Missing footer = untrustworthy. | Low | Legal links, LGPD privacy mention, social links, Strava badge, secondary CTA. |

## Differentiators

Features that set RunMind apart from competitors (AI Endurance, Athletica.ai, HumanGO, Racemate). Not expected, but create competitive advantage.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Live Big Numbers from API | Real-time stats (total km tracked, average pace, active users) pulled from `runmidApiClient`. Competitors use static/fake numbers. Real data = immediate credibility. Animated count-up on scroll creates engagement. | Medium | Requires API endpoint + caching strategy (ISR or SWR with long stale time). Show: "X km monitorados", "Y corredores ativos", "Z conversas com o coach". |
| User journey timeline (5 steps) | Visual storytelling: "Conecte Strava -> Converse com o coach -> Receba seu plano -> Corra -> Evolua". Competitors list features; showing the flow reduces perceived complexity and answers "how does this work?" | Medium | Horizontal on desktop, vertical on mobile. Icons + short descriptions. This is the critical "How it works" bridge between features and action. |
| Strava/Garmin integration showcase | Brazilian runners live on Strava -- 800% growth in clubs, 109% increase in running club participation. Showing Strava connect as first-class feature differentiates from generic fitness apps. | Low | Official brand assets already exist in `/public/brand/`. Display Strava "Compatible" and Garmin Connect IQ badges prominently. Show a mockup of synced activity data. |
| Coach conversation preview | Competitors like Racemate offer coach personas. Showing a sample chat conversation on the landing page lets visitors "feel" the AI coach before signup -- unique selling point for a chat-first product. | Medium | Static or CSS-animated chat mockup: coach greeting, user question, personalized response. Not a real demo -- just visual proof of the conversational experience. |
| Bilingual toggle (PT-BR/EN) in-page | Most Brazilian fitness apps are Portuguese-only OR English-only. Smooth client-side language toggle (no page reload) signals quality and enables future market expansion. | Medium | React context + JSON translation files or `next-intl`. Toggle in header. Persist preference in localStorage. |
| Dark/light theme on landing page | RunMind already has theme toggle in-app. Extending to landing page shows design consistency and appeals to tech-savvy runner demographic. 62% of Brazilian consumers want personalized experiences. | Low | Already implemented in app. Extend Tailwind dark mode to landing page components. Default to dark (brand identity: neon green on dark background). |
| LGPD/privacy trust callout | 82% of Brazilian consumers are concerned about health data management. International competitors (AI Endurance, Athletica) ignore this entirely. Brief "Seus dados estao seguros" section is a Brazil-specific trust signal. | Low | Not a full privacy page. Small section or badge near footer: encryption mention, LGPD compliance, "dados no Brasil" if applicable. Low effort, high trust impact. |
| WhatsApp-optimized sharing | WhatsApp is the dominant communication platform in Brazil. OG tags optimized for WhatsApp preview cards make the landing page shareable in running groups (where 76% of Brazilian runners make friends). | Low | Proper OG image dimensions (1200x630), Portuguese OG description, clean URL preview. Very low effort, high organic distribution potential. |

## Anti-Features

Features to explicitly NOT build. Each would waste time or hurt conversions.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| In-page payment/checkout | PROJECT.md marks explicitly out of scope. Landing page converts to signup, not purchase. Checkout adds complexity and creates a second conversion barrier. | CTA goes to `/signup`. Pricing shows plans but "Comece gratis" is the action. Premium upgrade happens inside the app post-registration. |
| Blog/content section | Content marketing is v2 (PROJECT.md out of scope). Blog on landing page dilutes focus and creates navigation distractions that kill single-page conversion. | Single-page landing, no outbound links except CTAs to signup/login. Blog can be `/blog` route later. |
| Interactive product demo | Embedded demos (Guideflow-style) are a 2026 SaaS trend but require significant engineering, a working demo environment, and add substantial bundle size. Overkill for current stage. | Polished static mockups + coach conversation preview. Screenshots > embedded demos at this stage. |
| Chatbot/live chat widget | Behavior-triggered chat is an advanced SaaS tactic but adds complexity, requires backend support, and creates ironic overlap -- the product IS a chat interface. | Show the chat experience via mockup preview section. Don't recreate it on the landing page. |
| Countdown timers / urgency tactics | "Oferta por tempo limitado" pressure tactics feel cheap for a freemium product and erode trust. Brazilian consumers value authenticity, and the product is free to start. | Freemium = no urgency needed. "Comece gratis" = zero risk, zero pressure. Trust > urgency. |
| App store badges / download links | RunMind is web-first (PROJECT.md: mobile native out of scope). Showing badges for a non-existent app is dishonest and confuses the value proposition. | Emphasize "Acesse de qualquer navegador" as a feature. PWA potential is future, not now. |
| Heavy JS animations (Framer Motion, GSAP, Lottie) | Large bundle size (Framer Motion ~30kb min-gzipped), hurts mobile performance on Brazilian 4G networks, violates 3s load target. Motion sickness concerns with parallax. | Subtle CSS transitions: `@keyframes` fade-in on scroll via `IntersectionObserver`. CSS `scroll-behavior: smooth` for anchor links. Zero library overhead. |
| Multi-page funnel | Multi-step funnels work for high-ticket B2B but cause massive drop-off for consumer freemium products. Each additional page = lost visitors. | Single-page with anchor sections. Smooth scroll: hero -> features -> how-it-works -> social proof -> pricing -> footer. |
| PIX payment integration on landing | PIX dominates Brazil (90% adult adoption) but payment integration is out of scope and belongs in-app, not on a conversion-focused landing page. | Mention "Aceita PIX" as a bullet in Premium plan features if applicable. Actual PIX flow is post-signup. |
| Smooth scroll hijacking (Lenis/Locomotive) | Breaks native scroll behavior, causes accessibility issues, mobile jank on lower-end Android devices common in Brazil. | Native CSS `scroll-behavior: smooth` for anchor links only. Let the browser handle scrolling. |
| Testimonial carousels/sliders | Carousels have notoriously low engagement past the first slide. Auto-rotating content is ignored or annoying. | Show 2-3 testimonials in a static grid. All visible at once. |
| Cookie consent banner | LGPD does not require consent banners for strictly necessary cookies. Only needed if adding analytics tracking (Google Analytics, etc). | Add only when/if analytics is implemented. Don't pre-build. |
| Video autoplay in hero | Massive LCP hit, consumes mobile data (Brazilian users are data-conscious), auto-playing media annoys users. | Static hero with styled mockup + subtle CSS animation. |

## Feature Dependencies

```
PT-BR copy and translation files --> Hero section (needs localized headline/subheadline)
PT-BR copy and translation files --> Feature highlights (needs localized benefit descriptions)
PT-BR copy and translation files --> Pricing section (needs localized plan names/descriptions)
PT-BR copy and translation files --> Social proof (needs Portuguese testimonials)
PT-BR copy and translation files --> Bilingual toggle (toggle switches between translation sets)

Hero section --> Product mockup placement (mockup appears inside hero)
Hero section --> Primary CTA (CTA appears inside hero)

API endpoint for stats --> Big Numbers section (needs real data source)
Big Numbers section --> Number count-up animation (animates the fetched data)

Feature highlights section --> How-it-works timeline (timeline expands on the feature pillars)

Strava brand assets (exist in /public/brand/) --> Integration showcase section
Existing dark/light theme system --> Landing page theme support

Landing page layout shell --> All content sections (header, footer, section containers)
```

## MVP Recommendation

**Build in this order (critical path):**

1. **PT-BR copy and translation infrastructure** -- Everything else depends on having the words. Write Portuguese-first, then English. Use JSON files with a simple context provider. This is the foundation that unblocks all sections.
2. **Landing page layout shell** -- Header (logo + CTA + lang toggle), section containers, footer. The skeleton that holds everything.
3. **Hero section** -- Headline, subheadline, primary CTA, product mockup placeholder. This is where 80% of conversion decision happens. Get this right first.
4. **Feature highlights (3 pillars)** -- Chat IA, Planilhas Dinamicas, Sincronizacao. Quick to build, communicates core value.
5. **Pricing section** -- Free vs Premium comparison table with CTAs to `/signup`. Visitors need to know cost before committing. Include feature comparison.
6. **Social proof** -- Minimal viable: Strava integration badge, 1-2 real testimonials (or beta user quotes), user count if available.
7. **How-it-works timeline (5 steps)** -- Visual user journey. Bridges features to action. Reduces "is this complicated?" anxiety.
8. **Footer** -- LGPD mention, language toggle, login link, social links, secondary CTA.
9. **Scroll animations (CSS-only)** -- Polish layer. Fade-in on scroll via IntersectionObserver + CSS transitions. Applied to all sections.

**Defer to Phase 2 (post-launch optimization):**

- **Big Numbers from API**: Requires backend endpoint, caching, loading/error states, SSR considerations. Use hardcoded realistic numbers for v1, connect to API when endpoint is ready.
- **Coach conversation preview**: Requires design work for realistic chat mockup animation. Use a static screenshot of the chat UI for v1.
- **A/B testing**: Optimize after initial launch with real traffic data. No point A/B testing with zero visitors.
- **Advanced analytics**: Track conversion funnel after page exists. Google Analytics / Plausible can be added independently.

## Sources

- [KlientBoost - 51 High-Converting SaaS Landing Pages](https://www.klientboost.com/landing-pages/saas-landing-page/)
- [Unbounce - SaaS Landing Pages State](https://unbounce.com/conversion-rate-optimization/the-state-of-saas-landing-pages/)
- [SaaSFrame - 10 SaaS Landing Page Trends 2026](https://www.saasframe.io/blog/10-saas-landing-page-trends-for-2026-with-real-examples)
- [SaaS Hero - High-Converting Landing Pages 2026](https://www.saashero.net/design/enterprise-landing-page-design-2026/)
- [Genesys Growth - B2B SaaS Landing Pages 2026](https://genesysgrowth.com/blog/designing-b2b-saas-landing-pages)
- [Unbounce - Fitness Landing Page Examples](https://unbounce.com/landing-page-examples/fitness/)
- [First Page Sage - SaaS Freemium Conversion Rates 2026](https://firstpagesage.com/seo-blog/saas-freemium-conversion-rates/)
- [Grand View Research - Brazil Fitness Apps Market](https://www.grandviewresearch.com/horizon/outlook/move-to-earn-fitness-apps-market/brazil)
- [Ken Research - Brazil AI Fitness Apps Market](https://www.kenresearch.com/brazil-ai-in-wellness-digital-fitness-apps-market)
- [Maquina do Esporte - Strava Communities Brazil](https://maquinadoesporte.com.br/running/atletas-se-mantem-na-corrida-de-rua-gracas-a-formacao-de-comunidades-diz-executiva-do-strava/)
- [FastSpring - PIX for Software in Brazil](https://fastspring.com/blog/how-pix-helps-software-businesses-reach-buyers-in-brazil/)
- [Stripe - PIX Payments Brazil](https://stripe.com/en-br/resources/more/pix-replacing-cards-cash-brazil)
- [ALF Design Group - SaaS Hero Section Best Practices](https://www.alfdesigngroup.com/post/saas-hero-section-best-practices)
