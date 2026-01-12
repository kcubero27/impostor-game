import { Player } from "@/domain/player/player.entity";
import { Game } from "@/domain/game/game.aggregate";
import { RoleAssignmentService } from "@/domain/game/role-assignment.domain-service";
import { WordSelectionService } from "@/domain/game/word-selection.domain-service";

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

  startGame(
    players: Player[],
    impostorCount: number,
    selectedCategoryIds: string[] = [],
    difficulty: number | null = null
  ): Game {
    const gamePlayers = this.roleAssignmentService.assignRoles(
      players,
      impostorCount
    );

    const word = this.wordSelectionService.selectWord(
      selectedCategoryIds,
      difficulty
    );

    return Game.start(gamePlayers, word, impostorCount);
  }
}
