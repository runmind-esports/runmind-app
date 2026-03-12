'use client'

import { useRef, useEffect, useState, useCallback } from 'react'

export function useChatScroll<T extends HTMLElement>(deps: unknown[]) {
  const scrollRef = useRef<T>(null)
  const [isAtBottom, setIsAtBottom] = useState(true)

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [])

  const handleScroll = useCallback(() => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
      const threshold = 100
      setIsAtBottom(scrollHeight - scrollTop - clientHeight < threshold)
    }
  }, [])

  useEffect(() => {
    if (isAtBottom) {
      scrollToBottom()
    }
  }, [deps, isAtBottom, scrollToBottom])

  useEffect(() => {
    const element = scrollRef.current
    if (element) {
      element.addEventListener('scroll', handleScroll)
      return () => element.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])

  return {
    scrollRef,
    isAtBottom,
    scrollToBottom,
  }
}
