/**
 * Beastform Data
 *
 * Static definitions for all Druid beastforms per the Daggerheart SRD.
 * Each form specifies tier, trait bonus, evasion bonus, attack stats,
 * advantages, and special features.
 */

import type { CharacterTrait } from '@/lib/character-stats-engine/types';

/** A special feature granted by a beastform */
export interface BeastformFeature {
  name: string;
  description: string;
}

/** Attack definition for a beastform */
export interface BeastformAttack {
  /** Range category */
  range: 'Melee' | 'Very Close' | 'Close' | 'Far';
  /** Trait used for the attack roll */
  trait: CharacterTrait;
  /** Damage dice expression (e.g., 'd8+2') */
  damageDice: string;
}

/** Complete definition for a single beastform */
export interface BeastformDefinition {
  id: string;
  name: string;
  tier: number;
  /** Example creatures this form represents */
  examples: string[];
  /** Trait bonus granted while in this form */
  traitBonus: { trait: CharacterTrait; value: number };
  /** Flat bonus to evasion while in this form */
  evasionBonus: number;
  /** Attack granted by this form */
  attack: BeastformAttack;
  /** Advantages this form grants */
  advantages: string[];
  /** Special features of this form */
  features: BeastformFeature[];
}

// ============================================
// Tier 1 Beastforms
// ============================================

const AGILE_SCOUT: BeastformDefinition = {
  id: 'agile-scout',
  name: 'Agile Scout',
  tier: 1,
  examples: ['Fox', 'Mouse', 'Weasel'],
  traitBonus: { trait: 'Agility', value: 1 },
  evasionBonus: 2,
  attack: { range: 'Melee', trait: 'Agility', damageDice: 'd4' },
  advantages: ['deceive', 'locate', 'sneak'],
  features: [
    {
      name: 'Agile',
      description:
        'Your movement is silent, and you can spend a Hope to move up to Far range without rolling.',
    },
    {
      name: 'Fragile',
      description:
        'When you take Major or greater damage, you drop out of Beastform.',
    },
  ],
};

const HOUSEHOLD_FRIEND: BeastformDefinition = {
  id: 'household-friend',
  name: 'Household Friend',
  tier: 1,
  examples: ['Cat', 'Dog', 'Rabbit'],
  traitBonus: { trait: 'Instinct', value: 1 },
  evasionBonus: 2,
  attack: { range: 'Melee', trait: 'Instinct', damageDice: 'd6' },
  advantages: ['climb', 'locate', 'protect'],
  features: [
    {
      name: 'Companion',
      description:
        'When you Help an Ally, you can roll a d8 as your advantage die.',
    },
    {
      name: 'Fragile',
      description:
        'When you take Major or greater damage, you drop out of Beastform.',
    },
  ],
};

const NIMBLE_GRAZER: BeastformDefinition = {
  id: 'nimble-grazer',
  name: 'Nimble Grazer',
  tier: 1,
  examples: ['Deer', 'Gazelle', 'Goat'],
  traitBonus: { trait: 'Agility', value: 1 },
  evasionBonus: 3,
  attack: { range: 'Melee', trait: 'Agility', damageDice: 'd6' },
  advantages: ['leap', 'sneak', 'sprint'],
  features: [
    {
      name: 'Elusive Prey',
      description:
        'When an attack roll against you would succeed, you can mark a Stress and roll a d4. Add the result to your Evasion against this attack.',
    },
    {
      name: 'Fragile',
      description:
        'When you take Major or greater damage, you drop out of Beastform.',
    },
  ],
};

const PACK_PREDATOR: BeastformDefinition = {
  id: 'pack-predator',
  name: 'Pack Predator',
  tier: 1,
  examples: ['Coyote', 'Hyena', 'Wolf'],
  traitBonus: { trait: 'Strength', value: 2 },
  evasionBonus: 1,
  attack: { range: 'Melee', trait: 'Strength', damageDice: 'd8+2' },
  advantages: ['attack', 'sprint', 'track'],
  features: [
    {
      name: 'Hobbling Strike',
      description:
        'When you succeed on an attack against a target within Melee range, you can mark a Stress to make the target temporarily Vulnerable.',
    },
    {
      name: 'Pack Hunting',
      description:
        'When you succeed on an attack against the same target as an ally who acts immediately before you, add a d8 to your damage roll.',
    },
  ],
};

const AQUATIC_SCOUT: BeastformDefinition = {
  id: 'aquatic-scout',
  name: 'Aquatic Scout',
  tier: 1,
  examples: ['Eel', 'Fish', 'Octopus'],
  traitBonus: { trait: 'Agility', value: 1 },
  evasionBonus: 2,
  attack: { range: 'Melee', trait: 'Agility', damageDice: 'd4' },
  advantages: ['navigate', 'sneak', 'swim'],
  features: [
    {
      name: 'Aquatic',
      description: 'You can breathe and move naturally underwater.',
    },
    {
      name: 'Fragile',
      description:
        'When you take Major or greater damage, you drop out of Beastform.',
    },
  ],
};

const STALKING_ARACHNID: BeastformDefinition = {
  id: 'stalking-arachnid',
  name: 'Stalking Arachnid',
  tier: 1,
  examples: ['Tarantula', 'Wolf Spider'],
  traitBonus: { trait: 'Finesse', value: 1 },
  evasionBonus: 2,
  attack: { range: 'Melee', trait: 'Finesse', damageDice: 'd6+1' },
  advantages: ['attack', 'climb', 'sneak'],
  features: [
    {
      name: 'Venomous Bite',
      description:
        'When you succeed on an attack against a target within Melee range, the target becomes temporarily Poisoned. A Poisoned creature takes 1d10 direct physical damage each time they act.',
    },
    {
      name: 'Webslinger',
      description:
        'You can create a strong web material useful for both adventuring and battle. The web is resilient enough to support one creature. You can temporarily Restrain a target within Close range by succeeding on a Finesse Roll against them.',
    },
  ],
};

// ============================================
// Tier 2 Beastforms
// ============================================

const ARMORED_SENTRY: BeastformDefinition = {
  id: 'armored-sentry',
  name: 'Armored Sentry',
  tier: 2,
  examples: ['Armadillo', 'Pangolin', 'Turtle'],
  traitBonus: { trait: 'Strength', value: 1 },
  evasionBonus: 1,
  attack: { range: 'Melee', trait: 'Strength', damageDice: 'd8+2' },
  advantages: ['dig', 'locate', 'protect'],
  features: [
    {
      name: 'Armored Shell',
      description:
        'Your hardened exterior gives you resistance to physical damage. Additionally, mark an Armor Slot to retract into your shell. While in your shell, physical damage is reduced by a number equal to your Armor Score (after applying resistance), but you can\u2019t perform other actions without leaving this form.',
    },
    {
      name: 'Cannonball',
      description:
        'Mark a Stress to allow an ally to throw or launch you at an adversary. To do so, the ally makes an attack roll using Agility or Strength (their choice) against a target within Close range. On a success, the adversary takes d12+2 physical damage using the thrower\u2019s Proficiency. You can spend a Hope to target an additional adversary within Very Close range of the first. The second target takes half the damage dealt to the first target.',
    },
  ],
};

const POWERFUL_BEAST: BeastformDefinition = {
  id: 'powerful-beast',
  name: 'Powerful Beast',
  tier: 2,
  examples: ['Bear', 'Bull', 'Moose'],
  traitBonus: { trait: 'Strength', value: 1 },
  evasionBonus: 3,
  attack: { range: 'Melee', trait: 'Strength', damageDice: 'd10+4' },
  advantages: ['navigate', 'protect', 'scare'],
  features: [
    {
      name: 'Rampage',
      description:
        'When you roll a 1 on a damage die, you can roll a d10 and add the result to the damage roll. Additionally, before you make an attack roll, you can mark a Stress to gain a +1 bonus to your Proficiency for that attack.',
    },
    {
      name: 'Thick Hide',
      description: 'You gain a +2 bonus to your damage thresholds.',
    },
  ],
};

const MIGHTY_STRIDER: BeastformDefinition = {
  id: 'mighty-strider',
  name: 'Mighty Strider',
  tier: 2,
  examples: ['Camel', 'Horse', 'Zebra'],
  traitBonus: { trait: 'Agility', value: 1 },
  evasionBonus: 2,
  attack: { range: 'Melee', trait: 'Agility', damageDice: 'd8+1' },
  advantages: ['leap', 'navigate', 'sprint'],
  features: [
    {
      name: 'Carrier',
      description:
        'You can carry up to two willing allies with you when you move.',
    },
    {
      name: 'Trample',
      description:
        'Mark a Stress to move up to Close range in a straight line and make an attack against all targets within Melee range of the line. Targets you succeed against take d8+1 physical damage using your Proficiency and are temporarily Vulnerable.',
    },
  ],
};

const STRIKING_SERPENT: BeastformDefinition = {
  id: 'striking-serpent',
  name: 'Striking Serpent',
  tier: 2,
  examples: ['Cobra', 'Rattlesnake', 'Viper'],
  traitBonus: { trait: 'Finesse', value: 1 },
  evasionBonus: 2,
  attack: { range: 'Very Close', trait: 'Finesse', damageDice: 'd8+4' },
  advantages: ['climb', 'deceive', 'sprint'],
  features: [
    {
      name: 'Venomous Strike',
      description:
        'Make an attack against any number of targets within Very Close range. On a success, a target is temporarily Poisoned. A Poisoned creature takes 1d10 direct physical damage each time they act.',
    },
    {
      name: 'Warning Hiss',
      description:
        'Mark a Stress to force any number of targets within Melee range to move back to Very Close range.',
    },
  ],
};

const POUNCING_PREDATOR: BeastformDefinition = {
  id: 'pouncing-predator',
  name: 'Pouncing Predator',
  tier: 2,
  examples: ['Cheetah', 'Lion', 'Panther'],
  traitBonus: { trait: 'Instinct', value: 1 },
  evasionBonus: 3,
  attack: { range: 'Melee', trait: 'Instinct', damageDice: 'd8+6' },
  advantages: ['attack', 'climb', 'sneak'],
  features: [
    {
      name: 'Fleet',
      description: 'Spend a Hope to move up to Far range without rolling.',
    },
    {
      name: 'Takedown',
      description:
        'Mark a Stress to move into Melee range of a target and make an attack roll against them. On a success, you gain a +2 bonus to your Proficiency for this attack and the target must mark a Stress.',
    },
  ],
};

const WINGED_BEAST: BeastformDefinition = {
  id: 'winged-beast',
  name: 'Winged Beast',
  tier: 2,
  examples: ['Hawk', 'Owl', 'Raven'],
  traitBonus: { trait: 'Finesse', value: 1 },
  evasionBonus: 3,
  attack: { range: 'Melee', trait: 'Finesse', damageDice: 'd4+2' },
  advantages: ['deceive', 'locate', 'scare'],
  features: [
    {
      name: 'Bird\u2019s-Eye View',
      description:
        'You can fly at will. Once per rest while you are airborne, you can ask the GM a question about the scene below you without needing to roll. The first time a character makes a roll to act on this information, they gain advantage on the roll.',
    },
    {
      name: 'Hollow Bones',
      description: 'You gain a \u22122 penalty to your damage thresholds.',
    },
  ],
};

// ============================================
// Tier 3 Beastforms
// ============================================

const GREAT_PREDATOR: BeastformDefinition = {
  id: 'great-predator',
  name: 'Great Predator',
  tier: 3,
  examples: ['Dire Wolf', 'Velociraptor', 'Sabertooth Tiger'],
  traitBonus: { trait: 'Strength', value: 2 },
  evasionBonus: 2,
  attack: { range: 'Melee', trait: 'Strength', damageDice: 'd12+8' },
  advantages: ['attack', 'sneak', 'sprint'],
  features: [
    {
      name: 'Carrier',
      description:
        'You can carry up to two willing allies with you when you move.',
    },
    {
      name: 'Vicious Maul',
      description:
        'When you succeed on an attack against a target, you can spend a Hope to make them temporarily Vulnerable and gain a +1 bonus to your Proficiency for this attack.',
    },
  ],
};

const MIGHTY_LIZARD: BeastformDefinition = {
  id: 'mighty-lizard',
  name: 'Mighty Lizard',
  tier: 3,
  examples: ['Alligator', 'Crocodile', 'Gila Monster'],
  traitBonus: { trait: 'Instinct', value: 2 },
  evasionBonus: 1,
  attack: { range: 'Melee', trait: 'Instinct', damageDice: 'd10+7' },
  advantages: ['attack', 'sneak', 'track'],
  features: [
    {
      name: 'Physical Defense',
      description: 'You gain a +3 bonus to your damage thresholds.',
    },
    {
      name: 'Snapping Strike',
      description:
        'When you succeed on an attack against a target within Melee range, you can spend a Hope to clamp that opponent in your jaws, making them temporarily Restrained and Vulnerable.',
    },
  ],
};

const GREAT_WINGED_BEAST: BeastformDefinition = {
  id: 'great-winged-beast',
  name: 'Great Winged Beast',
  tier: 3,
  examples: ['Giant Eagle', 'Falcon'],
  traitBonus: { trait: 'Finesse', value: 2 },
  evasionBonus: 3,
  attack: { range: 'Melee', trait: 'Finesse', damageDice: 'd8+6' },
  advantages: ['deceive', 'distract', 'locate'],
  features: [
    {
      name: 'Bird\u2019s-Eye View',
      description:
        'You can fly at will. Once per rest while you are airborne, you can ask the GM a question about the scene below you without needing to roll. The first time a character makes a roll to act on this information, they gain advantage on the roll.',
    },
    {
      name: 'Carrier',
      description:
        'You can carry up to two willing allies with you when you move.',
    },
  ],
};

const AQUATIC_PREDATOR: BeastformDefinition = {
  id: 'aquatic-predator',
  name: 'Aquatic Predator',
  tier: 3,
  examples: ['Dolphin', 'Orca', 'Shark'],
  traitBonus: { trait: 'Agility', value: 2 },
  evasionBonus: 4,
  attack: { range: 'Melee', trait: 'Agility', damageDice: 'd10+6' },
  advantages: ['attack', 'swim', 'track'],
  features: [
    {
      name: 'Aquatic',
      description: 'You can breathe and move naturally underwater.',
    },
    {
      name: 'Vicious Maul',
      description:
        'When you succeed on an attack against a target, you can spend a Hope to make them Vulnerable and gain a +1 bonus to your Proficiency for this attack.',
    },
  ],
};

const LEGENDARY_BEAST: BeastformDefinition = {
  id: 'legendary-beast',
  name: 'Legendary Beast',
  tier: 3,
  examples: ['Upgraded Tier 1 Options'],
  traitBonus: { trait: 'Strength', value: 0 },
  evasionBonus: 0,
  attack: { range: 'Melee', trait: 'Strength', damageDice: 'd0' },
  advantages: [],
  features: [
    {
      name: 'Evolved',
      description:
        'Pick a Tier 1 Beastform option and become a larger, more powerful version of that creature. While you\u2019re in this form, you retain all traits and features from the original form and gain the following bonuses: a +6 bonus to damage rolls, a +1 bonus to the trait used by this form, and a +2 bonus to Evasion.',
    },
  ],
};

const LEGENDARY_HYBRID: BeastformDefinition = {
  id: 'legendary-hybrid',
  name: 'Legendary Hybrid',
  tier: 3,
  examples: ['Griffon', 'Sphinx'],
  traitBonus: { trait: 'Strength', value: 2 },
  evasionBonus: 3,
  attack: { range: 'Melee', trait: 'Strength', damageDice: 'd10+8' },
  advantages: [],
  features: [
    {
      name: 'Hybrid Features',
      description:
        'To transform into this creature, mark an additional Stress. Choose any two Beastform options from Tiers 1\u20132. Choose a total of four advantages and two features from those options.',
    },
  ],
};

// ============================================
// Tier 4 Beastforms
// ============================================

const MASSIVE_BEHEMOTH: BeastformDefinition = {
  id: 'massive-behemoth',
  name: 'Massive Behemoth',
  tier: 4,
  examples: ['Elephant', 'Mammoth', 'Rhinoceros'],
  traitBonus: { trait: 'Strength', value: 3 },
  evasionBonus: 1,
  attack: { range: 'Melee', trait: 'Strength', damageDice: 'd12+12' },
  advantages: ['locate', 'protect', 'scare', 'sprint'],
  features: [
    {
      name: 'Carrier',
      description:
        'You can carry up to four willing allies with you when you move.',
    },
    {
      name: 'Demolish',
      description:
        'Spend a Hope to move up to Far range in a straight line and make an attack against all targets within Melee range of the line. Targets you succeed against take d8+10 physical damage using your Proficiency and are temporarily Vulnerable.',
    },
    {
      name: 'Undaunted',
      description: 'You gain a +2 bonus to all your damage thresholds.',
    },
  ],
};

const TERRIBLE_LIZARD: BeastformDefinition = {
  id: 'terrible-lizard',
  name: 'Terrible Lizard',
  tier: 4,
  examples: ['Brachiosaurus', 'Tyrannosaurus'],
  traitBonus: { trait: 'Strength', value: 3 },
  evasionBonus: 2,
  attack: { range: 'Melee', trait: 'Strength', damageDice: 'd12+10' },
  advantages: ['attack', 'deceive', 'scare', 'track'],
  features: [
    {
      name: 'Devastating Strikes',
      description:
        'When you deal Severe damage to a target within Melee range, you can mark a Stress to force them to mark an additional Hit Point.',
    },
    {
      name: 'Massive Stride',
      description:
        'You can move up to Far range without rolling. You ignore rough terrain (at the GM\u2019s discretion) due to your size.',
    },
  ],
};

const MYTHIC_AERIAL_HUNTER: BeastformDefinition = {
  id: 'mythic-aerial-hunter',
  name: 'Mythic Aerial Hunter',
  tier: 4,
  examples: ['Dragon', 'Pterodactyl', 'Roc', 'Wyvern'],
  traitBonus: { trait: 'Finesse', value: 3 },
  evasionBonus: 4,
  attack: { range: 'Melee', trait: 'Finesse', damageDice: 'd10+11' },
  advantages: ['attack', 'deceive', 'locate', 'navigate'],
  features: [
    {
      name: 'Carrier',
      description:
        'You can carry up to three willing allies with you when you move.',
    },
    {
      name: 'Deadly Raptor',
      description:
        'You can fly at will and move up to Far range as part of your action. When you move in a straight line into Melee range of a target from at least Close range and make an attack against that target in the same action, you can reroll all damage dice that rolled a result lower than your Proficiency.',
    },
  ],
};

const EPIC_AQUATIC_BEAST: BeastformDefinition = {
  id: 'epic-aquatic-beast',
  name: 'Epic Aquatic Beast',
  tier: 4,
  examples: ['Giant Squid', 'Whale'],
  traitBonus: { trait: 'Agility', value: 3 },
  evasionBonus: 3,
  attack: { range: 'Melee', trait: 'Agility', damageDice: 'd10+10' },
  advantages: ['locate', 'protect', 'scare', 'track'],
  features: [
    {
      name: 'Ocean Master',
      description:
        'You can breathe and move naturally underwater. When you succeed on an attack against a target within Melee range, you can temporarily Restrain them.',
    },
    {
      name: 'Unyielding',
      description:
        'When you would mark an Armor Slot, roll a d6. On a result of 5 or higher, reduce the severity by one threshold without marking an Armor Slot.',
    },
  ],
};

const MYTHIC_BEAST: BeastformDefinition = {
  id: 'mythic-beast',
  name: 'Mythic Beast',
  tier: 4,
  examples: ['Upgraded Tier 1 or Tier 2 Options'],
  traitBonus: { trait: 'Strength', value: 0 },
  evasionBonus: 0,
  attack: { range: 'Melee', trait: 'Strength', damageDice: 'd0' },
  advantages: [],
  features: [
    {
      name: 'Evolved',
      description:
        'Pick a Tier 1 or Tier 2 Beastform option and become a larger, more powerful version of that creature. While you\u2019re in this form, you retain all traits and features from the original form and gain the following bonuses: a +9 bonus to damage rolls, a +2 bonus to the trait used by this form, a +3 bonus to Evasion, and your damage die increases by one size (d6 becomes d8, d8 becomes d10, etc.).',
    },
  ],
};

const MYTHIC_HYBRID: BeastformDefinition = {
  id: 'mythic-hybrid',
  name: 'Mythic Hybrid',
  tier: 4,
  examples: ['Chimera', 'Cockatrice', 'Manticore'],
  traitBonus: { trait: 'Strength', value: 3 },
  evasionBonus: 2,
  attack: { range: 'Melee', trait: 'Strength', damageDice: 'd12+10' },
  advantages: [],
  features: [
    {
      name: 'Hybrid Features',
      description:
        'To transform into this creature, mark 2 additional Stress. Choose any three Beastform options from Tiers 1\u20133. Choose a total of five advantages and three features from those options.',
    },
  ],
};

// ============================================
// Exports & Helpers
// ============================================

/** All beastform definitions indexed by tier */
export const BEASTFORMS: readonly BeastformDefinition[] = [
  // Tier 1
  AGILE_SCOUT,
  HOUSEHOLD_FRIEND,
  NIMBLE_GRAZER,
  PACK_PREDATOR,
  AQUATIC_SCOUT,
  STALKING_ARACHNID,
  // Tier 2
  ARMORED_SENTRY,
  POWERFUL_BEAST,
  MIGHTY_STRIDER,
  STRIKING_SERPENT,
  POUNCING_PREDATOR,
  WINGED_BEAST,
  // Tier 3
  GREAT_PREDATOR,
  MIGHTY_LIZARD,
  GREAT_WINGED_BEAST,
  AQUATIC_PREDATOR,
  LEGENDARY_BEAST,
  LEGENDARY_HYBRID,
  // Tier 4
  MASSIVE_BEHEMOTH,
  TERRIBLE_LIZARD,
  MYTHIC_AERIAL_HUNTER,
  EPIC_AQUATIC_BEAST,
  MYTHIC_BEAST,
  MYTHIC_HYBRID,
] as const;

/**
 * Look up a beastform by its unique ID.
 */
export function getBeastformById(id: string): BeastformDefinition | undefined {
  return BEASTFORMS.find(b => b.id === id);
}

/**
 * Get all beastforms available at or below a given tier.
 * Per SRD, druids can transform into forms of their tier or lower.
 */
export function getBeastformsForTier(tier: number): BeastformDefinition[] {
  return BEASTFORMS.filter(b => b.tier <= tier);
}

/**
 * Get beastforms for a specific tier only.
 */
export function getBeastformsAtTier(tier: number): BeastformDefinition[] {
  return BEASTFORMS.filter(b => b.tier === tier);
}
