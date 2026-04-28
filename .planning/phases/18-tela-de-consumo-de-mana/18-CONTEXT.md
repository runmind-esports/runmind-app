# Phase 18: Tela de Consumo de Mana (kcal) - Context

**Gathered:** 2026-04-28
**Status:** Ready for planning

<domain>
## Phase Boundary

Adicionar nova tab "Consumo" nas configurações mostrando o uso de kcal (mana) do usuário: gauge circular com consumo atual, mini gráfico de 7 dias, e card motivacional quando kcal acabar.

**Importante:** No frontend, "mana" é apresentado como "kcal" (calorias) — branding temático de corrida.

</domain>

<decisions>
## Implementation Decisions

### Layout
- **D-01:** Nova tab "Consumo" no settings (3a tab: Integrações | Planos | Consumo). Ícone: Flame ou Zap do lucide-react.

### Dados Exibidos
- **D-02:** Mostrar kcal atual/máximo + mini gráfico de barras dos últimos 7 dias de consumo.
- **D-03:** Endpoint principal: `GET /api/v1/mana/status` do chat-agent → `{currentMana, maxMana, periodType, periodStart, nextResetAt, tier}`. Mapear "mana" → "kcal" no display.
- **D-04:** Histórico 7 dias: precisa de endpoint adicional ou derivar do `mana_transactions`. Se não existir endpoint, usar dados mock com TODO para implementar depois.

### Visual
- **D-05:** Gauge circular (SVG) com porcentagem preenchida. Cores: verde quando >30%, amarelo entre 10-30%, vermelho <10%. Estilo fitness app.
- **D-06:** Número grande dentro do gauge (ex: "72 kcal") com texto pequeno abaixo ("de 100 kcal").
- **D-07:** Gráfico de barras 7 dias: barrinhas verticais simples com labels de dia da semana (Seg, Ter, ...). Altura proporcional ao consumo. CSS/SVG puro, sem lib de charts.

### Ação quando kcal acaba
- **D-08:** Card motivacional temático de corrida quando kcal < 10% (ex: "Hora de reabastecer! 🏃‍♂️"). CTA de upgrade pro Pro. Timer mostrando horário do próximo reset.
- **D-09:** Quando kcal = 0, gauge fica vermelho com texto "Sem calorias" e botão "Fazer upgrade" que abre checkout Stripe direto (mesmo padrão da fase 17).

### Claude's Discretion
- Animação do gauge (transição suave ao carregar)
- Formato do timer de reset (countdown vs horário fixo)
- Skeleton loading state da tab

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Frontend Existente
- `src/app/settings/page.tsx` — Settings page com tabs (adicionar tab "Consumo")
- `src/features/subscription/hooks/useSubscription.ts` — Padrão de hook com React Query
- `src/features/subscription/services/subscriptionApi.ts` — Padrão de service com runmidApiClient
- `src/shared/lib/apiClient.ts` — chatApiClient para chamadas ao chat-agent

### Backend Endpoints (chat-agent)
- `GET /api/v1/mana/status` → `{currentMana, maxMana, periodType, periodStart, nextResetAt, tier}`
- Mana balance stored in PostgreSQL `user_mana_balance` table

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `chatApiClient` — Axios client com auth interceptor para chat-agent
- React Query hooks pattern de `src/features/subscription/`
- Settings page tabs pattern (já tem 2 tabs)
- `useSubscription.checkout()` — reutilizar para botão de upgrade

### Established Patterns
- Feature modules em `src/features/` com barrel exports
- Services como objetos literais
- Hooks com useQuery + staleTime + retry: false
- Cards com border-border, rounded-2xl, accent color #00F048

### Integration Points
- Settings page: adicionar 3a tab
- chatApiClient: novo service para mana/kcal
- useSubscription: reutilizar checkout para upgrade CTA

</code_context>

<specifics>
## Specific Ideas

- Gauge circular em SVG puro (sem dependência externa)
- Cores do gauge: #00F048 (verde/accent), #F59E0B (amarelo), #EF4444 (vermelho)
- Gráfico de 7 dias: barras com max-height fixa, cor accent
- Texto motivacional de corrida: "Hora de reabastecer!", "Suas calorias do dia acabaram", etc.
- Timer de reset: "Reseta em 4h 23min" ou "Reseta à meia-noite"

</specifics>

<deferred>
## Deferred Ideas

- Breakdown por tipo de operação (simples, análise, imagem) — requer endpoint adicional
- Histórico mensal de consumo
- Notificação push quando kcal está acabando
- Gamificação: streak de dias sem estourar o limite

</deferred>

---

*Phase: 18-tela-de-consumo-de-mana*
*Context gathered: 2026-04-28*
