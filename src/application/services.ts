import { PlayerManagementService } from "./player-management.service";
import { CategoryManagementService } from "./category-management.service";
import { GameManagementService } from "./game-management.service";
import { IdGeneratorAdapter } from "@/infrastructure/id-generator.adapter";
import { RoleAssignmentService } from "@/domain/game/role-assignment.domain-service";
import { WordSelectionService } from "@/domain/game/word-selection.domain-service";
import { WordRepository } from "@/infrastructure/repositories/word.repository";
import { WordMemoryAdapter } from "@/infrastructure/persistence/word-memory.adapter";

/**
 * Service Configuration
 * 
 * Dependency Injection container for application services.
 * Wires all dependencies following Dependency Inversion Principle.
 */

// Infrastructure layer
const idGenerator = new IdGeneratorAdapter();
const wordRepository = new WordRepository();
const wordMemory = new WordMemoryAdapter();

// Domain services
const roleAssignmentService = new RoleAssignmentService();
const wordSelectionService = new WordSelectionService(
  wordRepository,
  wordMemory,
);

// Application services
export const playerManagementService = new PlayerManagementService(
  idGenerator,
);

export const categoryManagementService = new CategoryManagementService();

export const gameManagementService = new GameManagementService(
  roleAssignmentService,
  wordSelectionService,
);
