# Phase 8: Dashboard Premium - Context

**Gathered:** 2026-04-25
**Status:** Ready for planning

<domain>
## Phase Boundary

Redesign do dashboard de treino (`/training`) com métricas avançadas, progresso visual, e conteúdo contextual. Inspirado em Nike Run Club / Apple Fitness+. Usando dados disponíveis via Strava API.

</domain>

<decisions>
## Implementation Decisions

### Progresso Semanal
- **D-01:** Exibir meta semanal como **anel circular** (estilo Apple Fitness+) — anel preenche conforme avança na meta de km
- **D-02:** Meta semanal **sugerida pela IA** com base no histórico do Strava. Usuário pode ajustar manualmente

### Lista de Atividades Recentes
- **D-03:** Mostrar **3 atividades recentes** no dashboard (não apenas 1)
- **D-04:** Layout em **cards compactos horizontais** — nome, distância, pace, data relativa. Link "Ver todas" leva ao histórico
- **D-05:** Reutilizar o componente `Card` base padronizado (`src/components/ui/card.tsx`)

### Streak & Gamificação
- **D-06:** Streak calculado por **semanas consecutivas** com pelo menos 1 corrida (não dias)
- **D-07:** Gamificação **sutil** — streak + comparação semana anterior ("↑ 8km a mais"). Sem badges ou rankings nesta fase

### CTA do Coach IA
- **D-08:** Card com **sugestão contextual dinâmica** baseada nos dados do Strava (ex: "Você correu 3x essa semana! Que tal um longão no domingo?")
- **D-09:** Ao clicar, abre o chat com prompt pré-preenchido baseado na sugestão

### Claude's Discretion
- Lógica de geração das sugestões contextuais (regras simples baseadas em dados, não chamada à IA)
- Animação do anel circular (CSS transitions vs SVG animation)
- Cálculo do streak a partir das atividades do Strava

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Dashboard existente
- `src/features/training/components/dashboard/DashboardScreen.tsx` — Tela atual do dashboard
- `src/features/training/components/dashboard/MetricCard.tsx` — Card de métrica com accent colors e shimmer
- `src/features/training/components/dashboard/LastActivityCard.tsx` — Card de última atividade
- `src/features/training/components/dashboard/StravaConnectCTA.tsx` — CTA para conectar Strava

### Componentes base padronizados
- `src/components/ui/card.tsx` — Card base reutilizável
- `src/components/ui/shimmer.tsx` — Shimmer loading padronizado

### Dados Strava
- `src/features/strava/hooks/useStravaActivities.ts` — Hooks useStravaStats() e useStravaActivities()
- `src/features/strava/services/stravaActivitiesApi.ts` — API service do Strava
- `src/features/strava/types/activities.types.ts` — Tipos StravaActivity, StravaAthleteStats

### Formatadores
- `src/features/training/utils/formatters.ts` — formatDistance, formatPace, formatDuration, formatDateShort

### Chat integration
- `src/features/chat/components/WelcomeScreen.tsx` — Tela que já usa MetricCard + LastActivityCard

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `Card` component: base container com rounded-2xl, shadow, bg-secondary
- `MetricCard`: já tem accent colors (green/blue/orange), gradient glow, shimmer loading
- `LastActivityCard`: grid de stats, accent bar, shimmer
- `Shimmer`: componente reutilizável para loading states
- `useStravaStats()`: retorna recent_run_totals, all_run_totals, ytd_run_totals
- `useStravaActivities(page, perPage)`: retorna array de StravaActivity
- `formatDistance`, `formatPace`, `formatDuration`: formatadores existentes

### Established Patterns
- Cards usam `Card` base + composição interna
- Loading com `Shimmer` padronizado
- Dados via React Query com staleTime 5min
- Accent colors para diferenciação visual (green, blue, orange)

### Integration Points
- `DashboardScreen` renderiza dentro de `TrainingLayout` na rota `/training`
- `WelcomeScreen` do chat também usa MetricCard — mudanças refletem em ambos
- `TrainingTabs` (Dashboard/Semana/Histórico) no topo do layout

</code_context>

<specifics>
## Specific Ideas

- Anel circular inspirado em Apple Fitness+ — preenche de 0% a 100% com cor accent
- Cards compactos de atividade: ícone de tipo + nome + stats inline + data relativa ("hoje", "ontem", "3d")
- Sugestão do coach baseada em regras simples: se correu 3+ vezes → sugere longão; se não correu há 3 dias → sugere corrida leve
- Comparativo semana: "↑ 8km a mais que semana passada" ou "↓ 5km a menos"
- Streak com ícone de fogo 🔥 e contagem de semanas

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 08-dashboard-premium*
*Context gathered: 2026-04-25*
