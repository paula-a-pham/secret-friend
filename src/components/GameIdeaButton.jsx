import { useState, useEffect } from 'react'
import { tapVibrate } from '../utils/haptics'

export default function GameIdeaButton() {
  const [open, setOpen] = useState(false)
  const [closing, setClosing] = useState(false)

  function handleOpen() {
    tapVibrate()
    setOpen(true)
    setClosing(false)
  }

  function handleClose() {
    setClosing(true)
    setTimeout(() => {
      setOpen(false)
      setClosing(false)
    }, 250)
  }

  useEffect(() => {
    if (!open || closing) return
    const handleKey = (e) => { if (e.key === 'Escape') handleClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, closing])

  return (
    <>
      {/* Floating icon */}
      <button
        onClick={handleOpen}
        className="fixed bottom-5 right-5 z-50 w-12 h-12 bg-accent-500 hover:bg-accent-600 active:scale-90 text-white rounded-full shadow-lg shadow-accent-500/30 flex items-center justify-center transition-all duration-150"
        aria-label="How to play"
        title="How to play"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path d="M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7ZM9 21a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-1H9v1Z" />
        </svg>
      </button>

      {/* Popup overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center px-4 pb-6"
          onClick={handleClose}
        >
          {/* Backdrop */}
          <div className={`absolute inset-0 bg-black/30 backdrop-blur-[2px] ${closing ? 'animate-backdrop-out' : 'animate-backdrop-in'}`} />

          {/* Card */}
          <div
            className={`relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 overflow-y-auto max-h-[80vh] scrollbar-hide ${closing ? 'animate-popup-out' : 'animate-popup-in'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-accent-500">
                How to Play
              </span>
            </div>

            <h3 className="text-xl font-bold text-primary-900 mb-3 text-center">
              🎁 Secret Friend 🎁
            </h3>

            <div className="space-y-4 text-sm text-primary-700/80 leading-relaxed">
              <div>
                <h4 className="font-semibold text-primary-900 mb-1 text-center">What is it?</h4>
                <p className="text-center">
                  Secret Friend is a gift exchange game where each participant is randomly assigned another person to give a gift to — without them knowing who picked their name!
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-primary-900 mb-1 text-center">How it works</h4>
                <ul className="space-y-1.5">
                  <li className="flex gap-2"><span className="text-accent-500 font-bold">•</span>A group of friends, family, or coworkers join the game.</li>
                  <li className="flex gap-2"><span className="text-accent-500 font-bold">•</span>Set a PIN so only players can see their draw.</li>
                  <li className="flex gap-2"><span className="text-accent-500 font-bold">•</span>Each person draws a name in secret — the app makes sure no one draws themselves.</li>
                  <li className="flex gap-2"><span className="text-accent-500 font-bold">•</span>Buy or make a gift for the person you drew.</li>
                  <li className="flex gap-2"><span className="text-accent-500 font-bold">•</span>On the exchange day, give your gift and try to guess who your secret friend is!</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-primary-900 mb-1 text-center">Rules</h4>
                <ul className="space-y-1.5">
                  <li className="flex gap-2"><span className="text-accent-500 font-bold">•</span>Keep it a secret! Don't tell anyone who you drew.</li>
                  <li className="flex gap-2"><span className="text-accent-500 font-bold">•</span>Choose a gift with care — think about what would make them smile.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-primary-900 mb-1 text-center">Tips</h4>
                <ul className="space-y-1.5">
                  <li className="flex gap-2"><span className="text-accent-500 font-bold">•</span>Use the Results screen to check your assignment later if you forget.</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-2 mt-5">
              <button
                onClick={handleClose}
                className="flex-1 py-3 px-4 bg-accent-500 hover:bg-accent-600 active:scale-95 text-white font-semibold rounded-xl text-sm transition-all duration-150"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
