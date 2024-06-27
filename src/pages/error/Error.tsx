import React from 'react'
import { useTranslation } from 'react-i18next'

export const Error: React.FC = () => {
  const { t } = useTranslation(['main'])

  return (
    <div>
      <h1>Not Found: 404</h1>
    </div>
  )
}

export const Unauthorized: React.FC = () => {
  const { t } = useTranslation(['main'])

  return (
    <div>
      <h1>Unauthorized: 401</h1>
    </div>
  )
}
