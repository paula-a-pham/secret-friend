import { useLanguage } from '../i18n/LanguageContext'
import { tapVibrate } from '../utils/haptics'

export default function LanguageToggle() {
  const { lang, toggleLanguage } = useLanguage()

  return (
    <button
      onClick={() => { tapVibrate(); toggleLanguage() }}
      className="fixed bottom-5 left-5 z-50 w-12 h-12 bg-accent-500 hover:bg-accent-600 active:scale-90 text-white rounded-full shadow-lg shadow-accent-500/30 flex items-center justify-center transition-all duration-150 text-sm font-bold"
      aria-label={lang === 'en' ? '\u0627\u0644\u062a\u0628\u062f\u064a\u0644 \u0625\u0644\u0649 \u0627\u0644\u0639\u0631\u0628\u064a\u0629' : 'Switch to English'}
      title={lang === 'en' ? '\u0639\u0631\u0628\u064a' : 'EN'}
    >
      {lang === 'en' ? '\u0639\u0631\u0628\u064a' : 'EN'}
    </button>
  )
}
