import { Player } from "@/domain/player/player.entity";
import { GamePlayer } from "@/domain/game/game-player.entity";
import { Game } from "@/domain/game/game.aggregate";
import { RoleAssignmentService } from "@/domain/game/role-assignment.domain-service";
import { WordSelectionService } from "@/domain/game/word-selection.domain-service";

/**
 * GameManagementService
 *
 * Application service that orchestrates game-related use cases.
 * Coordinates domain services to manage game state.
 *
 * Follows Dependency Inversion Principle by depending on abstractions.
 */
export class GameManagementService {
  private readonly roleAssignmentService: RoleAssignmentService;
  private readonly wordSelectionService: WordSelectionService;

  constructor(
    roleAssignmentService: RoleAssignmentService,
    wordSelectionService: WordSelectionService
  ) {
    this.roleAssignmentService = roleAssignmentService;
    this.wordSelectionService = wordSelectionService;
  }

  /**
   * Assigns roles to players for a new game
   *
   * @param players - Array of players to assign roles to
   * @param impostorCount - Number of impostors to assign
   * @returns Array of GamePlayers with assigned roles
   */
  assignRolesToPlayers(players: Player[], impostorCount: number): GamePlayer[] {
    return this.roleAssignmentService.assignRoles(players, impostorCount);
  }

  /**
   * Starts a new game
   *
   * @param players - Array of players to start the game with
   * @param impostorCount - Number of impostors for this game
   * @param selectedCategoryIds - Array of selected category IDs (empty = all categories)
   * @param difficulty - Difficulty level (1-3) or null for all difficulties
   * @returns New Game instance
   */
  startGame(
    players: Player[],
    impostorCount: number,
    selectedCategoryIds: string[] = [],
    difficulty: number | null = null
  ): Game {
    // Assign roles to players
    const gamePlayers = this.roleAssignmentService.assignRoles(
      players,
      impostorCount
    );

    // Select a word for the game
    const word = this.wordSelectionService.selectWord(
      selectedCategoryIds,
      difficulty
    );

    // Create and return the game aggregate
    return Game.start(gamePlayers, word, impostorCount);
  }
}
