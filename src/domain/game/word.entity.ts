export class Word {
  private readonly _id: string;
  private readonly _wordKey: string;
  private readonly _hintKey: string;
  private readonly _categoryIds: readonly string[];
  private readonly _difficulty: number;

  private constructor(
    id: string,
    wordKey: string,
    hintKey: string,
    categoryIds: readonly string[],
    difficulty: number
  ) {
    if (!id || id.trim().length === 0) {
      throw new Error("Word ID cannot be empty");
    }
    if (!wordKey || wordKey.trim().length === 0) {
      throw new Error("Word key cannot be empty");
    }
    if (!hintKey || hintKey.trim().length === 0) {
      throw new Error("Hint key cannot be empty");
    }
    if (categoryIds.length === 0) {
      throw new Error("Word must belong to at least one category");
    }
    if (difficulty < 1 || difficulty > 3) {
      throw new Error("Word difficulty must be between 1 and 3");
    }
    this._id = id;
    this._wordKey = wordKey;
    this._hintKey = hintKey;
    this._categoryIds = categoryIds;
    this._difficulty = difficulty;
  }

  static create(
    id: string,
    wordKey: string,
    hintKey: string,
    categoryIds: readonly string[],
    difficulty: number
  ): Word {
    return new Word(id, wordKey, hintKey, categoryIds, difficulty);
  }

  getId(): string {
    return this._id;
  }

  getWordKey(): string {
    return this._wordKey;
  }

  getHintKey(): string {
    return this._hintKey;
  }

  getDifficulty(): number {
    return this._difficulty;
  }

  belongsToAnyCategory(categoryIds: string[]): boolean {
    return categoryIds.some((id) => this._categoryIds.includes(id));
  }
}
