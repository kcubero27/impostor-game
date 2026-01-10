import { Player } from '@/domain/player/player.entity'
import { Game } from '@/domain/game/game.aggregate'
import { RoleAssignmentService } from '@/domain/game/role-assignment.domain-service'
import { WordSelectionService } from '@/domain/game/word-selection.domain-service'
import { type GameConfig } from '@/types/game-config.types'

/**
 * Application Service: GameManagementService
 * Orchestrates game-related use cases
 */
export class GameManagementService {
  private readonly roleAssignmentService: RoleAssignmentService
  private readonly wordSelectionService: WordSelectionService

  constructor(
    roleAssignmentService: RoleAssignmentService,
    wordSelectionService: WordSelectionService
  ) {
    this.roleAssignmentService = roleAssignmentService
    this.wordSelectionService = wordSelectionService
  }

  /**
   * Start a new game
   */
  startGame(players: Player[], config: GameConfig): Game {
    if (players.length < 2) {
      throw new Error('Cannot start game with less than 2 players')
    }

    // Use domain services to prepare the game
    const gamePlayers = this.roleAssignmentService.assignRoles(players)
    const word = this.wordSelectionService.selectWord(config.selectedCategoryIds as string[])

    // Create the game aggregate
    return Game.start(gamePlayers, word)
  }

  /**
   * Reveal role to current player
   */
  revealRoleToCurrentPlayer(game: Game): void {
    game.markCurrentPlayerAsSeenRole()
  }

  /**
   * Move to next player
   */
  moveToNextPlayer(game: Game): void {
    game.moveToNextPlayer()
  }

  /**
   * Check if game is complete
   */
  isGameComplete(game: Game): boolean {
    return game.isComplete
  }

  /**
   * Restart game with same players and config
   */
  restartGame(game: Game, config: GameConfig): Game {
    const players = game.players.map(gp => gp.basePlayer)
    return this.startGame(players, config)
  }
}
