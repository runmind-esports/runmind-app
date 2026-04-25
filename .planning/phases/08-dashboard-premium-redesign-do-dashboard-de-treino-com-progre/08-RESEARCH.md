# Phase 8: Dashboard Premium - Research

**Researched:** 2026-04-25
**Domain:** React dashboard UI with SVG circular progress, Strava data visualization, contextual AI CTA
**Confidence:** HIGH

## Summary

This phase redesigns the existing `/training` dashboard screen to a premium Nike Run Club / Apple Fitness+ inspired layout. The current `DashboardScreen.tsx` shows 3 metric cards (km, runs, pace) + 1 last activity card + a static "Falar com coach" button. The redesign replaces this with: (1) circular progress ring for weekly km goal, (2) 3 recent activity compact cards, (3) week-over-week comparison, (4) running streak counter, and (5) a contextual AI coach CTA.

All data sources already exist: `useStravaStats()` returns `recent_run_totals` / `ytd_run_totals`, `useStravaActivities(1, 5)` returns recent activities, and the `PaginatedActivitiesParams` interface supports `after`/`before` epoch filters for fetching historical weeks. The `formatDistance`, `formatPace`, `formatDuration`, `formatDateShort`, and `formatTrend` utilities are ready. The `Card` base component, `Shimmer` loading, and `MetricCard` with accent colors are all reusable.

**Primary recommendation:** Rebuild `DashboardScreen.tsx` with new composed sections (WeeklyRing, RecentActivities, WeekComparison, StreakCounter, CoachCTA), keeping all new components inside `src/features/training/components/dashboard/`. Use SVG for the circular ring (no external library needed). Compute streak and weekly comparison client-side from activities fetched via existing hooks.

<user_constraints>

## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Weekly goal as circular ring (Apple Fitness+ style) -- ring fills as km progress toward goal
- **D-02:** Weekly goal suggested by AI based on Strava history. User can adjust manually
- **D-03:** Show 3 recent activities on dashboard (not just 1)
- **D-04:** Compact horizontal cards -- name, distance, pace, relative date. "Ver todas" link to history
- **D-05:** Reuse `Card` base component (`src/components/ui/card.tsx`)
- **D-06:** Streak calculated by consecutive weeks with at least 1 run (not days)
- **D-07:** Subtle gamification -- streak + week comparison ("up 8km a mais"). No badges or rankings this phase
- **D-08:** Contextual coach CTA card with dynamic suggestion based on Strava data
- **D-09:** CTA click opens chat with pre-filled prompt based on suggestion

### Claude's Discretion
- Logic for generating contextual suggestions (simple rules based on data, not AI API call)
- Circular ring animation technique (CSS transitions vs SVG animation)
- Streak calculation from Strava activities

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope

</user_constraints>

## Standard Stack

### Core (Already in Project)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React 18 | ^18 | UI rendering | Already in project [VERIFIED: package.json] |
| Next.js | 14.2.21 | App Router, routing | Already in project [VERIFIED: package.json] |
| Tailwind CSS | ^3.4.1 | Styling | Already in project [VERIFIED: package.json] |
| @tanstack/react-query | ^5.90.21 | Data fetching/caching | Already used by Strava hooks [VERIFIED: codebase] |
| lucide-react | ^0.312.0 | Icons | Already in project [VERIFIED: package.json] |

### No New Dependencies Required

This phase uses SVG for the circular ring (native browser API), existing Strava hooks for data, and Tailwind for styling. No new npm packages needed.

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Raw SVG ring | recharts / react-circular-progressbar | Overkill for a single ring; adds bundle size for no gain |
| Client-side streak calc | Backend API endpoint | Simpler now; backend can optimize later if needed |
| Rule-based coach suggestions | LLM API call | Too slow/expensive for a dashboard card; rules are snappier |

## Architecture Patterns

### New Components (all in `src/features/training/components/dashboard/`)
```
src/features/training/components/dashboard/
  DashboardScreen.tsx        # MODIFY - new layout composition
  MetricCard.tsx             # KEEP - reuse for comparison stats
  LastActivityCard.tsx       # KEEP - reference for activity card pattern
  StravaConnectCTA.tsx       # KEEP - shown when Strava not connected
  WeeklyProgressRing.tsx     # NEW - SVG circular ring + km label
  RecentActivityCard.tsx     # NEW - compact horizontal activity card
  WeekComparison.tsx         # NEW - "up/down X km vs last week"
  StreakBadge.tsx             # NEW - streak weeks counter with fire icon
  CoachCTA.tsx               # NEW - contextual suggestion card
```

### New Hook
```
src/features/training/hooks/
  useDashboardData.ts        # NEW - aggregates weekly stats, streak, comparison, suggestion
```

### Pattern 1: SVG Circular Progress Ring
**What:** Native SVG circle with `stroke-dasharray` and `stroke-dashoffset` for progress visualization
**When to use:** Single circular progress indicator without needing charting library

```typescript
// SVG ring technique - no library needed [ASSUMED - standard SVG pattern]
interface WeeklyProgressRingProps {
  current: number    // km done this week
  goal: number       // km goal for the week
  size?: number      // ring diameter in px
}

export function WeeklyProgressRing({ current, goal, size = 160 }: WeeklyProgressRingProps) {
  const strokeWidth = 12
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const progress = Math.min(current / goal, 1)
  const offset = circumference * (1 - progress)

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background track */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="var(--background-tertiary)"
          strokeWidth={strokeWidth}
        />
        {/* Progress arc */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="var(--accent)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-1000 ease-out"
        />
      </svg>
      {/* Center label */}
      <div className="absolute flex flex-col items-center">
        <span className="text-2xl font-extrabold font-display text-foreground">
          {current.toFixed(1)}
        </span>
        <span className="text-[10px] uppercase tracking-wider text-foreground-muted">
          de {goal} km
        </span>
      </div>
    </div>
  )
}
```

### Pattern 2: Streak Calculation from Activities
**What:** Client-side computation of consecutive weeks with at least 1 run
**When to use:** Streak badge on dashboard

```typescript
// [ASSUMED - standard date bucketing logic]
function calculateWeekStreak(activities: StravaActivity[]): number {
  if (activities.length === 0) return 0

  // Get Monday of current week
  const now = new Date()
  const getMonday = (d: Date) => {
    const date = new Date(d)
    const day = date.getDay()
    const diff = day === 0 ? -6 : 1 - day
    date.setDate(date.getDate() + diff)
    date.setHours(0, 0, 0, 0)
    return date
  }

  // Bucket activities by week (Monday start)
  const weekSet = new Set<string>()
  activities.forEach((a) => {
    const monday = getMonday(new Date(a.start_date_local))
    weekSet.add(monday.toISOString().split('T')[0])
  })

  // Count consecutive weeks backwards from current week
  let streak = 0
  let checkWeek = getMonday(now)

  while (weekSet.has(checkWeek.toISOString().split('T')[0])) {
    streak++
    checkWeek.setDate(checkWeek.getDate() - 7)
  }

  return streak
}
```

### Pattern 3: Contextual Coach Suggestions (Rule-Based)
**What:** Simple rule engine producing a suggestion string and pre-filled chat prompt
**When to use:** CoachCTA card on dashboard

```typescript
// [ASSUMED - business logic rules from CONTEXT.md specifics]
interface CoachSuggestion {
  message: string     // displayed on card
  chatPrompt: string  // sent to chat when clicked
  emoji: string
}

function generateCoachSuggestion(
  weeklyRuns: number,
  daysSinceLastRun: number,
  weeklyKm: number,
  previousWeekKm: number,
): CoachSuggestion {
  // Rule: 3+ runs this week -> suggest long run
  if (weeklyRuns >= 3) {
    return {
      message: `Voce correu ${weeklyRuns}x essa semana! Que tal um longao no domingo?`,
      chatPrompt: `Corri ${weeklyRuns} vezes essa semana totalizando ${weeklyKm.toFixed(1)}km. Pode sugerir um longao para o fim de semana?`,
      emoji: '🏃',
    }
  }
  // Rule: no run in 3+ days -> suggest easy run
  if (daysSinceLastRun >= 3) {
    return {
      message: `Faz ${daysSinceLastRun} dias sem correr. Uma corrida leve hoje?`,
      chatPrompt: `Estou ha ${daysSinceLastRun} dias sem correr. Pode sugerir um treino leve para retomar?`,
      emoji: '💪',
    }
  }
  // Rule: weekly volume up -> congratulate
  if (weeklyKm > previousWeekKm && previousWeekKm > 0) {
    const diff = (weeklyKm - previousWeekKm).toFixed(1)
    return {
      message: `+${diff}km comparado a semana passada. Continue assim!`,
      chatPrompt: `Essa semana corri ${weeklyKm.toFixed(1)}km, ${diff}km a mais que semana passada. O que recomenda para a proxima semana?`,
      emoji: '🔥',
    }
  }
  // Default
  return {
    message: 'Pronto para o proximo treino? Pergunte ao coach!',
    chatPrompt: 'Pode me sugerir um treino para hoje baseado no meu historico recente?',
    emoji: '🎯',
  }
}
```

### Pattern 4: Pre-filled Chat Navigation
**What:** Navigate to `/chat` with a query parameter that pre-fills the chat input
**When to use:** CoachCTA click handler

```typescript
// Navigate with pre-filled prompt [ASSUMED - standard Next.js pattern]
import { useRouter } from 'next/navigation'

const router = useRouter()
const handleCoachClick = (prompt: string) => {
  router.push(`/chat?prompt=${encodeURIComponent(prompt)}`)
}
```

Note: The chat page will need a small modification to read the `prompt` query param and pre-fill the input. Check if `useChat` or `ChatInput` already supports initial message props.

### Anti-Patterns to Avoid
- **Fetching too many activities for streak:** Don't fetch ALL activities. Fetch last ~12 weeks (perPage=100 or use `after` param with epoch 12 weeks ago) which is sufficient for streak calculation
- **Calling AI API for suggestions:** The coach CTA suggestions must be rule-based (client-side), not LLM API calls. This keeps the dashboard instant
- **Breaking WelcomeScreen:** `MetricCard` is also used in `src/features/chat/components/WelcomeScreen.tsx`. Any interface changes to MetricCard must be backwards-compatible
- **Giant single component:** Don't put everything in DashboardScreen. Extract each section as a separate component

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Circular progress | Canvas-based ring or JS animation | SVG `stroke-dasharray` + CSS transition | Browser-native, GPU-accelerated, zero dependencies |
| Date/week math | Custom date arithmetic everywhere | Reuse existing `getMonday()` from `useWeekNavigation.ts` | Already correct and tested |
| Loading states | Custom skeleton per component | `Shimmer` component already in project | Consistent UX pattern |
| Metric formatting | Inline formatting | Existing `formatDistance`, `formatPace`, `formatTrend` | Already handles edge cases |

## Common Pitfalls

### Pitfall 1: Strava API Rate Limits
**What goes wrong:** Fetching activities for multiple weeks (current + previous + streak) makes too many API calls
**Why it happens:** Each `useStravaActivities` call triggers a separate Strava API request through the backend proxy
**How to avoid:** Fetch a single batch of activities with `after` param set to ~12 weeks ago, then filter client-side. One API call covers all needs (recent 3, weekly comparison, streak)
**Warning signs:** Multiple loading spinners, slow dashboard load

### Pitfall 2: Weekly Goal Storage
**What goes wrong:** Weekly goal (D-02) needs to persist somewhere -- if only in React state, it resets on every page load
**Why it happens:** No local storage or backend endpoint for storing the user's weekly km goal
**How to avoid:** Store weekly goal in `localStorage` (key: `runmind_weekly_goal`). Initial value derived from `recent_run_totals.distance / 4` (avg weekly from last 4 weeks). User adjusts via inline edit
**Warning signs:** Goal resets to default on refresh

### Pitfall 3: Empty State When No Activities
**What goes wrong:** Ring shows 0/0, streak is 0, comparison is meaningless, coach CTA is generic
**Why it happens:** New user with Strava connected but no running activities
**How to avoid:** Design explicit empty states for each section. Ring section can show "Defina sua meta" instead. Coach CTA becomes "Comece sua primeira corrida!"
**Warning signs:** Division by zero, NaN in display

### Pitfall 4: MetricCard Interface Breakage
**What goes wrong:** Modifying `MetricCard` props breaks the chat `WelcomeScreen` which also imports it
**Why it happens:** Shared component used across features
**How to avoid:** Only add optional props to MetricCard. Never remove or rename existing props. Test both DashboardScreen and WelcomeScreen render
**Warning signs:** TypeScript errors in `src/features/chat/components/WelcomeScreen.tsx`

### Pitfall 5: Chat Pre-fill Integration
**What goes wrong:** Clicking CoachCTA navigates to `/chat` but the prompt is not picked up
**Why it happens:** Chat page/input doesn't read URL query params
**How to avoid:** Add `searchParams` reading in chat page or hook. Pass initial prompt to ChatInput component
**Warning signs:** Chat opens empty despite clicking a suggestion

## Code Examples

### Compact Activity Card (D-04)
```typescript
// Compact horizontal card for recent activities [ASSUMED - follows existing patterns]
interface RecentActivityCardProps {
  activity: StravaActivity
}

export function RecentActivityCard({ activity }: RecentActivityCardProps) {
  const relativeDate = getRelativeDate(activity.start_date_local) // "hoje", "ontem", "3d"

  return (
    <Card className="flex items-center gap-3 py-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-accent shrink-0">
        <Activity size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground truncate">{activity.name}</p>
        <div className="flex items-center gap-2 text-[11px] text-foreground-muted">
          <span>{formatDistance(activity.distance)}</span>
          <span>·</span>
          <span>{formatPace(activity.average_speed)}</span>
        </div>
      </div>
      <span className="text-[11px] text-foreground-muted shrink-0">{relativeDate}</span>
    </Card>
  )
}
```

### Relative Date Formatter
```typescript
// New formatter needed in formatters.ts [ASSUMED]
export function formatRelativeDate(isoDate: string): string {
  const date = new Date(isoDate)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'hoje'
  if (diffDays === 1) return 'ontem'
  if (diffDays < 7) return `${diffDays}d`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}sem`
  return formatDateShort(isoDate)
}
```

### Dashboard Data Hook
```typescript
// Aggregation hook [ASSUMED - combines existing hooks]
export function useDashboardData() {
  const { stats, isLoading: isLoadingStats } = useStravaStats()
  // Fetch last 12 weeks of activities in one call
  const twelveWeeksAgo = Math.floor((Date.now() - 12 * 7 * 24 * 60 * 60 * 1000) / 1000)
  const { activities, isLoading: isLoadingActivities } = useStravaActivities(1, 200)
  // Note: may need to use `after` param -- check if useStravaActivities supports it

  const weeklyGoal = useWeeklyGoal() // from localStorage
  const currentWeekActivities = filterCurrentWeek(activities)
  const previousWeekActivities = filterPreviousWeek(activities)

  const currentWeekKm = sumDistance(currentWeekActivities) / 1000
  const previousWeekKm = sumDistance(previousWeekActivities) / 1000
  const streak = calculateWeekStreak(activities)
  const recentThree = activities.slice(0, 3)

  const daysSinceLastRun = activities.length > 0
    ? Math.floor((Date.now() - new Date(activities[0].start_date_local).getTime()) / (1000 * 60 * 60 * 24))
    : Infinity

  const suggestion = generateCoachSuggestion(
    currentWeekActivities.length,
    daysSinceLastRun,
    currentWeekKm,
    previousWeekKm,
  )

  return {
    currentWeekKm,
    previousWeekKm,
    weeklyGoal,
    streak,
    recentThree,
    suggestion,
    isLoading: isLoadingStats || isLoadingActivities,
  }
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Canvas-based circular charts | SVG with CSS transitions | Widely adopted | Simpler, lighter, GPU-accelerated |
| External charting lib for single ring | Native SVG `stroke-dasharray` | Always available | Zero bundle cost |
| Server-computed streaks | Client-side from cached activities | React Query caching | Instant after first load |

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | SVG stroke-dasharray with CSS transition is sufficient for the ring animation (no need for framer-motion or GSAP) | Architecture Patterns | LOW - may want spring animation, but CSS ease-out is fine for MVP |
| A2 | localStorage is acceptable for persisting weekly goal | Pitfalls | LOW - if user clears storage, goal resets to computed default |
| A3 | Fetching 200 activities covers 12 weeks for streak calculation | Code Examples | MEDIUM - very active users might have >200 activities in 12 weeks; could need `after` param instead |
| A4 | Chat page can be modified to read `?prompt=` query param for pre-fill | Pitfalls | LOW - straightforward Next.js searchParams, but needs implementation |
| A5 | `useStravaActivities` pagination with page=1, perPage=200 returns enough data | Code Examples | MEDIUM - Strava API default max per_page is 200, which should be sufficient |
| A6 | Rule-based suggestions (not AI) are acceptable for D-08 | Architecture Patterns | LOW - explicitly stated in Claude's Discretion |

## Open Questions

1. **Weekly goal initial value source**
   - What we know: D-02 says "suggested by AI based on Strava history, user can adjust"
   - What's unclear: "AI suggestion" -- is this a backend call or client-side heuristic? Given Claude's Discretion says "simple rules", a client-side heuristic (avg weekly km from recent_run_totals) seems right
   - Recommendation: Use `recent_run_totals.distance / 4` as initial weekly goal (last 4 weeks avg). Store in localStorage. No AI API call needed

2. **Chat pre-fill mechanism**
   - What we know: D-09 says clicking CTA opens chat with pre-filled prompt
   - What's unclear: Whether chat components already support initial message injection
   - Recommendation: Use URL query param `?prompt=...` and read it in the chat page. Small integration change needed

3. **Activity fetch for streak -- pagination vs date filter**
   - What we know: `useStravaActivities` supports `page` and `perPage`. The API service supports `after` epoch param
   - What's unclear: Whether the hook passes `after` param through (it currently doesn't in the hook signature)
   - Recommendation: Extend `useStravaActivities` or create a new `useDashboardActivities` hook that uses `after` param for efficient fetching

## Project Constraints (from CLAUDE.md)

- **Tech Stack:** Next.js 14 + React 18 + Tailwind CSS -- no new frameworks
- **Naming:** Components PascalCase, hooks camelCase with `use` prefix, utils camelCase
- **Exports:** Barrel file at `src/features/training/index.ts` must be updated
- **Client components:** Must have `'use client'` directive
- **Styling:** Tailwind utility classes, CSS variables for theme colors, `cn()` for conditional classes
- **UI text:** Portuguese (pt-BR) for all user-facing strings
- **Code identifiers:** English
- **No semicolons**, single quotes, 2-space indent
- **Card pattern:** Use `Card` base component with composition
- **Loading:** Use `Shimmer` component for loading states
- **Data fetching:** React Query with staleTime 5min

## Sources

### Primary (HIGH confidence)
- Codebase analysis: `DashboardScreen.tsx`, `MetricCard.tsx`, `LastActivityCard.tsx`, `useStravaActivities.ts`, `stravaActivitiesApi.ts`, `activities.types.ts`, `formatters.ts`, `card.tsx`, `globals.css` -- all read and verified
- `WeekSummary.tsx` and `useWeekNavigation.ts` -- existing week calculation patterns verified

### Secondary (MEDIUM confidence)
- SVG stroke-dasharray technique for circular progress [ASSUMED - well-established web standard]
- Strava API per_page max of 200 [ASSUMED - standard Strava API limit from training data]

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - no new dependencies, all existing tools verified in codebase
- Architecture: HIGH - follows established patterns from existing dashboard components
- Pitfalls: HIGH - identified from direct codebase analysis (shared MetricCard, API patterns, empty states)
- Data layer: HIGH - all Strava types and hooks verified, data fields confirmed

**Research date:** 2026-04-25
**Valid until:** 2026-05-25 (stable -- no external dependency changes expected)
