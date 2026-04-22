'use client'

import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

interface ImagePreviewProps {
  src: string
  onRemove: () => void
}

export function ImagePreview({ src, onRemove }: ImagePreviewProps) {
  return (
    <div className="relative h-12 w-12 shrink-0">
      <Image
        src={src}
        alt="Preview"
        fill
        className="rounded-md object-cover"
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onRemove}
        className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-background border border-border hover:bg-background-tertiary shadow-sm"
      >
        <X className="h-2.5 w-2.5" />
      </Button>
    </div>
  )
}
