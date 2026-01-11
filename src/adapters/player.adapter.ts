import { Player } from "@/domain/player/player.entity";

/**
 * Player DTO for UI layer
 */
export type PlayerDto = {
  id: string;
  name: string;
};

/**
 * PlayerAdapter
 *
 * Converts between Domain entities and DTOs.
 * Adapter layer responsibility.
 */
export class PlayerAdapter {
  /**
   * Converts a Player entity to a DTO
   */
  static toDto(player: Player): PlayerDto {
    return {
      id: player.getId(),
      name: player.getName(),
    };
  }

  /**
   * Converts an array of Player entities to DTOs
   */
  static toDtoArray(players: Player[]): PlayerDto[] {
    return players.map((player) => PlayerAdapter.toDto(player));
  }

  /**
   * Converts a DTO to a Player entity
   */
  static toDomain(dto: PlayerDto): Player {
    return Player.create(dto.id, dto.name);
  }

  /**
   * Converts an array of DTOs to Player entities
   */
  static toDomainArray(dtos: PlayerDto[]): Player[] {
    return dtos.map((dto) => PlayerAdapter.toDomain(dto));
  }
}
