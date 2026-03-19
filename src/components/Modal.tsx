import { useEffect, useRef, useState, useCallback, type ReactNode } from 'react'

interface ModalProps {
  open: boolean
  onClose: () => void
  children: ReactNode
  role?: 'dialog' | 'alertdialog'
  ariaLabel: string
  ariaDescribedBy?: string
  maxWidth?: string
  className?: string
  zIndex?: string
}

export default function Modal({
  open,
  onClose,
  children,
  role = 'dialog',
  ariaLabel,
  ariaDescribedBy,
  maxWidth = 'max-w-sm',
  className = '',
  zIndex = 'z-50',
}: ModalProps) {
  const [closing, setClosing] = useState(false)
  const [prevOpen, setPrevOpen] = useState(false)
  const dialogRef = useRef<HTMLDivElement>(null)

  // React-recommended pattern: adjust state during render when props change
  if (open !== prevOpen) {
    setPrevOpen(open)
    if (!open && prevOpen) {
      setClosing(true)
    }
  }

  // Handle closing animation timeout
  useEffect(() => {
    if (!closing) return
    const timer = setTimeout(() => {
      setClosing(false)
      onClose()
    }, 250)
    return () => clearTimeout(timer)
  }, [closing, onClose])

  const close = useCallback(() => {
    setClosing(true)
  }, [])

  const visible = open || closing

  useEffect(() => {
    if (!open || closing) return
    const dialog = dialogRef.current
    if (dialog) {
      const firstBtn = dialog.querySelector<HTMLButtonElement>('button')
      firstBtn?.focus()
      dialog.scrollTop = 0
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') { close(); return }
      if (e.key !== 'Tab' || !dialog) return
      const focusable = dialog.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, closing, close])

  if (!visible) return null

  return (
    <div
      className={`fixed inset-0 ${zIndex} flex items-end justify-center px-3 sm:px-4 pb-4 sm:pb-6`}
      onClick={close}
    >
      <div className={`absolute inset-0 bg-black/30 backdrop-blur-[2px] ${closing ? 'animate-backdrop-out' : 'animate-backdrop-in'}`} />

      <div
        ref={dialogRef}
        className={`relative w-full ${maxWidth} bg-white rounded-2xl shadow-2xl ${closing ? 'animate-popup-out' : 'animate-popup-in'} ${className}`}
        onClick={(e) => e.stopPropagation()}
        role={role}
        aria-modal="true"
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
      >
        {children}
      </div>
    </div>
  )
}
