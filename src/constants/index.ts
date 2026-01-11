// Re-export domain constants for UI layer backward compatibility
import {
  MIN_PLAYERS,
  MIN_IMPOSTORS,
  MAX_IMPOSTORS,
  MAX_IMPOSTOR_RATIO,
  getMaxImpostorsForPlayerCount,
  isValidImpostorCount,
} from "@/domain/game/game-rules";

export const PLAYER_CONSTANTS = {
  MIN_PLAYERS,
  INITIAL_PLAYERS_COUNT: 2,
} as const;

/**
 * Impostor Game Constants
 *
 * Rules for impostor assignment based on player count.
 * These are re-exported from the domain layer to maintain backward compatibility.
 */
export const IMPOSTOR_CONSTANTS = {
  MIN_IMPOSTORS,
  MAX_IMPOSTORS,
  MAX_IMPOSTOR_RATIO,
  getMaxImpostorsForPlayerCount,
  isValidImpostorCount,
} as const;
