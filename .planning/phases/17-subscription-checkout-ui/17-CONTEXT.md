# Phase 17: Subscription Checkout UI - Context

**Gathered:** 2026-04-27
**Status:** Ready for planning

<domain>
## Phase Boundary

Conectar o frontend ao módulo de subscription do runmid-api. Criar service layer, hooks React Query, atualizar PlansSection com checkout Stripe real, exibir tier do usuário na sidebar e settings, tratar callbacks de sucesso/cancelamento.

</domain>

<decisions>
## Implementation Decisions

### Nomenclatura dos Planos
- **D-01:** Alinhar frontend com backend: "Pro" e "Premium" (não "Elite"). Renomear "Elite" → "Premium" em PlansSection e landing page.
- **D-02:** Toggle mensal/anual no topo da seção de planos. Switch que altera preços dinamicamente. Destacar economia do plano anual.

### Fluxo de Checkout
- **D-03:** Botão "Assinar Pro" / "Assinar Premium" dentro de cada card de plano. Ao clicar, chama `POST /api/v1/subscription/checkout` com planId, recebe URL do Stripe, redireciona com `window.location.href`.
- **D-04:** Callback de sucesso: modal de celebração ao voltar com `?subscription=success`. Animação visual, botão "Voltar ao chat". Query do tier é invalidada pra atualizar o plano.
- **D-05:** Callback de cancelamento: `?subscription=cancelled` — toast discreto ou nenhum feedback (usuário cancelou voluntariamente).

### Exibição do Plano Ativo
- **D-06:** Card do plano ativo mostra badge "Ativo" e botão muda para "Gerenciar assinatura" que abre o Stripe Billing Portal via `POST /api/v1/subscription/portal`.
- **D-07:** Sidebar do chat exibe badge colorido com o nome do plano (Pro = verde, Premium = dourado). Free não mostra badge.
- **D-08:** `useUserProfile` busca tier real do backend via `GET /api/v1/subscriptions/user/me/tier` em vez de hardcoded "Free".

### Upgrade Prompt no Chat
- **D-09:** Quando 429 (rate limit), mensagem inline do coach com botão que abre checkout Stripe direto (chama checkout API e redireciona), sem passar por settings.

### Claude's Discretion
- Loading states durante checkout (spinner no botão, disable outros)
- Tratamento de erros do Stripe (toast de erro genérico)
- Cache strategy para tier (staleTime do React Query)
- Formato do badge de plano na sidebar (pill, tag, etc.)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Subscription Backend API
- `src/features/settings/components/PlansSection.tsx` — UI atual dos planos (será refatorada)
- `src/shared/hooks/useUserProfile.ts` — Hook com plan hardcoded (será conectado ao backend)
- `src/shared/lib/apiClient.ts` — runmidApiClient para chamadas à subscription API
- `src/features/chat/hooks/useChat.ts` — Rate limit handling (429) com mensagem de upgrade

### Backend Endpoints (runmid-api)
- `GET /api/v1/subscription/plans` — Lista planos disponíveis
- `POST /api/v1/subscription/checkout` — Cria sessão Stripe Checkout `{planId}` → `{url}`
- `POST /api/v1/subscription/portal` — Cria sessão Stripe Portal `{customerId}` → `{url}`
- `GET /api/v1/subscriptions/user/me/tier` — Tier do usuário `{tier, status, expiresAt, customerId}`

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `PlansSection.tsx` — Layout de cards já existe, precisa virar dinâmico
- `runmidApiClient` — Axios client com auth interceptor pronto
- React Query (`@tanstack/react-query`) — Padrão de hooks com useQuery/useMutation

### Established Patterns
- Feature modules em `src/features/` com barrel exports
- Services como objetos literais: `subscriptionApi.getPlans()`, `subscriptionApi.checkout()`
- Hooks com `useQuery` + `staleTime` + `retry: false`

### Integration Points
- Settings page tabs (já existe tab "Planos")
- Sidebar footer (já mostra `plan` do useUserProfile)
- Chat 429 handler (já tem mensagem, precisa do botão de checkout)

</code_context>

<specifics>
## Specific Ideas

- Backend retorna amount em centavos (2990 = R$ 29,90). Frontend formata.
- Planos Stripe: pro_monthly, pro_yearly, premium_monthly, premium_yearly
- Success URL: `/settings?subscription=success`
- Cancel URL: `/settings?subscription=cancelled`
- Portal return URL: `/settings`

</specifics>

<deferred>
## Deferred Ideas

- Webhook Stripe para atualizar tier automaticamente (backend TODO)
- Notificação push quando assinatura expira
- Comparação detalhada de features entre planos (feature matrix)

</deferred>

---

*Phase: 17-subscription-checkout-ui*
*Context gathered: 2026-04-27*
