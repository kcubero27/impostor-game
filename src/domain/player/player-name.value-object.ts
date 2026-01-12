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

  static create(name: string): PlayerName {
    return new PlayerName(name);
  }

  getValue(): string {
    return this.value;
  }

  isValid(): boolean {
    return this.value.trim().length >= PlayerName.MIN_LENGTH;
  }

  toString(): string {
    return this.value;
  }
}
