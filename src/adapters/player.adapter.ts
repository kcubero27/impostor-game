/**
 * Adapter Layer: Converts between domain entities and legacy types
 * Allows gradual migration from old types to new domain model
 */

import { Player as DomainPlayer } from '@/domain/player/player.entity'
import { type Player as LegacyPlayer } from '@/types/player.types'

export class PlayerAdapter {
  /**
   * Convert domain player to legacy type for UI compatibility
   */
  static toDto(player: DomainPlayer): LegacyPlayer {
    return player.toPlainObject()
  }

  /**
   * Convert legacy player to domain entity
   */
  static toDomain(dto: LegacyPlayer): DomainPlayer {
    return DomainPlayer.fromPersistence(dto.id, dto.name)
  }

  /**
   * Convert array of domain players to DTOs
   */
  static toDtoArray(players: DomainPlayer[]): LegacyPlayer[] {
    return players.map(p => this.toDto(p))
  }

  /**
   * Convert array of DTOs to domain players
   */
  static toDomainArray(dtos: LegacyPlayer[]): DomainPlayer[] {
    return dtos.map(dto => this.toDomain(dto))
  }
}
