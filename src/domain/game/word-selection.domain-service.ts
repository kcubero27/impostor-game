import { Word } from "./word.entity";
import type { IWordRepository } from "./word-repository.interface";
import type { IWordMemory } from "./word-memory.interface";

export class WordSelectionService {
  private readonly wordRepository: IWordRepository;
  private readonly wordMemory: IWordMemory;

  constructor(wordRepository: IWordRepository, wordMemory: IWordMemory) {
    this.wordRepository = wordRepository;
    this.wordMemory = wordMemory;
  }

  selectWord(
    selectedCategoryIds: string[] = [],
    difficulty: number | null = null
  ): Word {
    const usedWordIds = this.getUsedWordIds();
    const availableWords =
      this.wordRepository.getWordsByCategoriesAndDifficulty(
        selectedCategoryIds,
        usedWordIds,
        difficulty
      );

    if (availableWords.length === 0) {
      const allWords = this.wordRepository.getAllWords();
      if (this.wordMemory.shouldReset(allWords.length)) {
        this.wordMemory.reset();
        const resetAvailableWords =
          this.wordRepository.getWordsByCategoriesAndDifficulty(
            selectedCategoryIds,
            new Set<string>(),
            difficulty
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

  private selectRandomWord(words: Word[]): Word {
    if (words.length === 0) {
      throw new Error("Cannot select from empty word list");
    }
    const randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex];
  }
}
