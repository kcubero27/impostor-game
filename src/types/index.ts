export interface Player {
  readonly id: string
  name: string
}

let playerIdCounter = 0

export function createPlayer(name: string = ''): Player {
  return {
    id: `player-${++playerIdCounter}-${Date.now()}`,
    name,
  }
}

export type PlayerId = Player['id']
