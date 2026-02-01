import type { CombatWheelchair } from '../../schemas/equipment';

// Light Frame Combat Wheelchairs
export const LIGHT_FRAME_WHEELCHAIRS: CombatWheelchair[] = [
  {
    name: 'Light-Frame Wheelchair',
    tier: '1',
    type: 'Primary',
    trait: 'Agility',
    range: 'Melee',
    damage: { diceType: 8, count: 1, modifier: 0, type: 'phy' },
    burden: 'One-Handed',
    domainAffinity: 'Any',
    frameType: 'Light',
    features: [
      {
        name: 'Quick',
        description:
          'When you make an attack, you can mark a Stress to target another creature within range.',
      },
    ],
    wheelchairFeatures: ['Lightweight frame', 'Enhanced maneuverability'],
  },
  {
    name: 'Improved Light-Frame Wheelchair',
    tier: '2',
    type: 'Primary',
    trait: 'Agility',
    range: 'Melee',
    damage: { diceType: 8, count: 1, modifier: 3, type: 'phy' },
    burden: 'One-Handed',
    domainAffinity: 'Any',
    frameType: 'Light',
    features: [
      {
        name: 'Quick',
        description:
          'When you make an attack, you can mark a Stress to target another creature within range.',
      },
    ],
    wheelchairFeatures: [
      'Lightweight frame',
      'Enhanced maneuverability',
      'Improved suspension',
    ],
  },
  {
    name: 'Advanced Light-Frame Wheelchair',
    tier: '3',
    type: 'Primary',
    trait: 'Agility',
    range: 'Melee',
    damage: { diceType: 8, count: 1, modifier: 6, type: 'phy' },
    burden: 'One-Handed',
    domainAffinity: 'Any',
    frameType: 'Light',
    features: [
      {
        name: 'Quick',
        description:
          'When you make an attack, you can mark a Stress to target another creature within range.',
      },
    ],
    wheelchairFeatures: [
      'Lightweight frame',
      'Enhanced maneuverability',
      'Advanced materials',
    ],
  },
  {
    name: 'Legendary Light-Frame Wheelchair',
    tier: '4',
    type: 'Primary',
    trait: 'Agility',
    range: 'Melee',
    damage: { diceType: 8, count: 1, modifier: 9, type: 'phy' },
    burden: 'One-Handed',
    domainAffinity: 'Any',
    frameType: 'Light',
    features: [
      {
        name: 'Quick',
        description:
          'When you make an attack, you can mark a Stress to target another creature within range.',
      },
    ],
    wheelchairFeatures: [
      'Legendary lightweight frame',
      'Masterwork maneuverability',
      'Mythical materials',
    ],
  },
];

// Heavy Frame Combat Wheelchairs
export const HEAVY_FRAME_WHEELCHAIRS: CombatWheelchair[] = [
  {
    name: 'Heavy-Frame Wheelchair',
    tier: '1',
    type: 'Primary',
    trait: 'Strength',
    range: 'Melee',
    damage: { diceType: 12, count: 1, modifier: 3, type: 'phy' },
    burden: 'Two-Handed',
    domainAffinity: 'Any',
    frameType: 'Heavy',
    features: [
      {
        name: 'Heavy',
        description: '−1 to Evasion',
        modifiers: { evasion: -1 },
      },
    ],
    wheelchairFeatures: [
      'Reinforced frame',
      'Armored plating',
      'Stability systems',
    ],
  },
  {
    name: 'Improved Heavy-Frame Wheelchair',
    tier: '2',
    type: 'Primary',
    trait: 'Strength',
    range: 'Melee',
    damage: { diceType: 12, count: 1, modifier: 6, type: 'phy' },
    burden: 'Two-Handed',
    domainAffinity: 'Any',
    frameType: 'Heavy',
    features: [
      {
        name: 'Heavy',
        description: '−1 to Evasion',
        modifiers: { evasion: -1 },
      },
    ],
    wheelchairFeatures: [
      'Reinforced frame',
      'Enhanced armored plating',
      'Advanced stability',
    ],
  },
  {
    name: 'Advanced Heavy-Frame Wheelchair',
    tier: '3',
    type: 'Primary',
    trait: 'Strength',
    range: 'Melee',
    damage: { diceType: 12, count: 1, modifier: 9, type: 'phy' },
    burden: 'Two-Handed',
    domainAffinity: 'Any',
    frameType: 'Heavy',
    features: [
      {
        name: 'Heavy',
        description: '−1 to Evasion',
        modifiers: { evasion: -1 },
      },
    ],
    wheelchairFeatures: [
      'Advanced reinforced frame',
      'Military-grade armor',
      'Superior stability',
    ],
  },
  {
    name: 'Legendary Heavy-Frame Wheelchair',
    tier: '4',
    type: 'Primary',
    trait: 'Strength',
    range: 'Melee',
    damage: { diceType: 12, count: 1, modifier: 12, type: 'phy' },
    burden: 'Two-Handed',
    domainAffinity: 'Any',
    frameType: 'Heavy',
    features: [
      {
        name: 'Heavy',
        description: '−1 to Evasion',
        modifiers: { evasion: -1 },
      },
    ],
    wheelchairFeatures: [
      'Legendary reinforced frame',
      'Mythical armor plating',
      'Perfect stability',
    ],
  },
];

// Arcane Frame Combat Wheelchairs
export const ARCANE_FRAME_WHEELCHAIRS: CombatWheelchair[] = [
  {
    name: 'Arcane-Frame Wheelchair',
    tier: '1',
    type: 'Primary',
    trait: 'Spellcast',
    range: 'Far',
    damage: { diceType: 6, count: 1, modifier: 0, type: 'mag' },
    burden: 'One-Handed',
    domainAffinity: 'Any',
    frameType: 'Arcane',
    features: [
      {
        name: 'Reliable',
        description: '+1 to attack rolls',
        modifiers: { attackRolls: 1 },
      },
    ],
    wheelchairFeatures: [
      'Magically attuned frame',
      'Spell channeling systems',
      'Arcane mobility',
    ],
  },
  {
    name: 'Improved Arcane-Frame Wheelchair',
    tier: '2',
    type: 'Primary',
    trait: 'Spellcast',
    range: 'Far',
    damage: { diceType: 6, count: 1, modifier: 3, type: 'mag' },
    burden: 'One-Handed',
    domainAffinity: 'Any',
    frameType: 'Arcane',
    features: [
      {
        name: 'Reliable',
        description: '+1 to attack rolls',
        modifiers: { attackRolls: 1 },
      },
    ],
    wheelchairFeatures: [
      'Enhanced magical attunement',
      'Improved spell channeling',
      'Refined arcane mobility',
    ],
  },
  {
    name: 'Advanced Arcane-Frame Wheelchair',
    tier: '3',
    type: 'Primary',
    trait: 'Spellcast',
    range: 'Far',
    damage: { diceType: 6, count: 1, modifier: 6, type: 'mag' },
    burden: 'One-Handed',
    domainAffinity: 'Any',
    frameType: 'Arcane',
    features: [
      {
        name: 'Reliable',
        description: '+1 to attack rolls',
        modifiers: { attackRolls: 1 },
      },
    ],
    wheelchairFeatures: [
      'Advanced magical frame',
      'Masterwork spell systems',
      'Superior arcane control',
    ],
  },
  {
    name: 'Legendary Arcane-Frame Wheelchair',
    tier: '4',
    type: 'Primary',
    trait: 'Spellcast',
    range: 'Far',
    damage: { diceType: 6, count: 1, modifier: 9, type: 'mag' },
    burden: 'One-Handed',
    domainAffinity: 'Any',
    frameType: 'Arcane',
    features: [
      {
        name: 'Reliable',
        description: '+1 to attack rolls',
        modifiers: { attackRolls: 1 },
      },
    ],
    wheelchairFeatures: [
      'Legendary arcane frame',
      'Mythical spell channeling',
      'Perfect magical attunement',
    ],
  },
];

// All combat wheelchairs by frame type
export const COMBAT_WHEELCHAIRS_BY_FRAME = {
  Light: LIGHT_FRAME_WHEELCHAIRS,
  Heavy: HEAVY_FRAME_WHEELCHAIRS,
  Arcane: ARCANE_FRAME_WHEELCHAIRS,
} as const;

// All combat wheelchairs
export const ALL_COMBAT_WHEELCHAIRS: CombatWheelchair[] = [
  ...LIGHT_FRAME_WHEELCHAIRS,
  ...HEAVY_FRAME_WHEELCHAIRS,
  ...ARCANE_FRAME_WHEELCHAIRS,
];
