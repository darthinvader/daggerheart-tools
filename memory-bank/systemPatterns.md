# System Patterns

## Schema Architecture (Updated August 2025)

### Core Design Principles

- **Simplicity over Cleverness**: Removed unnecessary factory classes and validators
- **Zod-First Approach**: Leveraged Zod's built-in capabilities instead of wrapping them
- **Conditional Validation**: Single schema with mode-based validation instead of duplicate schemas
- **Separation of Concerns**: Moved utility functions out of schema files

### Schema Structure

```
schemas/
├── core.ts          # Base types, enums, primitives
├── character.ts     # Main character schema with conditional validation
├── equipment.ts     # Weapon, armor, inventory items
├── validation.ts    # Simple validation functions (no classes)
└── index.ts         # Re-exports
```

### Key Patterns

#### Conditional Schema Validation

Instead of separate SRD/Homebrew schemas, we use a single schema with conditional refinement:

```typescript
PlayerCharacterSchema.refine(character => {
  if (!character.homebrewMode) {
    // Apply SRD validations
  }
  return true;
});
```

#### Function-Based Utilities

Replaced class-based factories with simple functions:

```typescript
// OLD: CharacterFactory.createDefaultTraits()
// NEW: createDefaultTraits()
```

#### Utility Separation

Character calculation functions moved to dedicated `characterUtils.ts` file, keeping schemas pure.

### Removed Anti-Patterns

- ❌ Factory classes for simple object creation
- ❌ Validator classes wrapping Zod
- ❌ Duplicate schemas for different modes
- ❌ Over-commenting and verbose headers
- ❌ Utility functions mixed with schema definitions

### Performance Improvements

- Eliminated unnecessary object instantiation from factory patterns
- Reduced schema parsing overhead by consolidating validation
- Removed redundant type checking layers
