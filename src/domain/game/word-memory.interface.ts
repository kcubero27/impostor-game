/**
 * IWordMemory Interface
 *
 * Domain interface for word memory/persistence (Dependency Inversion Principle).
 *
 * This interface belongs to the domain layer because it represents
 * a domain concept (remembering which words have been used).
 * Infrastructure implementations depend on this domain interface.
 *
 * This allows:
 * - Domain services to work with abstractions
 * - Infrastructure to implement these abstractions
 * - Easy swapping of implementations (localStorage, database, in-memory, etc.)
 */
export interface IWordMemory {
  /**
   * Checks if a word has been used
   */
  hasBeenUsed(wordId: string): boolean;

  /**
   * Marks a word as used
   */
  markAsUsed(wordId: string): void;

  /**
   * Checks if the memory should be reset (e.g., all words used)
   *
   * @param totalWords - Total number of words available
   */
  shouldReset(totalWords: number): boolean;

  /**
   * Resets the memory (clears all used words)
   */
  reset(): void;
}
