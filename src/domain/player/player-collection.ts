import { Player } from './player.entity'

/**
 * Domain Service: PlayerCollection
 * Manages a collection of players with domain rules
 */
export class PlayerCollection {
  private readonly _players: Player[]

  private constructor(players: Player[]) {
    this._players = players
  }

  static create(players: Player[]): PlayerCollection {
    return new PlayerCollection([...players])
  }

  static empty(): PlayerCollection {
    return new PlayerCollection([])
  }

  get players(): readonly Player[] {
    return this._players
  }

  get count(): number {
    return this._players.length
  }

  /**
   * Add a player to the collection
   */
  add(player: Player): PlayerCollection {
    return new PlayerCollection([...this._players, player])
  }

  /**
   * Remove a player by ID
   */
  remove(playerId: string, minPlayers: number): PlayerCollection {
    if (this._players.length <= minPlayers) {
      return this
    }
    return new PlayerCollection(
      this._players.filter(p => p.id !== playerId)
    )
  }

  /**
   * Update a player by ID
   */
  update(playerId: string, updateFn: (player: Player) => void): PlayerCollection {
    const newPlayers = this._players.map(player => {
      if (player.id === playerId) {
        // Create a new player to maintain immutability at collection level
        const updatedPlayer = Player.fromPersistence(player.id, player.name)
        updateFn(updatedPlayer)
        return updatedPlayer
      }
      return player
    })

    return new PlayerCollection(newPlayers)
  }

  /**
   * Find a player by ID
   */
  findById(playerId: string): Player | undefined {
    return this._players.find(p => p.id === playerId)
  }

  /**
   * Check if can remove a player based on minimum requirement
   */
  canRemovePlayer(minPlayers: number): boolean {
    return this._players.length > minPlayers
  }

  /**
   * Get players with duplicate names
   */
  getPlayersWithDuplicateNames(): Set<string> {
    const duplicateNames = this.getDuplicateNames()
    const playerIds = new Set<string>()

    for (const player of this._players) {
      const playerName = player.getPlayerName()
      if (playerName && duplicateNames.has(playerName.normalized)) {
        playerIds.add(player.id)
      }
    }

    return playerIds
  }

  /**
   * Get duplicate name values (normalized)
   */
  private getDuplicateNames(): Set<string> {
    const nameCount = new Map<string, number>()
    const duplicates = new Set<string>()

    for (const player of this._players) {
      const playerName = player.getPlayerName()
      if (!playerName) continue

      const normalized = playerName.normalized
      const count = nameCount.get(normalized) ?? 0
      nameCount.set(normalized, count + 1)

      if (count + 1 > 1) {
        duplicates.add(normalized)
      }
    }

    return duplicates
  }

  /**
   * Check if all players have valid names
   */
  allPlayersHaveValidNames(): boolean {
    return this._players.every(p => p.hasValidName())
  }

  /**
   * Check if there are any duplicate names
   */
  hasDuplicateNames(): boolean {
    return this.getDuplicateNames().size > 0
  }

  /**
   * Validate the collection is ready for game
   */
  isReadyForGame(): boolean {
    return this.allPlayersHaveValidNames() && !this.hasDuplicateNames()
  }

  /**
   * Convert to plain array
   */
  toArray(): Player[] {
    return [...this._players]
  }
}
