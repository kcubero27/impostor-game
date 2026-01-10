import { memo } from 'react'
import { Users } from 'lucide-react'

export interface PlayersSectionProps {
  readonly playerCount: number
  readonly children: React.ReactNode
  readonly title?: string
  readonly className?: string
}

function PlayersSectionComponent({
  playerCount,
  children,
  title = 'Players',
  className,
}: PlayersSectionProps) {
  const playerLabel = playerCount === 1 ? 'player' : 'players'

  return (
    <div className={`space-y-6 ${className ?? ''}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
          <h2 className="text-lg font-semibold">{title}</h2>
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
