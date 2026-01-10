import { PlayerName } from './player-name.value-object'

/**
 * Domain Entity: Player
 * Represents a player in the game with identity and behavior
 */
export class Player {
  private readonly _id: string
  private _name: string

  private constructor(id: string, name: string) {
    this._id = id
    this._name = name
  }

  /**
   * Factory method to create a new Player
   */
  static create(id: string, name: string = ''): Player {
    if (!id || id.trim().length === 0) {
      throw new Error('Player ID cannot be empty')
    }

    return new Player(id, name)
  }

  /**
   * Reconstitute a player from persistence
   */
  static fromPersistence(id: string, name: string): Player {
    return new Player(id, name)
  }

  get id(): string {
    return this._id
  }

  get name(): string {
    return this._name
  }

  /**
   * Change the player's name
   */
  changeName(newName: string): void {
    this._name = newName
  }

  /**
   * Validate if the player has a valid name
   */
  hasValidName(): boolean {
    try {
      PlayerName.create(this._name)
      return true
    } catch {
      return false
    }
  }

  /**
   * Get the player name as a value object
   */
  getPlayerName(): PlayerName | null {
    return PlayerName.createOptional(this._name)
  }

  /**
   * Check if name matches another player's name (case-insensitive)
   */
  hasSameNameAs(other: Player): boolean {
    const thisName = this.getPlayerName()
    const otherName = other.getPlayerName()

    if (!thisName || !otherName) {
      return false
    }

    return thisName.equals(otherName)
  }

  /**
   * Convert to plain object for serialization
   */
  toPlainObject(): { id: string; name: string } {
    return {
      id: this._id,
      name: this._name,
    }
  }

  /**
   * Entity equality based on ID
   */
  equals(other: Player): boolean {
    return this._id === other._id
  }
}
