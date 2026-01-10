import { Word, type Difficulty } from '@/domain/game/word.entity'
import type { IWordRepository } from '@/domain/game/word-selection.domain-service'
import { WORDS as WORDS_DATA } from '@/data/words'

/**
 * Infrastructure: WordRepository
 * Implements data access for words
 */
export class WordRepository implements IWordRepository {
  private readonly words: Word[]

  constructor() {
    // Convert data to domain entities
    this.words = WORDS_DATA.map(w =>
      Word.create(
        w.id,
        w.wordKey,
        w.hintKey,
        w.categoryIds,
        w.difficulty as Difficulty
      )
    )
  }

  getAllWords(): Word[] {
    return [...this.words]
  }

  getAvailableWords(usedWordIds: Set<string>): Word[] {
    return this.words.filter(word => !usedWordIds.has(word.id))
  }

  getWordById(id: string): Word | undefined {
    return this.words.find(word => word.id === id)
  }

  getWordsByCategory(categoryId: string): Word[] {
    return this.words.filter(word => word.belongsToCategory(categoryId))
  }

  getWordsByCategories(categoryIds: string[]): Word[] {
    if (categoryIds.length === 0) {
      return [...this.words]
    }
    return this.words.filter(word =>
      word.categoryIds.some(catId => categoryIds.includes(catId))
    )
  }

  getWordsByDifficulty(difficulty: Difficulty): Word[] {
    return this.words.filter(word => word.hasDifficulty(difficulty))
  }
}

// Singleton instance
export const wordRepository = new WordRepository()
