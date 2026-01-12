import { Player } from "@/domain/player/player.entity";
import { GamePlayer } from "./game-player.entity";
import { GameConfiguration } from "./game-configuration.value-object";

/**
 * Domain service responsible for role assignment logic.
 * Encapsulates the rules and validation for assigning impostor and normal roles to players.
 */
export class RoleAssignmentService {
  /**
   * Gets the maximum number of impostors allowed for a given player count.
   * Applies business rules: max 50% ratio, capped at MAX_IMPOSTORS, minimum MIN_IMPOSTORS.
   */
  getMaxImpostorsForPlayerCount(playerCount: number): number {
    if (playerCount < GameConfiguration.MIN_PLAYERS) {
      return GameConfiguration.MIN_IMPOSTORS;
    }

    const maxByRatio = Math.floor(
      playerCount * GameConfiguration.MAX_IMPOSTOR_RATIO
    );
    const maxAllowed = Math.min(maxByRatio, GameConfiguration.MAX_IMPOSTORS);

    return Math.max(maxAllowed, GameConfiguration.MIN_IMPOSTORS);
  }

  /**
   * Validates if an impostor count is valid for a given player count.
   * Ensures the count is within the allowed range and respects business rules.
   */
  isValidImpostorCount(impostorCount: number, playerCount: number): boolean {
    if (impostorCount < GameConfiguration.MIN_IMPOSTORS) {
      return false;
    }
    if (impostorCount > GameConfiguration.MAX_IMPOSTORS) {
      return false;
    }
    const maxAllowed = this.getMaxImpostorsForPlayerCount(playerCount);
    return impostorCount <= maxAllowed;
  }

  /**
   * Assigns roles to players based on the specified impostor count.
   * Validates input and randomly assigns roles while maintaining business invariants.
   */
  assignRoles(players: Player[], impostorCount: number): GamePlayer[] {
    if (players.length < GameConfiguration.MIN_PLAYERS) {
      throw new Error(
        `Cannot assign roles to less than ${GameConfiguration.MIN_PLAYERS} players`
      );
    }

    if (!this.isValidImpostorCount(impostorCount, players.length)) {
      const maxAllowed = this.getMaxImpostorsForPlayerCount(players.length);
      throw new Error(
        `Invalid impostor count: ${impostorCount}. Maximum allowed for ${players.length} players is ${maxAllowed}`
      );
    }

    const shuffledPlayers = [...players];

    this.shuffleArray(shuffledPlayers);

    const gamePlayers: GamePlayer[] = shuffledPlayers.map((player, index) => {
      if (index < impostorCount) {
        return GamePlayer.createImpostor(player);
      }
      return GamePlayer.createNormal(player);
    });

    return gamePlayers;
  }

  private shuffleArray<T>(array: T[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
}
