import { Player } from "./player.entity";

export class PlayerCollection {
  private static readonly MIN_PLAYERS = 3;

  static hasMinimumPlayers(players: Player[]): boolean {
    return players.length >= PlayerCollection.MIN_PLAYERS;
  }

  static canRemovePlayer(players: Player[]): boolean {
    return players.length > PlayerCollection.MIN_PLAYERS;
  }

  static allPlayersHaveValidNames(players: Player[]): boolean {
    return players.every((player) => player.hasValidName());
  }

  static allNamesAreUnique(players: Player[]): boolean {
    const names = players
      .filter((p) => p.hasValidName())
      .map((p) => p.getName().toLowerCase());

    return new Set(names).size === names.length;
  }

  static getReadyPlayersCount(players: Player[]): number {
    return players.filter((p) => p.hasValidName()).length;
  }

  static hasDuplicateName(
    players: Player[],
    playerId: string,
    playerName: string
  ): boolean {
    const normalizedName = playerName.toLowerCase().trim();
    if (!normalizedName) return false;

    return players.some(
      (p) =>
        p.getId() !== playerId &&
        p.hasValidName() &&
        p.getName().toLowerCase() === normalizedName
    );
  }
}
