# Daggerheart Homebrew Kit Enhancements

This document outlines the enhancements made to our Daggerheart character system based on the official Homebrew Kit v1.0 (July 31, 2025).

## Summary of Enhancements

### 1. Enhanced Ancestry Feature Structure

**What was added:**
- `position` field for ancestry features ('top' | 'bottom')
- `featureType` field for design guidance and validation
- Support for mixed ancestry validation

**Why it matters:**
The Homebrew Kit reveals that ancestries are designed with specific "Top Feature" and "Bottom Feature" patterns. Mixed ancestries combine one Top Feature with one Bottom Feature, so proper categorization helps prevent overpowered combinations.

**Top Feature Types:**
- Experience bonuses
- Movement/terrain navigation
- Reaction roll bonuses
- Roll manipulation
- Communication abilities
- HP/Stress bonuses
- Hope generation
- Damage mitigation

**Bottom Feature Types:**
- Downtime benefits
- Innate attacks
- Specialty defenses
- Evasion manipulation
- Flight
- Stress management
- Information gathering
- Rerolls
- Social bonuses

### 2. Enhanced Domain Card System

**Token System:**
- Added support for token-based domain card features
- Tracks token sources (trait, tier, level, proficiency, etc.)
- Handles token spending and removal conditions

**Vault Placement:**
- Support for temporary and permanent vault placement
- Validation for "one-use per campaign" features

**Recall Cost Guidelines:**
- Built-in guidance for appropriate recall costs (0-4)
- Validation based on card power level and features

**Loadout Bonuses:**
- Support for level 7 "X-Touched" cards that provide domain focus bonuses

### 3. Enhanced Community System

**What was added:**
- `isCore` flag to distinguish core vs. homebrew communities
- `setting` field for campaign-specific communities
- `communityType` for design guidance

**Community Types:**
- `location_based` - Communities based on geography
- `ideal_based` - Communities based on shared beliefs
- `circumstance_based` - Communities based on shared experiences

### 4. Homebrew Design Guidelines

**Recall Cost Guidelines:**
- BASIC (0): Cards intended to be easily usable
- MODERATE (1): Standard utility cards
- POWERFUL (2): More specific or powerful cards
- HIGH_LEVEL (3): Most powerful, higher-level cards
- EXCEPTIONAL (4): Exceptional power or complexity

**Scaling Mechanics:**
- SMALL (tier): 1-4 range for powerful features
- MEDIUM (trait/proficiency): 1-6 range
- LARGE (level): 1-10 range for full progression

### 5. Enhanced Validation Functions

**New Validation Functions:**

1. `validateMixedAncestry()` - Ensures balanced Top/Bottom feature combinations
2. `validateRecallCosts()` - Validates recall costs follow Homebrew Kit guidelines
3. `validateAncestryFeatureTypes()` - Validates feature types follow design patterns

**What they check:**
- Mixed ancestry power balance
- Recall cost appropriateness
- Feature type consistency
- Vault placement taxation
- Grimoire cost standards

## Design Principles from Homebrew Kit

### Core Design Philosophy
1. **Balance narrative focus and dynamic combat**
2. **Streamline, then streamline again**
3. **Make the game tactile** (tokens, dice, cards)
4. **Limit cognitive load**
5. **Embrace collaboration**
6. **Design for flexibility**
7. **Think asymmetrically** (PC vs. GM features)

### Key Terms and Mechanics

**Asymmetrical Design:**
- PC features target adversary mechanics (not other PCs)
- Adversary features target PC mechanics (not other adversaries)
- Different rules for different participant types

**Important Distinctions:**
- **Difficulty** (not DC)
- **Target** (broader than "creature")
- **Evasion** (separate from armor)
- **Proficiency** (affects damage dice, not usually rolls)
- **Reactions** vs **Reaction Rolls**

## Implementation Benefits

### For Players
- Better mixed ancestry validation prevents accidental overpowered combinations
- Clear design guidelines help understand feature intent
- Token system support for more dynamic gameplay

### For GMs
- Homebrew validation tools ensure balanced custom content
- Design guidelines help create appropriate custom ancestries/communities
- Recall cost validation maintains game balance

### For Developers
- Comprehensive type system supports all official mechanics
- Extensible structure allows for homebrew content
- Validation functions catch potential balance issues

## Usage Examples

### Creating a Mixed Ancestry
```typescript
const mixedAncestry: Heritage = {
  ancestry: {
    name: 'Elf/Human',
    description: 'Mixed heritage combining elven grace with human adaptability',
    firstFeature: {
      name: 'Quick Reactions',
      description: 'Elven reflexes grant bonus to reaction rolls',
      position: 'top',
      featureType: 'reaction_bonus'
    },
    secondFeature: {
      name: 'Adaptability', 
      description: 'Human versatility allows rerolls',
      position: 'bottom',
      featureType: 'rerolls'
    }
  },
  community: { /* ... */ },
  isMixedAncestry: true,
  mixedAncestrySource: {
    firstFeatureFrom: 'Elf',
    secondFeatureFrom: 'Human'
  }
};

// Validation will check if this combination is balanced
const validation = validateMixedAncestry(mixedAncestry);
```

### Creating a Token-Based Domain Card
```typescript
const domainCard: DomainCard = {
  name: 'Tactical Focus',
  domain: 'Bone',
  level: 5,
  type: 'Ability',
  recallCost: 2,
  description: 'Focus your tactical awareness',
  features: [{
    name: 'Battle Awareness',
    description: 'Add tokens equal to your Agility. Spend to gain advantages.',
    tokenSystem: {
      maxTokens: 0, // Will be set by trait value
      currentTokens: 0,
      tokenSource: 'trait',
      tokenSourceValue: 'Agility',
      spendCondition: 'when making tactical decisions',
      removeCondition: 'when tokens are spent'
    }
  }]
};
```

## Future Enhancements

Based on the Homebrew Kit, potential future additions could include:

1. **Campaign Frame Support** - Tools for creating setting-specific character options
2. **Adversary Creation Tools** - Guidelines for homebrew monsters and NPCs
3. **Environment System** - Support for environmental challenges and features
4. **Equipment Crafting** - Tools for creating custom weapons, armor, and items
5. **Subclass Validation** - Enhanced validation for homebrew subclasses
6. **Domain Creation Wizard** - Step-by-step domain card creation tools

## Conclusion

These enhancements bring our Daggerheart character system in line with the official design guidelines while maintaining the flexibility needed for homebrew content. The additions provide better validation, clearer design patterns, and more comprehensive support for the full range of Daggerheart mechanics.
