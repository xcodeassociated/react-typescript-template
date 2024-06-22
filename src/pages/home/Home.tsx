import React from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'

export const Home: React.FC = () => {
  const { t } = useTranslation(['main'])

  return (
    <>
      <h1>
        <p>{t(`home.title`, { ns: ['main'] })}</p>
      </h1>
      <h3>
        <p>{t(`home.details`, { ns: ['main'] })}</p>
      </h3>
      <Button variant="outline">Button</Button>
    </>
  )
}
