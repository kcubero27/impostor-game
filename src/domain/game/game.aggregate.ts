import { GamePlayer } from "./game-player.entity";
import { Word } from "./word.entity";

/**
 * Game Aggregate Root
 * 
 * Represents a game session and enforces game invariants.
 * This is the aggregate root that manages GamePlayers and Word.
 * 
 * Invariants:
 * - Game must have at least 2 players
 * - Game must have exactly the specified number of impostors
 * - All players must have valid roles
 */
export class Game {
  private constructor(
    private readonly _players: readonly GamePlayer[],
    private readonly _word: Word,
    private _currentPlayerIndex: number,
    private _isComplete: boolean,
  ) {}

  /**
   * Factory method to start a new game
   * Enforces all game invariants
   * 
   * @param players - Array of game players with assigned roles
   * @param word - The word for this game
   * @param expectedImpostorCount - Expected number of impostors (for validation)
   * @returns New Game instance
   * @throws Error if invariants are violated
   */
  static start(
    players: GamePlayer[],
    word: Word,
    expectedImpostorCount: number,
  ): Game {
    // Invariant: Minimum players
    if (players.length < 2) {
      throw new Error("Game requires at least 2 players");
    }

    // Invariant: Exactly the expected number of impostors
    const impostorCount = players.filter((p) => p.isImpostor()).length;
    if (impostorCount !== expectedImpostorCount) {
      throw new Error(
        `Game must have exactly ${expectedImpostorCount} impostor(s), but found ${impostorCount}`,
      );
    }

    // Invariant: All players must have valid roles
    const hasInvalidRoles = players.some(
      (p) => !p.isImpostor() && !p.isNormal(),
    );
    if (hasInvalidRoles) {
      throw new Error("All players must have valid roles");
    }

    return new Game(players, word, 0, false);
  }

  /**
   * Gets all game players
   */
  getPlayers(): readonly GamePlayer[] {
    return [...this._players];
  }

  /**
   * Gets the word for this game
   */
  getWord(): Word {
    return this._word;
  }

  /**
   * Gets the current player index
   */
  getCurrentPlayerIndex(): number {
    return this._currentPlayerIndex;
  }

  /**
   * Gets the current player
   */
  getCurrentPlayer(): GamePlayer {
    return this._players[this._currentPlayerIndex];
  }

  /**
   * Checks if the game is complete
   */
  isComplete(): boolean {
    return this._isComplete;
  }

  /**
   * Marks the current player as having seen their role
   * Returns a new Game instance (immutability)
   */
  markCurrentPlayerAsSeenRole(): Game {
    const updatedPlayers = this._players.map((player, index) => {
      if (index === this._currentPlayerIndex) {
        return player.markRoleAsSeen();
      }
      return player;
    });

    return new Game(
      updatedPlayers,
      this._word,
      this._currentPlayerIndex,
      this._isComplete,
    );
  }

  /**
   * Marks a specific player as having seen their role
   * Returns a new Game instance (immutability)
   * 
   * @param playerId - ID of the player to mark as having seen their role
   */
  markPlayerAsSeenRole(playerId: string): Game {
    const updatedPlayers = this._players.map((player) => {
      if (player.getId() === playerId) {
        return player.markRoleAsSeen();
      }
      return player;
    });

    return new Game(
      updatedPlayers,
      this._word,
      this._currentPlayerIndex,
      this._isComplete,
    );
  }

  /**
   * Moves to the next player
   * Returns a new Game instance (immutability)
   */
  moveToNextPlayer(): Game {
    const nextIndex = (this._currentPlayerIndex + 1) % this._players.length;
    return new Game(this._players, this._word, nextIndex, this._isComplete);
  }

  /**
   * Marks the game as complete
   * Returns a new Game instance (immutability)
   */
  complete(): Game {
    return new Game(
      this._players,
      this._word,
      this._currentPlayerIndex,
      true,
    );
  }
}
