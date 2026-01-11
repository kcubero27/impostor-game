import { Word } from "./word.entity";

/**
 * IWordRepository Interface
 * 
 * Domain interface for word data access (Dependency Inversion Principle).
 * 
 * This interface belongs to the domain layer because it represents
 * a domain concept (accessing words). Infrastructure implementations
 * depend on this domain interface, not vice versa.
 * 
 * This allows:
 * - Domain services to work with abstractions
 * - Infrastructure to implement these abstractions
 * - Easy swapping of implementations (in-memory, database, API, etc.)
 */
export interface IWordRepository {
  /**
   * Gets all words in the repository
   */
  getAllWords(): Word[];

  /**
   * Gets available words that haven't been used yet
   * 
   * @param usedWordIds - Set of word IDs that have already been used
   */
  getAvailableWords(usedWordIds: Set<string>): Word[];

  /**
   * Gets words filtered by selected categories
   * 
   * @param selectedCategoryIds - Array of selected category IDs
   * @param usedWordIds - Set of word IDs that have already been used
   */
  getWordsByCategories(
    selectedCategoryIds: string[],
    usedWordIds: Set<string>,
  ): Word[];

  /**
   * Gets words filtered by selected categories and difficulty
   * 
   * @param selectedCategoryIds - Array of selected category IDs
   * @param usedWordIds - Set of word IDs that have already been used
   * @param difficulty - Difficulty level (1-3) or null for all difficulties
   */
  getWordsByCategoriesAndDifficulty(
    selectedCategoryIds: string[],
    usedWordIds: Set<string>,
    difficulty: number | null,
  ): Word[];
}
