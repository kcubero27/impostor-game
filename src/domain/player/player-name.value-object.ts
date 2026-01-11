/**
 * PlayerName Value Object
 *
 * Encapsulates player name validation logic.
 * Immutable value object that validates on creation.
 */
export class PlayerName {
  private static readonly MIN_LENGTH = 1;
  private static readonly MAX_LENGTH = 50;

  private readonly value: string;

  private constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error("Player name cannot be empty");
    }

    const trimmed = value.trim();
    if (trimmed.length < PlayerName.MIN_LENGTH) {
      throw new Error(
        `Player name must be at least ${PlayerName.MIN_LENGTH} character`
      );
    }

    if (trimmed.length > PlayerName.MAX_LENGTH) {
      throw new Error(
        `Player name cannot exceed ${PlayerName.MAX_LENGTH} characters`
      );
    }

    this.value = trimmed;
  }

  /**
   * Factory method to create a PlayerName
   * Validates the name on creation
   */
  static create(name: string): PlayerName {
    return new PlayerName(name);
  }

  /**
   * Creates a PlayerName from an optional string
   * Returns null if the name is empty or invalid
   */
  static createOptional(name: string | undefined): PlayerName | null {
    if (!name || name.trim().length === 0) {
      return null;
    }
    try {
      return new PlayerName(name);
    } catch {
      return null;
    }
  }

  /**
   * Gets the string value
   */
  getValue(): string {
    return this.value;
  }

  /**
   * Checks if the name is valid (non-empty)
   */
  isValid(): boolean {
    return this.value.trim().length >= PlayerName.MIN_LENGTH;
  }

  /**
   * Checks equality with another PlayerName
   */
  equals(other: PlayerName): boolean {
    return this.value.toLowerCase() === other.value.toLowerCase();
  }

  /**
   * Returns string representation
   */
  toString(): string {
    return this.value;
  }
}
