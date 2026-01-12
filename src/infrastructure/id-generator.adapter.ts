import type { IIdGenerator } from "@/domain/shared/id-generator.interface";

export class IdGeneratorAdapter implements IIdGenerator {
  generate(): string {
    return crypto.randomUUID();
  }
}
