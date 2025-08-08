# System Patterns - Daggerheart Tools

## Architecture Overview

### Data Flow Architecture

```
SRD Documents → Schema Definitions → Type-Safe Models → UI Components
```

The system follows a strict data-first approach where all game rules are encoded as Zod schemas, ensuring type safety and validation throughout the application.

## Core Design Patterns

### Schema-Driven Development

- **Zod Schemas**: Single source of truth for all game data structures
- **Type Inference**: TypeScript types automatically derived from schemas
- **Runtime Validation**: All user input validated against official rules
- **Error Boundaries**: Graceful handling of validation failures

### Domain-Driven Design

The codebase is organized around game domain concepts:

#### Domain Card System (`src/lib/domains/`)

- **9 Core Domains**: Arcana, Blade, Bone, Codex, Grace, Midnight, Sage, Splendor, Valor
- **Card Collections**: Each domain exports typed card arrays and name constants
- **Schema Validation**: All cards conform to `DomainCardSchema`
- **Extensibility**: Additional domains (Chaos, Moon, Sun, Blood, Fate) ready for future content

#### Class System (schemas simplified)

- **Base Classes**: 9 core classes with 2 subclasses each
- **Subclass Shape**: Unified `BaseSubclassSchema` used across classes (companion optional for Ranger)
- **Progressive Features**: Tier-based ability unlocking (Foundation → Specialization → Mastery)
- **Level-Up System**: Point-based advancement with configurable options
- **Multiclassing**: Complex rules for advanced character builds

#### Character System (`src/lib/schemas/player-character.ts`)

- **Trait System**: 6 core traits (Agility, Strength, Finesse, Instinct, Presence, Knowledge)
- **Identity System**: Ancestry + Community combinations with unique abilities
- **Resource Management**: Hit Points, Stress, Armor, and Gold tracking

### Component Architecture

#### Schema Composition Pattern

```typescript
// Base schema with extensible composition
const BaseClassSchema = z.object({
  name: z.string(),
  domains: z.array(DomainNameEnum).length(2),
  // ... common properties
});

// Specific class with discriminated union for subclasses
const BardClassSchema = BaseClassSchema.extend({
  name: z.literal('Bard'),
  subclasses: z.array(BaseSubclassSchema),
});
```

#### Discriminated Unions for Type Safety

- **Class Types**: Each class is a discriminated union member
- **Subclass Variants**: Type-safe subclass selection within classes
- **Domain Cards**: Union types for different card types and levels

#### Constants and Enums

- **Game Constants**: Level progression, point costs, thresholds
- **Validation Enums**: Restricted value sets for ancestry, community, traits
- **Reference Data**: Companion upgrades, equipment categories

## Key Technical Decisions

### 1. Zod for Schema Validation

**Decision**: Use Zod over alternatives like Yup or joi
**Rationale**:

- Native TypeScript integration
- Runtime validation with compile-time types
- Excellent error messages for user feedback
- Schema composition and transformation capabilities

### 2. Const Assertions for Game Data

**Decision**: Use `as const` for all game constant objects
**Rationale**:

- Ensures data immutability
- Enables precise type inference
- Prevents accidental mutations
- Better autocomplete and type checking

### 3. Discriminated Unions for Polymorphic Data

**Decision**: Use discriminated unions instead of inheritance
**Rationale**:

- Type-safe exhaustive checking
- Better pattern matching in TypeScript
- Clearer data structures
- Prevents invalid state combinations

### 4. Separate Schemas for Different Use Cases

**Decision**: Multiple schemas for same entity (Reference vs Full)
**Rationale**:

- Performance optimization for different contexts
- Reduced bundle size for lightweight operations
- Flexible API design
- Clear separation of concerns

## Data Relationships

### Class → Domain Mapping

- Each class has exactly 2 domains
- Domain access determines available spells/abilities
- Multiclassing can grant additional domain access

### Character Progression

- Tier-based advancement (1: Levels 1, 2: Levels 2-4, 3: Levels 5-7, 4: Levels 8-10)
- Point-based level-up system (2 points per level)
- Feature unlocking based on level and advancement choices

### Domain Card Availability

- Cards have level requirements (1-10)
- Access restricted by class domains
- Some advanced cards require specific subclass features

## Error Handling Patterns

### Validation Error Messages

- Schema validation provides specific field-level errors
- User-friendly error messages with suggestions
- Progressive validation during character creation

### Type Safety Boundaries

- All external data validated at boundaries
- Internal operations assume validated data
- Graceful degradation for missing or invalid data

## Performance Considerations

### Schema Compilation

- Schemas compiled once at module load
- Reused validation instances for performance
- Lazy loading for complex nested schemas

### Data Structure Optimization

- Flat arrays for card collections
- Indexed lookups for frequent operations
- Minimal object nesting for serialization efficiency
