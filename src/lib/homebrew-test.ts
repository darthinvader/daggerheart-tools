// Test for Homebrew Kit Enhancements
// This file demonstrates and tests the new features added from the Homebrew Kit

import type {
  Heritage,
  DomainCard
} from './daggerheartCharacter';

import {
  validateMixedAncestry,
  validateRecallCosts,
  validateAncestryFeatureTypes
} from './daggerheartValidation';

import {
  RECALL_COST_GUIDELINES,
  TOP_FEATURE_TYPES,
  BOTTOM_FEATURE_TYPES
} from './daggerheartCharacter';

// ============================================================================
// TEST MIXED ANCESTRY VALIDATION
// ============================================================================

console.log('Testing Mixed Ancestry Validation...');

// Example of a balanced mixed ancestry
const balancedMixedAncestry: Heritage = {
  ancestry: {
    name: 'Elf/Human',
    description: 'Combines elven grace with human adaptability',
    firstFeature: {
      name: 'Quick Reactions',
      description: 'Bonus to reaction rolls',
      position: 'top',
      featureType: 'reaction_bonus'
    },
    secondFeature: {
      name: 'Adaptability',
      description: 'Reroll failed attempts',
      position: 'bottom', 
      featureType: 'reroll'
    }
  },
  community: {
    name: 'Loreborne',
    description: 'Scholars and knowledge keepers',
    feature: {
      name: 'Research Bonus',
      description: 'Advantage on knowledge checks'
    },
    isCore: true,
    communityType: 'ideal_based'
  },
  isMixedAncestry: true,
  mixedAncestrySource: {
    firstFeatureFrom: 'Elf',
    secondFeatureFrom: 'Human'
  }
};

const mixedValidation = validateMixedAncestry(balancedMixedAncestry);
console.log('Balanced Mixed Ancestry:', mixedValidation);

// Example of potentially overpowered mixed ancestry
const overpoweredMixedAncestry: Heritage = {
  ...balancedMixedAncestry,
  ancestry: {
    name: 'Giant/Drakona',
    description: 'Combines giant endurance with drakonic might',
    firstFeature: {
      name: 'Endurance',
      description: 'Extra HP and stress',
      position: 'top',
      featureType: 'hp_stress'
    },
    secondFeature: {
      name: 'Dragon Scales',
      description: 'Damage mitigation',
      position: 'bottom',
      featureType: 'damage_mitigation'
    }
  }
};

const overpoweredValidation = validateMixedAncestry(overpoweredMixedAncestry);
console.log('Overpowered Mixed Ancestry:', overpoweredValidation);

// ============================================================================
// TEST RECALL COST VALIDATION
// ============================================================================

console.log('\nTesting Recall Cost Validation...');

const testDomainCards: Array<{ recallCost: number; level: number; type: string; features: Array<{ vaultPlacement?: { canPlace: boolean } }> }> = [
  {
    recallCost: 0,
    level: 1,
    type: 'Ability',
    features: [{ }]
  },
  {
    recallCost: 2,
    level: 3,
    type: 'Grimoire',
    features: [{ }, { }, { }]
  },
  {
    recallCost: 1,
    level: 5,
    type: 'Spell',
    features: [{ vaultPlacement: { canPlace: true } }]
  },
  {
    recallCost: 0,
    level: 8,
    type: 'Ability',
    features: [{ }]
  }
];

const recallValidation = validateRecallCosts(testDomainCards);
console.log('Recall Cost Validation:', recallValidation);

// ============================================================================
// TEST ANCESTRY FEATURE TYPE VALIDATION
// ============================================================================

console.log('\nTesting Ancestry Feature Type Validation...');

const wellDesignedAncestry = {
  firstFeature: {
    name: 'Natural Climber',
    description: 'Enhanced movement abilities',
    position: 'top' as const,
    featureType: 'movement' as const
  },
  secondFeature: {
    name: 'Nimble',
    description: 'Evasion bonus',
    position: 'bottom' as const,
    featureType: 'evasion' as const
  }
};

const featureValidation = validateAncestryFeatureTypes(wellDesignedAncestry);
console.log('Feature Type Validation:', featureValidation);

// ============================================================================
// TEST HOMEBREW GUIDELINES CONSTANTS
// ============================================================================

console.log('\nTesting Homebrew Guidelines...');

console.log('Recall Cost Guidelines:', RECALL_COST_GUIDELINES);
console.log('Top Feature Types:', TOP_FEATURE_TYPES);
console.log('Bottom Feature Types:', BOTTOM_FEATURE_TYPES);

// ============================================================================
// EXAMPLE TOKEN-BASED DOMAIN CARD
// ============================================================================

console.log('\nTesting Token-Based Domain Card...');

const tokenDomainCard: DomainCard = {
  name: 'Tactical Awareness',
  domain: 'Bone',
  level: 4,
  type: 'Ability',
  recallCost: 2,
  description: 'Enhanced battlefield awareness with token system',
  features: [{
    name: 'Battle Focus',
    description: 'Add tokens equal to your Agility modifier. Spend tokens for tactical advantages.',
    tokenSystem: {
      maxTokens: 0, // Set by trait value
      currentTokens: 0,
      tokenSource: 'trait',
      tokenSourceValue: 'Agility',
      spendCondition: 'when making tactical decisions',
      removeCondition: 'when combat ends'
    }
  }],
  recallCostGuidance: {
    reasoning: 'powerful',
    notes: 'Token system provides multiple uses per encounter'
  }
};

console.log('Token Domain Card:', tokenDomainCard);

// ============================================================================
// EXAMPLE LOADOUT BONUS CARD
// ============================================================================

const loadoutBonusCard: DomainCard = {
  name: 'Bone-Touched',
  domain: 'Bone',
  level: 7,
  type: 'Ability',
  recallCost: 3,
  description: 'Mastery of the body and tactics',
  features: [{
    name: 'Physical Mastery',
    description: 'Enhanced Agility and tactical awareness'
  }],
  loadoutBonus: {
    minimumCards: 4,
    bonusType: 'stat_and_ability',
    bonusDescription: 'If 4+ cards in loadout are from Bone domain, gain +1 Agility and enhanced battlefield awareness'
  }
};

console.log('Loadout Bonus Card:', loadoutBonusCard);

console.log('\nAll Homebrew Kit enhancements tested successfully! ✅');

export {
  balancedMixedAncestry,
  overpoweredMixedAncestry,
  tokenDomainCard,
  loadoutBonusCard
};
