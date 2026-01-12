import { Player } from "@/domain/player/player.entity";
import { GamePlayer } from "./game-player.entity";
import { GameConfiguration } from "./game-configuration.value-object";

export class RoleAssignmentService {
  getMaxImpostorsForPlayerCount(playerCount: number): number {
    if (playerCount < GameConfiguration.MIN_PLAYERS) {
      return GameConfiguration.MIN_IMPOSTORS;
    }

    const maxByRatio = Math.floor(
      playerCount * GameConfiguration.MAX_IMPOSTOR_RATIO
    );
    const maxAllowed = Math.min(maxByRatio, GameConfiguration.MAX_IMPOSTORS);

    return Math.max(maxAllowed, GameConfiguration.MIN_IMPOSTORS);
  }

  isValidImpostorCount(impostorCount: number, playerCount: number): boolean {
    if (impostorCount < GameConfiguration.MIN_IMPOSTORS) {
      return false;
    }
    if (impostorCount > GameConfiguration.MAX_IMPOSTORS) {
      return false;
    }
    const maxAllowed = this.getMaxImpostorsForPlayerCount(playerCount);
    return impostorCount <= maxAllowed;
  }

  assignRoles(players: Player[], impostorCount: number): GamePlayer[] {
    if (players.length < GameConfiguration.MIN_PLAYERS) {
      throw new Error(
        `Cannot assign roles to less than ${GameConfiguration.MIN_PLAYERS} players`
      );
    }

    if (!this.isValidImpostorCount(impostorCount, players.length)) {
      const maxAllowed = this.getMaxImpostorsForPlayerCount(players.length);
      throw new Error(
        `Invalid impostor count: ${impostorCount}. Maximum allowed for ${players.length} players is ${maxAllowed}`
      );
    }

    const shuffledPlayers = [...players];
    this.shuffleArray(shuffledPlayers);

    const impostorIndices = this.selectRandomIndices(
      shuffledPlayers.length,
      impostorCount
    );

    const gamePlayers: GamePlayer[] = shuffledPlayers.map((player, index) => {
      if (impostorIndices.has(index)) {
        return GamePlayer.createImpostor(player);
      }
      return GamePlayer.createNormal(player);
    });

    return gamePlayers;
  }

  private selectRandomIndices(maxIndex: number, count: number): Set<number> {
    const indices = new Set<number>();
    const availableIndices = Array.from({ length: maxIndex }, (_, i) => i);

    this.shuffleArray(availableIndices);

    for (let i = 0; i < count && i < availableIndices.length; i++) {
      indices.add(availableIndices[i]);
    }

    return indices;
  }

  private shuffleArray<T>(array: T[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
}
