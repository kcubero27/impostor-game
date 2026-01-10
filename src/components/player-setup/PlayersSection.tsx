import { memo } from 'react'
import { Users } from 'lucide-react'
import { useTranslation } from '@/i18n'

export interface PlayersSectionProps {
  readonly playerCount: number
  readonly children: React.ReactNode
  readonly className?: string
}

function PlayersSectionComponent({
  playerCount,
  children,
  className,
}: PlayersSectionProps) {
  const { t } = useTranslation()
  const playerLabel = playerCount === 1 ? t('ui.player_singular') : t('ui.player_plural')

  return (
    <div className={`space-y-6 ${className ?? ''}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
          <h2 className="text-lg font-semibold">{t('ui.players')}</h2>
        </div>
        <span
          className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium"
          aria-label={`${playerCount} ${playerLabel}`}
        >
          {playerCount} {playerLabel}
        </span>
      </div>
      {children}
    </div>
  )
}

export const PlayersSection = memo(PlayersSectionComponent)
PlayersSection.displayName = 'PlayersSection'
