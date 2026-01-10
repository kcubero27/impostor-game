import { memo } from 'react'
import { Sparkles } from 'lucide-react'
import { useTranslation } from '@/i18n'

export interface PlayerSetupHeaderProps {
  readonly icon?: React.ReactNode
  readonly className?: string
}

function PlayerSetupHeaderComponent({
  icon,
  className,
}: PlayerSetupHeaderProps) {
  const { t } = useTranslation()
  const defaultIcon = <Sparkles className="w-8 h-8 text-purple-600" aria-hidden="true" />
  const displayIcon = icon ?? defaultIcon

  return (
    <div className={className}>
      {/* Icon */}
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center">
          {displayIcon}
        </div>
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold text-center mb-2">{t('ui.game_title')}</h1>
      <p className="text-center text-muted-foreground mb-8">{t('ui.game_subtitle')}</p>
    </div>
  )
}

export const PlayerSetupHeader = memo(PlayerSetupHeaderComponent)
PlayerSetupHeader.displayName = 'PlayerSetupHeader'
