export interface GameConfig {
  readonly showHint: boolean
  readonly selectedCategoryIds: readonly string[]
}

export const DEFAULT_GAME_CONFIG: GameConfig = {
  showHint: false,
  selectedCategoryIds: [], // Empty means all categories
}
