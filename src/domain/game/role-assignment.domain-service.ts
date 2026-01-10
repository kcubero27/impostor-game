import { Player } from '../player/player.entity'
import { GamePlayer, PlayerRole } from './game-player.entity'

/**
 * Domain Service: RoleAssignmentService
 * Responsible for assigning roles to players
 * Pure domain logic - no infrastructure dependencies
 */
export class RoleAssignmentService {
  /**
   * Assign roles to players - one random impostor, rest are normal
   */
  assignRoles(players: Player[]): GamePlayer[] {
    if (players.length === 0) {
      return []
    }

    if (players.length < 2) {
      throw new Error('Cannot assign roles to less than 2 players')
    }

    // Select a random player to be the impostor
    const impostorIndex = Math.floor(Math.random() * players.length)

    return players.map((player, index) => {
      const role = index === impostorIndex ? PlayerRole.IMPOSTOR : PlayerRole.NORMAL
      return GamePlayer.fromPlayer(player, role)
    })
  }

  /**
   * Assign a specific player as impostor
   */
  assignImpostor(players: Player[], impostorId: string): GamePlayer[] {
    if (players.length === 0) {
      return []
    }

    const impostorExists = players.some(p => p.id === impostorId)
    if (!impostorExists) {
      throw new Error('Impostor player not found in players list')
    }

    return players.map(player => {
      const role = player.id === impostorId ? PlayerRole.IMPOSTOR : PlayerRole.NORMAL
      return GamePlayer.fromPlayer(player, role)
    })
  }
}
