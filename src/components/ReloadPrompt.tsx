import { useEffect, useState } from 'react'
import { useLanguage } from '../i18n/useLanguage'

export default function ReloadPrompt() {
  const [needRefresh, setNeedRefresh] = useState(false)
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null)
  const { t } = useLanguage()

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return

    import('virtual:pwa-register').then(({ registerSW }) => {
      registerSW({
        onNeedRefresh() {
          setNeedRefresh(true)
        },
        onRegisteredSW(_url, r) {
          if (r) setRegistration(r)
        },
      })
    })
  }, [])

  function handleUpdate() {
    if (registration?.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' })
      window.location.reload()
    }
  }

  if (!needRefresh) return null

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[70] animate-fade-in">
      <div className="bg-white rounded-2xl shadow-lg border border-primary-100 px-4 py-3 flex items-center gap-3 text-sm">
        <span className="text-primary-700">{t('updateAvailable')}</span>
        <button
          onClick={handleUpdate}
          className="px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg text-xs transition-colors"
        >
          {t('update')}
        </button>
        <button
          onClick={() => setNeedRefresh(false)}
          className="text-primary-400 hover:text-primary-600 text-lg leading-none transition-colors"
          aria-label={t('close')}
        >
          &times;
        </button>
      </div>
    </div>
  )
}
