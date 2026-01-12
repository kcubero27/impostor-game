import { PlayerManagementService } from "./player-management.service";
import { GameManagementService } from "./game-management.service";
import { IdGeneratorAdapter } from "@/infrastructure/id-generator.adapter";
import { RoleAssignmentService } from "@/domain/game/role-assignment.domain-service";
import { WordSelectionService } from "@/domain/game/word-selection.domain-service";
import { WordRepository } from "@/infrastructure/repositories/word.repository";
import { WordMemoryAdapter } from "@/infrastructure/persistence/word-memory.adapter";

const idGenerator = new IdGeneratorAdapter();
const wordRepository = new WordRepository();
const wordMemory = new WordMemoryAdapter();

const roleAssignmentService = new RoleAssignmentService();
const wordSelectionService = new WordSelectionService(
  wordRepository,
  wordMemory
);

export const playerManagementService = new PlayerManagementService(idGenerator);

export const gameManagementService = new GameManagementService(
  roleAssignmentService,
  wordSelectionService
);
