import { Word } from "./word.entity";
import type { IWordRepository } from "./word-repository.interface";
import type { IWordMemory } from "./word-memory.interface";

/**
 * WordSelectionService
 * 
 * Domain service responsible for selecting words for games.
 * This is a pure domain service that depends on abstractions (DIP).
 * 
 * Business Rules:
 * - Selects words from available pool (not yet used)
 * - Filters by selected categories
 * - Tracks used words to avoid repetition
 * - Resets memory when all words are used
 */
export class WordSelectionService {
  constructor(
    private readonly wordRepository: IWordRepository,
    private readonly wordMemory: IWordMemory,
  ) {}

  /**
   * Selects a random word for the game
   * 
   * @param selectedCategoryIds - Array of selected category IDs (empty = all categories)
   * @param difficulty - Difficulty level (1-3) or null for all difficulties
   * @returns Selected word
   * @throws Error if no words are available
   */
  selectWord(selectedCategoryIds: string[] = [], difficulty: number | null = null): Word {
    const usedWordIds = this.getUsedWordIds();
    const availableWords = this.wordRepository.getWordsByCategoriesAndDifficulty(
      selectedCategoryIds,
      usedWordIds,
      difficulty,
    );

    if (availableWords.length === 0) {
      // Check if we should reset memory
      const allWords = this.wordRepository.getAllWords();
      if (this.wordMemory.shouldReset(allWords.length)) {
        this.wordMemory.reset();
        // Try again after reset
        const resetAvailableWords = this.wordRepository.getWordsByCategoriesAndDifficulty(
          selectedCategoryIds,
          new Set<string>(),
          difficulty,
        );
        if (resetAvailableWords.length === 0) {
          throw new Error("No words available in selected categories");
        }
        const selectedWord = this.selectRandomWord(resetAvailableWords);
        this.wordMemory.markAsUsed(selectedWord.getId());
        return selectedWord;
      }
      throw new Error("No words available in selected categories");
    }

    const selectedWord = this.selectRandomWord(availableWords);
    this.wordMemory.markAsUsed(selectedWord.getId());
    return selectedWord;
  }

  /**
   * Gets the set of used word IDs
   */
  private getUsedWordIds(): Set<string> {
    const allWords = this.wordRepository.getAllWords();
    const usedIds = new Set<string>();
    
    allWords.forEach((word) => {
      if (this.wordMemory.hasBeenUsed(word.getId())) {
        usedIds.add(word.getId());
      }
    });

    return usedIds;
  }

  /**
   * Selects a random word from the available words
   */
  private selectRandomWord(words: Word[]): Word {
    if (words.length === 0) {
      throw new Error("Cannot select from empty word list");
    }
    const randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex];
  }
}
