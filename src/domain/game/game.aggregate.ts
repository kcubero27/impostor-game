import { GamePlayer } from "./game-player.entity";
import { Word } from "./word.entity";
import { GameConfiguration } from "./game-configuration.value-object";

export class Game {
  private readonly _players: readonly GamePlayer[];
  private readonly _word: Word;
  private readonly _currentPlayerIndex: number;
  private readonly _isComplete: boolean;

  private constructor(
    players: readonly GamePlayer[],
    word: Word,
    currentPlayerIndex: number,
    isComplete: boolean
  ) {
    this._players = players;
    this._word = word;
    this._currentPlayerIndex = currentPlayerIndex;
    this._isComplete = isComplete;
  }

  /**
   * Checks if a game can be started with the given player count.
   * Validates the minimum player requirement.
   */
  static canStart(playerCount: number): boolean {
    return playerCount >= GameConfiguration.MIN_PLAYERS;
  }

  static start(
    players: GamePlayer[],
    word: Word,
    expectedImpostorCount: number
  ): Game {
    if (players.length < GameConfiguration.MIN_PLAYERS) {
      throw new Error(
        `Game requires at least ${GameConfiguration.MIN_PLAYERS} players`
      );
    }

    const impostorCount = players.filter((p) => p.isImpostor()).length;
    if (impostorCount !== expectedImpostorCount) {
      throw new Error(
        `Game must have exactly ${expectedImpostorCount} impostor(s), but found ${impostorCount}`
      );
    }

    const hasInvalidRoles = players.some(
      (p) => !p.isImpostor() && !p.isNormal()
    );
    if (hasInvalidRoles) {
      throw new Error("All players must have valid roles");
    }

    return new Game(players, word, 0, false);
  }

  getPlayers(): readonly GamePlayer[] {
    return [...this._players];
  }

  getWord(): Word {
    return this._word;
  }

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
      this._isComplete
    );
  }
}
