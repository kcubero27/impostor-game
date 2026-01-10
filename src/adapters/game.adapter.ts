/**
 * Adapter Layer: Converts between game domain entities and legacy types
 */

import { Game } from '@/domain/game/game.aggregate'
import type { GameState as LegacyGameState, GamePlayer } from '@/types/game.types'
import type { Word } from '@/types/word.types'
import type { GameConfig } from '@/types/game-config.types'

export class GameAdapter {
  /**
   * Convert Game aggregate to legacy GameState for UI
   */
  static toGameStateDto(game: Game, config: GameConfig): LegacyGameState {
    const plainObject = game.toPlainObject()

    return {
      players: plainObject.players as unknown as readonly GamePlayer[],
      word: plainObject.word as unknown as Word,
      currentPlayerIndex: plainObject.currentPlayerIndex,
      isComplete: plainObject.isComplete,
      config,
    }
  }

  /**
   * Create a mutable game wrapper for UI interactions
   * This maintains the game instance and returns updated state
   */
  static createGameController(game: Game, config: GameConfig) {
    return {
      game,

      getState(): LegacyGameState {
        return GameAdapter.toGameStateDto(game, config)
      },

      markCurrentPlayerAsSeenRole(): void {
        game.markCurrentPlayerAsSeenRole()
      },

      moveToNextPlayer(): void {
        game.moveToNextPlayer()
      },

      getCurrentPlayer() {
        return game.currentPlayer
      },

      isComplete(): boolean {
        return game.isComplete
      },
    }
  }
}
