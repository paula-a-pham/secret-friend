import { useState, useEffect, useRef, type FormEvent } from 'react'
import { getAvailableRecipients, drawRandom, performSwap } from '../utils/draw'
import { playTick, playReveal, playSuccess } from '../utils/sounds'
import { tapVibrate } from '../utils/haptics'
import Modal from '../components/Modal'
import { useLanguage } from '../i18n/useLanguage'
import type { GameState, Assignments } from '../types'

const SHUFFLE_DURATION = 2000
const SHUFFLE_INTERVAL_START = 50
const SHUFFLE_INTERVAL_END = 300

type DrawPhase = 'list' | 'privacy' | 'shuffling' | 'reveal'

interface DrawScreenProps {
  game: GameState
  onAccept: (person: string, recipient: string, swapAssignments: Assignments | null) => void
  onComplete: () => void
  onAddPlayer: (name: string) => void
  onRemovePlayer: (name: string) => void
  onBack: () => void
}

export default function DrawScreen({ game, onAccept, onComplete, onAddPlayer, onRemovePlayer, onBack }: DrawScreenProps) {
  const { participants, assignments, drawn, pool } = game
  const [phase, setPhase] = useState<DrawPhase>('list')
  const [currentPerson, setCurrentPerson] = useState<string | null>(null)
  const [drawnName, setDrawnName] = useState<string | null>(null)
  const [displayName, setDisplayName] = useState('')
  const [swapData, setSwapData] = useState<Assignments | null>(null)
  const [newName, setNewName] = useState('')
  const [addError, setAddError] = useState('')
  const [removing, setRemoving] = useState<string | null>(null)
  const [shuffleProgress, setShuffleProgress] = useState(0)
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false)
  const shuffleRef = useRef<number | null>(null)
  const { t } = useLanguage()

  const allDrawn = drawn.length === participants.length
  const canRemove = participants.length > 3

  function handleAddPlayer(e: FormEvent) {
    e.preventDefault()
    const trimmed = newName.trim()
    if (!trimmed) return
    if (participants.some((p) => p.toLowerCase() === trimmed.toLowerCase())) {
      setAddError(t('nameAlreadyExists'))
      return
    }
    onAddPlayer(trimmed)
    setNewName('')
    setAddError('')
  }

  function startTurn(person: string) {
    setCurrentPerson(person)
    setPhase('privacy')
  }

  function startDraw() {
    setPhase('shuffling')

    let finalName: string
    let swap: Assignments | null = null

    if (!currentPerson) return

    const available = getAvailableRecipients(pool, currentPerson, assignments)

    if (available.length === 0) {
      const result = performSwap(assignments, currentPerson)
      if (!result) return
      finalName = result.drawnName
      swap = result.updatedAssignments
      setSwapData(swap)
    } else {
      const picked = drawRandom(available)
      if (!picked) return
      finalName = picked
      setSwapData(null)
    }

    setDrawnName(finalName)

    const poolForDisplay = available.length > 0 ? available : [finalName]
    if (poolForDisplay.length <= 1) {
      setDisplayName(finalName)
      setPhase('reveal')
      return
    }

    const startTime = Date.now()
    let lastUpdate = 0

    function animate() {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / SHUFFLE_DURATION, 1)
      const interval =
        SHUFFLE_INTERVAL_START +
        (SHUFFLE_INTERVAL_END - SHUFFLE_INTERVAL_START) * progress

      if (elapsed - lastUpdate >= interval) {
        const randomIdx = Math.floor(Math.random() * poolForDisplay.length)
        setDisplayName(poolForDisplay[randomIdx])
        setShuffleProgress(progress)
        playTick()
        tapVibrate()
        lastUpdate = elapsed
      }

      if (progress < 1) {
        shuffleRef.current = requestAnimationFrame(animate)
      } else {
        setDisplayName(finalName)
        setShuffleProgress(1)
        setPhase('reveal')
      }
    }

    shuffleRef.current = requestAnimationFrame(animate)
  }

  function handleAccept() {
    if (!currentPerson || !drawnName) return
    onAccept(currentPerson, drawnName, swapData)
    setPhase('list')
    setCurrentPerson(null)
    setDrawnName(null)
    setDisplayName('')
  }

  function handleReject() {
    startDraw()
  }

  useEffect(() => {
    return () => {
      if (shuffleRef.current) cancelAnimationFrame(shuffleRef.current)
    }
  }, [])

  useEffect(() => {
    if (phase !== 'reveal') return
    playReveal()
    let rafId: number
    import('canvas-confetti').then(({ default: confetti }) => {
      const end = Date.now() + 1500
      const colors = ['#e11d48', '#f59e0b', '#10b981', '#6366f1', '#ec4899', '#f97316']
      function frame() {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.6 },
          colors,
        })
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.6 },
          colors,
        })
        if (Date.now() < end) rafId = requestAnimationFrame(frame)
      }
      rafId = requestAnimationFrame(frame)
    })
    return () => { if (rafId) cancelAnimationFrame(rafId) }
  }, [phase])

  if (phase === 'shuffling' || phase === 'reveal') {
    const isRevealed = phase === 'reveal'
    const wobbleSpeed = isRevealed ? 0 : 0.15 + shuffleProgress * 0.4

    const shuffleContent = isRevealed ? (
      <div
        className="bg-white/80 rounded-3xl border border-white/40 px-8 sm:px-12 py-8 sm:py-10 flex items-center justify-center gap-3 sm:gap-4 whitespace-nowrap animate-pop-in"
        role="status"
        aria-live="assertive"
      >
        <span className="text-2xl sm:text-3xl" aria-hidden="true">🎉</span>
        <p className="text-3xl sm:text-5xl font-bold text-primary-900">{displayName}</p>
        <span className="text-2xl sm:text-3xl" aria-hidden="true">🎉</span>
      </div>
    ) : (
      <div
        className="bg-white/80 rounded-3xl border border-white/40 px-8 sm:px-10 py-6 sm:py-8 whitespace-nowrap shuffle-card"
        style={{ animationDuration: `0.8s, ${wobbleSpeed}s` }}
      >
        <p className="text-3xl sm:text-4xl font-bold text-primary-900">{displayName || '?'}</p>
      </div>
    )

    return (
      <div className="min-h-svh bg-gradient-to-b from-primary-50 to-accent-50 flex flex-col items-center justify-center px-4 sm:px-6">
        <div className="text-center">
          <p className={`text-primary-700/80 text-base sm:text-lg mb-3 sm:mb-4 ${isRevealed ? 'animate-fade-in' : ''}`}>
            {isRevealed ? t('yourSecretFriendIs') : t('drawing')}
          </p>

          <div className="mb-6 sm:mb-8">{shuffleContent}</div>

          {isRevealed && (
            <div className="flex gap-3 animate-fade-in" style={{ animationDelay: '400ms' }}>
              <button
                onClick={handleReject}
                className="flex-1 h-12 sm:h-14 px-4 sm:px-6 bg-white hover:bg-primary-50 active:scale-95 text-primary-600 font-semibold rounded-2xl text-base sm:text-lg border border-primary-200 transition-all whitespace-nowrap"
              >
                {t('drawAgain')}
              </button>
              <button
                onClick={handleAccept}
                className="flex-1 h-12 sm:h-14 px-4 sm:px-6 bg-primary-600 hover:bg-primary-700 active:scale-95 text-white font-semibold rounded-2xl text-base sm:text-lg shadow-lg shadow-primary-200 transition-all whitespace-nowrap"
              >
                {t('accept')}
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (phase === 'privacy') {
    return (
      <div className="min-h-svh bg-gradient-to-b from-primary-50 to-accent-50 flex flex-col items-center justify-center px-4 sm:px-6">
        <div className="animate-fade-in text-center max-w-sm">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary-100/80 backdrop-blur-sm flex items-center justify-center mx-auto mb-5 sm:mb-6">
            <span className="text-2xl sm:text-3xl" aria-hidden="true">🤫</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-primary-900 mb-2">
            {t('handDeviceTo')}
          </h2>
          <p className="text-2xl sm:text-3xl font-bold text-primary-600 mb-5 sm:mb-6">
            {currentPerson}
          </p>
          <p className="text-primary-700/80 text-sm sm:text-base mb-6 sm:mb-8">
            {t('lookAway')}
          </p>
          <button
            onClick={startDraw}
            className="w-full py-3.5 sm:py-4 px-6 bg-primary-600 hover:bg-primary-700 hover:shadow-xl active:scale-95 text-white font-semibold rounded-2xl text-base sm:text-lg shadow-lg shadow-primary-200 transition-[transform,background-color,box-shadow] duration-150"
          >
            {t('imPersonDraw', { name: currentPerson ?? '' })}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-svh bg-gradient-to-b from-primary-50 to-accent-50 px-4 sm:px-6 py-6 sm:py-8">
      <div className="max-w-sm sm:max-w-md mx-auto animate-fade-in">
        <button
          onClick={() => drawn.length > 0 ? setShowLeaveConfirm(true) : onBack()}
          className="text-primary-600 font-medium mb-5 sm:mb-6 flex items-center gap-1 hover:text-primary-800 transition-colors duration-150"
          aria-label={t('goBackHome')}
        >
          <span className="text-xl leading-none">{t('backArrow')}</span> {t('back')}
        </button>
        <h1 className="text-xl sm:text-2xl font-bold text-primary-900 mb-2">{t('drawNames')}</h1>
        <p className="text-primary-700/80 text-sm sm:text-base mb-5 sm:mb-6" aria-live="polite">
          {t('drawProgress', { drawn: drawn.length, total: participants.length })}
        </p>

        <div
          className="w-full h-2 bg-primary-100/80 rounded-full mb-5 sm:mb-6 overflow-hidden"
          role="progressbar"
          aria-valuenow={drawn.length}
          aria-valuemin={0}
          aria-valuemax={participants.length}
          aria-label={t('drawingProgress')}
        >
          <div
            className="h-full bg-primary-500 rounded-full transition-all duration-500"
            style={{ width: `${(drawn.length / participants.length) * 100}%` }}
          />
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-white/30 overflow-hidden mb-5 sm:mb-6">
          {participants.map((p) => {
            const hasDrawn = drawn.includes(p)
            const isRemoving = removing === p
            return (
              <div
                key={p}
                className={`flex items-center border-b border-primary-50/50 last:border-b-0 ${
                  isRemoving
                    ? 'animate-list-item-out'
                    : 'animate-list-item'
                } ${
                  hasDrawn
                    ? 'opacity-50'
                    : 'hover:bg-white/50 active:bg-white/70'
                }`}
              >
                <button
                  onClick={() => !hasDrawn && startTurn(p)}
                  disabled={hasDrawn}
                  className="flex-1 flex items-center justify-between px-3 sm:px-4 py-3.5 sm:py-4"
                  aria-label={hasDrawn ? t('alreadyDrawn', { name: p }) : t('tapToDrawAria', { name: p })}
                >
                  <span
                    className={`font-medium transition-colors duration-150 text-sm sm:text-base ${hasDrawn ? 'text-primary-500' : 'text-primary-900'}`}
                  >
                    {p}
                  </span>
                  {hasDrawn ? (
                    <span className="text-emerald-500 text-xl" aria-hidden="true">&#10003;</span>
                  ) : (
                    <span className="text-primary-500 text-xs sm:text-sm">{t('tapToDraw')}</span>
                  )}
                </button>
                {!hasDrawn && canRemove && (
                  <button
                    onClick={() => {
                      if (removing !== null) return
                      setRemoving(p)
                      setTimeout(() => {
                        onRemovePlayer(p)
                        setRemoving(null)
                      }, 250)
                    }}
                    className="pr-3 sm:pr-4 pl-2 py-3.5 sm:py-4 text-primary-400 hover:text-red-500 hover:scale-110 text-xl leading-none transition-[transform,background-color,box-shadow] duration-150"
                    aria-label={t('removeName', { name: p })}
                  >
                    &times;
                  </button>
                )}
              </div>
            )
          })}
        </div>

        {!allDrawn && (
          <>
            <form onSubmit={handleAddPlayer} className="flex gap-2 mb-2">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder={t('addNewPlayer')}
                className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-primary-200 bg-white text-primary-900 placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 text-base sm:text-lg transition-shadow duration-150"
                aria-label={t('newPlayerName')}
              />
              <button
                type="submit"
                className="px-4 sm:px-5 py-2.5 sm:py-3 bg-primary-600 hover:bg-primary-700 active:scale-95 text-white font-semibold rounded-xl transition-[transform,background-color,box-shadow] duration-150 text-sm sm:text-base"
              >
                {t('add')}
              </button>
            </form>
            {addError && (
              <p className="text-red-500 text-sm mb-4 font-medium" role="alert">{addError}</p>
            )}
          </>
        )}

        {allDrawn && (
          <button
            onClick={() => { playSuccess(); onComplete() }}
            className="w-full py-3.5 sm:py-4 px-6 bg-accent-700 hover:bg-accent-800 hover:shadow-xl active:scale-95 text-white font-semibold rounded-2xl text-base sm:text-lg shadow-lg shadow-accent-700/25 transition-[transform,background-color,box-shadow] duration-150 animate-pop-in"
          >
            {t('allDoneViewResults')}
          </button>
        )}
      </div>

      <Modal
        open={showLeaveConfirm}
        onClose={() => setShowLeaveConfirm(false)}
        role="alertdialog"
        ariaLabel={t('confirmLeaveTitle')}
        ariaDescribedBy="confirm-leave-msg"
        className="p-5 sm:p-6"
      >
        <p id="confirm-leave-msg" className="text-primary-900 font-medium text-center mb-4 sm:mb-5 text-sm sm:text-base">
          {t('confirmLeaveMessage')}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setShowLeaveConfirm(false)}
            className="flex-1 py-2.5 sm:py-3 px-4 bg-white hover:bg-primary-50 active:scale-95 text-primary-600 font-semibold rounded-xl border border-primary-200 transition-all text-sm sm:text-base"
          >
            {t('cancel')}
          </button>
          <button
            onClick={() => { setShowLeaveConfirm(false); onBack() }}
            className="flex-1 py-2.5 sm:py-3 px-4 bg-red-500 hover:bg-red-600 active:scale-95 text-white font-semibold rounded-xl transition-[transform,background-color,box-shadow] duration-150 text-sm sm:text-base"
          >
            {t('leave')}
          </button>
        </div>
      </Modal>
    </div>
  )
}
