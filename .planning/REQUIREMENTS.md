# Requirements: RunMind Landing Page

**Defined:** 2026-04-22
**Core Value:** Converter visitantes em usuarios demonstrando que o RunMind entrega treinamento de elite acessivel — preenchendo o gap do mercado brasileiro.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Infrastructure

- [ ] **INFRA-01**: Landing page uses translation dictionary (PT-BR + EN) with LanguageProvider React context
- [ ] **INFRA-02**: Landing page lives in `(marketing)` route group, isolated from existing app routes

### Hero Section

- [ ] **HERO-01**: User sees outcome-driven headline, subheadline attacking market pain, and CTA button directing to `/signup`
- [ ] **HERO-02**: User sees stylized app mockup placeholder with Strava social login visible
- [ ] **HERO-03**: Hero elements animate in on page load (fade/slide-in)

### Features Section

- [ ] **FEAT-01**: User sees 3 feature cards with icons: Chat IA 24/7, Planilhas Dinamicas, Sincronizacao Inteligente
- [ ] **FEAT-02**: User sees Strava and Garmin logo badges with "Parceiro Oficial" designation
- [ ] **FEAT-03**: User sees 4 runner profiles: Corpo & Alma (88% influenciam amigos), Mestre Zen (98% buscam equilibrio), Competidor Nato (foco em provas), Espirito Livre (81% sem regras rigidas)

### User Journey

- [ ] **JRNY-01**: User sees 5-step visual timeline: Login (Strava) → Onboarding (perfil + metas) → Interface (5k-42k + Coach AI) → Planilha (treino do dia) → Perfil (Big Numbers + evolucao)
- [ ] **JRNY-02**: Journey steps reveal progressively as user scrolls into view
- [ ] **JRNY-03**: User sees metricas do amador brasileiro: 3.4x/semana frequencia, 9.2km volume, 82% focam 5k-10k, 43% correm antes das 8h

### Performance & Big Numbers

- [ ] **PERF-01**: User sees Big Numbers (Volume Total, Pace Medio, Engajamento) fetched from API via runmidApiClient
- [ ] **PERF-02**: Numbers animate with counter effect when section scrolls into view

### Conversion

- [ ] **CONV-01**: User sees prominent CTA "Comece seu treino de elite agora" directing to `/signup` at bottom of page

### Social Proof

- [ ] **SOCL-01**: User sees "Gap da Solidao" section: 30% correm sozinhos, 44% sentem-se despreparados, RunMind como oportunidade de democratizacao do suporte tecnico
- [ ] **SOCL-02**: User sees footer with navigation links, RunMind logo, and tagline "Inteligencia que move voce"

### Onboarding Differentiator

- [ ] **ONBR-01**: Journey section highlights that onboarding captures data Strava doesn't provide (objectives, fitness level, routine, limitations) to feed the AI coach with richer context

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### i18n Enhancements

- **I18N-01**: Language toggle component visible in landing page header/nav
- **I18N-02**: Cookie-based locale persistence across sessions
- **I18N-03**: Dynamic HTML `lang` attribute toggling

### Social Proof

- **SOCL-03**: Testimonials section with real user photos from Brazilian running events
- **SOCL-04**: LGPD privacy trust badge

### Pricing

- **PRIC-01**: Free vs Premium comparison table with feature breakdown
- **PRIC-02**: Locale-aware currency formatting (R$ for PT-BR)
- **PRIC-03**: Annual vs monthly pricing toggle

## Out of Scope

| Feature | Reason |
|---------|--------|
| Redesign of internal app screens (login, chat, settings) | Focus is landing page only |
| Payment/checkout integration | Landing page displays plans, directs to signup |
| Blog or content section | Potential v2+ feature |
| Mobile native app | Web-first approach |
| Multi-page marketing funnel | Single-page landing, focused conversion |
| Server-side rendering for entire app | Only landing page benefits from SSR/SSG |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| INFRA-01 | — | Pending |
| INFRA-02 | — | Pending |
| HERO-01 | — | Pending |
| HERO-02 | — | Pending |
| HERO-03 | — | Pending |
| FEAT-01 | — | Pending |
| FEAT-02 | — | Pending |
| FEAT-03 | — | Pending |
| JRNY-01 | — | Pending |
| JRNY-02 | — | Pending |
| JRNY-03 | — | Pending |
| PERF-01 | — | Pending |
| PERF-02 | — | Pending |
| CONV-01 | — | Pending |
| SOCL-01 | — | Pending |
| SOCL-02 | — | Pending |
| ONBR-01 | — | Pending |

**Coverage:**
- v1 requirements: 17 total
- Mapped to phases: 0
- Unmapped: 17

---
*Requirements defined: 2026-04-22*
*Last updated: 2026-04-22 after initial definition*
