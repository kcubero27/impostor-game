export type Difficulty = 1 | 2 | 3 // 1: low, 2: medium, 3: high

export interface Category {
  readonly id: string
  readonly nameKey: string // i18n key for the category name
}

export interface Word {
  readonly id: string
  readonly wordKey: string // i18n key for the actual word
  readonly hintKey: string // i18n key for the hint (shown to impostors)
  readonly categoryIds: readonly string[] // can belong to multiple categories
  readonly difficulty: Difficulty
}

