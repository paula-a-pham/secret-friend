import { render, type RenderOptions } from '@testing-library/react'
import { LanguageProvider } from '../i18n/LanguageContext'
import type { ReactElement } from 'react'

function AllProviders({ children }: { children: React.ReactNode }) {
  return <LanguageProvider>{children}</LanguageProvider>
}

function renderWithProviders(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  return render(ui, { wrapper: AllProviders, ...options })
}

export { renderWithProviders as render }
export { default as userEvent } from '@testing-library/user-event'
