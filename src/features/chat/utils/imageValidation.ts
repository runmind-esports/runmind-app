const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
const MAX_FILE_SIZE = 20 * 1024 * 1024 // 20MB
const MAX_TOTAL_SIZE = 32 * 1024 * 1024 // 32MB
const MAX_FILES = 5

export interface ValidationResult {
  valid: boolean
  errors: string[]
  validFiles: File[]
}

export function validateImageFile(file: File): string | null {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return 'Formato não suportado. Use JPEG, PNG, GIF ou WebP.'
  }

  if (file.size > MAX_FILE_SIZE) {
    return 'Imagem muito grande. Máximo 20MB.'
  }

  return null
}

export function validateImageFiles(
  files: File[],
  existingFiles: File[] = []
): ValidationResult {
  const errors: string[] = []
  const validFiles: File[] = []

  const totalFilesCount = existingFiles.length + files.length
  if (totalFilesCount > MAX_FILES) {
    errors.push('Máximo de 5 imagens por mensagem.')
    return { valid: false, errors, validFiles }
  }

  let totalSize = existingFiles.reduce((acc, f) => acc + f.size, 0)

  for (const file of files) {
    const fileError = validateImageFile(file)
    if (fileError) {
      errors.push(`${file.name}: ${fileError}`)
      continue
    }

    if (totalSize + file.size > MAX_TOTAL_SIZE) {
      errors.push('Tamanho total excede 32MB.')
      break
    }

    totalSize += file.size
    validFiles.push(file)
  }

  return {
    valid: errors.length === 0,
    errors,
    validFiles,
  }
}

export function isImageFile(file: File): boolean {
  return ACCEPTED_TYPES.includes(file.type)
}
