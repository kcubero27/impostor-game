import { Player } from "@/domain/player/player.entity";

export type PlayerDto = {
  id: string;
  name: string;
};

export class PlayerAdapter {
  static toDto(player: Player): PlayerDto {
    return {
      id: player.getId(),
      name: player.getName(),
    };
  }

  static toDtoArray(players: Player[]): PlayerDto[] {
    return players.map((player) => PlayerAdapter.toDto(player));
  }

  static toDomain(dto: PlayerDto): Player {
    return Player.create(dto.id, dto.name);
  }
}
