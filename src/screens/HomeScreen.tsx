import { useState, useRef } from 'react'
import Modal from '../components/Modal'
import { useLanguage } from '../i18n/useLanguage'

interface Particle {
  size: number
  color: string
  top: string
  left?: string
  right?: string
  duration: string
  delay: string
}

const particles: Particle[] = [
  { size: 8, color: '#fda4af', top: '12%', left: '10%', duration: '4s', delay: '0s' },
  { size: 12, color: '#fde68a', top: '20%', right: '14%', duration: '5s', delay: '1s' },
  { size: 6, color: '#fecdd3', top: '55%', left: '8%', duration: '4.5s', delay: '0.5s' },
  { size: 10, color: '#fbbf24', top: '70%', right: '10%', duration: '3.5s', delay: '1.5s' },
  { size: 7, color: '#fb7185', top: '85%', left: '20%', duration: '5s', delay: '2s' },
  { size: 9, color: '#fde68a', top: '35%', right: '22%', duration: '4s', delay: '0.8s' },
]

interface HomeScreenProps {
  onNewGame: () => void
  onContinue: () => void
  onReset: () => void
  hasSavedGame: boolean
}

export default function HomeScreen({ onNewGame, onContinue, onReset, hasSavedGame }: HomeScreenProps) {
  const [showConfirm, setShowConfirm] = useState(false)
  const resetTriggerRef = useRef<HTMLButtonElement>(null)
  const { t } = useLanguage()

  function handleCloseConfirm() {
    setShowConfirm(false)
    resetTriggerRef.current?.focus()
  }

  return (
    <>
      <div className="min-h-svh flex flex-col items-center justify-center bg-gradient-to-b from-primary-50 to-accent-50 px-4 sm:px-6 relative overflow-hidden">
        {particles.map((p, i) => (
          <div
            key={i}
            className="particle"
            style={{
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              top: p.top,
              left: p.left,
              right: p.right,
              animationDuration: p.duration,
              animationDelay: p.delay,
            }}
          />
        ))}

        <div className="flex flex-col items-center gap-5 sm:gap-6 relative z-10">
          <div className="animate-bounce-in-down" style={{ animationDuration: '0.65s' }}>
            <img
              src="/icon.svg"
              alt={t('giftBoxAlt')}
              className="w-24 h-24 sm:w-28 sm:h-28 drop-shadow-lg animate-float"
            />
          </div>

          <div
            className="text-center animate-fade-in"
            style={{ animationDuration: '0.55s', animationDelay: '200ms' }}
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-primary-900 tracking-tight">
              {t('secretFriend')}
            </h1>
            <p className="mt-2 text-primary-700/80 text-base sm:text-lg">
              {t('tagline')}
            </p>
          </div>

          <div
            className="flex flex-col gap-3 w-full max-w-[280px] sm:max-w-xs mt-3 sm:mt-4 animate-fade-in"
            style={{ animationDuration: '0.55s', animationDelay: '400ms' }}
            role="navigation"
            aria-label={t('gameOptions')}
          >
            <button
              onClick={onNewGame}
              className="w-full py-3.5 sm:py-4 px-6 bg-primary-600 hover:bg-primary-700 hover:shadow-xl active:scale-95 text-white font-semibold rounded-2xl text-base sm:text-lg shadow-lg shadow-primary-200 transition-[transform,background-color,box-shadow] duration-150"
            >
              {t('startNewGame')}
            </button>

            {hasSavedGame && (
              <>
                <button
                  onClick={onContinue}
                  className="w-full py-3.5 sm:py-4 px-6 bg-white/70 backdrop-blur-sm hover:bg-white/90 active:scale-95 text-primary-700 font-semibold rounded-2xl text-base sm:text-lg shadow-md border border-white/30 transition-[transform,background-color,box-shadow] duration-150"
                >
                  {t('continueGame')}
                </button>

                <button
                  ref={resetTriggerRef}
                  onClick={() => setShowConfirm(true)}
                  className="w-full py-3 px-6 text-red-500 hover:text-red-700 font-medium text-sm transition-colors duration-150"
                >
                  {t('resetEverything')}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <Modal
        open={showConfirm}
        onClose={handleCloseConfirm}
        role="alertdialog"
        ariaLabel={t('confirmReset')}
        ariaDescribedBy="confirm-reset-msg"
        zIndex="z-[60]"
        className="p-5 sm:p-6"
      >
        <p id="confirm-reset-msg" className="text-primary-900 font-medium text-center mb-4 sm:mb-5 text-sm sm:text-base">
          {t('confirmDeleteMessage')}
        </p>
        <div className="flex gap-2">
          <button
            onClick={handleCloseConfirm}
            className="flex-1 py-2.5 sm:py-3 px-4 bg-white hover:bg-primary-50 active:scale-95 text-primary-600 font-semibold rounded-xl border border-primary-200 transition-all text-sm sm:text-base"
          >
            {t('cancel')}
          </button>
          <button
            onClick={() => { onReset(); handleCloseConfirm() }}
            className="flex-1 py-2.5 sm:py-3 px-4 bg-red-500 hover:bg-red-600 active:scale-95 text-white font-semibold rounded-xl transition-[transform,background-color,box-shadow] duration-150 text-sm sm:text-base"
          >
            {t('reset')}
          </button>
        </div>
      </Modal>
    </>
  )
}
