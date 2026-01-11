/**
 * Word Entity
 * 
 * Represents a word in the game with its translations and metadata.
 * This is a domain entity that encapsulates word-related business logic.
 */
export class Word {
  private constructor(
    private readonly _id: string,
    private readonly _wordKey: string,
    private readonly _hintKey: string,
    private readonly _categoryIds: readonly string[],
    private readonly _difficulty: number,
  ) {
    if (!_id || _id.trim().length === 0) {
      throw new Error("Word ID cannot be empty");
    }
    if (!_wordKey || _wordKey.trim().length === 0) {
      throw new Error("Word key cannot be empty");
    }
    if (!_hintKey || _hintKey.trim().length === 0) {
      throw new Error("Hint key cannot be empty");
    }
    if (_categoryIds.length === 0) {
      throw new Error("Word must belong to at least one category");
    }
    if (_difficulty < 1 || _difficulty > 3) {
      throw new Error("Word difficulty must be between 1 and 3");
    }
  }

  /**
   * Factory method to create a Word entity
   */
  static create(
    id: string,
    wordKey: string,
    hintKey: string,
    categoryIds: readonly string[],
    difficulty: number,
  ): Word {
    return new Word(id, wordKey, hintKey, categoryIds, difficulty);
  }

  /**
   * Gets the word ID
   */
  getId(): string {
    return this._id;
  }

  /**
   * Gets the word translation key
   */
  getWordKey(): string {
    return this._wordKey;
  }

  /**
   * Gets the hint translation key
   */
  getHintKey(): string {
    return this._hintKey;
  }

  /**
   * Gets the category IDs this word belongs to
   */
  getCategoryIds(): readonly string[] {
    return [...this._categoryIds];
  }

  /**
   * Gets the difficulty level (1-3)
   */
  getDifficulty(): number {
    return this._difficulty;
  }

  /**
   * Checks if this word belongs to a specific category
   */
  belongsToCategory(categoryId: string): boolean {
    return this._categoryIds.includes(categoryId);
  }

  /**
   * Checks if this word belongs to any of the given categories
   */
  belongsToAnyCategory(categoryIds: string[]): boolean {
    return categoryIds.some((id) => this._categoryIds.includes(id));
  }
}
