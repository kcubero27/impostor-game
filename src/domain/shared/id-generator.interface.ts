/**
 * IIdGenerator Interface
 * 
 * Domain interface for ID generation (Dependency Inversion Principle).
 * 
 * This interface belongs to the domain layer because it represents
 * a domain concept (generating unique identifiers).
 * Infrastructure implementations depend on this domain interface.
 * 
 * This allows:
 * - Domain and application services to work with abstractions
 * - Infrastructure to implement these abstractions
 * - Easy swapping of implementations (UUID, nanoid, database sequences, etc.)
 */
export interface IIdGenerator {
  /**
   * Generates a unique identifier
   * 
   * @param prefix - Optional prefix for the generated ID
   * @returns A unique identifier string
   */
  generate(prefix?: string): string;
}
