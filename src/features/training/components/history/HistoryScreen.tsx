'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Unplug } from 'lucide-react'
import { useStrava } from '@/features/strava'
import { useInfiniteActivities } from '../../hooks/useInfiniteActivities'
import { ActivityListItem } from './ActivityListItem'
import { ActivityFilters } from './ActivityFilters'

function SkeletonItem() {
  return (
    <div className="animate-pulse rounded-xl border border-border bg-background-secondary p-3">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-background-tertiary" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 rounded bg-background-tertiary" />
          <div className="h-3 w-1/2 rounded bg-background-tertiary" />
        </div>
      </div>
    </div>
  )
}

function StravaConnectCTA({ onConnect }: { onConnect: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-12">
      <Unplug className="h-12 w-12 text-accent" />
      <h2 className="mt-4 text-lg font-semibold text-foreground">
        Conecte seu Strava
      </h2>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        Conecte sua conta Strava para ver seu historico de atividades
      </p>
      <button
        onClick={onConnect}
        className="mt-4 rounded-xl bg-accent px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
      >
        Conectar Strava
      </button>
    </div>
  )
}

export function HistoryScreen() {
  const router = useRouter()
  const [typeFilter, setTypeFilter] = useState('')
  const [periodFilter, setPeriodFilter] = useState<string>('all')
  const sentinelRef = useRef<HTMLDivElement>(null)

  const { isConnected, connect } = useStrava()
  const {
    activities,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteActivities({
    typeFilter: typeFilter || undefined,
    periodFilter: periodFilter as 'week' | 'month' | '3months' | 'all',
  })

  const handleFetchNext = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          handleFetchNext()
        }
      },
      { threshold: 0.1 },
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [handleFetchNext])

  if (!isConnected) {
    return <StravaConnectCTA onConnect={connect} />
  }

  return (
    <div className="mx-auto max-w-lg space-y-4 p-4">
      <ActivityFilters
        typeFilter={typeFilter}
        periodFilter={periodFilter}
        onTypeChange={setTypeFilter}
        onPeriodChange={setPeriodFilter}
      />

      {isLoading ? (
        <div className="space-y-2">
          <SkeletonItem />
          <SkeletonItem />
          <SkeletonItem />
        </div>
      ) : activities.length === 0 ? (
        <p className="py-12 text-center text-sm text-foreground-muted">
          Nenhuma atividade encontrada
        </p>
      ) : (
        <div className="space-y-2">
          {activities.map((activity) => (
            <ActivityListItem
              key={activity.id}
              activity={activity}
              onTap={(id) => router.push(`/training/history/${id}`)}
            />
          ))}
        </div>
      )}

      {isFetchingNextPage && (
        <div className="flex justify-center py-4">
          <Loader2 className="h-5 w-5 animate-spin text-accent" />
        </div>
      )}

      <div ref={sentinelRef} className="h-1" />
    </div>
  )
}
