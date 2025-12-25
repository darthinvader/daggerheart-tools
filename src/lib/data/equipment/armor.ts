/* eslint-disable max-lines */
import type { SpecialArmor, StandardArmor } from '../../schemas/equipment';

// Tier 1 Standard Armor
export const TIER_1_STANDARD_ARMOR: StandardArmor[] = [
  {
    name: 'Gambeson Armor',
    tier: '1',
    armorType: 'Gambeson',
    isStandard: true,
    baseThresholds: { major: 5, severe: 11 },
    baseScore: 3,
    evasionModifier: 1,
    agilityModifier: 0,
    features: [{ name: 'Flexible', description: '+1 to Evasion' }],
  },
  {
    name: 'Leather Armor',
    tier: '1',
    armorType: 'Leather',
    isStandard: true,
    baseThresholds: { major: 6, severe: 13 },
    baseScore: 3,
    evasionModifier: 0,
    agilityModifier: 0,
    features: [],
  },
  {
    name: 'Chainmail Armor',
    tier: '1',
    armorType: 'Chainmail',
    isStandard: true,
    baseThresholds: { major: 7, severe: 15 },
    baseScore: 4,
    evasionModifier: -1,
    agilityModifier: 0,
    features: [{ name: 'Heavy', description: '−1 to Evasion' }],
  },
  {
    name: 'Full Plate Armor',
    tier: '1',
    armorType: 'Full Plate',
    isStandard: true,
    baseThresholds: { major: 8, severe: 17 },
    baseScore: 4,
    evasionModifier: -2,
    agilityModifier: -1,
    features: [
      { name: 'Very Heavy', description: '−2 to Evasion; −1 to Agility' },
    ],
  },
];

// Tier 2 Standard Armor
export const TIER_2_STANDARD_ARMOR: StandardArmor[] = [
  {
    name: 'Improved Gambeson Armor',
    tier: '2',
    armorType: 'Gambeson',
    isStandard: true,
    baseThresholds: { major: 7, severe: 16 },
    baseScore: 4,
    evasionModifier: 1,
    agilityModifier: 0,
    features: [{ name: 'Flexible', description: '+1 to Evasion' }],
  },
  {
    name: 'Improved Leather Armor',
    tier: '2',
    armorType: 'Leather',
    isStandard: true,
    baseThresholds: { major: 9, severe: 20 },
    baseScore: 4,
    evasionModifier: 0,
    agilityModifier: 0,
    features: [],
  },
  {
    name: 'Improved Chainmail Armor',
    tier: '2',
    armorType: 'Chainmail',
    isStandard: true,
    baseThresholds: { major: 11, severe: 24 },
    baseScore: 5,
    evasionModifier: -1,
    agilityModifier: 0,
    features: [{ name: 'Heavy', description: '−1 to Evasion' }],
  },
  {
    name: 'Improved Full Plate Armor',
    tier: '2',
    armorType: 'Full Plate',
    isStandard: true,
    baseThresholds: { major: 13, severe: 28 },
    baseScore: 5,
    evasionModifier: -2,
    agilityModifier: -1,
    features: [
      { name: 'Very Heavy', description: '−2 to Evasion; −1 to Agility' },
    ],
  },
];

// Tier 3 Standard Armor
export const TIER_3_STANDARD_ARMOR: StandardArmor[] = [
  {
    name: 'Advanced Gambeson Armor',
    tier: '3',
    armorType: 'Gambeson',
    isStandard: true,
    baseThresholds: { major: 9, severe: 23 },
    baseScore: 5,
    evasionModifier: 1,
    agilityModifier: 0,
    features: [{ name: 'Flexible', description: '+1 to Evasion' }],
  },
  {
    name: 'Advanced Leather Armor',
    tier: '3',
    armorType: 'Leather',
    isStandard: true,
    baseThresholds: { major: 11, severe: 27 },
    baseScore: 5,
    evasionModifier: 0,
    agilityModifier: 0,
    features: [],
  },
  {
    name: 'Advanced Chainmail Armor',
    tier: '3',
    armorType: 'Chainmail',
    isStandard: true,
    baseThresholds: { major: 13, severe: 31 },
    baseScore: 6,
    evasionModifier: -1,
    agilityModifier: 0,
    features: [{ name: 'Heavy', description: '−1 to Evasion' }],
  },
  {
    name: 'Advanced Full Plate Armor',
    tier: '3',
    armorType: 'Full Plate',
    isStandard: true,
    baseThresholds: { major: 15, severe: 35 },
    baseScore: 6,
    evasionModifier: -2,
    agilityModifier: -1,
    features: [
      { name: 'Very Heavy', description: '−2 to Evasion; −1 to Agility' },
    ],
  },
];

// Tier 4 Standard Armor
export const TIER_4_STANDARD_ARMOR: StandardArmor[] = [
  {
    name: 'Legendary Gambeson Armor',
    tier: '4',
    armorType: 'Gambeson',
    isStandard: true,
    baseThresholds: { major: 11, severe: 32 },
    baseScore: 6,
    evasionModifier: 1,
    agilityModifier: 0,
    features: [{ name: 'Flexible', description: '+1 to Evasion' }],
  },
  {
    name: 'Legendary Leather Armor',
    tier: '4',
    armorType: 'Leather',
    isStandard: true,
    baseThresholds: { major: 13, severe: 36 },
    baseScore: 6,
    evasionModifier: 0,
    agilityModifier: 0,
    features: [],
  },
  {
    name: 'Legendary Chainmail Armor',
    tier: '4',
    armorType: 'Chainmail',
    isStandard: true,
    baseThresholds: { major: 15, severe: 40 },
    baseScore: 7,
    evasionModifier: -1,
    agilityModifier: 0,
    features: [{ name: 'Heavy', description: '−1 to Evasion' }],
  },
  {
    name: 'Legendary Full Plate Armor',
    tier: '4',
    armorType: 'Full Plate',
    isStandard: true,
    baseThresholds: { major: 17, severe: 44 },
    baseScore: 7,
    evasionModifier: -2,
    agilityModifier: -1,
    features: [
      { name: 'Very Heavy', description: '−2 to Evasion; −1 to Agility' },
    ],
  },
];

// Special Armor (unique materials and legendary pieces)
export const SPECIAL_ARMOR: SpecialArmor[] = [
  {
    name: 'Elundrian Chain Armor',
    tier: '2',
    armorType: 'Elundrian Chain',
    isStandard: false,
    materialType: 'Elundrian',
    baseThresholds: { major: 9, severe: 21 },
    baseScore: 4,
    evasionModifier: 0,
    agilityModifier: 0,
    features: [
      {
        name: 'Warded',
        description:
          'You reduce incoming magic damage by your Armor Score before applying it to your damage thresholds',
      },
    ],
    originDescription: 'Legendary chain that wards against magic.',
  },
  {
    name: 'Harrowbone Armor',
    tier: '2',
    armorType: 'Harrowbone',
    isStandard: false,
    materialType: 'Harrowbone',
    baseThresholds: { major: 9, severe: 21 },
    baseScore: 4,
    evasionModifier: 0,
    agilityModifier: 0,
    features: [
      {
        name: 'Resilient',
        description:
          'Before you mark your last Armor Slot, roll a d6. On a result of 6, reduce the severity by one threshold without marking an Armor Slot.',
      },
    ],
  },
  {
    name: 'Irontree Breastplate Armor',
    tier: '2',
    armorType: 'Irontree Breastplate',
    isStandard: false,
    materialType: 'Irontree',
    baseThresholds: { major: 9, severe: 20 },
    baseScore: 4,
    evasionModifier: 0,
    agilityModifier: 0,
    features: [
      {
        name: 'Reinforced',
        description:
          'When you mark your last Armor Slot, increase your damage thresholds by +2 until you clear at least 1 Armor Slot.',
      },
    ],
  },
  {
    name: 'Runetan Floating Armor',
    tier: '2',
    armorType: 'Runetan Floating',
    isStandard: false,
    materialType: 'Runetan',
    baseThresholds: { major: 9, severe: 20 },
    baseScore: 4,
    evasionModifier: 0,
    agilityModifier: 0,
    features: [
      {
        name: 'Shifting',
        description:
          'When you are targeted for an attack, you can mark an Armor Slot to give the attack roll against you disadvantage.',
      },
    ],
  },
  {
    name: 'Tyris Soft Armor',
    tier: '2',
    armorType: 'Tyris Soft',
    isStandard: false,
    materialType: 'Tyris',
    baseThresholds: { major: 8, severe: 18 },
    baseScore: 5,
    evasionModifier: 0,
    agilityModifier: 0,
    features: [
      {
        name: 'Quiet',
        description: 'You gain a +2 bonus to rolls you make to move silently.',
      },
    ],
  },
  {
    name: 'Rosewild Armor',
    tier: '2',
    armorType: 'Rosewild',
    isStandard: false,
    materialType: 'Rosewild',
    baseThresholds: { major: 11, severe: 23 },
    baseScore: 5,
    evasionModifier: 0,
    agilityModifier: 0,
    features: [
      {
        name: 'Hopeful',
        description:
          'When you would spend a Hope, you can mark an Armor Slot instead.',
      },
    ],
  },
  {
    name: 'Bellamoi Fine Armor',
    tier: '3',
    armorType: 'Bellamoi Fine',
    isStandard: false,
    materialType: 'Bellamoi',
    baseThresholds: { major: 11, severe: 27 },
    baseScore: 5,
    evasionModifier: 0,
    agilityModifier: 0,
    features: [{ name: 'Gilded', description: '+1 to Presence' }],
  },
  {
    name: 'Dragonscale Armor',
    tier: '3',
    armorType: 'Dragonscale',
    isStandard: false,
    materialType: 'Dragonscale',
    baseThresholds: { major: 11, severe: 27 },
    baseScore: 5,
    evasionModifier: 0,
    agilityModifier: 0,
    features: [
      {
        name: 'Impenetrable',
        description:
          'Once per short rest, when you would mark your last Hit Point, you can instead mark a Stress.',
      },
    ],
  },
  {
    name: 'Spiked Plate Armor',
    tier: '3',
    armorType: 'Spiked Plate',
    isStandard: false,
    materialType: 'Spiked Plate',
    baseThresholds: { major: 10, severe: 25 },
    baseScore: 5,
    evasionModifier: 0,
    agilityModifier: 0,
    features: [
      {
        name: 'Sharp',
        description:
          'On a successful attack against a target within Melee range, add a d4 to the damage roll.',
      },
    ],
  },
  {
    name: 'Bladefare Armor',
    tier: '3',
    armorType: 'Bladefare',
    isStandard: false,
    materialType: 'Bladefare',
    baseThresholds: { major: 16, severe: 39 },
    baseScore: 6,
    evasionModifier: 0,
    agilityModifier: 0,
    features: [
      {
        name: 'Physical',
        description: 'You can’t mark an Armor Slot to reduce magic damage.',
      },
    ],
  },
  {
    name: 'Monett’s Cloak',
    tier: '3',
    armorType: 'Monett’s Cloak',
    isStandard: false,
    materialType: 'Monett',
    baseThresholds: { major: 16, severe: 39 },
    baseScore: 6,
    evasionModifier: 0,
    agilityModifier: 0,
    features: [
      {
        name: 'Magic',
        description: 'You can’t mark an Armor Slot to reduce physical damage.',
      },
    ],
  },
  {
    name: 'Runes of Fortification',
    tier: '3',
    armorType: 'Runes of Fortification',
    isStandard: false,
    materialType: 'Runes',
    baseThresholds: { major: 17, severe: 43 },
    baseScore: 6,
    evasionModifier: 0,
    agilityModifier: 0,
    features: [
      {
        name: 'Painful',
        description:
          'Each time you mark an Armor Slot, you must mark a Stress.',
      },
    ],
  },
  {
    name: 'Dunamis Silkchain',
    tier: '4',
    armorType: 'Dunamis Silkchain',
    isStandard: false,
    materialType: 'Dunamis',
    baseThresholds: { major: 13, severe: 36 },
    baseScore: 7,
    evasionModifier: 0,
    agilityModifier: 0,
    features: [
      {
        name: 'Timeslowing',
        description:
          'Mark an Armor Slot to roll a d4 and add its result as a bonus to your Evasion against an incoming attack.',
      },
    ],
  },
  {
    name: 'Channeling Armor',
    tier: '4',
    armorType: 'Channeling',
    isStandard: false,
    materialType: 'Channeling',
    baseThresholds: { major: 13, severe: 36 },
    baseScore: 5,
    evasionModifier: 0,
    agilityModifier: 0,
    features: [{ name: 'Channeling', description: '+1 to Spellcast Rolls' }],
  },
  {
    name: 'Emberwoven Armor',
    tier: '4',
    armorType: 'Emberwoven',
    isStandard: false,
    materialType: 'Emberwoven',
    baseThresholds: { major: 13, severe: 36 },
    baseScore: 6,
    evasionModifier: 0,
    agilityModifier: 0,
    features: [
      {
        name: 'Burning',
        description:
          'When an adversary attacks you within Melee range, they mark a Stress.',
      },
    ],
  },
  {
    name: 'Full Fortified Armor',
    tier: '4',
    armorType: 'Full Fortified',
    isStandard: false,
    materialType: 'Fortified',
    baseThresholds: { major: 15, severe: 40 },
    baseScore: 4,
    evasionModifier: 0,
    agilityModifier: 0,
    features: [
      {
        name: 'Fortified',
        description:
          'When you mark an Armor Slot, you reduce the severity of an attack by two thresholds instead of one.',
      },
    ],
  },
  {
    name: 'Veritas Opal Armor',
    tier: '4',
    armorType: 'Veritas Opal',
    isStandard: false,
    materialType: 'Veritas Opal',
    baseThresholds: { major: 13, severe: 36 },
    baseScore: 6,
    evasionModifier: 0,
    agilityModifier: 0,
    features: [
      {
        name: 'Truthseeking',
        description:
          'This armor glows when another creature within Close range tells a lie.',
      },
    ],
  },
  {
    name: 'Savior Chainmail',
    tier: '4',
    armorType: 'Savior Chainmail',
    isStandard: false,
    materialType: 'Chainmail',
    baseThresholds: { major: 18, severe: 48 },
    baseScore: 8,
    evasionModifier: 0,
    agilityModifier: 0,
    features: [
      {
        name: 'Difficult',
        description: '−1 to all character traits and Evasion',
      },
    ],
  },
];

// Combined exports for easy access
export const ALL_STANDARD_ARMOR = [
  ...TIER_1_STANDARD_ARMOR,
  ...TIER_2_STANDARD_ARMOR,
  ...TIER_3_STANDARD_ARMOR,
  ...TIER_4_STANDARD_ARMOR,
];

export const ALL_ARMOR = [...ALL_STANDARD_ARMOR, ...SPECIAL_ARMOR];
