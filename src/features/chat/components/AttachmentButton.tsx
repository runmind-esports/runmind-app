'use client'

import { useRef } from 'react'
import { Paperclip } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AttachmentButtonProps {
  onFilesSelected: (files: FileList) => void
  disabled?: boolean
}

export function AttachmentButton({ onFilesSelected, disabled }: AttachmentButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleClick = () => {
    inputRef.current?.click()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      onFilesSelected(files)
    }
    // Reset input to allow selecting the same file again
    e.target.value = ''
  }

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        multiple
        onChange={handleChange}
        style={{ display: 'none' }}
        aria-hidden="true"
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={handleClick}
        disabled={disabled}
        aria-label="Anexar imagem"
        className="h-9 w-9 shrink-0 rounded-full text-foreground-muted hover:text-foreground hover:bg-background-tertiary"
      >
        <Paperclip className="h-4 w-4" />
      </Button>
    </div>
  )
}
