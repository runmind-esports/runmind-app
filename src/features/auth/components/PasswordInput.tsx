'use client'

import { useState, useMemo, forwardRef } from 'react'

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  showStrength?: boolean
  error?: string
}

function calculateStrength(password: string): { level: number; label: string; color: string } {
  let score = 0

  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[A-Z]/.test(password)) score++
  if (/[a-z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  if (score <= 2) return { level: 1, label: 'Fraca', color: '#EF4444' }
  if (score <= 4) return { level: 2, label: 'Média', color: '#F59E0B' }
  return { level: 3, label: 'Forte', color: '#00F048' }
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput(
    {
      showStrength = false,
      error,
      className,
      ...props
    },
    ref
  ) {
    const [showPassword, setShowPassword] = useState(false)
    const [internalValue, setInternalValue] = useState('')

    // Track value for strength indicator
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInternalValue(e.target.value)
      props.onChange?.(e)
    }

    const strength = useMemo(() => {
      if (!showStrength || !internalValue) return null
      return calculateStrength(internalValue)
    }, [internalValue, showStrength])

    return (
      <div className="space-y-2">
        <div className="relative">
          <input
            ref={ref}
            type={showPassword ? 'text' : 'password'}
            {...props}
            onChange={handleChange}
            className={`w-full px-4 py-3 pr-12 bg-[#F5F6F7] border-[1.5px] rounded-xl text-sm text-[#14162E] placeholder:text-[#A8ADBE] outline-none transition-all focus:border-[#14162E] focus:bg-white focus:shadow-[0_0_0_4px_rgba(20,22,46,0.05)] ${
              error ? 'border-red-400' : 'border-[rgba(20,22,46,0.09)]'
            } ${className || ''}`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-[#A8ADBE] hover:text-[#14162E] transition-colors"
            tabIndex={-1}
          >
            {showPassword ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            )}
          </button>
        </div>

        {error && (
          <p className="text-xs text-red-500">{error}</p>
        )}

        {showStrength && internalValue && strength && (
          <div className="flex items-center gap-2">
            <div className="flex gap-1 flex-1">
              {[1, 2, 3].map((level) => (
                <div
                  key={level}
                  className="h-1 flex-1 rounded-full transition-colors"
                  style={{
                    backgroundColor: level <= strength.level ? strength.color : 'rgba(20,22,46,0.1)',
                  }}
                />
              ))}
            </div>
            <span
              className="text-[10px] font-semibold tracking-wide"
              style={{ color: strength.color }}
            >
              {strength.label}
            </span>
          </div>
        )}
      </div>
    )
  }
)
