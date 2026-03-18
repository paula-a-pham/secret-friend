import { useState, useEffect } from 'react'
import { tapVibrate } from '../utils/haptics'
import { useLanguage } from '../i18n/LanguageContext'

export default function GameIdeaButton() {
  const [open, setOpen] = useState(false)
  const [closing, setClosing] = useState(false)
  const { t } = useLanguage()

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
        aria-label={t('howToPlay')}
        title={t('howToPlay')}
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
                {t('howToPlay')}
              </span>
            </div>

            <h3 className="text-xl font-bold text-primary-900 mb-3 text-center">
              🎁 {t('secretFriend')} 🎁
            </h3>

            <div className="space-y-4 text-sm text-primary-700/80 leading-relaxed">
              <div>
                <h4 className="font-semibold text-primary-900 mb-1 text-center">{t('whatIsIt')}</h4>
                <p className="text-center">
                  {t('whatIsItDesc')}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-primary-900 mb-1 text-center">{t('howItWorks')}</h4>
                <ul className="space-y-1.5">
                  <li className="flex gap-2"><span className="text-accent-500 font-bold">•</span>{t('howItWorks1')}</li>
                  <li className="flex gap-2"><span className="text-accent-500 font-bold">•</span>{t('howItWorks2')}</li>
                  <li className="flex gap-2"><span className="text-accent-500 font-bold">•</span>{t('howItWorks3')}</li>
                  <li className="flex gap-2"><span className="text-accent-500 font-bold">•</span>{t('howItWorks4')}</li>
                  <li className="flex gap-2"><span className="text-accent-500 font-bold">•</span>{t('howItWorks5')}</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-primary-900 mb-1 text-center">{t('rules')}</h4>
                <ul className="space-y-1.5">
                  <li className="flex gap-2"><span className="text-accent-500 font-bold">•</span>{t('rules1')}</li>
                  <li className="flex gap-2"><span className="text-accent-500 font-bold">•</span>{t('rules2')}</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-primary-900 mb-1 text-center">{t('tips')}</h4>
                <ul className="space-y-1.5">
                  <li className="flex gap-2"><span className="text-accent-500 font-bold">•</span>{t('tips1')}</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-2 mt-5">
              <button
                onClick={handleClose}
                className="flex-1 py-3 px-4 bg-accent-500 hover:bg-accent-600 active:scale-95 text-white font-semibold rounded-xl text-sm transition-all duration-150"
              >
                {t('gotIt')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
