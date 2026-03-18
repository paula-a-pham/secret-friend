import { useState } from 'react'
import AddPlayersForm from '../components/AddPlayersForm'
import PinInput from '../components/PinInput'
import { playFlip, playSuccess } from '../utils/sounds'
import { tapVibrate, successVibrate } from '../utils/haptics'

function FlipCard({ giver, recipient, isRevealed, onFlip, delay = 0 }) {
  return (
    <div
      onClick={onFlip}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onFlip()}
      role="button"
      tabIndex={0}
      aria-label={isRevealed ? `${giver} gives to ${recipient}` : `Reveal ${giver}'s secret friend`}
      className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-400 rounded-2xl flip-gpu"
      style={{
        perspective: '800px',
        animation: `card-enter 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}ms both`,
      }}
    >
      <div
        className="relative w-full transition-transform duration-200 ease-out"
        style={{
          minHeight: '140px',
          transformStyle: 'preserve-3d',
          transform: isRevealed ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* Front */}
        <div
          className="w-full h-full bg-white/85 rounded-2xl shadow-sm border border-white/40 absolute inset-0 flex flex-col items-center justify-center gap-2 p-5 hover:bg-white transition-colors duration-150"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <p className="font-semibold text-primary-900 text-center text-lg break-words w-full">{giver}</p>
          <span className="text-3xl" aria-hidden="true">🎁</span>
          <p className="text-primary-300 text-sm">Tap to reveal</p>
        </div>

        {/* Back */}
        <div
          className="w-full h-full bg-white/85 rounded-2xl shadow-sm border border-white/40 absolute inset-0 flex flex-col items-center justify-center gap-2 p-5"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <p className="text-primary-400 text-sm">Secret friend</p>
          <span className="text-2xl" aria-hidden="true">🎁</span>
          <p className="font-bold text-accent-600 text-xl text-center break-words w-full">{recipient}</p>
        </div>
      </div>
    </div>
  )
}

export default function ResultsScreen({ game, onBack, onAddPlayers }) {
  const { participants, assignments, pin } = game
  const [unlocked, setUnlocked] = useState(false)
  const [error, setError] = useState(null)
  const [showAddPlayers, setShowAddPlayers] = useState(false)
  const [revealed, setRevealed] = useState({})
  const [pinSuccess, setPinSuccess] = useState(false)

  function handlePinComplete(value) {
    if (value === pin) {
      successVibrate()
      playSuccess()
      setPinSuccess(true)
      setTimeout(() => {
        setUnlocked(true)
        setError(null)
      }, 800)
    } else {
      setError({ message: 'Wrong PIN', key: Date.now() })
    }
  }

  function toggleReveal(name) {
    tapVibrate()
    playFlip()
    setRevealed((prev) => ({ ...prev, [name]: !prev[name] }))
  }

  if (!unlocked) {
    return (
      <div className="min-h-svh bg-gradient-to-b from-primary-50 to-accent-50 flex flex-col items-center justify-center px-6">
        <div className="animate-fade-in text-center max-w-sm w-full">
          <button
            onClick={onBack}
            className="text-primary-600 font-medium mb-8 flex items-center gap-1 hover:text-primary-800 transition-colors duration-150"
            aria-label="Go back to home"
          >
            <span className="text-xl leading-none">&larr;</span> Back
          </button>
          {pinSuccess ? (
            <div className="animate-pop-in">
              <div className="w-20 h-20 rounded-full bg-emerald-100/80 flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">&#10003;</span>
              </div>
              <p className="text-xl font-bold text-emerald-600">Unlocked!</p>
            </div>
          ) : (
            <>
              <div className="w-20 h-20 rounded-full bg-primary-100/80 backdrop-blur-sm flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🔒</span>
              </div>
              <h1 className="text-2xl font-bold text-primary-900 mb-2">
                View Results
              </h1>
              <p className="text-primary-600/60 mb-8">
                Enter the organizer PIN to see all pairs
              </p>

              <PinInput onComplete={handlePinComplete} error={error?.message} errorKey={error?.key} />
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-svh bg-gradient-to-b from-primary-50 to-accent-50 px-6 py-8">
      <div className="max-w-2xl mx-auto animate-fade-in">
        <h1 className="text-2xl font-bold text-primary-900 mb-4 text-center">
          All Pairs
        </h1>

        <p className="text-primary-600/60 mb-4 text-center text-sm">
          Tap a card to reveal the secret friend
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
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
            onConfirm={(names) => { tapVibrate(); onAddPlayers(names); setShowAddPlayers(false) }}
            onCancel={() => setShowAddPlayers(false)}
          />
        ) : (
          <button
            onClick={() => { tapVibrate(); setShowAddPlayers(true) }}
            className="w-full mb-6 py-3 px-6 bg-white/70 backdrop-blur-sm hover:bg-white/90 active:scale-95 text-primary-600 font-medium rounded-2xl text-base border border-dashed border-primary-300/50 transition-[transform,background-color] duration-150"
          >
            + Add New Players
          </button>
        )}

        <button
          onClick={() => { tapVibrate(); onBack() }}
          className="w-full py-4 px-6 bg-primary-600 hover:bg-primary-700 hover:shadow-xl active:scale-95 text-white font-semibold rounded-2xl text-lg shadow-lg shadow-primary-200 transition-[transform,background-color,box-shadow] duration-150"
        >
          Home
        </button>
      </div>
    </div>
  )
}
