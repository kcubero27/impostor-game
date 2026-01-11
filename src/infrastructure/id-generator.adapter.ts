import type { IIdGenerator } from "@/domain/shared/id-generator.interface";

/**
 * IdGeneratorAdapter
 *
 * Infrastructure implementation of ID generation.
 */
export class IdGeneratorAdapter implements IIdGenerator {
  generate(prefix: string = "id"): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
