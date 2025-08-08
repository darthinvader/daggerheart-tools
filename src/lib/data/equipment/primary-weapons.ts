import type { PrimaryWeapon } from '../../schemas/equipment/weapons';
import {
  getBrutalFeature,
  getReliableFeature,
} from '../equipment/common-features';

// Arcana Domain Primary Weapons
export const ARCANA_PRIMARY_WEAPONS: PrimaryWeapon[] = [
  {
    name: 'Crystal Wand',
    tier: '1',
    type: 'Primary',
    trait: 'Spellcast',
    range: 'Far',
    damage: { diceType: 6, count: 1, modifier: 0, type: 'mag' },
    burden: 'One-Handed',
    domainAffinity: 'Arcana',
    features: [getReliableFeature()],
  },
  {
    name: 'Improved Crystal Wand',
    tier: '2',
    type: 'Primary',
    trait: 'Spellcast',
    range: 'Far',
    damage: { diceType: 6, count: 1, modifier: 3, type: 'mag' },
    burden: 'One-Handed',
    domainAffinity: 'Arcana',
    features: [getReliableFeature()],
  },
  {
    name: 'Advanced Crystal Wand',
    tier: '3',
    type: 'Primary',
    trait: 'Spellcast',
    range: 'Far',
    damage: { diceType: 6, count: 1, modifier: 6, type: 'mag' },
    burden: 'One-Handed',
    domainAffinity: 'Arcana',
    features: [{ name: 'Reliable', description: '+1 to attack rolls' }],
  },
  {
    name: 'Legendary Crystal Wand',
    tier: '4',
    type: 'Primary',
    trait: 'Spellcast',
    range: 'Far',
    damage: { diceType: 6, count: 1, modifier: 9, type: 'mag' },
    burden: 'One-Handed',
    domainAffinity: 'Arcana',
    features: [{ name: 'Reliable', description: '+1 to attack rolls' }],
  },
];

// Blade Domain Primary Weapons
export const BLADE_PRIMARY_WEAPONS: PrimaryWeapon[] = [
  {
    name: 'Broadsword',
    tier: '1',
    type: 'Primary',
    trait: 'Agility',
    range: 'Melee',
    damage: { diceType: 8, count: 1, modifier: 0, type: 'phy' },
    burden: 'One-Handed',
    domainAffinity: 'Blade',
    features: [{ name: 'Reliable', description: '+1 to attack rolls' }],
  },
  {
    name: 'Improved Broadsword',
    tier: '2',
    type: 'Primary',
    trait: 'Agility',
    range: 'Melee',
    damage: { diceType: 8, count: 1, modifier: 3, type: 'phy' },
    burden: 'One-Handed',
    domainAffinity: 'Blade',
    features: [{ name: 'Reliable', description: '+1 to attack rolls' }],
  },
  {
    name: 'Advanced Broadsword',
    tier: '3',
    type: 'Primary',
    trait: 'Agility',
    range: 'Melee',
    damage: { diceType: 8, count: 1, modifier: 6, type: 'phy' },
    burden: 'One-Handed',
    domainAffinity: 'Blade',
    features: [{ name: 'Reliable', description: '+1 to attack rolls' }],
  },
  {
    name: 'Legendary Broadsword',
    tier: '4',
    type: 'Primary',
    trait: 'Agility',
    range: 'Melee',
    damage: { diceType: 8, count: 1, modifier: 9, type: 'phy' },
    burden: 'One-Handed',
    domainAffinity: 'Blade',
    features: [{ name: 'Reliable', description: '+1 to attack rolls' }],
  },
];

// Bone Domain Primary Weapons
export const BONE_PRIMARY_WEAPONS: PrimaryWeapon[] = [
  {
    name: 'Bone Club',
    tier: '1',
    type: 'Primary',
    trait: 'Strength',
    range: 'Melee',
    damage: { diceType: 10, count: 1, modifier: 0, type: 'phy' },
    burden: 'Two-Handed',
    domainAffinity: 'Bone',
    features: [getBrutalFeature()],
  },
  {
    name: 'Improved Bone Club',
    tier: '2',
    type: 'Primary',
    trait: 'Strength',
    range: 'Melee',
    damage: { diceType: 10, count: 1, modifier: 3, type: 'phy' },
    burden: 'Two-Handed',
    domainAffinity: 'Bone',
    features: [
      {
        name: 'Brutal',
        description:
          'When you roll the maximum value on a damage die, roll an additional damage die',
      },
    ],
  },
  {
    name: 'Advanced Bone Club',
    tier: '3',
    type: 'Primary',
    trait: 'Strength',
    range: 'Melee',
    damage: { diceType: 10, count: 1, modifier: 6, type: 'phy' },
    burden: 'Two-Handed',
    domainAffinity: 'Bone',
    features: [
      {
        name: 'Brutal',
        description:
          'When you roll the maximum value on a damage die, roll an additional damage die',
      },
    ],
  },
  {
    name: 'Legendary Bone Club',
    tier: '4',
    type: 'Primary',
    trait: 'Strength',
    range: 'Melee',
    damage: { diceType: 10, count: 1, modifier: 9, type: 'phy' },
    burden: 'Two-Handed',
    domainAffinity: 'Bone',
    features: [
      {
        name: 'Brutal',
        description:
          'When you roll the maximum value on a damage die, roll an additional damage die',
      },
    ],
  },
];

// Codex Domain Primary Weapons
export const CODEX_PRIMARY_WEAPONS: PrimaryWeapon[] = [
  {
    name: 'Enchanted Tome',
    tier: '1',
    type: 'Primary',
    trait: 'Spellcast',
    range: 'Far',
    damage: { diceType: 6, count: 1, modifier: 1, type: 'mag' },
    burden: 'One-Handed',
    domainAffinity: 'Codex',
    features: [{ name: 'Reliable', description: '+1 to attack rolls' }],
  },
  {
    name: 'Improved Enchanted Tome',
    tier: '2',
    type: 'Primary',
    trait: 'Spellcast',
    range: 'Far',
    damage: { diceType: 6, count: 1, modifier: 4, type: 'mag' },
    burden: 'One-Handed',
    domainAffinity: 'Codex',
    features: [{ name: 'Reliable', description: '+1 to attack rolls' }],
  },
  {
    name: 'Advanced Enchanted Tome',
    tier: '3',
    type: 'Primary',
    trait: 'Spellcast',
    range: 'Far',
    damage: { diceType: 6, count: 1, modifier: 7, type: 'mag' },
    burden: 'One-Handed',
    domainAffinity: 'Codex',
    features: [{ name: 'Reliable', description: '+1 to attack rolls' }],
  },
  {
    name: 'Legendary Enchanted Tome',
    tier: '4',
    type: 'Primary',
    trait: 'Spellcast',
    range: 'Far',
    damage: { diceType: 6, count: 1, modifier: 10, type: 'mag' },
    burden: 'One-Handed',
    domainAffinity: 'Codex',
    features: [{ name: 'Reliable', description: '+1 to attack rolls' }],
  },
];

// Grace Domain Primary Weapons
export const GRACE_PRIMARY_WEAPONS: PrimaryWeapon[] = [
  {
    name: 'Noble Rapier',
    tier: '1',
    type: 'Primary',
    trait: 'Finesse',
    range: 'Melee',
    damage: { diceType: 8, count: 1, modifier: 0, type: 'phy' },
    burden: 'One-Handed',
    domainAffinity: 'Grace',
    features: [{ name: 'Reliable', description: '+1 to attack rolls' }],
  },
  {
    name: 'Improved Noble Rapier',
    tier: '2',
    type: 'Primary',
    trait: 'Finesse',
    range: 'Melee',
    damage: { diceType: 8, count: 1, modifier: 3, type: 'phy' },
    burden: 'One-Handed',
    domainAffinity: 'Grace',
    features: [{ name: 'Reliable', description: '+1 to attack rolls' }],
  },
  {
    name: 'Advanced Noble Rapier',
    tier: '3',
    type: 'Primary',
    trait: 'Finesse',
    range: 'Melee',
    damage: { diceType: 8, count: 1, modifier: 6, type: 'phy' },
    burden: 'One-Handed',
    domainAffinity: 'Grace',
    features: [{ name: 'Reliable', description: '+1 to attack rolls' }],
  },
  {
    name: 'Legendary Noble Rapier',
    tier: '4',
    type: 'Primary',
    trait: 'Finesse',
    range: 'Melee',
    damage: { diceType: 8, count: 1, modifier: 9, type: 'phy' },
    burden: 'One-Handed',
    domainAffinity: 'Grace',
    features: [{ name: 'Reliable', description: '+1 to attack rolls' }],
  },
];

// Midnight Domain Primary Weapons
export const MIDNIGHT_PRIMARY_WEAPONS: PrimaryWeapon[] = [
  {
    name: 'Shadow Bow',
    tier: '1',
    type: 'Primary',
    trait: 'Finesse',
    range: 'Far',
    damage: { diceType: 8, count: 1, modifier: 0, type: 'phy' },
    burden: 'Two-Handed',
    domainAffinity: 'Midnight',
    features: [{ name: 'Reliable', description: '+1 to attack rolls' }],
  },
  {
    name: 'Improved Shadow Bow',
    tier: '2',
    type: 'Primary',
    trait: 'Finesse',
    range: 'Far',
    damage: { diceType: 8, count: 1, modifier: 3, type: 'phy' },
    burden: 'Two-Handed',
    domainAffinity: 'Midnight',
    features: [{ name: 'Reliable', description: '+1 to attack rolls' }],
  },
  {
    name: 'Advanced Shadow Bow',
    tier: '3',
    type: 'Primary',
    trait: 'Finesse',
    range: 'Far',
    damage: { diceType: 8, count: 1, modifier: 6, type: 'phy' },
    burden: 'Two-Handed',
    domainAffinity: 'Midnight',
    features: [{ name: 'Reliable', description: '+1 to attack rolls' }],
  },
  {
    name: 'Legendary Shadow Bow',
    tier: '4',
    type: 'Primary',
    trait: 'Finesse',
    range: 'Far',
    damage: { diceType: 8, count: 1, modifier: 9, type: 'phy' },
    burden: 'Two-Handed',
    domainAffinity: 'Midnight',
    features: [{ name: 'Reliable', description: '+1 to attack rolls' }],
  },
];

// Sage Domain Primary Weapons
export const SAGE_PRIMARY_WEAPONS: PrimaryWeapon[] = [
  {
    name: 'Stoic Staff',
    tier: '1',
    type: 'Primary',
    trait: 'Instinct',
    range: 'Melee',
    damage: { diceType: 8, count: 1, modifier: 0, type: 'phy' },
    burden: 'Two-Handed',
    domainAffinity: 'Sage',
    features: [{ name: 'Reliable', description: '+1 to attack rolls' }],
  },
  {
    name: 'Improved Stoic Staff',
    tier: '2',
    type: 'Primary',
    trait: 'Instinct',
    range: 'Melee',
    damage: { diceType: 8, count: 1, modifier: 3, type: 'phy' },
    burden: 'Two-Handed',
    domainAffinity: 'Sage',
    features: [{ name: 'Reliable', description: '+1 to attack rolls' }],
  },
  {
    name: 'Advanced Stoic Staff',
    tier: '3',
    type: 'Primary',
    trait: 'Instinct',
    range: 'Melee',
    damage: { diceType: 8, count: 1, modifier: 6, type: 'phy' },
    burden: 'Two-Handed',
    domainAffinity: 'Sage',
    features: [{ name: 'Reliable', description: '+1 to attack rolls' }],
  },
  {
    name: 'Legendary Stoic Staff',
    tier: '4',
    type: 'Primary',
    trait: 'Instinct',
    range: 'Melee',
    damage: { diceType: 8, count: 1, modifier: 9, type: 'phy' },
    burden: 'Two-Handed',
    domainAffinity: 'Sage',
    features: [{ name: 'Reliable', description: '+1 to attack rolls' }],
  },
];

// Splendor Domain Primary Weapons
export const SPLENDOR_PRIMARY_WEAPONS: PrimaryWeapon[] = [
  {
    name: 'Golden Hammer',
    tier: '1',
    type: 'Primary',
    trait: 'Presence',
    range: 'Melee',
    damage: { diceType: 10, count: 1, modifier: 0, type: 'phy' },
    burden: 'Two-Handed',
    domainAffinity: 'Splendor',
    features: [
      {
        name: 'Brutal',
        description:
          'When you roll the maximum value on a damage die, roll an additional damage die',
      },
    ],
  },
  {
    name: 'Improved Golden Hammer',
    tier: '2',
    type: 'Primary',
    trait: 'Presence',
    range: 'Melee',
    damage: { diceType: 10, count: 1, modifier: 3, type: 'phy' },
    burden: 'Two-Handed',
    domainAffinity: 'Splendor',
    features: [
      {
        name: 'Brutal',
        description:
          'When you roll the maximum value on a damage die, roll an additional damage die',
      },
    ],
  },
  {
    name: 'Advanced Golden Hammer',
    tier: '3',
    type: 'Primary',
    trait: 'Presence',
    range: 'Melee',
    damage: { diceType: 10, count: 1, modifier: 6, type: 'phy' },
    burden: 'Two-Handed',
    domainAffinity: 'Splendor',
    features: [
      {
        name: 'Brutal',
        description:
          'When you roll the maximum value on a damage die, roll an additional damage die',
      },
    ],
  },
  {
    name: 'Legendary Golden Hammer',
    tier: '4',
    type: 'Primary',
    trait: 'Presence',
    range: 'Melee',
    damage: { diceType: 10, count: 1, modifier: 9, type: 'phy' },
    burden: 'Two-Handed',
    domainAffinity: 'Splendor',
    features: [
      {
        name: 'Brutal',
        description:
          'When you roll the maximum value on a damage die, roll an additional damage die',
      },
    ],
  },
];

// Valor Domain Primary Weapons
export const VALOR_PRIMARY_WEAPONS: PrimaryWeapon[] = [
  {
    name: 'Greataxe',
    tier: '1',
    type: 'Primary',
    trait: 'Strength',
    range: 'Melee',
    damage: { diceType: 10, count: 1, modifier: 0, type: 'phy' },
    burden: 'Two-Handed',
    domainAffinity: 'Valor',
    features: [
      {
        name: 'Brutal',
        description:
          'When you roll the maximum value on a damage die, roll an additional damage die',
      },
    ],
  },
  {
    name: 'Improved Greataxe',
    tier: '2',
    type: 'Primary',
    trait: 'Strength',
    range: 'Melee',
    damage: { diceType: 10, count: 1, modifier: 3, type: 'phy' },
    burden: 'Two-Handed',
    domainAffinity: 'Valor',
    features: [
      {
        name: 'Brutal',
        description:
          'When you roll the maximum value on a damage die, roll an additional damage die',
      },
    ],
  },
  {
    name: 'Advanced Greataxe',
    tier: '3',
    type: 'Primary',
    trait: 'Strength',
    range: 'Melee',
    damage: { diceType: 10, count: 1, modifier: 6, type: 'phy' },
    burden: 'Two-Handed',
    domainAffinity: 'Valor',
    features: [
      {
        name: 'Brutal',
        description:
          'When you roll the maximum value on a damage die, roll an additional damage die',
      },
    ],
  },
  {
    name: 'Legendary Greataxe',
    tier: '4',
    type: 'Primary',
    trait: 'Strength',
    range: 'Melee',
    damage: { diceType: 10, count: 1, modifier: 9, type: 'phy' },
    burden: 'Two-Handed',
    domainAffinity: 'Valor',
    features: [
      {
        name: 'Brutal',
        description:
          'When you roll the maximum value on a damage die, roll an additional damage die',
      },
    ],
  },
];

// All primary weapons by domain
export const PRIMARY_WEAPONS_BY_DOMAIN = {
  Arcana: ARCANA_PRIMARY_WEAPONS,
  Blade: BLADE_PRIMARY_WEAPONS,
  Bone: BONE_PRIMARY_WEAPONS,
  Codex: CODEX_PRIMARY_WEAPONS,
  Grace: GRACE_PRIMARY_WEAPONS,
  Midnight: MIDNIGHT_PRIMARY_WEAPONS,
  Sage: SAGE_PRIMARY_WEAPONS,
  Splendor: SPLENDOR_PRIMARY_WEAPONS,
  Valor: VALOR_PRIMARY_WEAPONS,
} as const;

// All primary weapons (excluding combat wheelchairs)
export const ALL_PRIMARY_WEAPONS: PrimaryWeapon[] = [
  ...ARCANA_PRIMARY_WEAPONS,
  ...BLADE_PRIMARY_WEAPONS,
  ...BONE_PRIMARY_WEAPONS,
  ...CODEX_PRIMARY_WEAPONS,
  ...GRACE_PRIMARY_WEAPONS,
  ...MIDNIGHT_PRIMARY_WEAPONS,
  ...SAGE_PRIMARY_WEAPONS,
  ...SPLENDOR_PRIMARY_WEAPONS,
  ...VALOR_PRIMARY_WEAPONS,
];
