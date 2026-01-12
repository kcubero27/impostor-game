/**
 * Value object encapsulating game configuration rules.
 * Immutable configuration that defines the constraints for game setup.
 */
export class GameConfiguration {
  static readonly MIN_PLAYERS = 2;
  static readonly MIN_IMPOSTORS = 1;
  static readonly MAX_IMPOSTORS = 3;
  static readonly MAX_IMPOSTOR_RATIO = 0.5;

  private constructor() {
    // Prevent instantiation - this is a value object with static constants
  }
}
