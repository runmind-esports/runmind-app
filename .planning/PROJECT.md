# RunMind Landing Page

## What This Is

Landing page estruturada para o RunMind — um coach de corrida com IA que conecta Strava/Garmin e oferece planos de treino personalizados e suporte 24/7 via chat. A landing page será uma rota separada (`/`) que espelha o pitch de vendas do produto, com 5 dobras alinhadas à jornada do usuário e ao modelo de negócio. Disponível em PT-BR e inglês.

## Core Value

Converter visitantes em usuários demonstrando que o RunMind entrega treinamento de elite acessível — preenchendo o gap do mercado brasileiro onde coaching humano é caro e planilhas são genéricas.

## Requirements

### Validated

<!-- Shipped and confirmed valuable. -->

- ✓ Chat com IA (interface de mensagens com coach) — existing
- ✓ Autenticação (login/signup com email/password) — existing
- ✓ Integração Strava (OAuth callback, conexão) — existing
- ✓ Sidebar com conversas e navegação — existing
- ✓ Tela de settings com integrações — existing
- ✓ Upload de imagens no chat — existing
- ✓ Theme toggle (dark/light) — existing
- ✓ Hero Section com headline, CTA e foto de corredor — Phase 2
- ✓ Seção de Funcionalidades com background image — Phase 2
- ✓ Fluxo do Usuário em 5 steps com timeline e foto de grupo — Phase 3
- ✓ Seção de Performance com Big Numbers via API e counters animados — Phase 4
- ✓ Seção de Planos e Pricing (Iniciante/Pro/Elite) — post-phase
- ✓ Gap da Solidão com stats e foto de corredor solo — Phase 3
- ✓ Suporte bilíngue PT-BR + EN com LanguageProvider — Phase 1
- ✓ Fotos reais de corredores nas seções — post-phase
- ✓ Navbar fixa com logo, links e CTAs — post-phase
- ✓ Scroll reveal animations em todas as seções — Phase 3
- ✓ Design com identidade visual RunMind (escuro/verde neon) — Phase 1-4
- ✓ Deploy em produção no Cloud Run — post-phase

### Active

(Nenhum — v1 da landing page entregue)

### Out of Scope

- Prova Social com depoimentos reais de usuários — v2 (precisa de usuários reais)
- Toggle de idioma visível na navbar — v2
- Cookie de persistência de idioma — v2

### Out of Scope

- Redesign das telas internas do app (login, chat, settings) — foco apenas na landing page
- Integração de pagamentos/checkout — landing page apenas exibe planos e direciona para signup
- Blog ou seção de conteúdo — pode ser v2
- App mobile nativo — web-first

## Context

- RunMind é um app Next.js 14 (App Router) com React 18, TypeScript e Tailwind CSS
- Codebase brownfield com features existentes: auth, chat, strava, settings
- Backend são microserviços separados acessados via axios (auth, chat, runmid API)
- A landing page será uma nova rota `/` separada das rotas de auth (`/login`, `/signup`)
- Dados de Big Numbers serão consumidos de API real (runmidApiClient)
- Mockups do app usarão placeholders estilizados (screenshots reais virão depois)
- Planos definidos: Free (limitado) + Premium (pago mensal)
- Design segue a identidade visual existente: contraste alto, verde neon (#00FF00 area), sensação tech

## Constraints

- **Tech Stack**: Next.js 14 + React 18 + Tailwind CSS — manter stack existente
- **Rota**: Landing page em `/`, sem alterar rotas existentes (`/login`, `/signup`, `/chat`, `/settings`)
- **i18n**: PT-BR como padrão, inglês como segunda língua
- **API**: Big Numbers via `runmidApiClient` existente
- **Responsividade**: Mobile-first (público brasileiro usa muito celular)
- **Performance**: Landing page deve carregar rápido — SSR/SSG quando possível

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Landing page como rota separada `/` | Não interferir nas telas existentes de auth | ✓ Good |
| Fotos reais de corredores (Unsplash) | Mais impacto visual que placeholders CSS | ✓ Good |
| Big Numbers via API com fallback | Dados reais + fallback garante que a página nunca quebra | ✓ Good |
| 3 planos (Iniciante/Pro/Elite) | Modelo freemium com upgrade path claro | ✓ Good |
| Bilíngue PT-BR + EN via LanguageProvider | Mercado principal é Brasil mas permite expansão | ✓ Good |
| CSS animations (sem Motion lib) | Bundle menor para mobile brasileiro em 4G | ✓ Good |
| RunMind como complemento, não substituto de treinador | Respeitar o trabalho de treinadores humanos | ✓ Good |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-22 after v1 landing page complete — deployed to production*
