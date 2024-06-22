import React from 'react'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { Home } from './Home'
import { GlobalSettingsContext } from '@/App'
import '@/locales/i18n'
import { ThemeProvider } from '@/components/theme-provider'

test('renders home page component', () => {
  render(
    <GlobalSettingsContext.Provider value={{ theme: { isDark: false } }}>
      <ThemeProvider>
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      </ThemeProvider>
    </GlobalSettingsContext.Provider>,
  )

  const element = screen.getByText(/React Typescript Learning/i)
  expect(element).toBeInTheDocument()
})
