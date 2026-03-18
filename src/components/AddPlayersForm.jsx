import { useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext'

export default function AddPlayersForm({ existingNames, onConfirm, onCancel }) {
  const [names, setNames] = useState([])
  const [input, setInput] = useState('')
  const [error, setError] = useState('')
  const { t } = useLanguage()

  function addName(e) {
    e.preventDefault()
    const trimmed = input.trim()
    if (!trimmed) return
    const allNames = [...existingNames, ...names]
    if (allNames.some((p) => p.toLowerCase() === trimmed.toLowerCase())) {
      setError(t('nameAlreadyExists'))
      return
    }
    setNames([...names, trimmed])
    setInput('')
    setError('')
  }

  function removeName(index) {
    setNames(names.filter((_, i) => i !== index))
  }

  function handleConfirm() {
    if (names.length < 2) {
      setError(t('addAtLeast2'))
      return
    }
    onConfirm(names)
  }

  const countKey = names.length === 1 ? 'newPlayerCount_one' : 'newPlayerCount_other'
  const countText = t(countKey, { count: names.length })

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-white/30 p-4 mb-6 animate-fade-in">
      <h2 className="text-lg font-bold text-primary-900 mb-1">{t('addNewPlayersTitle')}</h2>
      <p className="text-primary-700/80 text-sm mb-4">
        {t('newPlayersDesc')}
      </p>

      <form onSubmit={addName} className="flex gap-2 mb-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('enterName')}
          className="flex-1 px-3 py-2 rounded-lg border border-primary-200 bg-white text-primary-900 placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
          autoFocus
        />
        <button
          type="submit"
          className="px-4 py-2 bg-primary-600 hover:bg-primary-700 active:scale-95 text-white font-semibold rounded-lg transition-[transform,background-color] duration-150"
        >
          {t('add')}
        </button>
      </form>

      {names.length > 0 && (
        <div className="border border-white/30 rounded-xl overflow-hidden mb-3">
          {names.map((name, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-3 py-2 border-b border-primary-50/50 last:border-b-0 animate-list-item"
            >
              <span className="text-primary-900 font-medium text-sm">{name}</span>
              <button
                onClick={() => removeName(i)}
                className="text-primary-400 hover:text-red-500 text-lg leading-none transition-colors"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}

      <p className="text-primary-700/80 text-xs mb-3">
        {countText}
      </p>

      {error && (
        <p className="text-red-500 text-sm mb-3 font-medium" role="alert">{error}</p>
      )}

      <div className="flex gap-2">
        <button
          onClick={onCancel}
          className="flex-1 py-3 px-4 bg-white hover:bg-primary-50 active:scale-95 text-primary-600 font-semibold rounded-xl border border-primary-200 transition-[transform,background-color] duration-150"
        >
          {t('cancel')}
        </button>
        <button
          onClick={handleConfirm}
          disabled={names.length < 2}
          className="flex-1 py-3 px-4 bg-accent-700 hover:bg-accent-800 active:scale-95 disabled:bg-accent-200 disabled:text-accent-700 text-white font-semibold rounded-xl transition-[transform,background-color] duration-150"
        >
          {t('addAndDraw')}
        </button>
      </div>
    </div>
  )
}
