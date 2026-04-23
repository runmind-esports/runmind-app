# Roadmap: RunMind

## Milestones

- ✅ **v1.0 Landing Page** - Phases 1-4 (shipped 2026-04-22)
- 🚧 **v1.1 Onboarding** - Phases 5-7 (in progress)

## Phases

<details>
<summary>v1.0 Landing Page (Phases 1-4) - SHIPPED 2026-04-22</summary>

- [x] **Phase 1: Foundation** - Translation system, route group, and layout shell that all sections depend on
- [x] **Phase 2: Core Landing Page** - Hero, features, footer, and CTA delivering the minimum viable conversion path
- [x] **Phase 3: Extended Content** - User journey timeline, social proof, onboarding differentiator, and scroll animations
- [x] **Phase 4: Dynamic Data** - API-driven Big Numbers with animated counters and graceful fallback

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
- [x] 01-01-PLAN.md -- Landing feature module: i18n translations, LanguageProvider, SectionWrapper
- [x] 01-02-PLAN.md -- Marketing route group: layout, page orchestrator, delete old page.tsx
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
- [x] 02-01-PLAN.md -- Translation dictionary updates, type system fix, and 5 UI primitives
- [x] 02-02-PLAN.md -- 5 section components and page orchestrator wiring
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
- [x] 03-01-PLAN.md -- Animation infrastructure (useInView, ScrollReveal, CSS), UI primitives (TimelineStep, StatCard), and translation dictionary
- [x] 03-02-PLAN.md -- FlowSection, GapSection, HeroSection animations, barrel exports, and page orchestrator wiring
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
- [x] 04-01-PLAN.md -- Service function, useCountUp hook, AnimatedCounter, NumbersSection, translations, and page wiring
**UI hint**: yes

</details>

### 🚧 v1.1 Onboarding (In Progress)

**Milestone Goal:** Do cadastro a planilha personalizada em menos de 5 minutos -- onboarding que converte visitante em corredor ativo.

- [ ] **Phase 5: Runner Profile API** - Backend endpoints (Go) to persist runner profile and generate training spreadsheet
- [ ] **Phase 6: Onboarding Flow** - Multi-step onboarding UI from welcome screen through 11-question runner profile form
- [ ] **Phase 7: Planilha & Completion** - "Momento aha" screen with personalized spreadsheet download and redirect to chat

## Phase Details

### Phase 5: Runner Profile API
**Goal**: Backend can receive, persist, and use a runner's profile to generate a personalized training spreadsheet
**Depends on**: Phase 4 (existing auth and API infrastructure)
**Requirements**: API-01, API-02
**Success Criteria** (what must be TRUE):
  1. A POST request with runner profile data (fitness level, weekly km, goals, pace, preferred days, injuries) persists the profile and returns success
  2. A GET request for a runner who has a saved profile returns a downloadable spreadsheet file
  3. A GET request for a runner without a saved profile returns an appropriate error response
  4. Profile data validates required fields and rejects malformed requests
**Plans**: TBD

### Phase 6: Onboarding Flow
**Goal**: New users complete a guided onboarding that captures their runner profile in a smooth, mobile-friendly multi-step experience
**Depends on**: Phase 5 (API must accept profile data)
**Requirements**: ONB-01, ONB-02, ONB-03, ONB-04, ONB-05, ONB-06, ONB-07, ONB-08, ONB-09, ONB-10, ONB-11
**Success Criteria** (what must be TRUE):
  1. After signup, user sees a welcome screen with their name pre-filled from Google/Strava and can confirm or edit it
  2. User progresses through the 11-question form with clear progress indication and can go back to previous questions
  3. Each question presents the correct input type (single select, scale, yes/no) matching the requirement specs
  4. Upon completing the last question, the profile is submitted to the backend API and the user advances to the planilha screen
  5. The entire flow is responsive and usable on mobile screens
**Plans**: TBD
**UI hint**: yes

### Phase 7: Planilha & Completion
**Goal**: Users experience the "momento aha" -- seeing their personalized training plan ready for download -- and transition into the chat coach
**Depends on**: Phase 5 (spreadsheet generation API), Phase 6 (profile submission)
**Requirements**: ONB-12, ONB-13
**Success Criteria** (what must be TRUE):
  1. After profile submission, user sees a success screen with a personalized message and a visible download button for their training spreadsheet
  2. Clicking download fetches the spreadsheet from the backend API and saves it to the user's device
  3. After download (or explicit skip/continue action), user is redirected to the chat screen
**Plans**: TBD
**UI hint**: yes

## Progress

**Execution Order:**
Phases execute in numeric order: 5 -> 6 -> 7

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Foundation | v1.0 | 2/2 | Complete | 2026-04-22 |
| 2. Core Landing Page | v1.0 | 2/2 | Complete | 2026-04-22 |
| 3. Extended Content | v1.0 | 2/2 | Complete | 2026-04-22 |
| 4. Dynamic Data | v1.0 | 1/1 | Complete | 2026-04-22 |
| 5. Runner Profile API | v1.1 | 0/? | Not started | - |
| 6. Onboarding Flow | v1.1 | 0/? | Not started | - |
| 7. Planilha & Completion | v1.1 | 0/? | Not started | - |
