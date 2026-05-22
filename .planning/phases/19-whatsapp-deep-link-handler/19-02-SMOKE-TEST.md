# Phase 19 Plan 02 — Smoke Test Runbook (Human Verification)

**Status:** Awaiting operator execution
**Prepared by:** gsd-executor on 2026-05-22
**Triggers Task 3 checkpoint approval signal:** Type `"approved"` after running all 6 cenários, OR describe issues found.

---

## Pre-conditions

Antes de rodar qualquer cenário, garanta:

1. **App rodando local:**
   ```bash
   cd /Users/douglas.mesquita/Documents/runmid/runmid-app
   npm run dev
   ```
   App sobe em `http://localhost:3000` (ou porta configurada).

2. **Conta de teste autenticada** (login Google/Strava no app, JWT válido em localStorage).

3. **Estado do backend (`runmid-api` Phase 5):**
   - Se `POST /api/v1/whatsapp/init-token` está deployado e ativo → use cenários "live" (backend real).
   - Se ainda não está deployado → use **Opção A (MSW/DevTools mock)** abaixo.

4. **Browser DevTools abertos** (Chrome/Firefox), painel Network ativo, console limpo.

### Opção A — Mock do endpoint (recomendado se backend não deployado)

No Chrome DevTools, aba "Network", aba "Overrides" (ou via extensão "Resource Override"), interceptar:

`POST http://localhost:8081/api/v1/whatsapp/init-token` (ou a base URL configurada)

Retornar:

```json
{
  "token": "test-smoke-123",
  "walink": "https://wa.me/5511999999999?text=runmid-init-test-smoke-123",
  "expiresAt": "2027-01-01T00:00:00Z"
}
```

Status 200. Para cenários de erro (5), trocar response status por 429, 503, 500 conforme cenário.

---

## Cenário 1 — Settings success modal em mobile (375px)

**Objetivo:** Confirmar que o CTA do WhatsApp aparece dentro do modal pós-checkout em viewport mobile, com **apenas o botão** (sem QR).

**Steps:**
1. No DevTools, ativar device emulation → "iPhone SE" (375×667) ou viewport custom 375×800.
2. Visitar `http://localhost:3000/settings?subscription=success`.
3. Aguardar modal "Assinatura ativada!" aparecer (animação `zoom-in-95 fade-in`).
4. Inspecionar o modal visualmente.

**Expected results:**
- [ ] Modal `max-w-sm` aparece centralizado.
- [ ] Mensagem "Continue a conversa no WhatsApp" visível em cinza pequeno (`text-xs text-foreground-muted`).
- [ ] Botão "Conversar no WhatsApp" verde (`#00F048`) visível, com ícone `MessageCircle`.
- [ ] **QR NÃO aparece** (deliberado via `showQR={false}` — modal estreito demais).
- [ ] Botões "Voltar ao chat" e "Ver meu plano" continuam visíveis e clicáveis abaixo.
- [ ] Divider `h-px bg-border` visível entre o título e o CTA WhatsApp.
- [ ] Nenhum console error.

---

## Cenário 2 — Settings success modal em desktop (1280px+)

**Objetivo:** Confirmar que mesmo em desktop o modal mantém o layout enxuto (sem QR), por causa do `showQR={false}` deliberado.

**Steps:**
1. Desativar device emulation, viewport ≥ 1280px.
2. Visitar `http://localhost:3000/settings?subscription=success`.
3. Aguardar modal aparecer.

**Expected results:**
- [ ] Modal aparece com mesmo `max-w-sm` (não estica em desktop).
- [ ] **QR continua oculto** (`showQR={false}` força — mesmo em md+ viewport).
- [ ] Botão "Conversar no WhatsApp" visível, com bom contraste em fundo `bg-background-secondary`.
- [ ] Layout vertical (botão acima dos botões "Voltar ao chat" / "Ver meu plano").
- [ ] Clicar no botão WhatsApp abre nova aba (`target="_blank"`) com URL `wa.me/...`.

---

## Cenário 3 — PlanilhaScreen em mobile (375px)

**Objetivo:** Confirmar que o CTA aparece no final do onboarding em mobile, com **apenas o botão** (QR escondido via `hidden md:block`), e que o **contraste sobre `bg-white`** está OK (validação principal da Opção B do contrast fix).

**Steps:**
1. DevTools → viewport mobile 375×800.
2. Completar onboarding até o `PlanilhaScreen` (ou navegar direto pra `http://localhost:3000/planilha` se autenticado e perfil completo).
3. Inspecionar visualmente.

**Expected results:**
- [ ] Botão verde "Baixar planilha" (`#00F048`) visível e clicável.
- [ ] Mensagem em cinza "Tem dúvidas? Fala com o coach no WhatsApp" visível.
- [ ] Botão "Conversar no WhatsApp" aparece **com fundo escuro (`#14162E`) e texto branco** — contraste forte sobre `bg-white`.
- [ ] **QR NÃO aparece em mobile** (`hidden md:block` na div wrapper do QR).
- [ ] Link "Ir para o chat →" preservado abaixo do CTA WhatsApp.
- [ ] Border separator (`border-t border-[#E5E7EB]`) visível entre o erro e o bloco WhatsApp.

---

## Cenário 4 — PlanilhaScreen em desktop (1280px+)

**Objetivo:** Confirmar layout side-by-side (botão + QR) e que o QR está **scaneável** sobre `bg-white`.

**Steps:**
1. Desativar device emulation, viewport ≥ 1280px (ou `md:` breakpoint, `>=768px`).
2. Visitar `http://localhost:3000/planilha`.
3. Inspecionar.

**Expected results:**
- [ ] Botão "Conversar no WhatsApp" e QR code aparecem **lado a lado** (flex-row em md+).
- [ ] QR tem `bg-white` interno + foreground `#14162E` — perfeitamente escaneável.
- [ ] Instruction text abaixo do QR (`text-xs text-foreground-muted`) — verificar se aparece legível ou se o override `[&_p]:!text-[#6B7088]` precisou ser aplicado.
- [ ] **Apontar câmera de celular real pro QR** e confirmar que abre `wa.me/...` com o init-token.
- [ ] Layout não quebra; modal não cobre nada importante.

---

## Cenário 5 — Error states (mock backend)

**Objetivo:** Confirmar que cada code de erro renderiza a mensagem i18n correta.

### 5a — Rate limit (429)

**Steps:**
1. Configurar override do endpoint pra retornar status 429 com body:
   ```json
   { "error": "rate limited", "code": "RATE_LIMITED" }
   ```
2. Recarregar `http://localhost:3000/planilha` (ou `/settings?subscription=success`).

**Expected:**
- [ ] Em vez do botão, aparece banner vermelho suave (`bg-red-500/10`) com texto: **"Muitos links gerados. Espera alguns minutos e tenta de novo."** (ou similar, conforme `t.errorRateLimited` em `src/features/whatsapp-cta/i18n/translations.ts`).

### 5b — Service unavailable (503)

**Steps:**
1. Override: status 503, body `{ "code": "WHATSAPP_NOT_CONFIGURED" }`.
2. Recarregar.

**Expected:**
- [ ] Banner vermelho com texto: **"WhatsApp temporariamente indisponível. Tenta em instantes."** (`t.errorUnavailable`).

### 5c — Erro genérico (500 ou network)

**Steps:**
1. Override: status 500, body vazio. (Ou desligar o backend.)
2. Recarregar.

**Expected:**
- [ ] Banner vermelho com texto: **mensagem genérica** (`t.errorGeneric`).

**Pontos comuns dos 3 sub-cenários:**
- Nenhum auto-retry visível (D-F13 — `retry: false` na useQuery).
- Console pode mostrar AxiosError, mas SEM stack trace de runtime (a UI absorveu o erro).
- O banner ocupa o espaço do botão; layout não quebra.

---

## Cenário 6 — Cross-repo gating (backend real)

**Objetivo:** Se runmid-api Phase 5 estiver deployado, confirmar end-to-end real (não mock).

**Steps:**
1. Confirmar que `POST /api/v1/whatsapp/init-token` responde com status 200 + body válido. Exemplo:
   ```bash
   curl -X POST -H "Authorization: Bearer <jwt>" https://<runmid-api-url>/api/v1/whatsapp/init-token
   ```
2. Em produção/staging real ou local com backend up, repetir Cenários 1-4 sem mock.
3. Clicar no botão WhatsApp e confirmar que abre WhatsApp Web/app com mensagem pré-preenchida `runmid-init-<token>`.

**Expected:**
- [ ] Token recebido é único por chamada (não cacheado entre users — verificar com 2 contas diferentes).
- [ ] `walink` formato: `https://wa.me/<numero>?text=runmid-init-<token>`.
- [ ] App WhatsApp abre conversa direta (mobile) ou WhatsApp Web em nova aba (desktop).

**Se backend ainda NÃO deployado:**
- [ ] Marcar este cenário como **"deferred until runmid-api Phase 5 ships"** no SUMMARY.
- [ ] Cenários 1-5 (com mock Opção A) cobrem o lado frontend.

---

## Resume signal

Após completar todos os cenários aplicáveis, digite **um** dos signals no chat do orchestrator:

- `"approved"` — Todos os cenários passaram (ou Cenário 6 deferred com nota explícita).
- `"approved with notes: <descrição>"` — Passou no essencial, mas há issues menores (anotar para follow-up).
- `"issues: <descrição>"` — Algum cenário falhou; descrever o que aconteceu (screenshots úteis).
- `"deferred: backend not deployed"` — Cenários 1-5 OK via mock; Cenário 6 aguarda runmid-api Phase 5.

---

## Notas operacionais

- **Não executar** `npm run dev` em background pelo agente. O operador roda manualmente.
- **Não executar** os cenários pelo agente. Esta é uma checkpoint humana (`checkpoint:human-verify`).
- Reportar quaisquer screenshots/console traces no chat do orchestrator junto com o resume signal.
- Para issues de contraste na PlanilhaScreen: a Opção B (override Tailwind arbitrary) já foi aplicada em `<WhatsAppCTA className="[&_a]:!bg-[#14162E] [&_a]:!text-white ..." />`. Se ainda houver problema visual, o fix é localizado nesse className do callsite — não toca o componente.
