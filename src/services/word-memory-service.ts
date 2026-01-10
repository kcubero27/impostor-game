/**
 * Service to manage word history and prevent repetition
 * Stores used word IDs in localStorage for persistence across sessions
 */

const STORAGE_KEY = 'impostor-game-used-words'
const RESET_THRESHOLD = 0.8 // Reset when 80% of words have been used

export interface IWordMemoryService {
  markWordAsUsed(wordId: string): void
  hasBeenUsed(wordId: string): boolean
  getUsedWordIds(): Set<string>
  shouldReset(totalWords: number): boolean
  reset(): void
  getUsagePercentage(totalWords: number): number
}

class WordMemoryService implements IWordMemoryService {
  private usedWordIds: Set<string>

  constructor() {
    this.usedWordIds = this.loadFromStorage()
  }

  /**
   * Loads used word IDs from localStorage
   */
  private loadFromStorage(): Set<string> {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        return new Set(Array.isArray(parsed) ? parsed : [])
      }
    } catch (error) {
      console.warn('Failed to load word history from storage:', error)
    }
    return new Set()
  }

  /**
   * Saves used word IDs to localStorage
   */
  private saveToStorage(): void {
    try {
      const array = Array.from(this.usedWordIds)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(array))
    } catch (error) {
      console.warn('Failed to save word history to storage:', error)
    }
  }

  /**
   * Marks a word as used
   */
  markWordAsUsed(wordId: string): void {
    this.usedWordIds.add(wordId)
    this.saveToStorage()
  }

  /**
   * Checks if a word has been used before
   */
  hasBeenUsed(wordId: string): boolean {
    return this.usedWordIds.has(wordId)
  }

  /**
   * Gets all used word IDs
   */
  getUsedWordIds(): Set<string> {
    return new Set(this.usedWordIds)
  }

  /**
   * Checks if the history should be reset based on threshold
   */
  shouldReset(totalWords: number): boolean {
    const usagePercentage = this.getUsagePercentage(totalWords)
    return usagePercentage >= RESET_THRESHOLD
  }

  /**
   * Gets the percentage of words that have been used
   */
  getUsagePercentage(totalWords: number): number {
    if (totalWords === 0) return 0
    return this.usedWordIds.size / totalWords
  }

  /**
   * Resets the word history
   */
  reset(): void {
    this.usedWordIds.clear()
    this.saveToStorage()
  }

  /**
   * Gets statistics about word usage
   */
  getStats(totalWords: number) {
    return {
      usedCount: this.usedWordIds.size,
      totalCount: totalWords,
      remainingCount: totalWords - this.usedWordIds.size,
      usagePercentage: this.getUsagePercentage(totalWords),
      shouldReset: this.shouldReset(totalWords),
    }
  }
}

export const wordMemoryService = new WordMemoryService()

