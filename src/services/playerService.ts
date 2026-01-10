import { type Player, createPlayer, type PlayerId } from '@/types'

/**
 * Service interface for player management operations.
 * Follows Interface Segregation Principle (ISP) and Dependency Inversion Principle (DIP).
 */
export interface IPlayerService {
  createNewPlayer: (name?: string) => Player
  updatePlayerName: (players: Player[], id: PlayerId, name: string) => Player[]
  removePlayer: (players: Player[], id: PlayerId, minPlayers: number) => Player[]
  canRemovePlayer: (playersCount: number, minPlayers: number) => boolean
}

/**
 * Implementation of PlayerService.
 * Follows Single Responsibility Principle (SRP) - handles only player business logic.
 */
class PlayerService implements IPlayerService {
  createNewPlayer(name: string = ''): Player {
    return createPlayer(name)
  }

  updatePlayerName(players: Player[], id: PlayerId, name: string): Player[] {
    if (!players.some((player) => player.id === id)) {
      return players
    }
    return players.map((player) =>
      player.id === id ? { ...player, name } : player
    )
  }

  removePlayer(players: Player[], id: PlayerId, minPlayers: number): Player[] {
    if (players.length <= minPlayers) {
      return players
    }
    return players.filter((player) => player.id !== id)
  }

  canRemovePlayer(playersCount: number, minPlayers: number): boolean {
    return playersCount > minPlayers
  }
}

export const playerService: IPlayerService = new PlayerService()
