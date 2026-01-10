import { GamePlayer } from './game-player.entity'
import { Word } from './word.entity'

/**
 * Aggregate Root: Game
 * Manages the entire game state and enforces invariants
 */
export class Game {
  private readonly _players: GamePlayer[]
  private readonly _word: Word
  private _currentPlayerIndex: number
  private _isComplete: boolean

  private constructor(
    players: GamePlayer[],
    word: Word,
    currentPlayerIndex: number,
    isComplete: boolean
  ) {
    this._players = players
    this._word = word
    this._currentPlayerIndex = currentPlayerIndex
    this._isComplete = isComplete
  }

  static start(players: GamePlayer[], word: Word): Game {
    if (players.length < 2) {
      throw new Error('Game requires at least 2 players')
    }

    if (!players.some(p => p.isImpostor)) {
      throw new Error('Game must have at least one impostor')
    }

    if (players.filter(p => p.isImpostor).length > 1) {
      throw new Error('Game can only have one impostor')
    }

    return new Game(players, word, 0, false)
  }

  get players(): readonly GamePlayer[] {
    return this._players
  }

  get word(): Word {
    return this._word
  }

  get currentPlayerIndex(): number {
    return this._currentPlayerIndex
  }

  get isComplete(): boolean {
    return this._isComplete
  }

  get currentPlayer(): GamePlayer | undefined {
    return this._players[this._currentPlayerIndex]
  }

  /**
   * Mark current player as having seen their role
   */
  markCurrentPlayerAsSeenRole(): void {
    const currentPlayer = this.currentPlayer
    if (currentPlayer) {
      currentPlayer.markAsSeenRole()
    }
  }

  /**
   * Move to the next player
   */
  moveToNextPlayer(): void {
    if (this._isComplete) {
      throw new Error('Game is already complete')
    }

    this._currentPlayerIndex += 1

    if (this._currentPlayerIndex >= this._players.length) {
      this._isComplete = true
    }
  }

  /**
   * Check if all players have seen their roles
   */
  allPlayersHaveSeenRoles(): boolean {
    return this._players.every(p => p.hasSeenRole)
  }

  /**
   * Get the impostor player
   */
  getImpostor(): GamePlayer | undefined {
    return this._players.find(p => p.isImpostor)
  }

  /**
   * Get all normal players
   */
  getNormalPlayers(): GamePlayer[] {
    return this._players.filter(p => !p.isImpostor)
  }

  /**
   * Convert to plain object for serialization
   */
  toPlainObject(): {
    players: readonly ReturnType<GamePlayer['toPlainObject']>[]
    word: ReturnType<Word['toPlainObject']>
    currentPlayerIndex: number
    isComplete: boolean
  } {
    return {
      players: this._players.map(p => p.toPlainObject()),
      word: this._word.toPlainObject(),
      currentPlayerIndex: this._currentPlayerIndex,
      isComplete: this._isComplete,
    }
  }
}
