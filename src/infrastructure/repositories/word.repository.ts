import { Word } from "@/domain/game/word.entity";
import type { IWordRepository } from "@/domain/game/word-repository.interface";
import { WORDS } from "@/data/words";
import { type Word as WordData } from "@/data/types";

/**
 * WordRepository
 *
 * Infrastructure implementation of word data access.
 * Converts data layer Word types to domain Word entities.
 */
export class WordRepository implements IWordRepository {
  private readonly words: Word[];

  constructor() {
    this.words = WORDS.map((wordData: WordData) =>
      Word.create(
        wordData.id,
        wordData.wordKey,
        wordData.hintKey,
        wordData.categoryIds,
        wordData.difficulty
      )
    );
  }

  getAllWords(): Word[] {
    return [...this.words];
  }

  getAvailableWords(usedWordIds: Set<string>): Word[] {
    return this.words.filter((word) => !usedWordIds.has(word.getId()));
  }

  getWordsByCategories(
    selectedCategoryIds: string[],
    usedWordIds: Set<string>
  ): Word[] {
    // If no categories selected, return all available words
    if (selectedCategoryIds.length === 0) {
      return this.getAvailableWords(usedWordIds);
    }

    return this.words.filter(
      (word) =>
        !usedWordIds.has(word.getId()) &&
        word.belongsToAnyCategory(selectedCategoryIds)
    );
  }

  getWordsByCategoriesAndDifficulty(
    selectedCategoryIds: string[],
    usedWordIds: Set<string>,
    difficulty: number | null
  ): Word[] {
    // If no categories selected, return all available words
    if (selectedCategoryIds.length === 0) {
      return this.words.filter(
        (word) =>
          !usedWordIds.has(word.getId()) &&
          (difficulty === null || word.getDifficulty() === difficulty)
      );
    }

    return this.words.filter(
      (word) =>
        !usedWordIds.has(word.getId()) &&
        word.belongsToAnyCategory(selectedCategoryIds) &&
        (difficulty === null || word.getDifficulty() === difficulty)
    );
  }
}
