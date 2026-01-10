import { memo } from 'react'
import { Sparkles } from 'lucide-react'

export interface PlayerSetupHeaderProps {
  readonly title?: string
  readonly subtitle?: string
  readonly icon?: React.ReactNode
  readonly className?: string
}

function PlayerSetupHeaderComponent({
  title = 'Impostor Game',
  subtitle = 'Set up your game and find the impostor!',
  icon,
  className,
}: PlayerSetupHeaderProps) {
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
      <h1 className="text-3xl font-bold text-center mb-2">{title}</h1>
      <p className="text-center text-muted-foreground mb-8">{subtitle}</p>
    </div>
  )
}

export const PlayerSetupHeader = memo(PlayerSetupHeaderComponent)
PlayerSetupHeader.displayName = 'PlayerSetupHeader'
