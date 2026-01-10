/**
 * Value Object: Difficulty
 */
export type Difficulty = 1 | 2 | 3

/**
 * Domain Entity: Word
 * Represents a word in the game with its translations and metadata
 */
export class Word {
  private readonly _id: string
  private readonly _wordKey: string
  private readonly _hintKey: string
  private readonly _categoryIds: readonly string[]
  private readonly _difficulty: Difficulty

  constructor(
    id: string,
    wordKey: string,
    hintKey: string,
    categoryIds: readonly string[],
    difficulty: Difficulty
  ) {
    this._id = id
    this._wordKey = wordKey
    this._hintKey = hintKey
    this._categoryIds = categoryIds
    this._difficulty = difficulty
  }

  static create(
    id: string,
    wordKey: string,
    hintKey: string,
    categoryIds: readonly string[],
    difficulty: Difficulty
  ): Word {
    if (!id || !wordKey || !hintKey) {
      throw new Error('Word must have id, wordKey, and hintKey')
    }

    if (categoryIds.length === 0) {
      throw new Error('Word must belong to at least one category')
    }

    return new Word(id, wordKey, hintKey, categoryIds, difficulty)
  }

  get id(): string {
    return this._id
  }

  get wordKey(): string {
    return this._wordKey
  }

  get hintKey(): string {
    return this._hintKey
  }

  get categoryIds(): readonly string[] {
    return this._categoryIds
  }

  get difficulty(): Difficulty {
    return this._difficulty
  }

  /**
   * Check if word belongs to a specific category
   */
  belongsToCategory(categoryId: string): boolean {
    return this._categoryIds.includes(categoryId)
  }

  /**
   * Check if word matches difficulty level
   */
  hasDifficulty(difficulty: Difficulty): boolean {
    return this._difficulty === difficulty
  }

  /**
   * Convert to plain object
   */
  toPlainObject(): {
    id: string
    wordKey: string
    hintKey: string
    categoryIds: readonly string[]
    difficulty: number
  } {
    return {
      id: this._id,
      wordKey: this._wordKey,
      hintKey: this._hintKey,
      categoryIds: this._categoryIds,
      difficulty: this._difficulty,
    }
  }
}
