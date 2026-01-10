import { Player } from '@/domain/player/player.entity'
import { PlayerCollection } from '@/domain/player/player-collection'

/**
 * Interface for ID generation
 * Application service depends on abstraction (DIP)
 */
export interface IIdGenerator {
  generate(prefix?: string): string
}

/**
 * Application Service: PlayerManagementService
 * Orchestrates player-related use cases
 * Thin layer that coordinates domain objects
 */
export class PlayerManagementService {
  private readonly idGenerator: IIdGenerator
  private readonly minPlayers: number

  constructor(idGenerator: IIdGenerator, minPlayers: number = 2) {
    this.idGenerator = idGenerator
    this.minPlayers = minPlayers
  }

  /**
   * Create a new player
   */
  createPlayer(name: string = ''): Player {
    const id = this.idGenerator.generate('player')
    return Player.create(id, name)
  }

  /**
   * Update a player's name in a collection
   */
  updatePlayerName(
    collection: PlayerCollection,
    playerId: string,
    newName: string
  ): PlayerCollection {
    return collection.update(playerId, player => {
      player.changeName(newName)
    })
  }

  /**
   * Remove a player from a collection
   */
  removePlayer(collection: PlayerCollection, playerId: string): PlayerCollection {
    return collection.remove(playerId, this.minPlayers)
  }

  /**
   * Check if a player can be removed
   */
  canRemovePlayer(collection: PlayerCollection): boolean {
    return collection.canRemovePlayer(this.minPlayers)
  }

  /**
   * Validate if collection is ready for game
   */
  validateForGame(collection: PlayerCollection): {
    isValid: boolean
    errors: string[]
  } {
    const errors: string[] = []

    if (collection.count < this.minPlayers) {
      errors.push(`At least ${this.minPlayers} players required`)
    }

    if (!collection.allPlayersHaveValidNames()) {
      errors.push('All players must have valid names')
    }

    if (collection.hasDuplicateNames()) {
      errors.push('Player names must be unique')
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }
}
