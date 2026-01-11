import { Player } from "@/domain/player/player.entity";
import { GamePlayer } from "./game-player.entity";
import {
  MIN_PLAYERS,
  isValidImpostorCount,
  getMaxImpostorsForPlayerCount,
} from "./game-rules";

/**
 * RoleAssignmentService
 *
 * Domain service responsible for assigning roles to players.
 * This is a pure domain service with no infrastructure dependencies.
 *
 * Rules:
 * - Randomly selects which players become impostors
 * - Ensures the specified number of impostors is assigned
 * - Validates that the impostor count is valid for the player count
 */
export class RoleAssignmentService {
  /**
   * Assigns roles to players
   *
   * @param players - Array of players to assign roles to
   * @param impostorCount - Number of impostors to assign (must be valid for player count)
   * @returns Array of GamePlayers with assigned roles
   * @throws Error if impostor count is invalid or insufficient players
   */
  assignRoles(players: Player[], impostorCount: number): GamePlayer[] {
    if (players.length < MIN_PLAYERS) {
      throw new Error(
        `Cannot assign roles to less than ${MIN_PLAYERS} players`
      );
    }

    if (!isValidImpostorCount(impostorCount, players.length)) {
      const maxAllowed = getMaxImpostorsForPlayerCount(players.length);
      throw new Error(
        `Invalid impostor count: ${impostorCount}. Maximum allowed for ${players.length} players is ${maxAllowed}`
      );
    }

    // Create a copy of the players array to avoid mutating the original
    const shuffledPlayers = [...players];

    // Fisher-Yates shuffle algorithm for random selection
    this.shuffleArray(shuffledPlayers);

    // Assign impostor roles to the first N players
    const gamePlayers: GamePlayer[] = shuffledPlayers.map((player, index) => {
      if (index < impostorCount) {
        return GamePlayer.createImpostor(player);
      }
      return GamePlayer.createNormal(player);
    });

    return gamePlayers;
  }

  /**
   * Fisher-Yates shuffle algorithm
   * Randomly shuffles an array in place
   */
  private shuffleArray<T>(array: T[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
}
