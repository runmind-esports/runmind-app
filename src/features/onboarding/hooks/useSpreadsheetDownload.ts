'use client'

import { useState, useCallback } from 'react'
import { onboardingApi } from '../services/onboardingApi'

type DownloadStatus = 'idle' | 'loading' | 'success' | 'error'

export function useSpreadsheetDownload() {
  const [status, setStatus] = useState<DownloadStatus>('idle')
  const [error, setError] = useState<string | null>(null)

  const download = useCallback(async () => {
    setStatus('loading')
    setError(null)
    try {
      const blob = await onboardingApi.downloadSpreadsheet()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'planilha-runmind.xlsx'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      setStatus('success')
    } catch (err) {
      console.error('Error downloading spreadsheet:', err)
      setError('Erro ao gerar planilha. Tente novamente.')
      setStatus('error')
    }
  }, [])

  return { status, error, download }
}
