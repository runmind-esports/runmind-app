---
gsd_state_version: 1.0
milestone: v1.1
milestone_name: Onboarding
status: executing
stopped_at: Phase 19 plans created
last_updated: "2026-05-21T18:30:00.000Z"
last_activity: 2026-05-21
progress:
  total_phases: 3
  completed_phases: 2
  total_plans: 8
  completed_plans: 4
  percent: 50
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-04-22)

**Core value:** Do cadastro a planilha personalizada em menos de 5 minutos -- onboarding que converte visitante em corredor ativo.
**Current focus:** Phase 19 - WhatsApp Conversion CTA (planned, ready to execute)

## Current Position

Phase: 19 (WhatsApp Conversion CTA)
Plan: 2 plans created, none started
Status: Ready to execute
Last activity: 2026-05-21

Progress: [██████████░░░░░░░░░░] 57% (v1.0 complete, v1.1 in progress)

## Performance Metrics

**Velocity:**

- Total plans completed: 16 (v1.0)
- Average duration: ~2.6 min
- Total execution time: ~13 min

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01 | 2 | - | - |
| 02 | 2 | 4min | 2min |
| 03 | 2 | 6min | 3min |
| 04 | 1 | 3min | 3min |
| 05 | 2 | - | - |
| 06 | 1 | - | - |
| 07 | 1 | - | - |
| 17 | 3 | - | - |
| 18 | 2 | - | - |
| 19 | 2 (planned) | - | - |

**Recent Trend:**

- Last 5 plans: 2min, 2min, 4min, 2min, 3min
- Trend: Stable

| Phase 17 P01 | 1min | 2 tasks | 5 files |

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- [v1.1]: Backend already has RunnerProfile domain model with fields (FitnessLevel, WeeklyKmCapacity, etc.) -- build API on existing model
- [v1.1]: Onboarding flow: Signup -> Step 1 (confirm name) -> Step 2 (11-question form) -> Planilha download -> Chat
- [v1.1]: Multi-repo: frontend (Next.js here) + backend (Go at /Documents/runmid/runmid-api)
- [Phase 17]: Subscription feature module follows existing stravaApi pattern with service object + React Query hooks
- [Phase 19]: WhatsApp CTA é web-only (sem Capacitor). Renderização adaptativa via Tailwind responsive classes (sem UA detection). 23h cache no token (1h margin under 24h backend TTL). Retry: false em 429/503 (sem auto-retry, mensagem específica por errorCode).
- [Phase 19]: Divergência consciente de D-F4 documentada — não existe "step de seleção Free" no onboarding atual; usar `PlanilhaScreen` como o catch-all do funil Free.
- [Phase 19]: Analytics tracker (`whatsapp_cta_clicked`) deferido — runmid-app ainda não tem SDK de tracking instalado; componente expõe prop `onCtaClick` mas não dispara nenhum evento.

### Pending Todos

- Phase 19 plans 19-01 e 19-02 prontos pra execução.
- 19-02 tem checkpoint humano (smoke test) — depende de mock local OU runmid-api Phase 5 shippada pra teste real.

### Roadmap Evolution

- Phase 8 added: Subscription Checkout UI — Conectar frontend ao módulo de subscription do runmid-api
- Phase 18 added: Tela de Consumo de Mana — seção nas configurações com consumo diário
- Phase 19 added: WhatsApp Conversion CTA — botão "Conversar no WhatsApp" pós-checkout e pós-onboarding

### Blockers/Concerns

- Backend Go repo needs to be explored for existing RunnerProfile model before Phase 5 planning
- **Cross-repo dependency (Phase 19):** `POST /api/v1/whatsapp/init-token` é entregue pela runmid-api Phase 5 (`~/Documents/runmid/runmid-api/.planning/phases/05-whatsapp-linking-endpoints/`). Plan 19-01 pode rodar a qualquer momento (build/lint são suficientes); Plan 19-02 smoke test real precisa do backend up — alternativa: mock via DevTools/MSW.

## Session Continuity

Last session: 2026-05-21T18:30:00.000Z
Stopped at: Phase 19 plans created
Resume file: .planning/phases/19-whatsapp-deep-link-handler/19-01-PLAN.md
