import { Player } from '../player/player.entity'

export const PlayerRole = {
  IMPOSTOR: 'impostor' as const,
  NORMAL: 'normal' as const,
}

export type PlayerRole = typeof PlayerRole[keyof typeof PlayerRole]

/**
 * Domain Entity: GamePlayer
 * Represents a player in the context of an active game
 */
export class GamePlayer {
  private readonly _basePlayer: Player
  private readonly _role: PlayerRole
  private _hasSeenRole: boolean

  private constructor(basePlayer: Player, role: PlayerRole, hasSeenRole: boolean) {
    this._basePlayer = basePlayer
    this._role = role
    this._hasSeenRole = hasSeenRole
  }

  static createImpostor(player: Player): GamePlayer {
    return new GamePlayer(player, 'impostor', false)
  }

  static createNormal(player: Player): GamePlayer {
    return new GamePlayer(player, 'normal', false)
  }

  static fromPlayer(player: Player, role: PlayerRole): GamePlayer {
    return new GamePlayer(player, role, false)
  }

  get id(): string {
    return this._basePlayer.id
  }

  get name(): string {
    return this._basePlayer.name
  }

  get role(): PlayerRole {
    return this._role
  }

  get hasSeenRole(): boolean {
    return this._hasSeenRole
  }

  get isImpostor(): boolean {
    return this._role === 'impostor'
  }

  get basePlayer(): Player {
    return this._basePlayer
  }

  /**
   * Mark that this player has seen their role
   */
  markAsSeenRole(): void {
    this._hasSeenRole = true
  }

  /**
   * Convert to plain object
   */
  toPlainObject(): {
    id: string
    name: string
    role: string
    hasSeenRole: boolean
  } {
    return {
      id: this.id,
      name: this.name,
      role: this._role,
      hasSeenRole: this._hasSeenRole,
    }
  }
}
