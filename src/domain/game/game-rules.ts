/**
 * Game Rules
 * 
 * Domain constants and business rules for the impostor game.
 * These are pure domain concepts with no external dependencies.
 */

/**
 * Minimum number of players required for a game
 */
export const MIN_PLAYERS = 2;

/**
 * Minimum number of impostors (always at least 1)
 */
export const MIN_IMPOSTORS = 1;

/**
 * Maximum number of impostors allowed
 */
export const MAX_IMPOSTORS = 3;

/**
 * Maximum ratio of impostors to total players (e.g., 0.5 = 50%)
 * This ensures there are always more normal players than impostors
 */
export const MAX_IMPOSTOR_RATIO = 0.5;

/**
 * Calculates the maximum number of impostors allowed for a given player count
 * 
 * Rule: Impostors should not exceed half of the players (rounded down)
 * Example: 5 players -> max 2 impostors, 6 players -> max 3 impostors
 * 
 * @param playerCount - Total number of players
 * @returns Maximum number of impostors allowed
 */
export function getMaxImpostorsForPlayerCount(playerCount: number): number {
  if (playerCount < MIN_PLAYERS) {
    return MIN_IMPOSTORS;
  }
  
  const maxByRatio = Math.floor(playerCount * MAX_IMPOSTOR_RATIO);
  const maxAllowed = Math.min(maxByRatio, MAX_IMPOSTORS);
  
  // Ensure at least 1 impostor is always allowed
  return Math.max(maxAllowed, MIN_IMPOSTORS);
}

/**
 * Validates if a given number of impostors is valid for a player count
 * 
 * @param impostorCount - Number of impostors to validate
 * @param playerCount - Total number of players
 * @returns True if the impostor count is valid
 */
export function isValidImpostorCount(impostorCount: number, playerCount: number): boolean {
  if (impostorCount < MIN_IMPOSTORS) {
    return false;
  }
  if (impostorCount > MAX_IMPOSTORS) {
    return false;
  }
  const maxAllowed = getMaxImpostorsForPlayerCount(playerCount);
  return impostorCount <= maxAllowed;
}
