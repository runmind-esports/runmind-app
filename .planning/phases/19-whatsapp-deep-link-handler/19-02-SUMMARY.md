---
phase: 19-whatsapp-deep-link-handler
plan: 02
subsystem: whatsapp-cta
tags: [integration, conversion-funnel, ui-surface, cross-repo-contract, checkpoint-human-verify]
requires:
  - "Plan 01 (WhatsApp CTA feature module — components + hook + barrel)"
provides:
  - "WhatsAppCTA rendered in /settings success modal (post-checkout Stripe — D-F3)"
  - "WhatsAppCTA rendered in PlanilhaScreen (final do onboarding — D-F4)"
  - "Smoke test runbook (19-02-SMOKE-TEST.md) com 6 cenários para verificação humana"
affects:
  - "src/app/settings/page.tsx (success modal enriquecido)"
  - "src/features/onboarding/components/PlanilhaScreen.tsx (CTA antes do redirect pro chat)"
tech-stack:
  added: []
  patterns:
    - "Importação simples do barrel (`@/features/whatsapp-cta`) — sem mexer em código do componente"
    - "Override de estilo via Tailwind arbitrary variants (`[&_a]:!bg-...`) para resolver contraste em superfícies que forçam tema (PlanilhaScreen bg-white)"
    - "showQR={false} para superfícies estreitas (max-w-sm modal); showQR={true} (default) para fullscreen"
key-files:
  created:
    - .planning/phases/19-whatsapp-deep-link-handler/19-02-SMOKE-TEST.md
  modified:
    - src/app/settings/page.tsx
    - src/features/onboarding/components/PlanilhaScreen.tsx
key-decisions:
  - "Theme contrast — Opção B: override className via arbitrary Tailwind variants (`[&_a]:!bg-[#14162E] [&_a]:!text-white [&_a]:hover:!bg-[#1F2240] [&_p]:!text-[#6B7088]`) na PlanilhaScreen. Mantém o componente WhatsAppCTA frozen (Plan 01 interface) e força cores legíveis sobre o `bg-white` global da tela. Opções A (wrap em `<div className=\"dark\">`) e C (aceitar como known-issue) rejeitadas: A polui DOM com semantic wrapper só pra hack de tema; C falha no smoke test (Cenário 3)."
  - "Settings modal layout — showQR={false} confirmado: modal é `max-w-sm` (~320px área útil), QR side-by-side de 160px estouraria o layout em md+. Desktop users pegam o QR na PlanilhaScreen (fullscreen). Aceitação do trade-off documentada no plan (linha 161)."
  - "D-F4 divergence ratified: PlanilhaScreen escolhido como surface 'pós-Free' em vez de criar novo step de seleção. Razão: step não existe hoje (verificado em planejamento) e PlanilhaScreen é o último ponto autenticado do onboarding que pega 100% dos novos usuários (incluindo Free puro). Documentado no `<divergence_from_context>` do plan."
  - "Smoke test handoff: agent NÃO executa o smoke test (Task 3 é `checkpoint:human-verify`). Runbook escrito em 19-02-SMOKE-TEST.md com 6 cenários cobrindo mobile/desktop em ambas as superfícies, error states (429/503/500), e gating cross-repo. Operador roda manualmente pós-merge."
requirements-completed: []
duration: 18 min
completed: 2026-05-22
---

# Phase 19 Plan 02: WhatsApp Conversion CTA — Integração em 2 Surfaces Summary

`<WhatsAppCTA />` (entregue em Plan 01) integrado em duas superfícies autenticadas: success modal do `/settings` pós-checkout Stripe (D-F3) e `PlanilhaScreen` no final do onboarding (D-F4). Smoke test runbook com 6 cenários documentado para verificação humana operador-driven. Build e lint limpos, zero modificações ao componente Plan 01 (interface frozen respeitada).

## What was built

### Settings success modal integration (Task 1)

- Adicionado import `WhatsAppCTA` from `@/features/whatsapp-cta` em `src/app/settings/page.tsx`.
- Inserido bloco dentro de `{showSuccessModal && (...)}` antes dos botões existentes:
  - Divider sutil `<div className="my-5 h-px bg-border" />`.
  - Legenda curta: `<p className="text-xs text-foreground-muted mb-3">Continue a conversa no WhatsApp</p>`.
  - `<WhatsAppCTA variant="primary" showQR={false} className="mb-5" />`.
- `showQR={false}` deliberado — modal `max-w-sm` (~320px área útil) não cabe layout side-by-side.
- **Preservado:** `useEffect` que processa `searchParams.get('subscription')`, botões "Voltar ao chat" + "Ver meu plano", `max-w-sm` do modal, todos os outros tabs/sections.

### PlanilhaScreen integration (Task 2)

- Adicionado import `WhatsAppCTA` from `@/features/whatsapp-cta` em `src/features/onboarding/components/PlanilhaScreen.tsx`.
- Inserido bloco entre o `{error && (...)}` e o link "Ir para o chat":
  - Container com separator: `<div className="w-full mt-2 mb-6 pt-6 border-t border-[#E5E7EB] flex flex-col items-center">`.
  - Legenda: `<p className="text-sm text-[#6B7088] mb-3 text-center">Tem dúvidas? Fala com o coach no WhatsApp</p>`.
  - `<WhatsAppCTA variant="secondary" showQR={true} className="[&_a]:!bg-[#14162E] [&_a]:!text-white [&_a]:hover:!bg-[#1F2240] [&_p]:!text-[#6B7088]" />`.
- `showQR={true}` (default) — desktop vê QR via `hidden md:block` do componente; mobile só botão.
- **Theme contrast Opção B aplicada** (ver `key-decisions` acima).
- **Preservado:** botão Download verde, link "Ir para o chat", auth redirect (`if (!authLoading && !isAuthenticated) router.push('/login')`).

### Smoke test runbook (Task 3 — checkpoint:human-verify)

- Arquivo criado: `.planning/phases/19-whatsapp-deep-link-handler/19-02-SMOKE-TEST.md`.
- 6 cenários documentados:
  1. Settings modal mobile (375px) — só botão, sem QR.
  2. Settings modal desktop (1280px+) — só botão (showQR=false força).
  3. PlanilhaScreen mobile — só botão, contraste em bg-white.
  4. PlanilhaScreen desktop — botão + QR, scaneável.
  5. Error states (429 / 503 / 500) com i18n mapping.
  6. Cross-repo gating (backend live ou deferred).
- Inclui **Opção A (DevTools mock)** para quando runmid-api Phase 5 não estiver deployado.
- Agent **não executa** o smoke test — operador roda manualmente e sinaliza approval.

## Verification results

| Gate | Command | Result |
|------|---------|--------|
| Settings — import presente | `grep -q "import { WhatsAppCTA }" src/app/settings/page.tsx` | PASS |
| Settings — render presente | `grep -q "<WhatsAppCTA" src/app/settings/page.tsx` | PASS |
| Settings — showSuccessModal preservado | `grep -c "showSuccessModal" src/app/settings/page.tsx` | PASS (2 refs preservadas; 3 do setter também intactos) |
| PlanilhaScreen — import presente | `grep -q "import { WhatsAppCTA }" src/features/onboarding/components/PlanilhaScreen.tsx` | PASS |
| PlanilhaScreen — render presente | `grep -q "<WhatsAppCTA" src/features/onboarding/components/PlanilhaScreen.tsx` | PASS |
| PlanilhaScreen — router.push preservado | `grep -c "router.push" ...PlanilhaScreen.tsx` | PASS (2 refs: `/login` no useEffect, `/chat` no botão) |
| `grep -c '<WhatsAppCTA' src/app/settings/page.tsx src/features/onboarding/components/PlanilhaScreen.tsx` ≥ 2 | — | PASS (1 + 1 = 2) |
| `npm run lint` | `next lint` | PASS — só warnings preexistentes de `<img>` em arquivos não-relacionados |
| `npm run build` | `next build` | PASS — `✓ Compiled successfully`, 17 static pages, zero TS errors |
| TypeScript strict (no `any`) | grep manual nos arquivos modificados | PASS — sem casts `any` introduzidos |
| Smoke test runbook existe | `[ -f 19-02-SMOKE-TEST.md ]` | PASS |

## Commits

| Task | Commit | Title |
|------|--------|-------|
| 1 | `91bc97c` | feat(19-02): integrate WhatsAppCTA into settings success modal (D-F3) |
| 2 | `4396df8` | feat(19-02): integrate WhatsAppCTA into PlanilhaScreen (D-F4) |
| 3 | `aed2c3b` | docs(19-02): add smoke test runbook (Task 3 — human-verify checkpoint) |

## Deviations from Plan

None — plan executado exatamente como escrito.

A escolha entre Opções A/B/C para o contrast fix da PlanilhaScreen estava explícita no prompt do executor e no plan; a Opção B foi escolhida com justificativa documentada em `key-decisions` (não é uma deviation, é uma decisão exposta).

## Threat model coverage

| Threat ID | Status | Notes |
|-----------|--------|-------|
| T-19-07 (CTA renderiza em página não-auth) | mitigated | `PlanilhaScreen` tem `if (!authLoading && !isAuthenticated) router.push('/login')` antes do render; settings é alcançado apenas pelo sidebar autenticado. Plan 01 também tem `enabled: tokenStorage.getAccessToken()` no hook. Defense in depth respeitada. |
| T-19-08 (URL `?subscription=success` falseada) | accepted | Modal é informacional; `<WhatsAppCTA />` consulta endpoint JWT-gated e não confere status de assinatura. Sem escalação. (Risco residual pré-existente, não responsabilidade desta phase.) |

## Cross-repo dependency status

- **runmid-api Phase 5** (`POST /api/v1/whatsapp/init-token`) continua **pendente de deploy**. Frontend está integrado e funcional end-to-end localmente quando o endpoint estiver up.
- **chat-agent Phase 15** (consumir prefix `runmid-init-{token}` no WhatsApp inbound) é a outra ponta — fora do escopo desta phase, ver `~/Documents/siiix-platform/chat-agent/chat-agent/.planning/phases/15-whatsapp-inbound-channel/`.
- Smoke test cenários 1-5 podem rodar com mock (DevTools Overrides ou MSW); cenário 6 (end-to-end real) **aguarda runmid-api Phase 5 ship**. Documentado no runbook.

## Smoke test handoff status

**Status:** Awaiting operator execution.

Operador deve seguir `19-02-SMOKE-TEST.md` (6 cenários) e sinalizar approval no chat do orchestrator:
- `"approved"` se tudo OK.
- `"approved with notes: ..."` se passou com issues menores (follow-up).
- `"issues: ..."` se algum cenário falhou.
- `"deferred: backend not deployed"` se cenários 1-5 OK via mock mas cenário 6 aguarda backend.

A entrega de software (commits 91bc97c, 4396df8, aed2c3b) está **completa do ponto de vista do Plan 02**; o smoke test é a validação operacional pré-release.

## Decisions recorded

1. **Theme contrast Opção B** (override Tailwind arbitrary variants no callsite) — justificada em `key-decisions`. Componente Plan 01 permanece frozen, ajuste fica localizado no callsite (PlanilhaScreen), reversível em uma linha.
2. **showQR=false no modal settings** — confirmado deliberado, plan-checker Warning #3 incorporado no plan original (linha 161). Trade-off aceito: desktop users que querem QR pegam na PlanilhaScreen.
3. **PlanilhaScreen como surface "pós-Free"** (D-F4 divergence) — ratificada. Alternativas plausíveis listadas no plan, mas todas envolvem scope creep além da Phase 19.
4. **Smoke test deferred to operator** — não é deviation, é o tipo da Task 3 (`checkpoint:human-verify`). Runbook completo está disponível para qualquer operador rodar.

## Self-Check: PASSED

- All declared `key-files.created` exist on disk:
  - `[ -f .planning/phases/19-whatsapp-deep-link-handler/19-02-SMOKE-TEST.md ]` — TRUE.
- All `key-files.modified` carry the integration:
  - `grep -q "<WhatsAppCTA" src/app/settings/page.tsx` — TRUE.
  - `grep -q "<WhatsAppCTA" src/features/onboarding/components/PlanilhaScreen.tsx` — TRUE.
- 3 task commits exist on `main`: `91bc97c`, `4396df8`, `aed2c3b` (verified via `git log`).
- Plan-level `<verification>` block:
  - `npm run build` — PASS.
  - `npm run lint` — PASS (zero errors; preexisting `<img>` warnings unrelated).
  - `grep -l "WhatsAppCTA" src/app/settings/page.tsx src/features/onboarding/components/PlanilhaScreen.tsx` — both files listed.
  - Smoke test runbook documentado (Task 3 deferred a operador — válido per plan).
- Plan-level `<success_criteria>` satisfeitos:
  - `<WhatsAppCTA />` em ambas surfaces — PASS.
  - Mobile só botão; desktop botão+QR — PASS (controlado por `hidden md:block` do componente + `showQR` prop).
  - Loading/error states já cobertos pelo Plan 01 — herdado.
  - `target="_blank" rel="noopener noreferrer"` — herdado do Plan 01.
  - Build + lint limpos — PASS.
  - Smoke test (humano): pendente operador, runbook entregue.

Phase 19 (2/2 plans) — **ready to mark COMPLETE** pending operator smoke test signal.
