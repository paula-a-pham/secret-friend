import { useState } from 'react'
import AddPlayersForm from '../components/AddPlayersForm'
import PinInput from '../components/PinInput'
import { playFlip, playSuccess } from '../utils/sounds'
import { tapVibrate } from '../utils/haptics'
import { useLanguage } from '../i18n/useLanguage'
import type { GameState } from '../types'

interface FlipCardProps {
  giver: string
  recipient: string
  isRevealed: boolean
  onFlip: () => void
  delay?: number
}

function FlipCard({ giver, recipient, isRevealed, onFlip, delay = 0 }: FlipCardProps) {
  const { t } = useLanguage()
  return (
    <div
      onClick={onFlip}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onFlip()}
      role="button"
      tabIndex={0}
      aria-label={isRevealed ? t('givesTo', { giver, recipient }) : t('revealPerson', { name: giver })}
      className="focus:outline-none focus:ring-2 focus:ring-primary-400 rounded-2xl flip-gpu"
      style={{
        perspective: '800px',
        animation: `card-enter 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}ms both`,
      }}
    >
      <div
        className="relative w-full transition-transform duration-200 ease-out"
        style={{
          minHeight: '120px',
          transformStyle: 'preserve-3d',
          transform: isRevealed ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        <div
          className="w-full h-full bg-white/85 rounded-2xl shadow-sm border border-white/40 absolute inset-0 flex flex-col items-center justify-center gap-1.5 sm:gap-2 p-4 sm:p-5 hover:bg-white transition-colors duration-150"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <p className="font-semibold text-primary-900 text-center text-base sm:text-lg break-words w-full">{giver}</p>
          <span className="text-2xl sm:text-3xl" aria-hidden="true">🎁</span>
          <p className="text-primary-500 text-xs sm:text-sm">{t('tapToReveal')}</p>
        </div>

        <div
          className="w-full h-full bg-white/85 rounded-2xl shadow-sm border border-white/40 absolute inset-0 flex flex-col items-center justify-center gap-1.5 sm:gap-2 p-4 sm:p-5"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <p className="text-primary-600 text-xs sm:text-sm">{t('secretFriendLabel')}</p>
          <span className="text-xl sm:text-2xl" aria-hidden="true">🎁</span>
          <p className="font-bold text-accent-700 text-lg sm:text-xl text-center break-words w-full">{recipient}</p>
        </div>
      </div>
    </div>
  )
}

interface ResultsScreenProps {
  game: GameState
  onBack: () => void
  onAddPlayers: (names: string[]) => void
}

export default function ResultsScreen({ game, onBack, onAddPlayers }: ResultsScreenProps) {
  const { participants, assignments, pin } = game
  const [unlocked, setUnlocked] = useState(false)
  const [error, setError] = useState<{ message: string; key: number } | null>(null)
  const [showAddPlayers, setShowAddPlayers] = useState(false)
  const [revealed, setRevealed] = useState<Record<string, boolean>>({})
  const [pinSuccess, setPinSuccess] = useState(false)
  const { t } = useLanguage()

  function handlePinComplete(value: string) {
    if (value === pin) {
      playSuccess()
      setPinSuccess(true)
      setTimeout(() => {
        setUnlocked(true)
        setError(null)
      }, 800)
    } else {
      tapVibrate()
      setError({ message: t('wrongPin'), key: Date.now() })
    }
  }

  function toggleReveal(name: string) {
    tapVibrate()
    playFlip()
    setRevealed((prev) => ({ ...prev, [name]: !prev[name] }))
  }

  if (!unlocked) {
    return (
      <div className="min-h-svh bg-gradient-to-b from-primary-50 to-accent-50 flex flex-col items-center justify-center px-4 sm:px-6">
        <div className="animate-fade-in text-center max-w-sm w-full">
          <button
            onClick={onBack}
            className="text-primary-600 font-medium mb-6 sm:mb-8 flex items-center gap-1 hover:text-primary-800 transition-colors duration-150"
            aria-label={t('goBackHome')}
          >
            <span className="text-xl leading-none">{t('backArrow')}</span> {t('back')}
          </button>
          {pinSuccess ? (
            <div className="animate-pop-in">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-100/80 flex items-center justify-center mx-auto mb-5 sm:mb-6">
                <span className="text-3xl sm:text-4xl">&#10003;</span>
              </div>
              <p className="text-lg sm:text-xl font-bold text-emerald-600">{t('unlocked')}</p>
            </div>
          ) : (
            <>
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary-100/80 backdrop-blur-sm flex items-center justify-center mx-auto mb-5 sm:mb-6">
                <span className="text-2xl sm:text-3xl" aria-hidden="true">🔒</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-primary-900 mb-2">
                {t('viewResults')}
              </h1>
              <p className="text-primary-700/80 text-sm sm:text-base mb-6 sm:mb-8">
                {t('enterPinToSee')}
              </p>

              <PinInput onComplete={handlePinComplete} error={error?.message} errorKey={error?.key} />
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-svh bg-gradient-to-b from-primary-50 to-accent-50 px-4 sm:px-6 py-6 sm:py-8">
      <div className="max-w-lg sm:max-w-2xl mx-auto animate-fade-in">
        <h1 className="text-xl sm:text-2xl font-bold text-primary-900 mb-3 sm:mb-4 text-center">
          {t('allMatches')}
        </h1>

        <p className="text-primary-700/80 mb-3 sm:mb-4 text-center text-xs sm:text-sm">
          {t('tapCardToReveal')}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3 mb-4">
          {participants.map((giver, i) => (
            <FlipCard
              key={giver}
              giver={giver}
              recipient={assignments[giver]}
              isRevealed={revealed[giver]}
              onFlip={() => toggleReveal(giver)}
              delay={i * 120}
            />
          ))}
        </div>

        {showAddPlayers ? (
          <AddPlayersForm
            existingNames={participants}
            onConfirm={(names) => { onAddPlayers(names); setShowAddPlayers(false) }}
            onCancel={() => setShowAddPlayers(false)}
          />
        ) : (
          <button
            onClick={() => setShowAddPlayers(true)}
            className="w-full mb-5 sm:mb-6 py-2.5 sm:py-3 px-6 bg-white/70 backdrop-blur-sm hover:bg-white/90 active:scale-95 text-primary-600 font-medium rounded-2xl text-sm sm:text-base border border-dashed border-primary-300/50 transition-[transform,background-color] duration-150"
          >
            {t('addNewPlayersBtn')}
          </button>
        )}

        <button
          onClick={onBack}
          className="w-full py-3.5 sm:py-4 px-6 bg-primary-600 hover:bg-primary-700 hover:shadow-xl active:scale-95 text-white font-semibold rounded-2xl text-base sm:text-lg shadow-lg shadow-primary-200 transition-[transform,background-color,box-shadow] duration-150"
        >
          {t('home')}
        </button>
      </div>
    </div>
  )
}
