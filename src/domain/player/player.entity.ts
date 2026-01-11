import { PlayerName } from "./player-name.value-object";

/**
 * Player Entity
 * 
 * Represents a player with unique identity.
 * Has behavior for managing player name.
 */
export class Player {
  private constructor(
    private readonly id: string,
    private _name: PlayerName | null,
  ) {
    if (!id || id.trim().length === 0) {
      throw new Error("Player ID cannot be empty");
    }
  }

  /**
   * Factory method to create a Player
   */
  static create(id: string, name: string = ""): Player {
    const playerName = name.trim().length > 0 
      ? PlayerName.create(name) 
      : null;
    return new Player(id, playerName);
  }

  /**
   * Gets the player ID
   */
  getId(): string {
    return this.id;
  }

  /**
   * Gets the player name value (or empty string if not set)
   */
  getName(): string {
    return this._name?.getValue() ?? "";
  }

  /**
   * Gets the PlayerName value object (or null if not set)
   */
  getPlayerName(): PlayerName | null {
    return this._name;
  }

  /**
   * Changes the player's name
   * Validates the name through PlayerName value object
   */
  changeName(newName: string): void {
    if (newName.trim().length === 0) {
      this._name = null;
      return;
    }
    this._name = PlayerName.create(newName);
  }

  /**
   * Checks if the player has a valid name
   */
  hasValidName(): boolean {
    return this._name !== null && this._name.isValid();
  }

  /**
   * Checks if this player has the same name as another player
   */
  hasSameNameAs(other: Player): boolean {
    if (!this._name || !other._name) {
      return false;
    }
    return this._name.equals(other._name);
  }
}
