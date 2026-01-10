import { idService } from '@/services/id-service'

export interface Player {
  readonly id: string
  name: string
}

export type PlayerId = Player['id']

export function createPlayer(name: string = ''): Player {
  return {
    id: idService.generate('player'),
    name,
  }
}

