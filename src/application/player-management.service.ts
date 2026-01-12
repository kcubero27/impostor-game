import { Player } from "@/domain/player/player.entity";
import { PlayerCollection } from "@/domain/player/player-collection";
import type { IIdGenerator } from "@/domain/shared/id-generator.interface";

export class PlayerManagementService {
  readonly idGenerator: IIdGenerator;

  constructor(idGenerator: IIdGenerator) {
    this.idGenerator = idGenerator;
  }

  createPlayer(name: string = ""): Player {
    const id = this.idGenerator.generate();
    return Player.create(id, name);
  }

  removePlayer(players: Player[], playerId: string): Player[] {
    if (!PlayerCollection.canRemovePlayer(players)) {
      throw new Error("Cannot remove player. Minimum 3 players required.");
    }
    return players.filter((p) => p.getId() !== playerId);
  }

  updatePlayerName(
    players: Player[],
    playerId: string,
    newName: string
  ): Player[] {
    return players.map((player) => {
      if (player.getId() === playerId) {
        // Player.create already validates the name through PlayerName value object
        // This is the correct DDD approach for immutable collections
        return Player.create(player.getId(), newName);
      }
      return player;
    });
  }

  getReadyPlayersCount(players: Player[]): number {
    return PlayerCollection.getReadyPlayersCount(players);
  }
}
