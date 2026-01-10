import { useCallback } from 'react'
import {
  PlayerSetupHeader,
  PlayersSection,
  PlayerInput,
  AddPlayerButton,
} from '@/components/player-setup'
import { usePlayers } from '@/hooks'
import { type PlayerId } from '@/types'

export interface PlayerSetupProps {
  readonly initialPlayerCount?: number
  readonly className?: string
  readonly containerClassName?: string
}

export function PlayerSetup({
  initialPlayerCount,
  className,
  containerClassName,
}: PlayerSetupProps) {
  const { players, addPlayer, updatePlayer, removePlayer, canRemove, playerCount } =
    usePlayers({ initialCount: initialPlayerCount })

  const handlePlayerChange = useCallback(
    (id: PlayerId, value: string) => {
      updatePlayer(id, value)
    },
    [updatePlayer]
  )

  const handleRemovePlayer = useCallback(
    (id: PlayerId) => {
      removePlayer(id)
    },
    [removePlayer]
  )

  return (
    <div
      className={`min-h-screen bg-purple-50/80 flex items-center justify-center p-4 ${containerClassName ?? ''}`}
    >
      <div className={`bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg ${className ?? ''}`}>
        <PlayerSetupHeader />

        <PlayersSection playerCount={playerCount}>
          {/* Player List */}
          <div className="space-y-3" role="list">
            {players.map((player, index) => (
              <div key={player.id} role="listitem">
                <PlayerInput
                  index={index}
                  value={player.name}
                  onChange={(value) => handlePlayerChange(player.id, value)}
                  onRemove={() => handleRemovePlayer(player.id)}
                  canRemove={canRemove}
                />
              </div>
            ))}
          </div>

          {/* Add Player Button */}
          <AddPlayerButton onClick={addPlayer} />
        </PlayersSection>
      </div>
    </div>
  )
}
