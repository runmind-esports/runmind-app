'use client'

import { useState, useCallback, useEffect } from 'react'

const STORAGE_KEY = 'runmind_fab_position'

interface Position {
  x: number
  y: number
}

function getDefaultPosition(): Position {
  if (typeof window === 'undefined') {
    return { x: 0, y: 0 }
  }
  return {
    x: window.innerWidth - 76,
    y: window.innerHeight - 160,
  }
}

function readStoredPosition(): Position | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      typeof parsed.x === 'number' &&
      typeof parsed.y === 'number'
    ) {
      return { x: parsed.x, y: parsed.y }
    }
    return null
  } catch {
    return null
  }
}

export function useFABPosition() {
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 })

  useEffect(() => {
    const stored = readStoredPosition()
    setPosition(stored ?? getDefaultPosition())
  }, [])

  const savePosition = useCallback((pos: Position) => {
    setPosition(pos)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pos))
    } catch {
      // localStorage full or unavailable -- silently ignore
    }
  }, [])

  return { position, savePosition }
}
