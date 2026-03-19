import { useState, useEffect, type MouseEvent } from 'react'
import { isMuted, toggleMute } from '../utils/sounds'
import { useLanguage } from '../i18n/useLanguage'

export default function GameIdeaButton() {
  const [expanded, setExpanded] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const [closingInfo, setClosingInfo] = useState(false)
  const [soundMuted, setSoundMuted] = useState(isMuted)
  const { t, lang, toggleLanguage } = useLanguage()

  function toggleMenu(e: MouseEvent) {
    e.stopPropagation()
    setExpanded((prev) => !prev)
  }

  function handleLanguage(e: MouseEvent) {
    e.stopPropagation()
    toggleLanguage()
    setExpanded(false)
  }

  function handleSound(e: MouseEvent) {
    e.stopPropagation()
    setSoundMuted(toggleMute())
  }

  function handleInfo(e: MouseEvent) {
    e.stopPropagation()
    setExpanded(false)
    setShowInfo(true)
    setClosingInfo(false)
  }

  function handleCloseInfo() {
    setClosingInfo(true)
    setTimeout(() => {
      setShowInfo(false)
      setClosingInfo(false)
    }, 250)
  }

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key !== 'Escape') return
      if (showInfo && !closingInfo) handleCloseInfo()
      else if (expanded) setExpanded(false)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [expanded, showInfo, closingInfo])

  return (
    <>
      {expanded && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setExpanded(false)}
        />
      )}

      <div className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 z-50">
        <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-3 flex flex-col items-center gap-3 ${expanded ? '' : 'pointer-events-none'}`}>
          <button
            onClick={handleInfo}
            className={`w-10 h-10 bg-white text-primary-700 rounded-full shadow-md flex items-center justify-center transition-all duration-200 hover:bg-primary-50 ${
              expanded
                ? 'opacity-100 scale-100 translate-y-0'
                : 'opacity-0 scale-75 translate-y-4'
            }`}
            style={{ transitionDelay: expanded ? '120ms' : '0ms' }}
            aria-label={t('howToPlay')}
            title={t('howToPlay')}
            tabIndex={expanded ? 0 : -1}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7ZM9 21a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-1H9v1Z" />
            </svg>
          </button>

          <button
            onClick={handleSound}
            className={`w-10 h-10 bg-white text-primary-700 rounded-full shadow-md flex items-center justify-center transition-all duration-200 hover:bg-primary-50 ${
              expanded
                ? 'opacity-100 scale-100 translate-y-0'
                : 'opacity-0 scale-75 translate-y-4'
            }`}
            style={{ transitionDelay: expanded ? '80ms' : '0ms' }}
            aria-label={soundMuted ? t('unmuteSound') : t('muteSound')}
            title={soundMuted ? t('unmuteSound') : t('muteSound')}
            tabIndex={expanded ? 0 : -1}
          >
            {soundMuted ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM17.78 9.22a.75.75 0 1 0-1.06 1.06L18.44 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06l1.72-1.72 1.72 1.72a.75.75 0 1 0 1.06-1.06L20.56 12l1.72-1.72a.75.75 0 1 0-1.06-1.06l-1.72 1.72-1.72-1.72Z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM18.584 5.106a.75.75 0 0 1 1.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 0 1-1.06-1.06 8.25 8.25 0 0 0 0-11.668.75.75 0 0 1 0-1.06Z" />
                <path d="M15.932 7.757a.75.75 0 0 1 1.061 0 6 6 0 0 1 0 8.486.75.75 0 0 1-1.06-1.061 4.5 4.5 0 0 0 0-6.364.75.75 0 0 1 0-1.06Z" />
              </svg>
            )}
          </button>

          <button
            onClick={handleLanguage}
            className={`w-10 h-10 bg-white text-primary-700 rounded-full shadow-md flex items-center justify-center transition-all duration-200 hover:bg-primary-50 text-xs font-bold ${
              expanded
                ? 'opacity-100 scale-100 translate-y-0'
                : 'opacity-0 scale-75 translate-y-4'
            }`}
            style={{ transitionDelay: expanded ? '30ms' : '0ms' }}
            aria-label={lang === 'en' ? '\u0627\u0644\u062a\u0628\u062f\u064a\u0644 \u0625\u0644\u0649 \u0627\u0644\u0639\u0631\u0628\u064a\u0629' : 'Switch to English'}
            title={lang === 'en' ? '\u0639\u0631\u0628\u064a' : 'EN'}
            tabIndex={expanded ? 0 : -1}
          >
            {lang === 'en' ? '\u0639\u0631\u0628\u064a' : 'EN'}
          </button>
        </div>

        <button
          onClick={toggleMenu}
          className="w-12 h-12 bg-accent-700 hover:bg-accent-800 active:scale-90 text-white rounded-full shadow-lg shadow-accent-700/30 flex items-center justify-center transition-all duration-200"
          aria-label={expanded ? t('close') : t('menu')}
          aria-expanded={expanded}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            className={`w-6 h-6 transition-transform duration-200 ${expanded ? 'rotate-45' : ''}`}
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
      </div>

      {showInfo && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center px-3 sm:px-4 pb-4 sm:pb-6"
          onClick={handleCloseInfo}
        >
          <div className={`absolute inset-0 bg-black/30 backdrop-blur-[2px] ${closingInfo ? 'animate-backdrop-out' : 'animate-backdrop-in'}`} />

          <div
            className={`relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-4 sm:p-6 overflow-y-auto max-h-[80vh] scrollbar-hide ${closingInfo ? 'animate-popup-out' : 'animate-popup-in'}`}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label={t('howToPlay')}
          >
            <div className="text-center mb-3 sm:mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-accent-700">
                {t('howToPlay')}
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-primary-900 mb-3 text-center">
              🎁 {t('secretFriend')} 🎁
            </h3>

            <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm text-primary-700/80 leading-relaxed">
              <div>
                <h4 className="font-semibold text-primary-900 mb-1 text-center">{t('whatIsIt')}</h4>
                <p className="text-center">
                  {t('whatIsItDesc')}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-primary-900 mb-1 text-center">{t('howItWorks')}</h4>
                <ul className="space-y-1.5">
                  <li className="flex gap-2"><span className="text-accent-700 font-bold">•</span>{t('howItWorks1')}</li>
                  <li className="flex gap-2"><span className="text-accent-700 font-bold">•</span>{t('howItWorks2')}</li>
                  <li className="flex gap-2"><span className="text-accent-700 font-bold">•</span>{t('howItWorks3')}</li>
                  <li className="flex gap-2"><span className="text-accent-700 font-bold">•</span>{t('howItWorks4')}</li>
                  <li className="flex gap-2"><span className="text-accent-700 font-bold">•</span>{t('howItWorks5')}</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-primary-900 mb-1 text-center">{t('rules')}</h4>
                <ul className="space-y-1.5">
                  <li className="flex gap-2"><span className="text-accent-700 font-bold">•</span>{t('rules1')}</li>
                  <li className="flex gap-2"><span className="text-accent-700 font-bold">•</span>{t('rules2')}</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-primary-900 mb-1 text-center">{t('tips')}</h4>
                <ul className="space-y-1.5">
                  <li className="flex gap-2"><span className="text-accent-700 font-bold">•</span>{t('tips1')}</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-2 mt-4 sm:mt-5">
              <button
                onClick={handleCloseInfo}
                className="flex-1 py-2.5 sm:py-3 px-4 bg-accent-700 hover:bg-accent-800 active:scale-95 text-white font-semibold rounded-xl text-sm transition-all duration-150"
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
