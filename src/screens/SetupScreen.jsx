import { useState } from 'react'
import PinInput from '../components/PinInput'
import { tapVibrate, successVibrate } from '../utils/haptics'
import { playSuccess } from '../utils/sounds'
import { useLanguage } from '../i18n/LanguageContext'

export default function SetupScreen({ step, pin, onPinSet, onStart, onBack, onBackToPin }) {
  const [participants, setParticipants] = useState([])
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [removing, setRemoving] = useState(null)
  const [pinSuccess, setPinSuccess] = useState(false)
  const { t } = useLanguage()

  function handlePinComplete(value) {
    setError('')
    successVibrate()
    playSuccess()
    setPinSuccess(true)
    setTimeout(() => onPinSet(value), 800)
  }

  function addParticipant(e) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    if (participants.some((p) => p.toLowerCase() === trimmed.toLowerCase())) {
      setError(t('nameAlreadyAdded'))
      return
    }
    tapVibrate()
    setParticipants([...participants, trimmed])
    setName('')
    setError('')
  }

  function removeParticipant(index) {
    if (removing !== null) return
    tapVibrate()
    setRemoving(index)
    setTimeout(() => {
      setParticipants((prev) => prev.filter((_, i) => i !== index))
      setRemoving(null)
    }, 250)
  }

  function handleStart() {
    if (participants.length < 3) {
      setError(t('needAtLeast3'))
      return
    }
    tapVibrate()
    onStart(participants, pin)
  }

  const canStart = participants.length >= 3

  if (step === 'pin') {
    return (
      <div className="min-h-svh bg-gradient-to-b from-primary-50 to-accent-50 flex flex-col items-center justify-center px-6">
        <div className="animate-fade-in text-center max-w-sm w-full">
          <button
            onClick={onBack}
            className="text-primary-600 font-medium mb-8 flex items-center gap-1 hover:text-primary-800 transition-colors duration-150"
            aria-label={t('goBackHome')}
          >
            <span className="text-xl leading-none">{t('backArrow')}</span> {t('back')}
          </button>

          {pinSuccess ? (
            <div className="animate-pop-in">
              <div className="w-20 h-20 rounded-full bg-emerald-100/80 flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">&#10003;</span>
              </div>
              <p className="text-xl font-bold text-emerald-600">{t('pinSet')}</p>
            </div>
          ) : (
            <>
              <div className="w-20 h-20 rounded-full bg-primary-100/80 backdrop-blur-sm flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🔑</span>
              </div>
              <h1 className="text-2xl font-bold text-primary-900 mb-2">
                {t('setOrganizerPin')}
              </h1>
              <p className="text-primary-700/80 mb-8">
                {t('pinDescription')}
              </p>

              <PinInput onComplete={handlePinComplete} error={error} />
            </>
          )}
        </div>
      </div>
    )
  }

  const countKey = participants.length === 1 ? 'participantCount_one' : 'participantCount_other'
  const countText = t(countKey, { count: participants.length })

  return (
    <div className="min-h-svh bg-gradient-to-b from-primary-50 to-accent-50 px-6 py-8">
      <div className="max-w-md mx-auto animate-fade-in">
        <button
          onClick={onBackToPin}
          className="text-primary-600 font-medium mb-6 flex items-center gap-1 hover:text-primary-800 transition-colors duration-150"
          aria-label={t('goBackToPin')}
        >
          <span className="text-xl leading-none">{t('backArrow')}</span> {t('back')}
        </button>

        <h1 className="text-2xl font-bold text-primary-900 mb-6">
          {t('addParticipants')}
        </h1>

        <form onSubmit={addParticipant} className="flex gap-2 mb-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('enterName')}
            className="flex-1 px-4 py-3 rounded-xl border border-primary-200 bg-white text-primary-900 placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 text-lg transition-shadow duration-150"
            autoFocus
            aria-label={t('participantName')}
          />
          <button
            type="submit"
            className="px-5 py-3 bg-primary-600 hover:bg-primary-700 active:scale-95 text-white font-semibold rounded-xl transition-[transform,background-color,box-shadow] duration-150"
          >
            {t('add')}
          </button>
        </form>

        {error && (
          <p className="text-red-500 text-sm mb-4 font-medium" role="alert">{error}</p>
        )}

        {(participants.length > 0 || removing !== null) && (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-white/30 mb-6 overflow-hidden">
            {participants.map((p, i) => (
              <div
                key={p}
                className={`flex items-center justify-between px-4 py-3 border-b border-primary-50/50 last:border-b-0 hover:bg-white/50 ${removing === i ? 'animate-list-item-out' : 'animate-list-item'}`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-primary-100/80 text-primary-600 flex items-center justify-center text-sm font-bold">
                    {i + 1}
                  </span>
                  <span className="text-primary-900 font-medium">{p}</span>
                </div>
                <button
                  onClick={() => removeParticipant(i)}
                  className="text-primary-400 hover:text-red-500 hover:scale-110 text-xl leading-none transition-[transform,background-color,box-shadow] duration-150"
                  aria-label={t('removeName', { name: p })}
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}

        <p className="text-primary-700/80 text-sm mb-2" aria-live="polite">
          {countText}
          {participants.length < 3 && ` ${t('needMinimum')}`}
        </p>

        <button
          onClick={handleStart}
          disabled={!canStart}
          className="w-full mt-8 py-4 px-6 bg-primary-600 hover:bg-primary-700 hover:shadow-xl active:scale-95 disabled:bg-primary-200 disabled:text-primary-500 text-white font-semibold rounded-2xl text-lg shadow-lg shadow-primary-200 transition-[transform,background-color,box-shadow] duration-150"
        >
          {t('startDrawing')}
        </button>
      </div>
    </div>
  )
}
