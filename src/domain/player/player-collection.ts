import { Player } from "./player.entity";

/**
 * PlayerCollection Domain Service
 * 
 * Manages business rules for player collections.
 * Enforces invariants like minimum players, unique names, etc.
 */
export class PlayerCollection {
  private static readonly MIN_PLAYERS = 3;

  /**
   * Validates that a collection has the minimum required players
   */
  static hasMinimumPlayers(players: Player[]): boolean {
    return players.length >= PlayerCollection.MIN_PLAYERS;
  }

  /**
   * Checks if a player can be removed without violating minimum requirement
   */
  static canRemovePlayer(players: Player[]): boolean {
    return players.length > PlayerCollection.MIN_PLAYERS;
  }

  /**
   * Validates that all players have valid names
   */
  static allPlayersHaveValidNames(players: Player[]): boolean {
    return players.every((player) => player.hasValidName());
  }

  /**
   * Checks if all player names are unique
   */
  static allNamesAreUnique(players: Player[]): boolean {
    const names = players
      .filter((p) => p.hasValidName())
      .map((p) => p.getName().toLowerCase());

    return new Set(names).size === names.length;
  }

  /**
   * Gets the count of players with valid names
   */
  static getReadyPlayersCount(players: Player[]): number {
    return players.filter((p) => p.hasValidName()).length;
  }

  /**
   * Validates the entire collection
   * Returns an array of validation errors (empty if valid)
   */
  static validate(players: Player[]): string[] {
    const errors: string[] = [];

    if (!PlayerCollection.hasMinimumPlayers(players)) {
      errors.push(
        `At least ${PlayerCollection.MIN_PLAYERS} players are required`,
      );
    }

    if (!PlayerCollection.allPlayersHaveValidNames(players)) {
      errors.push("All players must have valid names");
    }

    if (!PlayerCollection.allNamesAreUnique(players)) {
      errors.push("All player names must be unique");
    }

    return errors;
  }

  /**
   * Checks if the collection is ready to start a game
   */
  static isReady(players: Player[]): boolean {
    return PlayerCollection.validate(players).length === 0;
  }
}
