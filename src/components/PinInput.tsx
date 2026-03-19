import { useState, useRef, useEffect, type ChangeEvent, type KeyboardEvent, type ClipboardEvent } from 'react'
import { useLanguage } from '../i18n/useLanguage'

interface PinInputProps {
  length?: number
  onComplete: (value: string) => void
  error?: string
  errorKey?: number
}

export default function PinInput({ length = 4, onComplete, error, errorKey }: PinInputProps) {
  const [digits, setDigits] = useState<string[]>(Array(length).fill(''))
  const [shaking, setShaking] = useState(false)
  const [lastErrorKey, setLastErrorKey] = useState(errorKey)
  const refs = useRef<(HTMLInputElement | null)[]>([])
  const { t } = useLanguage()

  useEffect(() => {
    refs.current[0]?.focus()
  }, [])

  // Adjust state during render when errorKey changes (React-recommended pattern)
  if (errorKey !== lastErrorKey) {
    setLastErrorKey(errorKey)
    if (error) {
      setShaking(true)
      setDigits(Array(length).fill(''))
    }
  }

  // Clear shaking after animation completes
  useEffect(() => {
    if (!shaking) return
    const timer = setTimeout(() => {
      setShaking(false)
      refs.current[0]?.focus()
    }, 400)
    return () => clearTimeout(timer)
  }, [shaking])

  function handleChange(index: number, value: string) {
    if (!/^\d*$/.test(value)) return

    const next = [...digits]
    next[index] = value.slice(-1)
    setDigits(next)

    if (value && index < length - 1) {
      refs.current[index + 1]?.focus()
    }

    if (next.every((d) => d !== '')) {
      onComplete(next.join(''))
    }
  }

  function handleKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      const next = [...digits]
      next[index - 1] = ''
      setDigits(next)
      refs.current[index - 1]?.focus()
    }
  }

  function handlePaste(e: ClipboardEvent<HTMLDivElement>) {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    if (!pasted) return

    const next = [...digits]
    for (let i = 0; i < length; i++) {
      next[i] = pasted[i] || ''
    }
    setDigits(next)

    const focusIndex = Math.min(pasted.length, length - 1)
    refs.current[focusIndex]?.focus()

    if (next.every((d) => d !== '')) {
      onComplete(next.join(''))
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex gap-2.5 sm:gap-3" dir="ltr" onPaste={handlePaste}>
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={(el) => { refs.current[i] = el }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            aria-label={t('pinDigit', { n: i + 1 })}
            value={digit ? '\u25CF' : ''}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              const raw = e.target.value.replace('\u25CF', '')
              handleChange(i, raw)
            }}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onFocus={(e) => e.target.select()}
            className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-bold rounded-xl border-2 bg-white focus:outline-none transition-all ${
              shaking
                ? 'border-red-400 text-red-500 animate-shake'
                : digit
                  ? 'border-primary-400 text-primary-700'
                  : 'border-primary-200 text-primary-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-200'
            }`}
          />
        ))}
      </div>
      {error && (
        <p className="text-red-500 text-sm font-medium" role="alert">{error}</p>
      )}
    </div>
  )
}
