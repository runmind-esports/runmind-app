# Phase 19: WhatsApp Conversion CTA (runmid-app) - Context

**Gathered:** 2026-05-21
**Status:** Ready for planning
**Source:** Direct discussion (yolo mode) coordinating 3 repos: chat-agent (Phase 15), runmid-api (Phase 5), this one (runmid-app). Phase originally named "WhatsApp Deep-Link Handler" — slug do diretório mantido (`19-whatsapp-deep-link-handler/`) mas escopo mudou pra CTA wa.me.

<domain>
## Phase Boundary

`runmid-app` (Next.js web) ganha um componente de **CTA "Conversar no WhatsApp"** que aparece nas páginas pós-checkout (Pro/Premium) e pós-seleção (Free). O CTA:

1. Chama `POST /api/v1/whatsapp/init-token` no runmid-api (autenticado JWT user) e recebe `{token, walink, expiresAt}`
2. Renderiza o link `walink` (formato `https://wa.me/{numero}?text=runmid-init-{token}`) de forma adaptativa:
   - **Mobile**: botão CTA `<a href={walink}>` que abre o app WhatsApp instalado direto na conversa
   - **Desktop**: botão + QR code do `walink` (lib JS no client) — usuário escaneia pelo celular
3. Mostra fallback se o endpoint falhar ("Tente novamente em alguns instantes")

**NÃO existe** tela `/link?t=...`, **NÃO existe** handler de deep link, **NÃO existe** Capacitor/scheme `runmind://`. O `walink` é uma URL HTTPS comum que o navegador entrega pro WhatsApp via protocolo handler nativo do OS (mobile) ou via QR (desktop).

</domain>

<decisions>
## Implementation Decisions

### Stack alignment
- **D-F1:** runmid-app é Next.js 14 (App Router) + TanStack Query + Tailwind. **Sem Capacitor instalado** (verificado em `package.json`). Sem build nativo. Tudo é web.
- **D-F2:** Não adicionar Capacitor nem qualquer dependência nativa nesta phase. Se um dia houver app nativo (Capacitor ou Flutter), o CTA web continua válido — usuário com app instalado pega o universal link / wa.me que abre o app diretamente.

### Onde o CTA aparece
- **D-F3:** Página de "sucesso pós-checkout Stripe" (Pro/Premium): adicionar o CTA como passo final do flow de assinatura. Localizar a página atual de sucesso (se existir) ou criar.
- **D-F4:** Página/step de "plano Free selecionado" (no onboarding flow ou na seleção de plano): adicionar o mesmo CTA — Free também recebe (confirmado, é o funil de conversão pro WhatsApp).
- **D-F5:** (Opcional, scope bônus) Tela `/settings/whatsapp` (ou modal em `/settings`) que mostra "Já vinculou no WhatsApp? Acesse rápido" com mesmo CTA — útil pra usuários que querem reabrir conversa de outro device.

### Componente compartilhado
- **D-F6:** Criar componente `<WhatsAppCTA />` em `src/features/whatsapp-cta/components/`. Props: `variant: "primary" | "secondary"`, `showQR?: boolean`. Componente encapsula:
  - Hook `useWhatsAppInitToken()` (TanStack Query) que chama o endpoint e cacheia por 23h (TTL menor que a expiração do token pra evitar entregar token quase-expirado)
  - Renderização adaptativa (UA detection ou simplesmente sempre mostrar o botão + QR como fallback)
  - Loading/error states
- **D-F7:** Cache local do `walink` via TanStack Query: `queryKey: ["whatsapp-init-token", userId]`, `staleTime: 23h`. Se token expirou (cliente passou de 24h sem clicar) o backend retorna erro na validação; a UX nessa fase é aceitar erro com mensagem "Esse link expirou, atualize a página".

### QR code
- **D-F8:** Usar `qrcode.react` (lib leve, ~15kB) pra renderizar QR no desktop. Não instalar lib pesada.
- **D-F9:** Detectar desktop vs mobile via media query CSS (`md:hidden` / `hidden md:block`) ao invés de UA detection — simples e não-falha. Mobile: só botão. Desktop: botão + QR ao lado.

### i18n
- **D-F10:** Translations em `src/locales/{pt,en}/*.json` seguindo o padrão existente. Chaves flat: `whatsapp_cta_*` (`button_label`, `qr_instruction`, `loading`, `error_generic`, `error_expired`).

### Error handling
- **D-F11:** Se endpoint retornar 429 (rate limit), mostrar "Você já gerou muitos links. Tente em alguns minutos."
- **D-F12:** Se retornar 503 (Stripe links not configured ou WhatsApp service unavailable), mostrar "WhatsApp temporariamente indisponível. Tente em instantes."
- **D-F13:** Sem retry automático — usuário decide quando re-clicar/atualizar.

### Auth state
- **D-F14:** Componente assume `useAuth()` (ou equivalente) provendo o JWT user. Sem fallback pra usuário não-logado — o CTA só aparece em páginas autenticadas (checkout success, onboarding).

### Tracking
- **D-F15:** Logar evento de analytics quando user clica o CTA (`whatsapp_cta_clicked`) — facilita medir taxa de conversão web → WhatsApp. Usar analytics tracker existente do projeto (se houver).

### Scope bônus (settings unlink)
- **D-F16:** **Fora de escopo desta phase.** Unlink de WhatsApp via UI fica pra futuro. Por enquanto, usuário pode bloquear o número WhatsApp pelo lado deles ou abrir um support ticket.

### Claude's Discretion
- Estrutura exata de rotas (App Router conventions do projeto)
- Componente design (cores, tipografia — seguir design system existente)
- Posicionamento exato do CTA nas páginas (final do flow vs. card lateral)
- Copy das mensagens (CTA label, instructions, errors)
- Decisão sobre incluir tracking ou não dependendo do projeto

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Padrões do projeto
- `src/features/` — Feature-based organization. Criar `src/features/whatsapp-cta/`.
- `src/locales/pt/`, `src/locales/en/` — i18n dictionaries.
- `package.json` — Confirma Next.js 14 + Tailwind + TanStack Query + shadcn/ui. Sem Capacitor.
- Localizar onde mora a página de "checkout success" atual (se existir) — grep por `checkout` ou `success` em `src/app/`. Se não existir, criar.
- Localizar onde mora a seleção/onboarding de plano free — grep por `pricing`, `plan`, `subscription` em `src/app/` e `src/features/`.
- Auth hook existente — grep `useAuth\|useUser\|useSession` em `src/`.

### Cross-repo contract (manter sync)
- `~/Documents/runmid/runmid-api/.planning/phases/05-whatsapp-linking-endpoints/05-CONTEXT.md` — `POST /api/v1/whatsapp/init-token` contract (auth JWT, response `{token, walink, expiresAt}`, error codes incluindo 429 rate limit + 503 Stripe-not-configured).
- `~/Documents/siiix-platform/chat-agent/chat-agent/.planning/phases/15-whatsapp-inbound-channel/15-CONTEXT.md` — Define o formato do prefixo da mensagem (`runmid-init-{token}`) que o user manda no WhatsApp e o chat-agent consome.

### External
- WhatsApp click-to-chat (wa.me): https://faq.whatsapp.com/5913398998672934
- qrcode.react: https://github.com/zpao/qrcode.react

</canonical_refs>

<scope_fence>
## Scope Fence

**IN scope (runmid-app):**
- Componente `<WhatsAppCTA />` em `src/features/whatsapp-cta/`
- Hook `useWhatsAppInitToken()` (TanStack Query)
- Renderização adaptativa (botão mobile / botão+QR desktop) via CSS
- Integração em ≥ 2 páginas: pós-checkout Stripe (Pro/Premium) + pós-seleção Free
- i18n pt/en das novas strings
- Lib `qrcode.react` adicionada como dep
- Error states + loading state
- (Opcional, se couber) tracking de evento `whatsapp_cta_clicked`

**OUT of scope (this phase):**
- Capacitor / build nativo / scheme `runmind://`
- Tela `/link?t=...` com handler de deep link (esse fluxo não existe mais)
- Settings tela de unlink WhatsApp
- Webhook Meta, Meta client, AI runtime (chat-agent Phase 15)
- Endpoints `/whatsapp/init-token` (runmid-api Phase 5)
- Geração de magic-link / validação de token (runmid-api + chat-agent)
- Notificações push internas pós-vínculo
- A/B test do componente

</scope_fence>

---

*Phase: 19-whatsapp-deep-link-handler (slug histórico; nome humano atualizado pra "WhatsApp Conversion CTA")*
*Context gathered: 2026-05-21 via direct discussion (yolo mode); coordinates with chat-agent Phase 15 + runmid-api Phase 5*
