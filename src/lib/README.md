# Daggerheart Character Type System

This directory contains flexible TypeScript interfaces and utilities for creating and validating Daggerheart characters based on the official SRD (System Reference Document). The system is designed to handle both standard SRD content and homebrew extensions.

## Files Overview

### `daggerheartCharacter.ts`
The main type definitions file containing comprehensive TypeScript interfaces for:

- **Core Game Mechanics**: Flexible traits, classes, domains, ancestries, communities
- **Heritage System**: Ancestry and community definitions with their features
- **Class System**: Character classes, subclasses, and class features
- **Domain System**: Domain cards with recall costs and usage limits
- **Equipment System**: Weapons, armor, and general equipment with flexible tiers
- **Character Interface**: Complete character definition with all required fields
- **Standard Constants**: Default values from the SRD that can be customized

### `daggerheartValidation.ts`
Validation utilities and helper functions:

- **Flexible Character Validation**: Ensures characters follow rules (customizable)
- **Trait Assignment Validation**: Verifies modifier distribution (customizable)
- **Domain Validation**: Checks domain cards match class restrictions
- **Experience Validation**: Validates experience appropriateness
- **Helper Functions**: Stat calculation, domain lookups, creation utilities

### `exampleCharacter.ts`
Working example demonstrating:

- Complete character creation process
- Proper type usage with flexible system
- Validation in action
- Best practices for character data structure

## Key Features

### ✅ Flexible & Homebrew-Friendly
All types are designed to handle extensions beyond the SRD:
- **Trait modifiers**: Any number (-∞ to +∞), not just standard -1 to +2
- **Classes & Domains**: Extendable strings, not limited enums
- **Equipment Tiers**: Any number, not just 1-5
- **Custom Content**: Easy to add homebrew ancestries, classes, domains, etc.

### ✅ Standard SRD Defaults
While flexible, the system provides all standard SRD values:
- **STANDARD_TRAIT_MODIFIERS**: [2, 1, 1, 0, 0, -1] for character creation
- **STANDARD_CLASS_DOMAINS**: Core class-domain combinations
- **CHARACTER_DEFAULTS**: Starting values (level 1, 6 stress, 2 Hope, etc.)
- **Core Constants**: Standard classes, domains, ancestries, communities

### ✅ Type Safety with Flexibility
- Strict TypeScript interfaces prevent invalid combinations
- Flexible string types allow custom content
- Comprehensive validation functions with customizable rules
- Optional validation - use as much or as little as needed

### ✅ Character Creation Support
- Step-by-step creation process support
- Validation at each creation step with customizable rules
- Helper functions for stat calculation
- Error reporting with specific guidance

## Usage Examples

### Creating a Flexible Character
```typescript
import { DaggerheartCharacter } from './daggerheartCharacter';
import { validateCharacter } from './daggerheartValidation';

// Create character with any traits/classes (not limited to SRD)
const character: DaggerheartCharacter = {
  name: 'Custom Character',
  level: 1,
  heritage: {
    ancestry: { name: 'Homebrew Ancestry', /* ... */ },
    community: { name: 'Custom Community', /* ... */ }
  },
  class: { name: 'Homebrew Class', domains: ['Custom Domain', 'Another Domain'], /* ... */ },
  traits: {
    'Custom Trait': 5,      // Any number allowed
    'Another Trait': -3,    // Negative values ok
    'Magic Power': 10       // High values for epic campaigns
  },
  // ... other fields
};

// Validate with custom rules or skip validation entirely
const validation = validateCharacter(character);
```

### Using Standard SRD Values
```typescript
import { STANDARD_TRAIT_MODIFIERS, STANDARD_CLASS_DOMAINS } from './daggerheartCharacter';
import { validateTraitAssignment } from './daggerheartValidation';

// Use standard SRD trait distribution
const traits = {
  'Presence': 2, 'Knowledge': 1, 'Finesse': 1,
  'Agility': 0, 'Instinct': 0, 'Strength': -1
};

// Validate against standard rules
const validation = validateTraitAssignment(traits, STANDARD_TRAIT_MODIFIERS);

// Get standard class domains
const bardDomains = STANDARD_CLASS_DOMAINS['Bard']; // ['Codex', 'Grace']
```

### Custom Validation Rules
```typescript
import { validateTraitAssignment, validateDomainCards } from './daggerheartValidation';

// Custom trait distribution for high-power campaign
const customTraits = { 'Strength': 5, 'Magic': 8, 'Luck': 3 };
const customModifiers = [8, 5, 3]; // High-power modifiers

const validation = validateTraitAssignment(customTraits, customModifiers);

// Custom class-domain mapping for homebrew
const homebrewDomains = {
  'Technomancer': ['Arcane', 'Technology'],
  'Voidwalker': ['Shadow', 'Space']
};

const domainValidation = validateDomainCards('Technomancer', ['Arcane'], homebrewDomains);
```

## Flexibility Examples

### Trait System
```typescript
// Standard SRD traits
const standardTraits = {
  'Agility': 2, 'Strength': 1, 'Finesse': 1,
  'Instinct': 0, 'Presence': 0, 'Knowledge': -1
};

// Homebrew traits with any names/values
const homebrewTraits = {
  'Cybernetics': 8,
  'Psionics': 5,
  'Social Media Influence': 12,
  'Quantum Physics': -2
};

// Epic campaign traits
const epicTraits = {
  'Divine Power': 25,
  'Cosmic Awareness': 18,
  'Reality Manipulation': 30
};
```

### Equipment System
```typescript
// Standard weapons (tier 1-5)
const standardSword: Weapon = {
  name: 'Longsword',
  tier: 3,
  damageDie: 'd8+2',
  // ...
};

// Homebrew legendary weapons
const cosmicSword: Weapon = {
  name: 'Sword of Stars',
  tier: 15,           // Any tier number
  damageDie: '3d12+10',
  // ...
};
```

### Classes and Domains
```typescript
// Standard class
const standardBard: CharacterClass = {
  name: 'Bard',
  domains: ['Codex', 'Grace'], // Standard domains
  // ...
};

// Homebrew class
const technoMage: CharacterClass = {
  name: 'Technomancer',
  domains: ['Cybernetics', 'Digital Magic'], // Custom domains
  // ...
};
```

## Character Creation Rules (Customizable)

### Default SRD Rules
- **Trait Assignment**: +2, +1, +1, +0, +0, -1 distribution
- **Starting Level**: 1
- **Starting Equipment**: Based on class
- **Domain Cards**: 2 level-1 cards from class domains
- **Experiences**: 2 at +2 modifier each

### Customization Options
- Override any validation rule
- Use custom trait distributions
- Allow any equipment tier
- Create homebrew classes/domains/ancestries
- Set custom starting values
- Skip validation entirely for narrative games

## Integration and Migration

### From rpgModels.ts
The old `rpgModels.ts` has been replaced with this more flexible system:
- More accurate to Daggerheart SRD
- Supports homebrew content
- Better type safety with flexibility
- Easier to extend and customize

### Extension Points
- Add homebrew content by extending string types
- Create custom validation rules
- Implement character sheet generators
- Build character creation wizards
- Add campaign-specific modifications

## Example Character

See `exampleCharacter.ts` for "Elara Moonwhisper", a complete, valid character demonstrating:
- Standard SRD character creation
- Proper type usage
- Validation patterns
- Flexible trait system usage

The example passes all standard validations while demonstrating the system's flexibility for future extensions.
