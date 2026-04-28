# Phase 17: Subscription Checkout UI - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-27
**Phase:** 17-subscription-checkout-ui
**Areas discussed:** Nomenclatura dos planos, Fluxo de checkout, Exibição do plano ativo, Upgrade prompt no chat

---

## Nomenclatura dos Planos

| Option | Description | Selected |
|--------|-------------|----------|
| Pro / Premium | Alinhar com o backend. Mudar "Elite" pra "Premium" no frontend. | ✓ |
| Pro / Elite | Manter "Elite" no frontend. Mapeamento no código. | |
| Manter ambos | Mapear backend "premium" = frontend "Elite". | |

**User's choice:** Pro / Premium
**Notes:** Alinhar nomes com o backend para evitar confusão.

| Option | Description | Selected |
|--------|-------------|----------|
| Toggle mensal/anual | Switch no topo dos planos. Preço muda dinamicamente. | ✓ |
| Só mensal por agora | Simplificar. Anual fica pra depois. | |

**User's choice:** Toggle mensal/anual

---

## Fluxo de Checkout

| Option | Description | Selected |
|--------|-------------|----------|
| Toast de sucesso | Banner verde que desaparece em 5s. | |
| Modal de celebração | Modal com animação/confetti, botão "Voltar ao chat". | ✓ |
| Redirect direto pro chat | Manda pro /chat com mensagem de boas-vindas. | |

**User's choice:** Modal de celebração

| Option | Description | Selected |
|--------|-------------|----------|
| No card do plano | Botão "Assinar" dentro de cada card. | ✓ |
| Card + banner no chat | Card no settings + banner fixo no chat. | |

**User's choice:** No card do plano

---

## Exibição do Plano Ativo

| Option | Description | Selected |
|--------|-------------|----------|
| Badge + Gerenciar | Badge "Ativo" no card, botão "Gerenciar assinatura" (Stripe Portal). | ✓ |
| Badge + Cancelar | Badge "Ativo" + botão "Cancelar" direto. | |

**User's choice:** Badge + Gerenciar

| Option | Description | Selected |
|--------|-------------|----------|
| Badge colorido | Badge "Pro" ou "Premium" com cor ao lado do nome. Free sem badge. | ✓ |
| Texto simples | "Plano: Pro" abaixo do nome. | |

**User's choice:** Badge colorido

---

## Upgrade Prompt no Chat

| Option | Description | Selected |
|--------|-------------|----------|
| Mensagem inline + link settings | Link pra /settings na mensagem de rate limit. | |
| Mensagem inline + checkout direto | Botão que abre checkout Stripe direto do chat. | ✓ |
| Manter como está | Só adicionar link pro settings. | |

**User's choice:** Mensagem inline + checkout direto

## Claude's Discretion

- Loading states durante checkout
- Tratamento de erros do Stripe
- Cache strategy para tier
- Formato do badge de plano na sidebar

## Deferred Ideas

- Webhook Stripe para atualizar tier automaticamente
- Notificação push quando assinatura expira
- Feature matrix comparativa
