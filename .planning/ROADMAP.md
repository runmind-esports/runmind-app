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

**Milestone Goal:** Acompanhamento de treinos via Strava — dashboard com métricas, calendário semanal, histórico de atividades e detalhe de treino. Dados puxados automaticamente do Strava. Chat acessível pelo menu.

- [x] **Phase 8: Dashboard Premium** - Redesign do dashboard de treino com progresso semanal, últimas 3 atividades, comparativo semanal, streak de corrida e CTA do coach IA (completed 2026-04-25)
- [x] **Phase 9: Strava Activities Service** - Camada de serviço e hooks para consumir atividades do Strava via runmid-api (completed 2026-04-25)
- [x] **Phase 10: Dashboard de Métricas** - Métricas do mês (km total, corridas, pace médio), evolução, última atividade (completed 2026-04-25)
- [x] **Phase 11: Calendário Semanal** - Cards por dia com atividades do Strava, navegação entre semanas (completed 2026-04-25)
- [x] **Phase 12: Histórico de Atividades** - Lista paginada com filtros e tela de detalhe completo (completed 2026-04-25)
- [x] **Phase 13: Treino do Dia & Execução** - Detalhes da atividade com splits, zonas FC, elevação, e feedback para IA (completed 2026-04-25)

## Phase Details (v2.0)

### Phase 8: Dashboard Premium
**Goal**: Dashboard de treino redesenhado com anel de progresso semanal, 3 atividades recentes, comparativo semanal, streak de corrida e CTA contextual do coach IA
**Depends on**: Phase 7 (onboarding completo)
**Requirements**: NAV-01, NAV-02, NAV-03
**Success Criteria**:
  1. Anel circular (Apple Fitness+ style) mostra progresso semanal de km com meta editavel
  2. 3 atividades recentes em cards compactos horizontais com nome, distancia, pace e data relativa
  3. Comparativo semanal mostra diferenca de km vs semana passada com seta up/down
  4. Streak de semanas consecutivas com pelo menos 1 corrida exibido com icone de fogo
  5. CTA do coach IA com sugestao contextual baseada nos dados do Strava
  6. Ao clicar no CTA, abre o chat com prompt pre-preenchido
**UI hint**: yes
**Plans**: 2 plans
Plans:
- [x] 08-01-PLAN.md -- Data layer: useDashboardData hook, dashboardHelpers utilities, WeeklyProgressRing SVG component, formatRelativeDate
- [x] 08-02-PLAN.md -- UI composition: RecentActivityCard, WeekComparison, StreakBadge, CoachCTA, DashboardScreen rebuild, chat pre-fill integration

### Phase 9: Strava Activities Service
**Goal**: Frontend tem camada de serviço para buscar e cachear atividades do Strava
**Depends on**: Phase 8 (navegação)
**Requirements**: SVC-01, SVC-02, SVC-03
**Success Criteria**:
  1. Hook `useStravaActivities` busca atividades recentes via `runmidApiClient`
  2. Hook `useStravaStats` busca estatísticas agregadas (km total, corridas, pace médio)
  3. Hook `useStravaActivityDetail` busca detalhes de uma atividade (splits, zonas FC)
  4. Dados cacheados com React Query (stale time 5min)
  5. Estados de loading, erro e "Strava não conectado" tratados
**UI hint**: no
**Plans**: 1 plan
Plans:
- [x] 09-01-PLAN.md -- Strava activities service layer: types, API methods, React Query hooks, barrel exports

### Phase 10: Dashboard de Métricas
**Goal**: Usuário vê dashboard com métricas reais do Strava e acesso ao chat
**Depends on**: Phase 9 (serviço de atividades)
**Requirements**: DASH-01, DASH-02, DASH-03
**Success Criteria**:
  1. Cards de métricas: km total do mês, número de corridas, pace médio — dados do Strava
  2. Comparação com mês anterior (ex: "+12km vs julho")
  3. Card da última atividade com resumo (distância, pace, data)
  4. Botão "Falar com coach" leva ao chat
  5. Se Strava não conectado, CTA para conectar
**UI hint**: yes
**Plans**: 1 plan
Plans:
- [x] 10-01-PLAN.md -- Dashboard components (MetricCard, LastActivityCard, StravaConnectCTA, DashboardScreen), formatters, route wiring

### Phase 11: Calendário Semanal
**Goal**: Usuário vê atividades do Strava da semana em cards por dia
**Depends on**: Phase 9 (serviço de atividades)
**Requirements**: WEEK-01, WEEK-02, WEEK-03
**Success Criteria**:
  1. 7 cards (seg-dom) com atividades do Strava (tipo, distância, pace, duração)
  2. Dias com atividade = card verde, dias sem = card cinza, hoje = destaque
  3. Ícone por tipo de atividade (Corrida, Caminhada, Ciclismo)
  4. Seletor de semana para navegar semanas anteriores
  5. Resumo da semana no topo (km total, corridas, tempo total)
**UI hint**: yes
**Plans**: 1 plan
Plans:
- [x] 11-01-PLAN.md -- Week navigation hook, WeekSelector, DayCard, WeekSummary, WeekScreen, route wiring

### Phase 12: Histórico de Atividades
**Goal**: Usuário vê lista completa de atividades com filtros e tela de detalhe
**Depends on**: Phase 9 (serviço de atividades)
**Requirements**: HIST-01, HIST-02, HIST-03
**Success Criteria**:
  1. Lista paginada de atividades com scroll infinito
  2. Cada item mostra: data, tipo, distância, pace, duração, FC média
  3. Filtros por tipo (corrida, caminhada, ciclismo) e período
  4. Ao tocar em uma atividade, abre tela de detalhe com splits, zonas FC, elevação, cadência
  5. Botão "Analisar com IA" no detalhe abre chat com contexto da atividade
**UI hint**: yes
**Plans**: 1 plan
Plans:
- [x] 12-01-PLAN.md -- Infinite scroll list, filters, activity detail with splits/zones, route wiring

### Phase 13: Treino do Dia & Execução
**Goal**: Usuário vê detalhes do treino do dia com etapas e pode registrar conclusão com métricas
**Depends on**: Phase 11 (calendário semanal), Phase 12 (histórico)
**Requirements**: EXEC-01, EXEC-02, EXEC-03
**Success Criteria**:
  1. Tela mostra partes do treino (Parte 1, 2, 3...) com descrição de cada etapa
  2. Usuário marca treino como concluído e vê resumo (distância, tempo, pace)
  3. Se Strava conectado, puxa dados reais da atividade (mapa, FC, splits)
  4. Botão "Atualizar a IA" envia feedback do treino para o coach
**UI hint**: yes
**Plans**: 1 plan
Plans:
- [x] 13-01-PLAN.md -- Workout types, WorkoutParts, WorkoutSummary, WorkoutScreen, route wiring

### Phase 14: Projetos — Backend (chat-agent)
**Goal**: Chat-agent suporta projetos para agrupar conversas com ícone customizável
**Depends on**: Nenhuma (aditivo, sem breaking changes)
**Requirements**: PROJ-01, PROJ-02
**Success Criteria**:
  1. Tabela `projects` criada (id, user_id, name, icon, created_at, updated_at)
  2. Coluna `project_id` (nullable FK) adicionada em `conversations`
  3. `POST /api/v1/chat/projects` cria projeto com nome e ícone
  4. `GET /api/v1/chat/projects` lista projetos do usuário
  5. `PUT /api/v1/chat/projects/:id` renomeia / troca ícone
  6. `DELETE /api/v1/chat/projects/:id` deleta projeto (conversas voltam pra project_id null)
  7. `PATCH /api/v1/chat/conversations/:id/move` move conversa pra projeto
  8. `GET /api/v1/chat/conversations/list` aceita query param opcional `project_id` pra filtrar
**UI hint**: no
**Repo**: siiix-platform/chat-agent

### Phase 15: Projetos — Frontend (runmid-app)
**Goal**: Usuário pode criar, gerenciar projetos e organizar conversas no sidebar
**Depends on**: Phase 14 (backend de projetos)
**Requirements**: PROJ-03, PROJ-04, PROJ-05
**Success Criteria**:
  1. Seção "Projetos" no sidebar com botão "Novo projeto"
  2. Ao criar projeto, usuário define nome e escolhe ícone de uma galeria de Material Design icons
  3. Projetos listados no sidebar com ícone customizado e nome (máx 3 visíveis + "Ver mais")
  4. Ao clicar num projeto, abre lista de conversas daquele projeto
  5. Usuário pode mover conversas existentes para um projeto (arrastar ou menu de contexto)
  6. Conversas sem projeto aparecem na lista geral "Conversas" abaixo dos projetos
  7. Usuário pode renomear, trocar ícone e deletar projeto (conversas voltam pra lista geral)
**UI hint**: yes
**Plans**: 2 plans
Plans:
- [x] 15-01-PLAN.md -- Service layer + hooks: projectsApi, useProjects hook, types, barrel exports
- [x] 15-02-PLAN.md -- UI components: IconPicker, CreateProjectModal, ProjectSection, ConversationItem context menu, sidebar wiring

## Progress

**Execution Order:**
Phases execute in numeric order: 5 -> 6 -> 7 -> 8 -> 9 -> 10 -> 11 -> 12 -> 13 -> 14 -> 15

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Foundation | v1.0 | 2/2 | Complete | 2026-04-22 |
| 2. Core Landing Page | v1.0 | 2/2 | Complete | 2026-04-22 |
| 3. Extended Content | v1.0 | 2/2 | Complete | 2026-04-22 |
| 4. Dynamic Data | v1.0 | 1/1 | Complete | 2026-04-22 |
| 5. Runner Profile API | v1.1 | 2/2 | Complete | - |
| 6. Onboarding Flow | v1.1 | 1/3 | In progress | - |
| 7. Planilha & Completion | v1.1 | 1/1 | Complete | - |
| 8. Dashboard Premium | v2.0 | 2/2 | Complete    | 2026-04-25 |
| 9. Strava Activities Service | v2.0 | 1/1 | Complete    | 2026-04-25 |
| 10. Dashboard de Métricas | v2.0 | 1/1 | Complete    | 2026-04-25 |
| 11. Calendário Semanal | v2.0 | 1/1 | Complete    | 2026-04-25 |
| 12. Histórico de Atividades | v2.0 | 1/1 | Complete    | 2026-04-25 |
| 13. Treino do Dia & Execução | v2.0 | 1/1 | Complete    | 2026-04-25 |
| 14. Projetos Backend | v2.0 | 0/0 | Complete    | 2026-04-25 |
| 15. Projetos Frontend | v2.0 | 2/2 | Complete    | 2026-04-25 |

### Phase 8: Onboarding Visual Upgrade — Adicionar imagens ilustrativas, animações e visual premium nas telas de onboarding (welcome, questions, planilha). Inspirado em apps como Nike Run Club e Strava onboarding. Mobile-first.

**Goal:** [To be planned]
**Requirements**: TBD
**Depends on:** Phase 7
**Plans:** 2/2 plans complete

Plans:
- [ ] TBD (run /gsd-plan-phase 8 to break down)

### Phase 8: Onboarding Visual Upgrade — Imagens ilustrativas, animações e visual premium nas telas de onboarding. Mobile-first, inspirado em NRC e Strava.

**Goal:** [To be planned]
**Requirements**: TBD
**Depends on:** Phase 7
**Plans:** 0 plans

Plans:
- [ ] TBD (run /gsd-plan-phase 8 to break down)
