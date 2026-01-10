import { useCallback, useState, useMemo, useRef, useEffect } from 'react'
import {
  PlayerSetupHeader,
  PlayersSection,
  PlayerInput,
  AddPlayerButton,
} from '@/components/player-setup'
import { usePlayers } from '@/hooks'
import { type PlayerId, type Player } from '@/types'
import { Button } from '@/components/ui/button'
import { LanguageSwitcher } from '@/components/ui/language-switcher'
import { useTranslation } from '@/i18n'
import { AlertCircle } from 'lucide-react'

export interface PlayerSetupProps {
  readonly initialPlayerCount?: number
  readonly className?: string
  readonly containerClassName?: string
  readonly onStartGame?: (players: Player[]) => void
}

export function PlayerSetup({
  initialPlayerCount,
  className,
  containerClassName,
  onStartGame,
}: PlayerSetupProps) {
  const {
    players,
    addPlayer,
    updatePlayer,
    removePlayer,
    canRemove,
    playerCount,
    playersWithDuplicateNames,
    hasDuplicateNames,
  } = usePlayers({ initialCount: initialPlayerCount })
  const { t } = useTranslation()
  const [showValidation, setShowValidation] = useState(false)
  const inputRefs = useRef<Map<string, HTMLInputElement>>(new Map())
  const prevPlayerCountRef = useRef(playerCount)

  // Check if all players have names
  const emptyPlayerIndices = useMemo(() => {
    return players
      .map((player, index) => (player.name.trim() === '' ? index : -1))
      .filter((index) => index !== -1)
  }, [players])

  const allPlayersHaveNames = emptyPlayerIndices.length === 0
  const allNamesAreValid = allPlayersHaveNames && !hasDuplicateNames

  const handlePlayerChange = useCallback(
    (id: PlayerId, value: string) => {
      updatePlayer(id, value)
      // Reset validation when user types
      if (showValidation) {
        setShowValidation(false)
      }
    },
    [updatePlayer, showValidation]
  )

  const handleRemovePlayer = useCallback(
    (id: PlayerId) => {
      removePlayer(id)
    },
    [removePlayer]
  )

  // Focus on the last added player input when a new player is added
  useEffect(() => {
    // Check if a new player was added (count increased)
    if (playerCount > prevPlayerCountRef.current && players.length > 0) {
      const lastPlayer = players[players.length - 1]
      const inputElement = inputRefs.current.get(lastPlayer.id)

      if (inputElement) {
        // Small delay to ensure DOM is updated
        requestAnimationFrame(() => {
          inputElement.focus()
          // Scroll into view if needed
          inputElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
        })
      }
    }

    // Update the previous count
    prevPlayerCountRef.current = playerCount
  }, [playerCount, players])

  const handleStartGame = useCallback(() => {
    if (!allNamesAreValid) {
      setShowValidation(true)
      return
    }

    if (onStartGame) {
      onStartGame(players)
    }
  }, [players, onStartGame, allNamesAreValid])

  return (
    <div
      className={`min-h-dvh bg-purple-50/80 flex items-center justify-center p-4 ${containerClassName ?? ''}`}
    >
      <div className={`bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg ${className ?? ''}`}>
        {/* Language Switcher */}
        <div className="flex justify-end mb-4">
          <LanguageSwitcher />
        </div>

        <PlayerSetupHeader />

        <PlayersSection playerCount={playerCount}>
          {/* Player List */}
          <div className="space-y-3" role="list">
            {players.map((player, index) => (
              <div key={player.id} role="listitem">
                <PlayerInput
                  ref={(el) => {
                    if (el) {
                      inputRefs.current.set(player.id, el)
                    } else {
                      inputRefs.current.delete(player.id)
                    }
                  }}
                  index={index}
                  value={player.name}
                  onChange={(value) => handlePlayerChange(player.id, value)}
                  onRemove={() => handleRemovePlayer(player.id)}
                  canRemove={canRemove}
                  hasError={
                    showValidation &&
                    (emptyPlayerIndices.includes(index) ||
                      playersWithDuplicateNames.has(player.id))
                  }
                />
              </div>
            ))}
          </div>

          {/* Add Player Button */}
          <AddPlayerButton onClick={addPlayer} />
        </PlayersSection>

        {/* Validation Error Messages */}
        {showValidation && !allPlayersHaveNames && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start gap-2 text-sm text-red-800">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p>{t('ui.all_players_need_names')}</p>
          </div>
        )}
        {showValidation && hasDuplicateNames && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start gap-2 text-sm text-red-800">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p>{t('ui.names_must_be_unique')}</p>
          </div>
        )}

        {/* Start Game Button */}
        {onStartGame && (
          <div className="mt-6">
            <Button
              onClick={handleStartGame}
              className="w-full"
              size="lg"
            >
              {t('ui.start_game')}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
