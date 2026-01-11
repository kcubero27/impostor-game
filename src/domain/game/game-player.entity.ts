import { Player } from "@/domain/player/player.entity";

/**
 * Player Role
 * 
 * Represents the role a player has in the game.
 */
export type PlayerRole = "impostor" | "normal";

/**
 * GamePlayer Entity
 * 
 * Represents a player in the context of a game.
 * Extends the base Player with game-specific properties like role.
 */
export class GamePlayer {
  private constructor(
    private readonly _player: Player,
    private readonly _role: PlayerRole,
    private _hasSeenRole: boolean = false,
  ) {}

  /**
   * Factory method to create a normal player
   */
  static createNormal(player: Player): GamePlayer {
    return new GamePlayer(player, "normal", false);
  }

  /**
   * Factory method to create an impostor
   */
  static createImpostor(player: Player): GamePlayer {
    return new GamePlayer(player, "impostor", false);
  }

  /**
   * Gets the underlying player entity
   */
  getPlayer(): Player {
    return this._player;
  }

  /**
   * Gets the player ID
   */
  getId(): string {
    return this._player.getId();
  }

  /**
   * Gets the player name
   */
  getName(): string {
    return this._player.getName();
  }

  /**
   * Gets the player's role
   */
  getRole(): PlayerRole {
    return this._role;
  }

  /**
   * Checks if this player is an impostor
   */
  isImpostor(): boolean {
    return this._role === "impostor";
  }

  /**
   * Checks if this player is normal (not an impostor)
   */
  isNormal(): boolean {
    return this._role === "normal";
  }

  /**
   * Checks if the player has seen their role
   */
  hasSeenRole(): boolean {
    return this._hasSeenRole;
  }

  /**
   * Marks the player as having seen their role
   */
  markRoleAsSeen(): GamePlayer {
    return new GamePlayer(this._player, this._role, true);
  }
}
