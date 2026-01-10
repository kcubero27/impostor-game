import { type Player } from './player.types'
import { type Word } from './word.types'
import { type GameConfig } from './game-config.types'

export const PLAYER_ROLES = {
  IMPOSTOR: 'impostor',
  NORMAL: 'normal',
} as const

export type PlayerRole = typeof PLAYER_ROLES[keyof typeof PLAYER_ROLES]

export interface GamePlayer extends Player {
  role: PlayerRole
  hasSeenRole: boolean
}

export interface GameState {
  readonly players: readonly GamePlayer[]
  readonly word: Word | null
  readonly currentPlayerIndex: number
  readonly isComplete: boolean
  readonly config: GameConfig
}

