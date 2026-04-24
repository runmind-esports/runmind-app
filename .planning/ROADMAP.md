# Roadmap: RunMind

## Milestones

- ✅ **v1.0 Landing Page** - Phases 1-4 (shipped 2026-04-22)
- 🚧 **v1.1 Onboarding** - Phases 5-7 (in progress)
- 📋 **v2.0 Training Dashboard** - Phases 8-14 (planned)

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

### v1.1 Onboarding (In Progress)

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
**Plans**: 2 plans
Plans:
- [x] 05-01-PLAN.md -- Extend RunnerProfile with 4 new onboarding fields across domain, DTO, handler, repo, and DB schema
- [x] 05-02-PLAN.md -- XLSX spreadsheet generation endpoint with excelize + frontend onboarding service layer

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
**Plans**: 3 plans
Plans:
- [x] 06-01-PLAN.md -- useOnboarding hook, translations module, and input primitives (OptionButton, ScaleInput, YesNoInput)
- [ ] 06-02-PLAN.md -- OnboardingFlow orchestrator, WelcomeStep, QuestionStep, ProgressBar, OnboardingNavigation, page route, and animations
- [ ] 06-03-PLAN.md -- Signup redirect chain wiring to /onboarding
**UI hint**: yes

### Phase 7: Planilha & Completion
**Goal**: Users experience the "momento aha" -- seeing their personalized training plan ready for download -- and transition into the chat coach
**Depends on**: Phase 5 (spreadsheet generation API), Phase 6 (profile submission)
**Requirements**: ONB-12, ONB-13
**Success Criteria** (what must be TRUE):
  1. After profile submission, user sees a success screen with a personalized message and a visible download button for their training spreadsheet
  2. Clicking download fetches the spreadsheet from the backend API and saves it to the user's device
  3. After download (or explicit skip/continue action), user is redirected to the chat screen
**Plans**: 1 plan
Plans:
- [x] 07-01-PLAN.md -- Planilha success screen with spreadsheet download and chat redirect
**UI hint**: yes

### v2.0 Training Dashboard (Planned)

**Milestone Goal:** Dashboard de treino completo — do planejamento à execução diária, com visão semanal, calendário mensal e tracking de progresso. Home deixa de ser chat e passa a ser dashboard de treino. Chat acessível pelo menu.

- [ ] **Phase 8: App Shell & Navigation** - Menu principal com tabs (Home, Meu Treino, Semana, Desempenho), roteamento, layout compartilhado
- [ ] **Phase 9: Home Dashboard** - Tela principal com métricas (km total, progresso), conquistas, e botão de acesso ao chat
- [ ] **Phase 10: Criar Plano de Treino (Backend)** - Endpoints no runmid-api para geração de plano via IA, CRUD de workouts, e tracking de conclusão
- [ ] **Phase 11: Criar Plano de Treino (Frontend)** - Fluxo de criação de plano: seleção de objetivo, data da prova, geração via IA, confirmação
- [ ] **Phase 12: Visão Semanal** - Cards por dia com tipo de treino, tempo, variações, status (concluído/não realizado/pendente), marcação de conclusão
- [ ] **Phase 13: Calendário Mensal (Meu Treino)** - Calendário com dias coloridos por status, lista de atividades do dia selecionado, integração Strava
- [ ] **Phase 14: Treino do Dia & Execução** - Tela de execução do treino com partes/etapas, conclusão, resumo com mapa e métricas do Strava

## Phase Details (v2.0)

### Phase 8: App Shell & Navigation
**Goal**: App tem navegação principal com tabs que permite acessar todas as seções sem depender do chat como tela principal
**Depends on**: Phase 7 (onboarding completo)
**Requirements**: NAV-01, NAV-02, NAV-03
**Success Criteria**:
  1. Usuário autenticado vê menu inferior com tabs: Home, Meu Treino, Semana, Desempenho
  2. Tab "Chat" no menu leva à tela de chat existente (mesma funcionalidade, nova rota ou acesso)
  3. Navegação entre tabs mantém estado (não recarrega dados ao voltar)
  4. Layout compartilhado com header e bottom nav em todas as telas autenticadas
**UI hint**: yes

### Phase 9: Home Dashboard
**Goal**: Usuário vê sua dashboard pessoal com métricas de corrida, progresso do plano ativo e conquistas
**Depends on**: Phase 8 (shell de navegação)
**Requirements**: DASH-01, DASH-02, DASH-03
**Success Criteria**:
  1. Dashboard mostra quilometragem total do mês e progresso percentual do plano ativo
  2. Seção de conquistas/marcos mostra badges (ex: "6 meses de treino")
  3. Botão "Dialogar com IA sobre seu treino" abre o chat com contexto
  4. Sem campo de input de chat na home — chat é acessado pelo menu
**UI hint**: yes

### Phase 10: Criar Plano de Treino (Backend)
**Goal**: Backend suporta criação, leitura e tracking de planos de treino com workouts individuais
**Depends on**: Phase 5 (runner profile API já existente)
**Requirements**: PLAN-01, PLAN-02, PLAN-03, PLAN-04
**Success Criteria**:
  1. POST /training/plans cria plano com objetivo, data de prova e gera workouts via IA
  2. GET /training/plans/active retorna plano ativo com workouts da semana
  3. PATCH /workouts/:id/complete marca workout como concluído com dados opcionais do Strava
  4. GET /workouts/week retorna workouts da semana atual com status
  5. GET /logs/weekly-review retorna análise semanal de aderência
**UI hint**: no

### Phase 11: Criar Plano de Treino (Frontend)
**Goal**: Usuário cria um plano de treino personalizado através de um fluxo guiado
**Depends on**: Phase 10 (API de planos), Phase 8 (navegação)
**Requirements**: PLAN-05, PLAN-06, PLAN-07
**Success Criteria**:
  1. Usuário seleciona objetivo (5k, 10k, 21k, 42k) e data da prova
  2. Sistema mostra preview do plano gerado pela IA com semanas e sessões
  3. Usuário pode confirmar, ajustar ou regenerar o plano
  4. Plano confirmado aparece nas telas de Semana e Meu Treino
**UI hint**: yes

### Phase 12: Visão Semanal
**Goal**: Usuário visualiza e interage com o treino semanal em cards por dia
**Depends on**: Phase 10 (API workouts), Phase 8 (navegação)
**Requirements**: WEEK-01, WEEK-02, WEEK-03
**Success Criteria**:
  1. Tela mostra 7 cards (seg-dom) com tipo de treino, duração, variações
  2. Card verde = concluído, vermelho = não realizado, cinza = pendente/futuro
  3. Usuário pode marcar treino como concluído diretamente do card
  4. Dias de descanso mostram "Dia off — descanse!"
  5. Seletor de semana permite navegar entre semanas do plano
**UI hint**: yes

### Phase 13: Calendário Mensal (Meu Treino)
**Goal**: Usuário vê visão mensal do plano com calendário colorido e atividades do dia
**Depends on**: Phase 10 (API workouts), Phase 8 (navegação)
**Requirements**: CAL-01, CAL-02, CAL-03
**Success Criteria**:
  1. Calendário mensal com dias coloridos: verde=concluído, vermelho=perdido, amarelo=hoje, cinza=futuro
  2. Ao tocar em um dia, mostra lista de atividades programadas (Alongamento, Musculação, Corrida)
  3. Navegação entre meses
  4. Integração com dados do Strava para auto-completar treinos realizados
**UI hint**: yes

### Phase 14: Treino do Dia & Execução
**Goal**: Usuário vê detalhes do treino do dia com etapas e pode registrar conclusão com métricas
**Depends on**: Phase 12 (visão semanal para navegação)
**Requirements**: EXEC-01, EXEC-02, EXEC-03
**Success Criteria**:
  1. Tela mostra partes do treino (Parte 1, 2, 3...) com descrição de cada etapa
  2. Usuário marca treino como concluído e vê resumo (distância, tempo, pace)
  3. Se Strava conectado, puxa dados reais da atividade (mapa, FC, splits)
  4. Botão "Atualizar a IA" envia feedback do treino para o coach
**UI hint**: yes

## Progress

**Execution Order:**
Phases execute in numeric order: 5 -> 6 -> 7 -> 8 -> 9 -> 10 -> 11 -> 12 -> 13 -> 14

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Foundation | v1.0 | 2/2 | Complete | 2026-04-22 |
| 2. Core Landing Page | v1.0 | 2/2 | Complete | 2026-04-22 |
| 3. Extended Content | v1.0 | 2/2 | Complete | 2026-04-22 |
| 4. Dynamic Data | v1.0 | 1/1 | Complete | 2026-04-22 |
| 5. Runner Profile API | v1.1 | 2/2 | Complete | - |
| 6. Onboarding Flow | v1.1 | 0/3 | Not started | - |
| 7. Planilha & Completion | v1.1 | 0/1 | Not started | - |
| 8. App Shell & Navigation | v2.0 | 0/0 | Planned | - |
| 9. Home Dashboard | v2.0 | 0/0 | Planned | - |
| 10. Criar Plano (Backend) | v2.0 | 0/0 | Planned | - |
| 11. Criar Plano (Frontend) | v2.0 | 0/0 | Planned | - |
| 12. Visão Semanal | v2.0 | 0/0 | Planned | - |
| 13. Calendário Mensal | v2.0 | 0/0 | Planned | - |
| 14. Treino do Dia | v2.0 | 0/0 | Planned | - |
