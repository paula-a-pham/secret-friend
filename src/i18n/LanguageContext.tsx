import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import { translations } from './translations'

interface LanguageContextValue {
  lang: string
  t: (key: string, params?: Record<string, string | number>) => string
  toggleLanguage: () => void
  isRtl: boolean
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState(() => localStorage.getItem('sf-lang') || 'en')

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
    document.title = translations[lang].secretFriend
  }, [lang])

  const t = useCallback((key: string, params?: Record<string, string | number>) => {
    let str = translations[lang]?.[key] || translations.en[key] || key
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        str = str.replaceAll(`{${k}}`, String(v))
      }
    }
    return str
  }, [lang])

  const toggleLanguage = useCallback(() => {
    setLang(prev => {
      const next = prev === 'en' ? 'ar' : 'en'
      localStorage.setItem('sf-lang', next)
      return next
    })
  }, [])

  const isRtl = lang === 'ar'

  return (
    <LanguageContext.Provider value={{ lang, t, toggleLanguage, isRtl }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
