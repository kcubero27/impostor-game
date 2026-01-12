import type { IWordMemory } from "@/domain/game/word-memory.interface";

export class WordMemoryAdapter implements IWordMemory {
  private static readonly STORAGE_KEY = "impostor-game-used-words";

  hasBeenUsed(wordId: string): boolean {
    const usedWords = this.getUsedWords();
    return usedWords.has(wordId);
  }

  markAsUsed(wordId: string): void {
    const usedWords = this.getUsedWords();
    usedWords.add(wordId);
    this.saveUsedWords(usedWords);
  }

  shouldReset(totalWords: number): boolean {
    const usedWords = this.getUsedWords();
    return usedWords.size >= totalWords;
  }

  reset(): void {
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.removeItem(WordMemoryAdapter.STORAGE_KEY);
    }
  }

  private getUsedWords(): Set<string> {
    if (typeof window === "undefined" || !window.localStorage) {
      return new Set<string>();
    }

    try {
      const stored = localStorage.getItem(WordMemoryAdapter.STORAGE_KEY);
      if (!stored) {
        return new Set<string>();
      }
      const wordIds = JSON.parse(stored) as string[];
      return new Set(wordIds);
    } catch {
      return new Set<string>();
    }
  }

  private saveUsedWords(usedWords: Set<string>): void {
    if (typeof window !== "undefined" && window.localStorage) {
      try {
        const wordIds = Array.from(usedWords);
        localStorage.setItem(
          WordMemoryAdapter.STORAGE_KEY,
          JSON.stringify(wordIds)
        );
      } catch {
        // Ignore localStorage errors (e.g., quota exceeded)
      }
    }
  }
}
