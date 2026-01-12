import { GameConfiguration } from "@/domain/game/game-configuration.value-object";
import { RoleAssignmentService } from "@/domain/game/role-assignment.domain-service";
import { Game } from "@/domain/game/game.aggregate";

// Create a singleton instance for UI access to domain service methods
const roleAssignmentService = new RoleAssignmentService();

export const IMPOSTOR_CONSTANTS = {
  MIN_IMPOSTORS: GameConfiguration.MIN_IMPOSTORS,
  MAX_IMPOSTORS: GameConfiguration.MAX_IMPOSTORS,
  MAX_IMPOSTOR_RATIO: GameConfiguration.MAX_IMPOSTOR_RATIO,
  getMaxImpostorsForPlayerCount: (playerCount: number) =>
    roleAssignmentService.getMaxImpostorsForPlayerCount(playerCount),
  isValidImpostorCount: (impostorCount: number, playerCount: number) =>
    roleAssignmentService.isValidImpostorCount(impostorCount, playerCount),
  canStartGame: (playerCount: number) => Game.canStart(playerCount),
} as const;
