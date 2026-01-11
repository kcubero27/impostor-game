export interface Category {
  readonly id: string;
  readonly nameKey: string;
  readonly emoji: string;
}

export interface Word {
  readonly id: string;
  readonly wordKey: string;
  readonly hintKey: string;
  readonly categoryIds: readonly string[];
  readonly difficulty: number;
}
