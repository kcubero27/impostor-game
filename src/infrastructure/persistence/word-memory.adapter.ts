import type { IWordMemory } from '@/domain/game/word-selection.domain-service'

const STORAGE_KEY = 'impostor-game-used-words'
const RESET_THRESHOLD = 0.8 // Reset when 80% of words have been used

/**
 * Infrastructure: WordMemoryAdapter
 * Implements word memory using localStorage
 */
export class WordMemoryAdapter implements IWordMemory {
  private usedWordIds: Set<string>

  constructor() {
    this.usedWordIds = this.loadFromStorage()
  }

  hasBeenUsed(wordId: string): boolean {
    return this.usedWordIds.has(wordId)
  }

  markAsUsed(wordId: string): void {
    this.usedWordIds.add(wordId)
    this.saveToStorage()
  }

  shouldReset(totalWords: number): boolean {
    if (totalWords === 0) return false
    const usagePercentage = this.usedWordIds.size / totalWords
    return usagePercentage >= RESET_THRESHOLD
  }

  reset(): void {
    this.usedWordIds.clear()
    this.saveToStorage()
  }

  getUsageStats(totalWords: number) {
    return {
      usedCount: this.usedWordIds.size,
      totalCount: totalWords,
      remainingCount: totalWords - this.usedWordIds.size,
      usagePercentage: totalWords === 0 ? 0 : this.usedWordIds.size / totalWords,
      shouldReset: this.shouldReset(totalWords),
    }
  }

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

  private saveToStorage(): void {
    try {
      const array = Array.from(this.usedWordIds)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(array))
    } catch (error) {
      console.warn('Failed to save word history to storage:', error)
    }
  }
}

// Singleton instance
export const wordMemoryAdapter = new WordMemoryAdapter()
