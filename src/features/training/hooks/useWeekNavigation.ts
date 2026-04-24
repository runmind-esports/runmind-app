'use client'

import { useState, useMemo, useCallback } from 'react'
import { formatDateShort } from '../utils/formatters'

/**
 * Returns the Monday of the week containing the given date.
 */
function getMonday(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  // getDay(): 0=Sun, 1=Mon, ..., 6=Sat
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  d.setHours(0, 0, 0, 0)
  return d
}

/**
 * Returns an array of 7 Date objects (Mon-Sun) for the given week start.
 */
export function getDaysOfWeek(weekStart: Date): Date[] {
  const days: Date[] = []
  for (let i = 0; i < 7; i++) {
    const day = new Date(weekStart)
    day.setDate(weekStart.getDate() + i)
    days.push(day)
  }
  return days
}

/**
 * Hook managing current week date range and navigation.
 * weekOffset: 0 = current week, -1 = last week, etc.
 */
export function useWeekNavigation() {
  const [weekOffset, setWeekOffset] = useState(0)

  const { weekStart, weekEnd, weekLabel, isCurrentWeek } = useMemo(() => {
    const today = new Date()
    const monday = getMonday(today)
    monday.setDate(monday.getDate() + weekOffset * 7)

    const start = new Date(monday)
    start.setHours(0, 0, 0, 0)

    const end = new Date(monday)
    end.setDate(end.getDate() + 6)
    end.setHours(23, 59, 59, 999)

    const label = `${formatDateShort(start)} - ${formatDateShort(end)}`

    return {
      weekStart: start,
      weekEnd: end,
      weekLabel: label,
      isCurrentWeek: weekOffset === 0,
    }
  }, [weekOffset])

  const goToPreviousWeek = useCallback(() => {
    setWeekOffset((prev) => prev - 1)
  }, [])

  const goToNextWeek = useCallback(() => {
    setWeekOffset((prev) => Math.min(prev + 1, 0))
  }, [])

  const goToCurrentWeek = useCallback(() => {
    setWeekOffset(0)
  }, [])

  return {
    weekStart,
    weekEnd,
    weekLabel,
    isCurrentWeek,
    goToPreviousWeek,
    goToNextWeek,
    goToCurrentWeek,
  }
}
