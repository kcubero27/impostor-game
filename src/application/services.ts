/**
 * Service Configuration and Dependency Injection
 * This file wires up all the services with their dependencies
 */

import { PlayerManagementService } from './player-management.service'
import { GameManagementService } from './game-management.service'
import { RoleAssignmentService } from '@/domain/game/role-assignment.domain-service'
import { WordSelectionService } from '@/domain/game/word-selection.domain-service'
import { idGeneratorAdapter } from '@/infrastructure/id-generator.adapter'
import { wordRepository } from '@/infrastructure/repositories/word.repository'
import { wordMemoryAdapter } from '@/infrastructure/persistence/word-memory.adapter'
import { PLAYER_CONSTANTS } from '@/constants'

// Domain Services (no dependencies on infrastructure)
const roleAssignmentService = new RoleAssignmentService()

// Infrastructure-dependent Domain Service
const wordSelectionService = new WordSelectionService(
  wordRepository,
  wordMemoryAdapter
)

// Application Services
export const playerManagementService = new PlayerManagementService(
  idGeneratorAdapter,
  PLAYER_CONSTANTS.MIN_PLAYERS
)

export const gameManagementService = new GameManagementService(
  roleAssignmentService,
  wordSelectionService
)

// Export for backwards compatibility and utility access
export { wordMemoryAdapter, wordRepository, idGeneratorAdapter }
