// Data moved from schemas/core/level-progression.ts

/**
 * SRD-defined tier boundary levels.
 * These are the levels at which new tier benefits are granted (experience, proficiency).
 */
export const TIER_START_LEVELS = [2, 5, 8] as const;

/**
 * Levels at which trait marks should be cleared per SRD.
 */
export const TRAIT_CLEAR_LEVELS = [5, 8] as const;

/**
 * Check if a level grants automatic tier benefits (new experience, proficiency).
 */
export function isTierStartLevel(level: number): boolean {
  return (TIER_START_LEVELS as readonly number[]).includes(level);
}

/**
 * Check if a level clears trait marks per SRD.
 */
export function isTraitClearLevel(level: number): boolean {
  return (TRAIT_CLEAR_LEVELS as readonly number[]).includes(level);
}

export const LEVEL_PROGRESSION = {
  TIERS: {
    TIER_1: { name: 'Tier 1', levels: [1], description: 'Starting level' },
    TIER_2: {
      name: 'Tier 2',
      levels: [2, 3, 4],
      description: 'Early advancement',
    },
    TIER_3: {
      name: 'Tier 3',
      levels: [5, 6, 7],
      description: 'Mid-level specialization',
    },
    TIER_4: {
      name: 'Tier 4',
      levels: [8, 9, 10],
      description: 'High-level mastery',
    },
  },
  AUTOMATIC_BENEFITS: {
    LEVEL_2: {
      experience: 'Gain a new Experience at +2',
      proficiency: '+1 Proficiency',
    },
    LEVEL_5: {
      experience: 'Gain a new Experience at +2',
      traitMarks: 'Clear all marks on character traits',
      proficiency: '+1 Proficiency',
    },
    LEVEL_8: {
      experience: 'Gain a new Experience at +2',
      traitMarks: 'Clear all marks on character traits',
      proficiency: '+1 Proficiency',
    },
  },
  RALLY_DIE_PROGRESSION: {
    LEVELS_1_4: 'd6',
    LEVELS_5_PLUS: 'd8',
  },
} as const;

export const LEVEL_UP_OPTIONS = {
  POINTS_PER_LEVEL: 2,
  TIER_2: {
    'Gain a +1 bonus to two unmarked character traits and mark them': {
      cost: 1,
      maxSelections: 3,
    },
    'Permanently gain a +1 bonus to two Experiences': {
      cost: 1,
      maxSelections: 1,
    },
    'Choose an additional domain card of your level or lower from a domain you have access to (up to level 4)':
      {
        cost: 1,
        maxSelections: 1,
      },
    'Permanently gain a +1 bonus to your Evasion': {
      cost: 1,
      maxSelections: 1,
    },
    'Permanently gain one Hit Point slot': {
      cost: 1,
      maxSelections: 2,
    },
    'Permanently gain one Stress slot': {
      cost: 1,
      maxSelections: 2,
    },
  },
  TIER_3: {
    'Gain a +1 bonus to two unmarked character traits and mark them': {
      cost: 1,
      maxSelections: 3,
    },
    'Permanently gain a +1 bonus to two Experiences': {
      cost: 1,
      maxSelections: 1,
    },
    'Choose an additional domain card of your level or lower from a domain you have access to':
      {
        cost: 1,
        maxSelections: 1,
      },
    'Permanently gain a +1 bonus to your Evasion': {
      cost: 1,
      maxSelections: 1,
    },
    'Permanently gain one Hit Point slot': {
      cost: 1,
      maxSelections: 2,
    },
    'Permanently gain one Stress slot': {
      cost: 1,
      maxSelections: 2,
    },
    'Increase your Proficiency by +1': {
      cost: 2,
      maxSelections: 1,
    },
    'Take an upgraded subclass card. Then cross out the multiclass option for this tier':
      {
        cost: 2,
        maxSelections: 1,
      },
    'Multiclass: Choose an additional class for your character, then cross out an unused "Take an upgraded subclass card" and the other multiclass option on this sheet':
      {
        cost: 2,
        maxSelections: 1,
      },
  },
  TIER_4: {
    'Gain a +1 bonus to two unmarked character traits and mark them': {
      cost: 1,
      maxSelections: 3,
    },
    'Permanently gain a +1 bonus to two Experiences': {
      cost: 1,
      maxSelections: 1,
    },
    'Choose an additional domain card of your level or lower from a domain you have access to (up to level 7)':
      {
        cost: 1,
        maxSelections: 1,
      },
    'Permanently gain a +1 bonus to your Evasion': {
      cost: 1,
      maxSelections: 1,
    },
    'Permanently gain one Hit Point slot': {
      cost: 1,
      maxSelections: 2,
    },
    'Permanently gain one Stress slot': {
      cost: 1,
      maxSelections: 2,
    },
    'Increase your Proficiency by +1': {
      cost: 2,
      maxSelections: 1,
    },
    'Take an upgraded subclass card. Then cross out the multiclass option for this tier':
      {
        cost: 2,
        maxSelections: 1,
      },
    'Multiclass: Choose an additional class for your character, then cross out an unused "Take an upgraded subclass card" and the other multiclass option on this sheet':
      {
        cost: 2,
        maxSelections: 1,
      },
  },
} as const;
