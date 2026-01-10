import type { IIdGenerator } from '@/application/player-management.service'

/**
 * Infrastructure: IdGeneratorAdapter
 * Implements ID generation using Web Crypto API
 */
export class IdGeneratorAdapter implements IIdGenerator {
  generate(prefix?: string): string {
    const uuid = crypto.randomUUID()
    return prefix ? `${prefix}-${uuid}` : uuid
  }

  generateShort(prefix?: string): string {
    const array = new Uint8Array(8)
    crypto.getRandomValues(array)
    const shortId = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
    return prefix ? `${prefix}-${shortId}` : shortId
  }
}

// Singleton instance
export const idGeneratorAdapter = new IdGeneratorAdapter()
