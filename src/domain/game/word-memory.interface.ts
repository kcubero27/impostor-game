export interface IWordMemory {
  hasBeenUsed(wordId: string): boolean;

  markAsUsed(wordId: string): void;

  shouldReset(totalWords: number): boolean;

  reset(): void;
}
