'use client'

import { useRouter } from 'next/navigation'
import { Dumbbell } from 'lucide-react'
import { useDraggable } from '../hooks/useDraggable'
import { useFABPosition } from '../hooks/useFABPosition'

export function FAB() {
  const router = useRouter()
  const { position, savePosition, ready } = useFABPosition()
  const { position: currentPos, isDragging, dragMovedRef, ref } = useDraggable({
    initialPosition: position,
    onPositionChange: savePosition,
  })

  const handleClick = () => {
    if (dragMovedRef.current) return
    router.push('/training')
  }

  if (!ready) return null

  return (
    <button
      ref={ref as React.RefObject<HTMLButtonElement>}
      onClick={handleClick}
      className={[
        'fixed z-50 flex h-14 w-14 items-center justify-center rounded-full bg-accent',
        'transition-opacity transition-shadow duration-200',
        isDragging
          ? 'opacity-100 shadow-xl cursor-grabbing'
          : 'opacity-70 hover:opacity-100 shadow-lg cursor-grab',
      ].join(' ')}
      style={{
        left: currentPos.x,
        top: currentPos.y,
        touchAction: 'none',
      }}
      aria-label="Modo treino"
    >
      <Dumbbell className="h-6 w-6 text-background" />
    </button>
  )
}
