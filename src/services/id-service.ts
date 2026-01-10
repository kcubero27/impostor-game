/**
 * Service for generating unique identifiers using crypto API
 * Can be used across all domains (players, categories, words, etc.)
 */
export interface IIdService {
  generate(prefix?: string): string
}

class IdService implements IIdService {
  /**
   * Generates a cryptographically secure unique identifier
   * @param prefix - Optional prefix to add to the ID (e.g., 'player', 'category')
   * @returns A unique identifier string
   */
  generate(prefix?: string): string {
    // Use crypto.randomUUID() for a standard UUID v4
    const uuid = crypto.randomUUID()
    
    // If a prefix is provided, prepend it
    return prefix ? `${prefix}-${uuid}` : uuid
  }

  /**
   * Generates a shorter unique ID (16 characters)
   * Useful when full UUID length is not necessary
   * @param prefix - Optional prefix to add to the ID
   * @returns A unique identifier string
   */
  generateShort(prefix?: string): string {
    // Generate a random array of bytes and convert to hex
    const array = new Uint8Array(8)
    crypto.getRandomValues(array)
    const shortId = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
    
    return prefix ? `${prefix}-${shortId}` : shortId
  }
}

export const idService = new IdService()

