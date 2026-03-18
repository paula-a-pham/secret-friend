import { useState } from 'react'
import { tapVibrate } from '../utils/haptics'
import { useLanguage } from '../i18n/LanguageContext'

const particles = [
  { size: 8, color: '#fda4af', top: '12%', left: '10%', duration: '4s', delay: '0s' },
  { size: 12, color: '#fde68a', top: '20%', right: '14%', duration: '5s', delay: '1s' },
  { size: 6, color: '#fecdd3', top: '55%', left: '8%', duration: '4.5s', delay: '0.5s' },
  { size: 10, color: '#fbbf24', top: '70%', right: '10%', duration: '3.5s', delay: '1.5s' },
  { size: 7, color: '#fb7185', top: '85%', left: '20%', duration: '5s', delay: '2s' },
  { size: 9, color: '#fde68a', top: '35%', right: '22%', duration: '4s', delay: '0.8s' },
]

export default function HomeScreen({ onNewGame, onContinue, onReset, hasSavedGame }) {
  const [showConfirm, setShowConfirm] = useState(false)
  const { t } = useLanguage()

  return (
    <div className="min-h-svh flex flex-col items-center justify-center bg-gradient-to-b from-primary-50 to-accent-50 px-6 relative overflow-hidden">
      {/* Decorative particles */}
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

      <div className="flex flex-col items-center gap-6 relative z-10">
        {/* Icon */}
        <div className="animate-bounce-in-down" style={{ animationDuration: '0.65s' }}>
          <img
            src="/icon.svg"
            alt={t('giftBoxAlt')}
            className="w-28 h-28 drop-shadow-lg animate-float"
          />
        </div>

        {/* Title + subtitle */}
        <div
          className="text-center animate-fade-in"
          style={{ animationDuration: '0.55s', animationDelay: '200ms' }}
        >
          <h1 className="text-4xl font-bold text-primary-900 tracking-tight">
            {t('secretFriend')}
          </h1>
          <p className="mt-2 text-primary-700/70 text-lg">
            {t('tagline')}
          </p>
        </div>

        {/* Buttons */}
        <div
          className="flex flex-col gap-3 w-full max-w-xs mt-4 animate-fade-in"
          style={{ animationDuration: '0.55s', animationDelay: '400ms' }}
          role="navigation"
          aria-label={t('gameOptions')}
        >
          <button
            onClick={() => { tapVibrate(); onNewGame() }}
            className="w-full py-4 px-6 bg-primary-600 hover:bg-primary-700 hover:shadow-xl active:scale-95 text-white font-semibold rounded-2xl text-lg shadow-lg shadow-primary-200 transition-[transform,background-color,box-shadow] duration-150"
          >
            {t('startNewGame')}
          </button>

          {hasSavedGame && (
            <>
              <button
                onClick={() => { tapVibrate(); onContinue() }}
                className="w-full py-4 px-6 bg-white/70 backdrop-blur-sm hover:bg-white/90 active:scale-95 text-primary-700 font-semibold rounded-2xl text-lg shadow-md border border-white/30 transition-[transform,background-color,box-shadow] duration-150"
              >
                {t('continueGame')}
              </button>

              {showConfirm ? (
                <div
                  className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/30 p-4 text-center animate-fade-in shadow-lg"
                  style={{ animationDuration: '0.55s' }}
                  role="alertdialog"
                  aria-label={t('confirmReset')}
                >
                  <p className="text-primary-900 font-medium mb-3">
                    {t('confirmDeleteMessage')}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowConfirm(false)}
                      className="flex-1 py-3 px-4 bg-white hover:bg-primary-50 active:scale-95 text-primary-600 font-semibold rounded-xl border border-primary-200 transition-all"
                    >
                      {t('cancel')}
                    </button>
                    <button
                      onClick={() => { tapVibrate(); onReset(); setShowConfirm(false) }}
                      className="flex-1 py-3 px-4 bg-red-500 hover:bg-red-600 active:scale-95 text-white font-semibold rounded-xl transition-[transform,background-color,box-shadow] duration-150"
                    >
                      {t('reset')}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowConfirm(true)}
                  className="w-full py-3 px-6 text-red-400 hover:text-red-600 font-medium text-sm transition-colors duration-150"
                >
                  {t('resetEverything')}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
