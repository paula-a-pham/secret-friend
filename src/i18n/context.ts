import { createContext } from 'react'

export interface LanguageContextValue {
  lang: string
  t: (key: string, params?: Record<string, string | number>) => string
  toggleLanguage: () => void
  isRtl: boolean
}

export const LanguageContext = createContext<LanguageContextValue | null>(null)
