'use client'

import { useState, useEffect } from 'react'

interface UseTypingEffectOptions {
  text: string
  speed?: number
  enabled?: boolean
}

export function useTypingEffect({ text, speed = 10, enabled = true }: UseTypingEffectOptions) {
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    if (!enabled) {
      setDisplayedText(text)
      return
    }

    setDisplayedText('')
    setIsTyping(true)

    let currentIndex = 0
    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1))
        currentIndex++
      } else {
        setIsTyping(false)
        clearInterval(interval)
      }
    }, speed)

    return () => clearInterval(interval)
  }, [text, speed, enabled])

  return { displayedText, isTyping }
}
