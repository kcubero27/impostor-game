/**
 * Value Object: PlayerName
 * Encapsulates player name validation and rules
 * Immutable and self-validating
 */
export class PlayerName {
  private readonly _value: string

  private constructor(value: string) {
    this._value = value
  }

  static create(name: string): PlayerName {
    const trimmed = name.trim()

    if (trimmed.length === 0) {
      throw new Error('Player name cannot be empty')
    }

    if (trimmed.length > 50) {
      throw new Error('Player name cannot exceed 50 characters')
    }

    return new PlayerName(trimmed)
  }

  static createOptional(name: string): PlayerName | null {
    const trimmed = name.trim()
    return trimmed.length === 0 ? null : new PlayerName(trimmed)
  }

  get value(): string {
    return this._value
  }

  get normalized(): string {
    return this._value.toLowerCase()
  }

  equals(other: PlayerName): boolean {
    return this.normalized === other.normalized
  }

  isEmpty(): boolean {
    return this._value.length === 0
  }

  toString(): string {
    return this._value
  }
}
