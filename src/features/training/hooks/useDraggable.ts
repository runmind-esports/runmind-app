'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

interface Position {
  x: number
  y: number
}

interface UseDraggableParams {
  initialPosition: Position
  onPositionChange?: (pos: Position) => void
}

interface UseDraggableReturn {
  position: Position
  isDragging: boolean
  dragMovedRef: React.RefObject<boolean>
  ref: React.RefObject<HTMLElement | null>
}

export function useDraggable({
  initialPosition,
  onPositionChange,
}: UseDraggableParams): UseDraggableReturn {
  const [position, setPosition] = useState<Position>(initialPosition)
  const [isDragging, setIsDragging] = useState(false)
  const ref = useRef<HTMLElement | null>(null)
  const offsetRef = useRef<Position>({ x: 0, y: 0 })
  const isDraggingRef = useRef(false)
  const dragMovedRef = useRef(false)

  // Sync initial position when it changes (e.g., after hydration)
  const initializedRef = useRef(false)
  useEffect(() => {
    if (!initializedRef.current && (initialPosition.x !== 0 || initialPosition.y !== 0)) {
      setPosition(initialPosition)
      initializedRef.current = true
    }
  }, [initialPosition])

  const clampPosition = useCallback((x: number, y: number): Position => {
    const el = ref.current
    if (!el) return { x, y }
    const rect = el.getBoundingClientRect()
    const w = rect.width
    const h = rect.height
    return {
      x: Math.max(0, Math.min(x, window.innerWidth - w)),
      y: Math.max(0, Math.min(y, window.innerHeight - h)),
    }
  }, [])

  const handleMoveEvent = useCallback((clientX: number, clientY: number) => {
    if (!isDraggingRef.current) return
    dragMovedRef.current = true
    const newX = clientX - offsetRef.current.x
    const newY = clientY - offsetRef.current.y
    const clamped = clampPosition(newX, newY)
    setPosition(clamped)
  }, [clampPosition])

  const handleEndEvent = useCallback(() => {
    if (!isDraggingRef.current) return
    isDraggingRef.current = false
    setIsDragging(false)
    setPosition((current) => {
      onPositionChange?.(current)
      return current
    })
  }, [onPositionChange])

  const onMouseMove = useCallback((e: MouseEvent) => {
    handleMoveEvent(e.clientX, e.clientY)
  }, [handleMoveEvent])

  const onTouchMove = useCallback((e: TouchEvent) => {
    e.preventDefault()
    const touch = e.touches[0]
    handleMoveEvent(touch.clientX, touch.clientY)
  }, [handleMoveEvent])

  const onMouseUp = useCallback(() => {
    handleEndEvent()
  }, [handleEndEvent])

  const onTouchEnd = useCallback(() => {
    handleEndEvent()
  }, [handleEndEvent])

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const onMouseDown = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      offsetRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
      isDraggingRef.current = true
      dragMovedRef.current = false
      setIsDragging(true)
    }

    const onTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0]
      const rect = el.getBoundingClientRect()
      offsetRef.current = { x: touch.clientX - rect.left, y: touch.clientY - rect.top }
      isDraggingRef.current = true
      dragMovedRef.current = false
      setIsDragging(true)
    }

    el.addEventListener('mousedown', onMouseDown)
    el.addEventListener('touchstart', onTouchStart, { passive: true })

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('touchend', onTouchEnd)

    return () => {
      el.removeEventListener('mousedown', onMouseDown)
      el.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [onMouseMove, onMouseUp, onTouchMove, onTouchEnd])

  return { position, isDragging, dragMovedRef, ref }
}
