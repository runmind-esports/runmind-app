'use client'

import { useParams } from 'next/navigation'
import { WorkoutScreen } from '@/features/training'

export default function WorkoutDetailPage() {
  const params = useParams()
  const activityId = Number(params.id)

  if (!activityId || isNaN(activityId)) {
    return null
  }

  return <WorkoutScreen activityId={activityId} />
}
