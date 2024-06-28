import { Moon, Sun } from 'lucide-react'

import { useTheme } from '@/components/theme-provider'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'

export function ModeToggle({
  buttonProps,
  contentProps,
}: {
  buttonProps?: ComponentProps<typeof Button>
  contentProps?: ComponentProps<typeof DropdownMenuContent>
}) {
  const { setTheme } = useTheme()
  const { t, i18n } = useTranslation(['main'])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" {...buttonProps}>
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" {...contentProps}>
        <DropdownMenuItem onClick={() => setTheme('light')}>{t('theme.light', { ns: ['main'] })}</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>{t('theme.dark', { ns: ['main'] })}</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>{t('theme.system', { ns: ['main'] })}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
