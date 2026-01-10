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
  getDuplicateNames: (players: Player[]) => Set<string>
  getPlayersWithDuplicateNames: (players: Player[]) => Set<PlayerId>
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

  /**
   * Returns a set of duplicate names (non-empty names that appear more than once).
   * Empty names are ignored in duplicate detection.
   */
  getDuplicateNames(players: Player[]): Set<string> {
    const nameCount = new Map<string, number>()
    const duplicates = new Set<string>()

    // Count occurrences of each non-empty name (case-insensitive)
    for (const player of players) {
      const normalizedName = player.name.trim().toLowerCase()
      if (normalizedName === '') continue

      const count = nameCount.get(normalizedName) ?? 0
      nameCount.set(normalizedName, count + 1)

      if (count + 1 > 1) {
        duplicates.add(normalizedName)
      }
    }

    return duplicates
  }

  /**
   * Returns a set of player IDs that have duplicate names.
   */
  getPlayersWithDuplicateNames(players: Player[]): Set<PlayerId> {
    const duplicateNames = this.getDuplicateNames(players)
    const playerIdsWithDuplicates = new Set<PlayerId>()

    for (const player of players) {
      const normalizedName = player.name.trim().toLowerCase()
      if (duplicateNames.has(normalizedName)) {
        playerIdsWithDuplicates.add(player.id)
      }
    }

    return playerIdsWithDuplicates
  }
}

export const playerService: IPlayerService = new PlayerService()
