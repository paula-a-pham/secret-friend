import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { translations } from './translations'

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('sf-lang') || 'en')

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
    document.title = translations[lang].secretFriend
  }, [lang])

  const t = useCallback((key, params) => {
    let str = translations[lang][key] || translations.en[key] || key
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        str = str.replaceAll(`{${k}}`, v)
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

export function useLanguage() {
  return useContext(LanguageContext)
}
