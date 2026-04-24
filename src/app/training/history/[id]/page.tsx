'use client'

import { useParams } from 'next/navigation'
import { ActivityDetailScreen } from '@/features/training'

export default function ActivityDetailPage() {
  const params = useParams()
  const activityId = Number(params.id)

  if (!activityId || isNaN(activityId)) {
    return null
  }

  return <ActivityDetailScreen activityId={activityId} />
}
