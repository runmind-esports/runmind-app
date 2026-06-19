---
phase: quick-260619-fv3
plan: 01
subsystem: pwa
tags: [pwa, landing, install, manifest, service-worker, ios]
dependency_graph:
  requires: [public/brand/runmind-logo-1024.png]
  provides:
    - public/manifest.json
    - public/sw.js
    - public/icons/icon-192.png
    - public/icons/icon-512.png
    - src/components/RegisterSW.tsx
    - src/components/InstallPWAButton.tsx
  affects:
    - src/app/layout.tsx
    - src/app/page.tsx
tech_stack:
  added: []
  patterns:
    - "Hand-written PWA (manifest + minimal SW) — no next-pwa dependency"
    - "Client-side install gating: capture beforeinstallprompt for Chromium, UA-detect for iOS Safari"
    - "Standalone detection via matchMedia('(display-mode: standalone)') + navigator.standalone (iOS)"
key_files:
  created:
    - public/manifest.json
    - public/sw.js
    - public/icons/icon-192.png
    - public/icons/icon-512.png
    - src/components/RegisterSW.tsx
    - src/components/InstallPWAButton.tsx
    - .planning/quick/260619-fv3-pwa-install-button-landing-page/SMOKE-TEST.md
  modified:
    - src/app/layout.tsx
    - src/app/page.tsx
decisions:
  - "Zero new npm deps: PNGs gerados via macOS sips, manifest e sw.js escritos à mão (evita Workbox opinionated config do next-pwa)."
  - "Service worker é shim mínimo (install + activate + fetch passthrough) — satisfaz critério de install do Chromium sem cachear assets (evita risco de servir bundle stale)."
  - "Botão 'Instalar app' usa estilo SECUNDÁRIO outlined no hero — não compete com a CTA primária 'Conversar no WhatsApp'."
  - "themeColor + appleWebApp no metadata.ts (Next 14.2). Warning de deprecation aceitável; migração para viewport export ficou fora de escopo."
  - "Ícones declarados como 'any maskable' nos dois tamanhos. Reversível para 'any' caso o cropping maskable produza recorte ruim em algum launcher Android."
metrics:
  duration_minutes: 6
  tasks_completed: 4
  files_created: 7
  files_modified: 2
  commits: 3
  completed_date: 2026-06-19
---

# Quick Task 260619-fv3: PWA Install Button on Landing Page — Summary

**One-liner:** Landing `/` agora é instalável como PWA em Android (prompt nativo do Chromium) e iOS (modal PT-BR explicando o flow do Share Sheet), sem adicionar dependências npm.

## What changed

| # | Task | Files | Commit |
|---|------|-------|--------|
| 1 | Generate PWA static assets (icons + manifest + SW) | `public/icons/icon-192.png`, `public/icons/icon-512.png`, `public/manifest.json`, `public/sw.js` | `ec431a9` |
| 2 | Wire manifest + SW registration into root layout | `src/components/RegisterSW.tsx`, `src/app/layout.tsx` | `8cf7da1` |
| 3 | InstallPWAButton + mount on landing hero | `src/components/InstallPWAButton.tsx`, `src/app/page.tsx` | `fa61dae` |
| 4 | Smoke verify (lint + build) + PT-BR runbook | `.planning/quick/260619-fv3-pwa-install-button-landing-page/SMOKE-TEST.md` | (docs — committed by orchestrator) |

## How it works

1. **`public/manifest.json`** — declara identidade do app (nome, ícones, `start_url=/`, `display=standalone`, `theme_color=#00F048`) que o OS usa para registrar o app instalado.
2. **`public/sw.js`** — service worker mínimo (install + activate + fetch passthrough vazio). A presença do listener `fetch` é o que satisfaz o critério "has a fetch handler" do Chromium para instalabilidade. Sem cache → nenhum risco de servir bundle stale.
3. **`RegisterSW`** (client component em `body`) registra `/sw.js` uma vez no mount, com guard de `'serviceWorker' in navigator`.
4. **`InstallPWAButton`** detecta no mount:
   - `isIOS` via UA regex `/iPad|iPhone|iPod/`
   - `isStandalone` via `matchMedia('(display-mode: standalone)')` + `navigator.standalone`
   - Captura `beforeinstallprompt` (Chromium) e oculta o botão após `appinstalled`.

   Render logic:
   - `isStandalone` → `null` (já instalado)
   - `canInstall` (Chromium) → botão "Instalar app" → `deferredPrompt.prompt()` no click
   - `isIOS` → botão "Instalar app" → abre modal PT-BR com 3 passos
   - Caso contrário → `null` (Firefox desktop, etc.)
5. **`src/app/page.tsx`** — `<InstallPWAButton />` montado como terceiro filho do flex container CTA do hero, com estilo outlined secundário para não competir com a CTA WhatsApp primária.

## Deviations from Plan

None — plan executado exatamente como escrito. Nenhum bug auto-fixado, nenhum gate de autenticação, nenhuma decisão arquitetural levantada.

## Verification

- `npm run lint`: exit 0. Apenas warnings pré-existentes de `<img>` em outros arquivos (não introduzidos por este plan).
- `npm run build`: exit 0. Compilou com sucesso. Build emite warnings de `themeColor` deprecation no metadata export para várias páginas (esperado conforme o plan — Next.js 14.2 ainda aceita; migração para `viewport` export ficou fora de escopo).
- `npx tsc --noEmit -p .`: exit 0. Nenhum erro de TypeScript.
- Static assets servidos no build: `/manifest.json`, `/sw.js`, `/icons/icon-192.png`, `/icons/icon-512.png` (sob `public/`, servidos diretamente pelo Next.js).
- `package.json` sem mudanças (zero novas dependências).

## Known Stubs

None.

## Threat Flags

None — todos os surface novos (manifest, SW, install button) foram cobertos no `<threat_model>` do PLAN.

## Next steps (handoff)

- Operador roda os 5 cenários de `SMOKE-TEST.md` (Chrome desktop, Chrome Android, Safari iOS, Firefox desktop, já-instalado) e marca sign-off.
- Deploy em produção via `./scripts/deploy.sh prod` para validar com `https://runmind-app-620849332552.us-central1.run.app` (manifest + SW só funcionam em HTTPS ou localhost).

## Self-Check: PASSED

- Files created/modified verified present on disk.
- All three task commits (`ec431a9`, `8cf7da1`, `fa61dae`) exist in git log.
- Lint and build gates passed.
