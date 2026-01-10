import { useState, useCallback, useMemo } from 'react'
import { PlayerCollection } from '@/domain/player/player-collection'
import { playerManagementService } from '@/application/services'
import { PlayerAdapter } from '@/adapters/player.adapter'
import { PLAYER_CONSTANTS } from '@/constants'

// Legacy type support
export type Player = { id: string; name: string }
export type PlayerId = string

export interface UsePlayersReturn {
  readonly players: Player[]
  readonly addPlayer: () => void
  readonly updatePlayer: (id: PlayerId, name: string) => void
  readonly removePlayer: (id: PlayerId) => void
  readonly canRemove: boolean
  readonly playerCount: number
  readonly playersWithDuplicateNames: Set<PlayerId>
  readonly hasDuplicateNames: boolean
}

export interface UsePlayersOptions {
  readonly initialCount?: number
}

/**
 * Custom hook for managing player state using DDD architecture.
 * Now uses domain entities, value objects, and application services.
 * 
 * SOLID Principles Applied:
 * - SRP: Hook only manages UI state, delegates logic to domain/application layers
 * - DIP: Depends on application service abstraction
 */
export function usePlayers(options: UsePlayersOptions = {}): UsePlayersReturn {
  const { initialCount = PLAYER_CONSTANTS.INITIAL_PLAYERS_COUNT } = options

  // Internal state uses domain model
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

  const updatePlayer = useCallback((id: PlayerId, name: string) => {
    setCollection(prev => playerManagementService.updatePlayerName(prev, id, name))
  }, [])

  const removePlayer = useCallback((id: PlayerId) => {
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

  // Return legacy-compatible interface using adapters
  return {
    players: PlayerAdapter.toDtoArray(collection.toArray()),
    addPlayer,
    updatePlayer,
    removePlayer,
    canRemove,
    playerCount,
    playersWithDuplicateNames,
    hasDuplicateNames,
  }
}

