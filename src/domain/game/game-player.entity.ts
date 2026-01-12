import { Player } from "@/domain/player/player.entity";

export type PlayerRole = "impostor" | "normal";

export class GamePlayer {
  private readonly _player: Player;
  private readonly _role: PlayerRole;
  private readonly _hasSeenRole: boolean;

  private constructor(
    player: Player,
    role: PlayerRole,
    hasSeenRole: boolean = false
  ) {
    this._player = player;
    this._role = role;
    this._hasSeenRole = hasSeenRole;
  }

  static createNormal(player: Player): GamePlayer {
    return new GamePlayer(player, "normal", false);
  }

  static createImpostor(player: Player): GamePlayer {
    return new GamePlayer(player, "impostor", false);
  }

  getId(): string {
    return this._player.getId();
  }

  getName(): string {
    return this._player.getName();
  }

  isImpostor(): boolean {
    return this._role === "impostor";
  }

  isNormal(): boolean {
    return this._role === "normal";
  }

  hasSeenRole(): boolean {
    return this._hasSeenRole;
  }

  markRoleAsSeen(): GamePlayer {
    return new GamePlayer(this._player, this._role, true);
  }
}
