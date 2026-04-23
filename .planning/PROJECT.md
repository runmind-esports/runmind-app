# RunMind

## What This Is

RunMind é um coach de corrida com IA para o corredor amador brasileiro. O app conecta Strava/Garmin, oferece planos de treino personalizados e suporte 24/7 via chat. Frontend Next.js 14 + backend Go (runmid-api). Landing page bilíngue em produção.

## Core Value

Entregar treinamento de elite acessível ao corredor amador brasileiro — do primeiro cadastro à planilha personalizada em menos de 5 minutos.

## Current Milestone: v1.1 Onboarding

**Goal:** Formulário de onboarding multi-step que coleta perfil do corredor, persiste no backend (Go), gera planilha para download, e redireciona para o chat.

**Target features:**
- Etapa 1: Dados automáticos do Google/Strava (nome, email)
- Etapa 2: Formulário multi-step com 11 perguntas de perfil de corredor
- Tela "momento ahá" com planilha personalizada para download
- Fluxo: Signup → Etapa 1 → Etapa 2 → Planilha download → Chat
- Backend API (Go/runmid-api) para persistir perfil e gerar planilha

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

- [ ] Etapa 1 do onboarding: importar dados do Google/Strava (nome, email)
- [ ] Etapa 2 do onboarding: formulário multi-step com 11 perguntas de perfil
- [ ] Tela "momento ahá" com planilha personalizada para download
- [ ] Redirecionamento para chat após download da planilha
- [ ] Backend API (Go) para persistir perfil do corredor
- [ ] Backend API (Go) para gerar planilha personalizada

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
- Backend Go em `/Documents/runmid/runmid-api` (microserviço REST)
- Outros backends: auth (cara-cracha), chat-agent, runmid-api (atividades/Strava)
- Landing page v1 em produção no Cloud Run
- Onboarding: formulário no frontend, persistência no backend Go
- Planilha gerada pelo backend após coleta do perfil

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
*Last updated: 2026-04-22 after milestone v1.1 Onboarding started*
