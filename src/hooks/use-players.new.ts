import { useState, useCallback, useMemo } from 'react'
import { Player } from '@/domain/player/player.entity'
import { PlayerCollection } from '@/domain/player/player-collection'
import { playerManagementService } from '@/application/services'
import { PLAYER_CONSTANTS } from '@/constants'

export interface UsePlayersReturn {
  readonly players: Player[]
  readonly addPlayer: () => void
  readonly updatePlayer: (id: string, name: string) => void
  readonly removePlayer: (id: string) => void
  readonly canRemove: boolean
  readonly playerCount: number
  readonly playersWithDuplicateNames: Set<string>
  readonly hasDuplicateNames: boolean
  readonly isReadyForGame: boolean
}

export interface UsePlayersOptions {
  readonly initialCount?: number
}

/**
 * Custom hook for managing player state using DDD architecture
 * Now uses domain entities and application services
 */
export function usePlayersNew(options: UsePlayersOptions = {}): UsePlayersReturn {
  const { initialCount = PLAYER_CONSTANTS.INITIAL_PLAYERS_COUNT } = options

  const [collection, setCollection] = useState<PlayerCollection>(() => {
    const initialPlayers = Array.from({ length: initialCount }, () =>
      playerManagementService.createPlayer()
    )
    return PlayerCollection.create(initialPlayers)
  })

  const addPlayer = useCallback(() => {
    setCollection(prev => {
      const newPlayer = playerManagementService.createPlayer()
      return prev.add(newPlayer)
    })
  }, [])

  const updatePlayer = useCallback((id: string, name: string) => {
    setCollection(prev => playerManagementService.updatePlayerName(prev, id, name))
  }, [])

  const removePlayer = useCallback((id: string) => {
    setCollection(prev => playerManagementService.removePlayer(prev, id))
  }, [])

  const canRemove = useMemo(
    () => playerManagementService.canRemovePlayer(collection),
    [collection]
  )

  const playerCount = useMemo(() => collection.count, [collection])

  const playersWithDuplicateNames = useMemo(
    () => collection.getPlayersWithDuplicateNames(),
    [collection]
  )

  const hasDuplicateNames = useMemo(
    () => collection.hasDuplicateNames(),
    [collection]
  )

  const isReadyForGame = useMemo(
    () => collection.isReadyForGame(),
    [collection]
  )

  return {
    players: collection.toArray(),
    addPlayer,
    updatePlayer,
    removePlayer,
    canRemove,
    playerCount,
    playersWithDuplicateNames,
    hasDuplicateNames,
    isReadyForGame,
  }
}
