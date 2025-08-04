# Enhanced Daggerheart Character Model

A comprehensive TypeScript implementation of Daggerheart characters that combines excellent SRD accuracy with missing critical mechanics like death moves, advancement systems, and dynamic state tracking.

## Overview

This enhanced model builds upon analysis of existing implementations to provide:

- **Complete SRD Coverage**: All core mechanics from the official Daggerheart SRD
- **Missing Critical Systems**: Death moves, advancement choices, dynamic state
- **Strong Type Safety**: Comprehensive TypeScript interfaces with validation
- **Extensibility**: Homebrew-friendly design with clear extension points
- **Real Gameplay Support**: Session tracking, conditions, temporary effects

## Files

### Core Model (`daggerheartCharacter.ts`)
- **Complete Character Interface**: All aspects of a Daggerheart character
- **Enhanced Equipment**: Structured weapon/armor features with mechanical effects
- **Dynamic State Tracking**: Conditions, temporary effects, action economy
- **Death & Mortality**: Death moves and character mortality mechanics
- **Character Advancement**: Level-up choices and multiclassing support
- **Session Management**: Session state, rest tracking, resource management

### Validation System (`daggerheartValidation.ts`)
- **Flexible Validation**: Customizable rules for different campaign styles
- **SRD Compliance**: Strict validation against official rules
- **Homebrew Support**: Relaxed validation for custom content
- **Comprehensive Checks**: Characters, equipment, advancement, resources
- **Custom Rules**: Framework for adding campaign-specific validation

### Example Character (`exampleCharacter.ts`)
- **Complete Demo**: "Elara Moonwhisper" - fully realized character
- **All Systems**: Demonstrates every aspect of the enhanced model
- **Best Practices**: Proper usage patterns and data structures
- **Validation Example**: Shows validation in action

## Key Enhancements Over Previous Models

### 🆕 Death & Mortality System
```typescript
interface MortalityState {
  lastHitPointMarked: boolean;
  deathMoveUsed?: DeathMove;
  dying: boolean;
  stabilized: boolean;
  resurrectionCount: number;
}

type DeathMoveType = 
  | "Last Words" | "Inspiring Sacrifice" 
  | "Unfinished Business" | "Final Strike"
  // ... more death move types
```

### 🆕 Character Advancement
```typescript
interface AdvancementChoice {
  type: AdvancementType;
  description: string;
  taken: boolean;
  level: Level;
  tier: Tier;
  requirements?: string[];
}
```

### 🆕 Dynamic State Tracking
```typescript
interface DynamicState {
  currentSession: SessionState;
  conditions: Condition[];
  temporaryEffects: TemporaryEffect[];
  actionEconomy: ActionEconomy;
  lastRollResult?: RollResult;
}
```

### 🆕 Enhanced Equipment
```typescript
interface WeaponFeature {
  name: string;
  type: WeaponFeatureType;
  description: string;
  mechanicalEffect?: string;
  trigger?: string;
  cost?: string;
}
```

### 🆕 Resource Management
```typescript
interface HopeState {
  current: number;
  maximum: number;
  sessionGenerated: number;
}

interface FearState {
  current: number;
  sessionGenerated: number;
  effects: string[];
}
```

## Comparison with External Model

### What We Kept ✅
- Excellent SRD accuracy and type coverage
- Strong TypeScript patterns and unions
- Good extensibility with data/tags fields
- Class-specific meters (Rally, Prayer Dice, etc.)
- Comprehensive trait and domain systems

### What We Enhanced 🚀
- **Death Moves**: Complete mortality system
- **Advancement**: Level-up choices and multiclassing
- **Dynamic State**: Conditions, temporary effects, action economy
- **Equipment**: Structured features with mechanical effects
- **Resources**: Enhanced tracking with temporary bonuses
- **Session Management**: Complete session and rest tracking
- **Validation**: Flexible validation with multiple modes

### What We Added 🆕
- Fear system mechanics
- Consumable items system
- Enhanced social/narrative systems
- Real-time state management
- Campaign integration support

## Usage Examples

### Creating a Character
```typescript
import { PlayerCharacter, deriveTier } from './daggerheartCharacter';

const character: PlayerCharacter = {
  id: "char-001",
  name: "Adventurer",
  level: 1,
  tier: deriveTier(1),
  // ... complete character definition
};
```

### Validation
```typescript
import { validateCharacter, getSRDCompliance } from './daggerheartValidation';

// Standard validation
const result = validateCharacter(character);

// Strict SRD compliance
const srdResult = getSRDCompliance(character);

// Homebrew-friendly validation
const homebrewResult = getHomebrewFriendlyValidation(character);
```

### Dynamic State Management
```typescript
// Add a condition
character.dynamicState.conditions.push({
  type: "Distracted",
  duration: "temporary", 
  source: "Mocking Taunt"
});

// Track action economy
character.dynamicState.actionEconomy.majorActionsUsed = 1;
```

### Death Moves
```typescript
import { canUseDeathMove } from './daggerheartCharacter';

if (canUseDeathMove(character)) {
  character.mortality.deathMoveUsed = {
    type: "Inspiring Sacrifice",
    description: "Rally allies with final words",
    mechanicalEffect: "All allies gain 2 Hope"
  };
}
```

## Integration Ready

This enhanced model is built for integration with React applications and provides clear patterns for:

- Character creation wizards
- Character sheet interfaces  
- Session management systems
- Campaign tools
- Homebrew content creation

## License & Attribution

This enhanced model builds upon analysis of external AI-generated code while adding significant original enhancements. Compatible with Daggerheart SRD design principles.

---

*Enhanced Daggerheart Character Model - Complete, Accurate, Extensible*
