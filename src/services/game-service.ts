import { type Player, type GamePlayer, type GameState, DEFAULT_GAME_CONFIG, type Word, PLAYER_ROLES } from '@/types'
import { WORDS } from '@/data/words'
import { wordMemoryService } from './word-memory-service'

export interface IGameService {
  startGame(players: Player[]): GameState
  getRandomWord(): Word
  assignRoles(players: Player[]): GamePlayer[]
  markPlayerAsSeenRole(gameState: GameState, playerIndex: number): GameState
  goToNextPlayer(gameState: GameState): GameState
  resetWordHistory(): void
  getWordStats(): { usedCount: number; totalCount: number; remainingCount: number }
}

class GameService implements IGameService {
  /**
   * Randomly selects a word from the word database
   * Avoids words that have been recently used
   */
  getRandomWord(): Word {
    // Check if we should reset the history (80%+ of words used)
    if (wordMemoryService.shouldReset(WORDS.length)) {
      wordMemoryService.reset()
    }

    // Filter out words that have been used
    const availableWords = WORDS.filter((word) => !wordMemoryService.hasBeenUsed(word.id))

    // If no words are available (shouldn't happen due to auto-reset), use all words
    const wordsToChooseFrom = availableWords.length > 0 ? availableWords : WORDS

    // Select a random word
    const randomIndex = Math.floor(Math.random() * wordsToChooseFrom.length)
    const selectedWord = wordsToChooseFrom[randomIndex]

    // Mark this word as used
    wordMemoryService.markWordAsUsed(selectedWord.id)

    return selectedWord
  }

  /**
   * Manually resets the word history
   */
  resetWordHistory(): void {
    wordMemoryService.reset()
  }

  /**
   * Gets statistics about word usage
   */
  getWordStats() {
    const stats = wordMemoryService.getStats(WORDS.length)
    return {
      usedCount: stats.usedCount,
      totalCount: stats.totalCount,
      remainingCount: stats.remainingCount,
    }
  }

  /**
   * Assigns roles to players - one random impostor, rest are normal
   */
  assignRoles(players: Player[]): GamePlayer[] {
    if (players.length === 0) {
      return []
    }

    // Select a random player to be the impostor
    const impostorIndex = Math.floor(Math.random() * players.length)

    return players.map((player, index) => ({
      ...player,
      role: index === impostorIndex ? PLAYER_ROLES.IMPOSTOR : PLAYER_ROLES.NORMAL,
      hasSeenRole: false,
    }))
  }

  /**
   * Initializes a new game with assigned roles and a selected word
   */
  startGame(players: Player[]): GameState {
    const gamePlayers = this.assignRoles(players)
    const word = this.getRandomWord()

    return {
      players: gamePlayers,
      word,
      currentPlayerIndex: 0,
      isComplete: false,
      config: { ...DEFAULT_GAME_CONFIG }
    }
  }

  /**
   * Marks the current player as having seen their role
   */
  markPlayerAsSeenRole(gameState: GameState, playerIndex: number): GameState {
    const updatedPlayers = gameState.players.map((player, index) =>
      index === playerIndex ? { ...player, hasSeenRole: true } : player
    )

    return {
      ...gameState,
      players: updatedPlayers,
    }
  }

  /**
   * Moves to the next player in the sequence
   */
  goToNextPlayer(gameState: GameState): GameState {
    const nextIndex = gameState.currentPlayerIndex + 1
    const isComplete = nextIndex >= gameState.players.length

    return {
      ...gameState,
      currentPlayerIndex: nextIndex,
      isComplete,
    }
  }
}

export const gameService = new GameService()

