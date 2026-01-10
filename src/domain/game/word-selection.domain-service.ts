import { Word } from './word.entity'

/**
 * Interface for word repository
 * Domain service depends on abstraction, not implementation (DIP)
 */
export interface IWordRepository {
  getAllWords(): Word[]
  getAvailableWords(usedWordIds: Set<string>): Word[]
  getWordsByCategories(categoryIds: string[]): Word[]
}

/**
 * Interface for word memory
 */
export interface IWordMemory {
  hasBeenUsed(wordId: string): boolean
  markAsUsed(wordId: string): void
  shouldReset(totalWords: number): boolean
  reset(): void
}

/**
 * Domain Service: WordSelectionService
 * Responsible for selecting words based on domain rules
 */
export class WordSelectionService {
  private readonly wordRepository: IWordRepository
  private readonly wordMemory: IWordMemory

  constructor(wordRepository: IWordRepository, wordMemory: IWordMemory) {
    this.wordRepository = wordRepository
    this.wordMemory = wordMemory
  }

  /**
   * Select a random word that hasn't been used recently
   * @param categoryIds Optional array of category IDs to filter by (empty means all categories)
   */
  selectWord(categoryIds: string[] = []): Word {
    // Get words filtered by categories if specified
    let allWords = this.wordRepository.getAllWords()

    if (categoryIds.length > 0) {
      allWords = this.wordRepository.getWordsByCategories(categoryIds)
    }

    if (allWords.length === 0) {
      throw new Error('No words available in repository for the selected categories')
    }

    // Check if we should reset the history
    if (this.wordMemory.shouldReset(allWords.length)) {
      this.wordMemory.reset()
    }

    // Get words that haven't been used
    const usedWordIds = this.getUsedWordIds(allWords)
    const availableWords = this.wordRepository.getAvailableWords(usedWordIds)

    // Filter available words by categories if specified
    let filteredAvailableWords = availableWords
    if (categoryIds.length > 0) {
      filteredAvailableWords = availableWords.filter(word =>
        word.categoryIds.some(catId => categoryIds.includes(catId))
      )
    }

    // If no words are available, use all words (filtered by categories)
    const wordsToChooseFrom = filteredAvailableWords.length > 0 ? filteredAvailableWords : allWords

    // Select a random word
    const selectedWord = this.selectRandomWord(wordsToChooseFrom)

    // Mark as used
    this.wordMemory.markAsUsed(selectedWord.id)

    return selectedWord
  }

  /**
   * Select a random word from a list
   */
  private selectRandomWord(words: Word[]): Word {
    const randomIndex = Math.floor(Math.random() * words.length)
    return words[randomIndex]
  }

  /**
   * Get set of used word IDs
   */
  private getUsedWordIds(allWords: Word[]): Set<string> {
    const usedIds = new Set<string>()
    for (const word of allWords) {
      if (this.wordMemory.hasBeenUsed(word.id)) {
        usedIds.add(word.id)
      }
    }
    return usedIds
  }
}
