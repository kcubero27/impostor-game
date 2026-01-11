# Architecture Documentation

## Overview

This application follows **Domain-Driven Design (DDD)** principles and **SOLID** principles to create a maintainable, testable, and scalable codebase.

## Layer Architecture

```
┌─────────────────────────────────────────────────┐
│             UI Layer (React)                    │
│  - Components                                   │
│  - Pages                                        │
│  - Hooks                                        │
└────────────────┬────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────┐
│         Adapter Layer                           │
│  - PlayerAdapter                                │
│  - GameAdapter                                  │
│  (Converts between Domain & DTOs)               │
└────────────────┬────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────┐
│         Application Layer                       │
│  - PlayerManagementService                      │
│  - GameManagementService                        │
│  (Orchestrates use cases)                       │
└────────────────┬────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────┐
│         Domain Layer                            │
│  Entities:                                      │
│    - Player                                     │
│    - GamePlayer                                 │
│    - Word                                       │
│  Value Objects:                                 │
│    - PlayerName                                 │
│  Aggregates:                                    │
│    - Game (Aggregate Root)                      │
│  Domain Services:                               │
│    - RoleAssignmentService                      │
│    - WordSelectionService                       │
│  Collections:                                   │
│    - PlayerCollection                           │
└────────────────┬────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────┐
│         Infrastructure Layer                    │
│  - WordRepository                               │
│  - WordMemoryAdapter                            │
│  - IdGeneratorAdapter                           │
│  (External dependencies, persistence, APIs)     │
└─────────────────────────────────────────────────┘
```

## Domain-Driven Design (DDD) Patterns

### 1. **Entities**

Entities have identity and lifecycle:

- **Player**: Represents a player with unique identity
  - Has behavior: `changeName()`, `hasValidName()`
  - Identity preserved through `id`
- **GamePlayer**: Player in game context with role
  - Extends player concept with game-specific behavior
- **Word**: Game word with translations and metadata

### 2. **Value Objects**

Immutable objects defined by their attributes:

- **PlayerName**: Encapsulates name validation logic
  - Self-validating
  - Immutable
  - Equality based on normalized value

### 3. **Aggregates**

Cluster of entities treated as a single unit:

- **Game** (Aggregate Root):
  - Manages GamePlayers and Word
  - Enforces invariants (e.g., exactly one impostor)
  - Controls access to child entities
  - Provides consistent interface for game operations

### 4. **Domain Services**

Business logic that doesn't belong to a single entity:

- **RoleAssignmentService**: Assigns roles to players
- **WordSelectionService**: Selects words with memory logic
- **PlayerCollection**: Manages player collection rules

### 5. **Repositories**

Abstract data access:

- **IWordRepository**: Interface for word data access
- **WordRepository**: Implementation using static data

### 6. **Domain Events** (Future Enhancement)

Could be added for:

- PlayerNameChanged
- RoleRevealed
- GameCompleted

## SOLID Principles Applied

### Single Responsibility Principle (SRP)

✅ **Each class has one reason to change:**

- `Player`: Player identity and basic info
- `PlayerName`: Name validation
- `PlayerCollection`: Collection management
- `RoleAssignmentService`: Role assignment logic only
- `WordSelectionService`: Word selection logic only
- `PlayerManagementService`: Player use case orchestration
- `GameManagementService`: Game use case orchestration

### Open/Closed Principle (OCP)

✅ **Open for extension, closed for modification:**

- `WordSelectionService` depends on `IWordRepository` interface
  - Can add new implementations (database, API) without changing service
- `PlayerManagementService` depends on `IIdGenerator` interface
  - Can swap ID generation strategy without changing service

### Liskov Substitution Principle (LSP)

✅ **Subtypes are substitutable:**

- Any implementation of `IWordRepository` can replace another
- Any implementation of `IIdGenerator` can replace another
- Interfaces define contracts that implementations must honor

### Interface Segregation Principle (ISP)

✅ **Clients don't depend on unused methods:**

- `IWordRepository`: Only word-related operations
- `IIdGenerator`: Only ID generation
- `IWordMemory`: Only memory operations
- Small, focused interfaces

### Dependency Inversion Principle (DIP)

✅ **Depend on abstractions, not concretions:**

```typescript
// ❌ Bad (before):
class GameService {
  selectWord() {
    const words = WORDS; // Direct dependency on data
  }
}

// ✅ Good (after):
class WordSelectionService {
  constructor(
    private readonly wordRepository: IWordRepository, // Abstraction
    private readonly wordMemory: IWordMemory, // Abstraction
  ) {}
}
```

## Directory Structure

```
src/
├── domain/                      # Domain layer (core business logic)
│   ├── player/
│   │   ├── player.entity.ts            # Player entity
│   │   ├── player-name.value-object.ts # PlayerName value object
│   │   └── player-collection.ts        # Player collection domain service
│   └── game/
│       ├── game.aggregate.ts                  # Game aggregate root
│       ├── game-player.entity.ts              # GamePlayer entity
│       ├── word.entity.ts                     # Word entity
│       ├── role-assignment.domain-service.ts  # Role assignment logic
│       └── word-selection.domain-service.ts   # Word selection logic
│
├── application/                 # Application layer (use cases)
│   ├── player-management.service.ts    # Player use cases
│   ├── game-management.service.ts      # Game use cases
│   └── services.ts                     # Service configuration & DI
│
├── infrastructure/              # Infrastructure layer (technical concerns)
│   ├── repositories/
│   │   └── word.repository.ts          # Word data access
│   ├── persistence/
│   │   └── word-memory.adapter.ts      # localStorage implementation
│   └── id-generator.adapter.ts         # ID generation implementation
│
├── adapters/                    # Adapter layer (converts between layers)
│   ├── player.adapter.ts               # Player DTO ↔ Entity
│   └── game.adapter.ts                 # Game DTO ↔ Aggregate
│
├── hooks/                       # React hooks (UI state management)
│   └── use-players.ts                  # Player state hook
│
├── pages/                       # Page components
├── components/                  # UI components
├── types/                       # TypeScript types (DTOs for UI)
├── data/                        # Static data
└── services/                    # Legacy services (to be migrated)
```

## Benefits of This Architecture

### 1. **Testability**

- Domain layer has no external dependencies → easy unit testing
- Infrastructure implementations can be mocked via interfaces
- Application services orchestrate tested domain logic

### 2. **Maintainability**

- Clear separation of concerns
- Each layer has specific responsibilities
- Changes in UI don't affect domain logic
- Changes in infrastructure don't affect domain logic

### 3. **Flexibility**

- Can swap implementations (e.g., localStorage → API)
- Can add new use cases without modifying existing code
- Can extend domain model without breaking existing features

### 4. **Domain-Centric**

- Business rules are explicit and located in domain layer
- Domain language (ubiquitous language) is preserved in code
- Non-technical stakeholders can understand domain code

## Migration Strategy

The codebase is being gradually migrated:

1. ✅ **Domain layer created** - Entities, Value Objects, Aggregates
2. ✅ **Application layer created** - Use case orchestration
3. ✅ **Infrastructure layer created** - Concrete implementations
4. ✅ **Adapter layer created** - Converts between old and new
5. ✅ **Hooks updated** - Use new architecture internally
6. ⏳ **Components** - Will gradually migrate to use domain types

### Backward Compatibility

Adapters ensure existing components continue to work:

```typescript
// Old code still works:
const players: LegacyPlayer[] = usePlayers().players;

// But internally uses:
// Domain entities → Application services → Adapters → UI
```

## Key Concepts

### Ubiquitous Language

Domain concepts reflected in code:

- `Player` (not `User`)
- `GamePlayer` (not `PlayerWithRole`)
- `Impostor` and `Normal` roles
- `PlayerCollection` (not `PlayerArray`)
- `revealRole`, `assignRoles` (domain verbs)

### Invariants

Rules enforced by the domain:

- Game must have exactly one impostor
- Game requires at least 2 players
- Player names must be unique and non-empty
- PlayerName cannot exceed 50 characters

### Bounded Context

This application represents a single bounded context: **Impostor Game**

Future expansion could add contexts:

- User Management (login, profiles)
- Matchmaking (online multiplayer)
- Statistics (game history, analytics)

## Testing Strategy

```typescript
// Domain Layer (Unit Tests - No Dependencies)
describe("Player", () => {
  it("should change name", () => {
    const player = Player.create("id-1", "Alice");
    player.changeName("Bob");
    expect(player.name).toBe("Bob");
  });
});

// Application Layer (Integration Tests - Mock Infrastructure)
describe("PlayerManagementService", () => {
  it("should create player with generated ID", () => {
    const mockIdGenerator = { generate: jest.fn(() => "test-id") };
    const service = new PlayerManagementService(mockIdGenerator);
    const player = service.createPlayer("Alice");
    expect(player.id).toBe("test-id");
  });
});

// UI Layer (Component Tests - Mock Services)
describe("usePlayers", () => {
  it("should add player", () => {
    const { result } = renderHook(() => usePlayers());
    act(() => result.current.addPlayer());
    expect(result.current.playerCount).toBe(3);
  });
});
```

## Future Enhancements

1. **Domain Events**: Add event-driven architecture
2. **CQRS**: Separate read/write models if needed
3. **Repository for Players**: Add persistence for player data
4. **Specification Pattern**: Add complex filtering for words
5. **Factory Pattern**: Centralize entity creation
6. **Strategy Pattern**: Different game modes (e.g., multiple impostors)

## References

- [Domain-Driven Design by Eric Evans](https://www.domainlanguage.com/ddd/)
- [Clean Architecture by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
