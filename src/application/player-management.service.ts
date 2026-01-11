import { Player } from "@/domain/player/player.entity";
import { PlayerCollection } from "@/domain/player/player-collection";
import type { IIdGenerator } from "@/domain/shared/id-generator.interface";

/**
 * PlayerManagementService
 *
 * Application service that orchestrates player management use cases.
 * Depends on domain entities and services.
 */
export class PlayerManagementService {
  readonly idGenerator: IIdGenerator;

  constructor(idGenerator: IIdGenerator) {
    this.idGenerator = idGenerator;
  }

  /**
   * Creates a new player with a generated ID
   */
  createPlayer(name: string = ""): Player {
    const id = this.idGenerator.generate("player");
    return Player.create(id, name);
  }

  /**
   * Adds a new player to the collection
   */
  addPlayer(players: Player[]): Player[] {
    const newPlayer = this.createPlayer();
    return [...players, newPlayer];
  }

  /**
   * Removes a player from the collection
   * Ensures minimum players requirement
   */
  removePlayer(players: Player[], playerId: string): Player[] {
    if (!PlayerCollection.canRemovePlayer(players)) {
      throw new Error("Cannot remove player. Minimum 3 players required.");
    }
    return players.filter((p) => p.getId() !== playerId);
  }

  /**
   * Updates a player's name
   */
  updatePlayerName(
    players: Player[],
    playerId: string,
    newName: string
  ): Player[] {
    return players.map((player) => {
      if (player.getId() === playerId) {
        const updatedPlayer = Player.create(player.getId(), newName);
        return updatedPlayer;
      }
      return player;
    });
  }

  /**
   * Gets the count of ready players (players with valid names)
   */
  getReadyPlayersCount(players: Player[]): number {
    return PlayerCollection.getReadyPlayersCount(players);
  }

  /**
   * Validates the player collection
   */
  validatePlayers(players: Player[]): string[] {
    return PlayerCollection.validate(players);
  }

  /**
   * Checks if players are ready to start a game
   */
  arePlayersReady(players: Player[]): boolean {
    return PlayerCollection.isReady(players);
  }
}
