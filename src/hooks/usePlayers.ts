import { useState, useCallback, useMemo } from 'react'
import { type Player, type PlayerId } from '@/types'
import { type IPlayerService } from '@/services/playerService'
import { playerService } from '@/services/playerService'
import { PLAYER_CONSTANTS } from '@/constants'

export interface UsePlayersReturn {
  readonly players: Player[]
  readonly addPlayer: () => void
  readonly updatePlayer: (id: PlayerId, name: string) => void
  readonly removePlayer: (id: PlayerId) => void
  readonly canRemove: boolean
  readonly playerCount: number
}

export interface UsePlayersOptions {
  readonly initialCount?: number
  readonly service?: IPlayerService
  readonly minPlayers?: number
}

/**
 * Custom hook for managing player state.
 * Follows Single Responsibility Principle (SRP) - handles only state management.
 * Follows Dependency Inversion Principle (DIP) - depends on IPlayerService abstraction.
 */
export function usePlayers(options: UsePlayersOptions = {}): UsePlayersReturn {
  const {
    initialCount = PLAYER_CONSTANTS.INITIAL_PLAYERS_COUNT,
    service = playerService,
    minPlayers = PLAYER_CONSTANTS.MIN_PLAYERS,
  } = options

  const [players, setPlayers] = useState<Player[]>(() => {
    return Array.from({ length: initialCount }, () => service.createNewPlayer())
  })

  const addPlayer = useCallback(() => {
    setPlayers((prevPlayers) => [...prevPlayers, service.createNewPlayer()])
  }, [service])

  const updatePlayer = useCallback(
    (id: PlayerId, name: string) => {
      setPlayers((prevPlayers) => service.updatePlayerName(prevPlayers, id, name))
    },
    [service]
  )

  const removePlayer = useCallback(
    (id: PlayerId) => {
      setPlayers((prevPlayers) => service.removePlayer(prevPlayers, id, minPlayers))
    },
    [service, minPlayers]
  )

  const canRemove = useMemo(
    () => service.canRemovePlayer(players.length, minPlayers),
    [players.length, service, minPlayers]
  )

  const playerCount = useMemo(() => players.length, [players.length])

  return {
    players,
    addPlayer,
    updatePlayer,
    removePlayer,
    canRemove,
    playerCount,
  }
}
