'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Chat } from '@/features/chat'

function ChatPageInner() {
  const searchParams = useSearchParams()
  const initialPrompt = searchParams.get('prompt') || undefined

  return <Chat initialPrompt={initialPrompt} />
}

export default function ChatPage() {
  return (
    <Suspense>
      <ChatPageInner />
    </Suspense>
  )
}
