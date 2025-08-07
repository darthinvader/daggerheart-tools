import type { SpecialArmor, StandardArmor } from '../armor';

// Tier 1 Standard Armor
export const TIER_1_STANDARD_ARMOR: StandardArmor[] = [
  {
    name: 'Gambeson Armor',
    tier: '1',
    armorType: 'Gambeson',
    isStandard: true,
    baseThresholds: { minor: 5, major: 11, severe: 17 },
    baseScore: 3,
    evasionModifier: 1,
    agilityModifier: 0,
    slots: 3,
    features: [{ name: 'Flexible', description: '+1 to Evasion' }],
  },
  {
    name: 'Leather Armor',
    tier: '1',
    armorType: 'Leather',
    isStandard: true,
    baseThresholds: { minor: 6, major: 13, severe: 19 },
    baseScore: 3,
    evasionModifier: 0,
    agilityModifier: 0,
    slots: 3,
    features: [],
  },
  {
    name: 'Chainmail Armor',
    tier: '1',
    armorType: 'Chainmail',
    isStandard: true,
    baseThresholds: { minor: 7, major: 15, severe: 22 },
    baseScore: 4,
    evasionModifier: -1,
    agilityModifier: 0,
    slots: 3,
    features: [{ name: 'Heavy', description: '−1 to Evasion' }],
  },
  {
    name: 'Full Plate Armor',
    tier: '1',
    armorType: 'Full Plate',
    isStandard: true,
    baseThresholds: { minor: 8, major: 17, severe: 25 },
    baseScore: 4,
    evasionModifier: -2,
    agilityModifier: -1,
    slots: 3,
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
    baseThresholds: { minor: 7, major: 16, severe: 23 },
    baseScore: 4,
    evasionModifier: 1,
    agilityModifier: 0,
    slots: 3,
    features: [{ name: 'Flexible', description: '+1 to Evasion' }],
  },
  {
    name: 'Improved Leather Armor',
    tier: '2',
    armorType: 'Leather',
    isStandard: true,
    baseThresholds: { minor: 9, major: 20, severe: 29 },
    baseScore: 4,
    evasionModifier: 0,
    agilityModifier: 0,
    slots: 3,
    features: [],
  },
  {
    name: 'Improved Chainmail Armor',
    tier: '2',
    armorType: 'Chainmail',
    isStandard: true,
    baseThresholds: { minor: 11, major: 24, severe: 35 },
    baseScore: 5,
    evasionModifier: -1,
    agilityModifier: 0,
    slots: 3,
    features: [{ name: 'Heavy', description: '−1 to Evasion' }],
  },
  {
    name: 'Improved Full Plate Armor',
    tier: '2',
    armorType: 'Full Plate',
    isStandard: true,
    baseThresholds: { minor: 13, major: 28, severe: 41 },
    baseScore: 5,
    evasionModifier: -2,
    agilityModifier: -1,
    slots: 3,
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
    baseThresholds: { minor: 9, major: 23, severe: 32 },
    baseScore: 5,
    evasionModifier: 1,
    agilityModifier: 0,
    slots: 3,
    features: [{ name: 'Flexible', description: '+1 to Evasion' }],
  },
  {
    name: 'Advanced Leather Armor',
    tier: '3',
    armorType: 'Leather',
    isStandard: true,
    baseThresholds: { minor: 11, major: 27, severe: 38 },
    baseScore: 5,
    evasionModifier: 0,
    agilityModifier: 0,
    slots: 3,
    features: [],
  },
  {
    name: 'Advanced Chainmail Armor',
    tier: '3',
    armorType: 'Chainmail',
    isStandard: true,
    baseThresholds: { minor: 13, major: 31, severe: 44 },
    baseScore: 6,
    evasionModifier: -1,
    agilityModifier: 0,
    slots: 3,
    features: [{ name: 'Heavy', description: '−1 to Evasion' }],
  },
  {
    name: 'Advanced Full Plate Armor',
    tier: '3',
    armorType: 'Full Plate',
    isStandard: true,
    baseThresholds: { minor: 15, major: 35, severe: 50 },
    baseScore: 6,
    evasionModifier: -2,
    agilityModifier: -1,
    slots: 3,
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
    baseThresholds: { minor: 11, major: 32, severe: 43 },
    baseScore: 6,
    evasionModifier: 1,
    agilityModifier: 0,
    slots: 3,
    features: [{ name: 'Flexible', description: '+1 to Evasion' }],
  },
  {
    name: 'Legendary Leather Armor',
    tier: '4',
    armorType: 'Leather',
    isStandard: true,
    baseThresholds: { minor: 13, major: 36, severe: 49 },
    baseScore: 6,
    evasionModifier: 0,
    agilityModifier: 0,
    slots: 3,
    features: [],
  },
  {
    name: 'Legendary Chainmail Armor',
    tier: '4',
    armorType: 'Chainmail',
    isStandard: true,
    baseThresholds: { minor: 15, major: 40, severe: 55 },
    baseScore: 7,
    evasionModifier: -1,
    agilityModifier: 0,
    slots: 3,
    features: [{ name: 'Heavy', description: '−1 to Evasion' }],
  },
  {
    name: 'Legendary Full Plate Armor',
    tier: '4',
    armorType: 'Full Plate',
    isStandard: true,
    baseThresholds: { minor: 17, major: 44, severe: 61 },
    baseScore: 7,
    evasionModifier: -2,
    agilityModifier: -1,
    slots: 3,
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
    baseThresholds: { minor: 9, major: 21, severe: 30 },
    baseScore: 4,
    evasionModifier: 0,
    agilityModifier: 0,
    slots: 3,
    features: [
      {
        name: 'Flexible',
        description: 'No Evasion penalty despite being chain armor',
      },
      {
        name: 'Ancient Design',
        description: 'Traditional Elundrian craftsmanship',
      },
    ],
    originDescription:
      'Ancient Elundrian chain forged with their traditional techniques.',
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
