# Roadmap: RunMind Landing Page

## Overview

This roadmap delivers a bilingual landing page that converts visitors into RunMind users. The build order follows a strict dependency chain: translation infrastructure and route isolation first (everything depends on it), then the core conversion path (hero, features, CTA, footer), then extended content that adds depth and differentiation (user journey, social proof, scroll reveals), and finally the API-driven Big Numbers section which requires backend coordination and has graceful fallback.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Foundation** - Translation system, route group, and layout shell that all sections depend on
- [x] **Phase 2: Core Landing Page** - Hero, features, footer, and CTA delivering the minimum viable conversion path (completed 2026-04-22)
- [ ] **Phase 3: Extended Content** - User journey timeline, social proof, onboarding differentiator, and scroll animations
- [ ] **Phase 4: Dynamic Data** - API-driven Big Numbers with animated counters and graceful fallback

## Phase Details

### Phase 1: Foundation
**Goal**: Visitors can load the landing page at `/` and see a bilingual shell without affecting existing app routes
**Depends on**: Nothing (first phase)
**Requirements**: INFRA-01, INFRA-02
**Success Criteria** (what must be TRUE):
  1. Visiting `/` renders the marketing layout without loading app providers (QueryProvider, auth state)
  2. A LanguageProvider context serves PT-BR translations by default and English when toggled
  3. Existing routes (`/login`, `/signup`, `/chat`, `/settings`, `/auth/strava/callback`) continue working unchanged
**Plans**: 2 plans
Plans:
- [x] 01-01-PLAN.md — Landing feature module: i18n translations, LanguageProvider, SectionWrapper
- [x] 01-02-PLAN.md — Marketing route group: layout, page orchestrator, delete old page.tsx
**UI hint**: yes

### Phase 2: Core Landing Page
**Goal**: Visitors see a complete conversion path from headline to signup CTA with feature highlights and footer
**Depends on**: Phase 1
**Requirements**: HERO-01, HERO-02, FEAT-01, FEAT-02, FEAT-03, CONV-01, SOCL-02
**Success Criteria** (what must be TRUE):
  1. Visitor sees an outcome-driven headline, subheadline, and a CTA button that navigates to `/signup`
  2. Visitor sees a stylized app mockup placeholder with Strava social login visible in the hero
  3. Visitor sees 3 feature cards (Chat IA 24/7, Planilhas Dinamicas, Sincronizacao Inteligente) with icons, plus Strava/Garmin badges
  4. Visitor sees 4 runner profile cards with real Brazilian market statistics
  5. Visitor sees a prominent bottom-of-page CTA and a footer with navigation links, logo, and tagline
**Plans**: 2 plans
Plans:
- [x] 02-01-PLAN.md — Translation dictionary updates, type system fix, and 5 UI primitives
- [x] 02-02-PLAN.md — 5 section components and page orchestrator wiring
**UI hint**: yes

### Phase 3: Extended Content
**Goal**: Visitors understand the full user journey, see social proof addressing market pain, and experience polished scroll-driven reveals
**Depends on**: Phase 2
**Requirements**: JRNY-01, JRNY-02, JRNY-03, SOCL-01, ONBR-01, HERO-03
**Success Criteria** (what must be TRUE):
  1. Visitor sees a 5-step visual timeline from Strava login to profile evolution, with Brazilian amateur runner metrics
  2. Journey steps and sections reveal progressively as user scrolls into view
  3. Visitor sees the "Gap da Solidao" section with statistics on solo runners and the RunMind democratization message
  4. Journey section clearly communicates that onboarding captures data Strava does not provide (objectives, fitness level, limitations)
  5. Hero elements animate in on page load (fade/slide-in)
**Plans**: 2 plans
Plans:
- [x] 03-01-PLAN.md — Animation infrastructure (useInView, ScrollReveal, CSS), UI primitives (TimelineStep, StatCard), and translation dictionary
- [x] 03-02-PLAN.md — FlowSection, GapSection, HeroSection animations, barrel exports, and page orchestrator wiring
**UI hint**: yes

### Phase 4: Dynamic Data
**Goal**: Visitors see real performance metrics from the API that build credibility with animated counter effects
**Depends on**: Phase 2
**Requirements**: PERF-01, PERF-02
**Success Criteria** (what must be TRUE):
  1. Visitor sees Big Numbers (Volume Total, Pace Medio, Engajamento) populated from the runmidApiClient API
  2. Numbers animate with a counter effect when the section scrolls into view
  3. If the API is unavailable, hardcoded fallback values display without layout shift or loading spinners
**Plans**: 1 plan
Plans:
- [x] 04-01-PLAN.md — Service function, useCountUp hook, AnimatedCounter, NumbersSection, translations, and page wiring
**UI hint**: yes

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 0/2 | Planning complete | - |
| 2. Core Landing Page | 2/2 | Complete   | 2026-04-22 |
| 3. Extended Content | 0/2 | Planning complete | - |
| 4. Dynamic Data | 0/1 | Planning complete | - |
