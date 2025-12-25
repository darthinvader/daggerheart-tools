/* eslint-disable max-lines */
import type { PrimaryWeapon } from '../../schemas/equipment';

// Primary Weapons per SRD (Tier-based, Physical and Magic)
// Tier 1 (Level 1) — Physical
export const TIER_1_PHYSICAL_PRIMARY_WEAPONS: PrimaryWeapon[] = [
  {
    name: 'Broadsword',
    tier: '1',
    type: 'Primary',
    trait: 'Agility',
    range: 'Melee',
    damage: { diceType: 8, count: 1, modifier: 0, type: 'phy' },
    burden: 'One-Handed',
    features: [{ name: 'Reliable', description: '+1 to attack rolls' }],
  },
  {
    name: 'Longsword',
    tier: '1',
    type: 'Primary',
    trait: 'Agility',
    range: 'Melee',
    damage: { diceType: 8, count: 1, modifier: 3, type: 'phy' },
    burden: 'Two-Handed',
    features: [],
  },
  {
    name: 'Battleaxe',
    tier: '1',
    type: 'Primary',
    trait: 'Strength',
    range: 'Melee',
    damage: { diceType: 10, count: 1, modifier: 3, type: 'phy' },
    burden: 'Two-Handed',
    features: [],
  },
  {
    name: 'Greatsword',
    tier: '1',
    type: 'Primary',
    trait: 'Strength',
    range: 'Melee',
    damage: { diceType: 10, count: 1, modifier: 3, type: 'phy' },
    burden: 'Two-Handed',
    features: [
      {
        name: 'Massive',
        description:
          '−1 to Evasion; on a successful attack, roll an additional damage die and discard the lowest result.',
      },
    ],
  },
  {
    name: 'Mace',
    tier: '1',
    type: 'Primary',
    trait: 'Strength',
    range: 'Melee',
    damage: { diceType: 8, count: 1, modifier: 1, type: 'phy' },
    burden: 'One-Handed',
    features: [],
  },
  {
    name: 'Warhammer',
    tier: '1',
    type: 'Primary',
    trait: 'Strength',
    range: 'Melee',
    damage: { diceType: 12, count: 1, modifier: 3, type: 'phy' },
    burden: 'Two-Handed',
    features: [{ name: 'Heavy', description: '−1 to Evasion' }],
  },
  {
    name: 'Dagger',
    tier: '1',
    type: 'Primary',
    trait: 'Finesse',
    range: 'Melee',
    damage: { diceType: 8, count: 1, modifier: 1, type: 'phy' },
    burden: 'One-Handed',
    features: [],
  },
  {
    name: 'Quarterstaff',
    tier: '1',
    type: 'Primary',
    trait: 'Instinct',
    range: 'Melee',
    damage: { diceType: 10, count: 1, modifier: 3, type: 'phy' },
    burden: 'Two-Handed',
    features: [],
  },
  {
    name: 'Cutlass',
    tier: '1',
    type: 'Primary',
    trait: 'Presence',
    range: 'Melee',
    damage: { diceType: 8, count: 1, modifier: 1, type: 'phy' },
    burden: 'One-Handed',
    features: [],
  },
  {
    name: 'Rapier',
    tier: '1',
    type: 'Primary',
    trait: 'Presence',
    range: 'Melee',
    damage: { diceType: 8, count: 1, modifier: 0, type: 'phy' },
    burden: 'One-Handed',
    features: [
      {
        name: 'Quick',
        description:
          'When you make an attack, you can mark a Stress to target another creature within range.',
      },
    ],
  },
  {
    name: 'Halberd',
    tier: '1',
    type: 'Primary',
    trait: 'Strength',
    range: 'Very Close',
    damage: { diceType: 10, count: 1, modifier: 2, type: 'phy' },
    burden: 'Two-Handed',
    features: [{ name: 'Cumbersome', description: '−1 to Finesse' }],
  },
  {
    name: 'Spear',
    tier: '1',
    type: 'Primary',
    trait: 'Finesse',
    range: 'Very Close',
    damage: { diceType: 10, count: 1, modifier: 2, type: 'phy' },
    burden: 'Two-Handed',
    features: [{ name: 'Cumbersome', description: '−1 to Finesse' }],
  },
  {
    name: 'Shortbow',
    tier: '1',
    type: 'Primary',
    trait: 'Agility',
    range: 'Far',
    damage: { diceType: 6, count: 1, modifier: 3, type: 'phy' },
    burden: 'Two-Handed',
    features: [],
  },
  {
    name: 'Crossbow',
    tier: '1',
    type: 'Primary',
    trait: 'Finesse',
    range: 'Far',
    damage: { diceType: 6, count: 1, modifier: 1, type: 'phy' },
    burden: 'One-Handed',
    features: [],
  },
  {
    name: 'Longbow',
    tier: '1',
    type: 'Primary',
    trait: 'Agility',
    range: 'Very Far',
    damage: { diceType: 8, count: 1, modifier: 3, type: 'phy' },
    burden: 'Two-Handed',
    features: [{ name: 'Cumbersome', description: '−1 to Finesse' }],
  },
];

// Tier 1 (Level 1) — Magic (Requires Spellcast to wield)
export const TIER_1_MAGIC_PRIMARY_WEAPONS: PrimaryWeapon[] = [
  {
    name: 'Arcane Gauntlets',
    tier: '1',
    type: 'Primary',
    trait: 'Strength',
    range: 'Melee',
    damage: { diceType: 10, count: 1, modifier: 3, type: 'mag' },
    burden: 'Two-Handed',
    features: [],
  },
  {
    name: 'Hallowed Axe',
    tier: '1',
    type: 'Primary',
    trait: 'Strength',
    range: 'Melee',
    damage: { diceType: 8, count: 1, modifier: 1, type: 'mag' },
    burden: 'One-Handed',
    features: [],
  },
  {
    name: 'Glowing Rings',
    tier: '1',
    type: 'Primary',
    trait: 'Agility',
    range: 'Very Close',
    damage: { diceType: 10, count: 1, modifier: 1, type: 'mag' },
    burden: 'Two-Handed',
    features: [],
  },
  {
    name: 'Hand Runes',
    tier: '1',
    type: 'Primary',
    trait: 'Instinct',
    range: 'Very Close',
    damage: { diceType: 10, count: 1, modifier: 0, type: 'mag' },
    burden: 'One-Handed',
    features: [],
  },
  {
    name: 'Returning Blade',
    tier: '1',
    type: 'Primary',
    trait: 'Finesse',
    range: 'Close',
    damage: { diceType: 8, count: 1, modifier: 0, type: 'mag' },
    burden: 'One-Handed',
    features: [
      {
        name: 'Returning',
        description:
          'When this weapon is thrown within its range, it appears in your hand immediately after the attack.',
      },
    ],
  },
  {
    name: 'Shortstaff',
    tier: '1',
    type: 'Primary',
    trait: 'Instinct',
    range: 'Close',
    damage: { diceType: 8, count: 1, modifier: 1, type: 'mag' },
    burden: 'One-Handed',
    features: [],
  },
  {
    name: 'Dualstaff',
    tier: '1',
    type: 'Primary',
    trait: 'Instinct',
    range: 'Far',
    damage: { diceType: 6, count: 1, modifier: 3, type: 'mag' },
    burden: 'Two-Handed',
    features: [],
  },
  {
    name: 'Scepter',
    tier: '1',
    type: 'Primary',
    trait: 'Presence',
    range: 'Far',
    damage: { diceType: 6, count: 1, modifier: 0, type: 'mag' },
    burden: 'Two-Handed',
    features: [
      {
        name: 'Versatile',
        description:
          'This weapon can also be used with these statistics—Presence, Melee, d8.',
      },
    ],
  },
  {
    name: 'Wand',
    tier: '1',
    type: 'Primary',
    trait: 'Knowledge',
    range: 'Far',
    damage: { diceType: 6, count: 1, modifier: 1, type: 'mag' },
    burden: 'One-Handed',
    features: [],
  },
  {
    name: 'Greatstaff',
    tier: '1',
    type: 'Primary',
    trait: 'Knowledge',
    range: 'Very Far',
    damage: { diceType: 6, count: 1, modifier: 0, type: 'mag' },
    burden: 'Two-Handed',
    features: [
      {
        name: 'Powerful',
        description:
          'On a successful attack, roll an additional damage die and discard the lowest result.',
      },
    ],
  },
];

// Tier 2 (Levels 2–4) — Physical
export const TIER_2_PHYSICAL_PRIMARY_WEAPONS: PrimaryWeapon[] = [
  {
    name: 'Improved Broadsword',
    tier: '2',
    type: 'Primary',
    trait: 'Agility',
    range: 'Melee',
    damage: { diceType: 8, count: 1, modifier: 3, type: 'phy' },
    burden: 'One-Handed',
    features: [{ name: 'Reliable', description: '+1 to attack rolls' }],
  },
  {
    name: 'Improved Longsword',
    tier: '2',
    type: 'Primary',
    trait: 'Agility',
    range: 'Melee',
    damage: { diceType: 8, count: 1, modifier: 6, type: 'phy' },
    burden: 'Two-Handed',
    features: [],
  },
  {
    name: 'Improved Battleaxe',
    tier: '2',
    type: 'Primary',
    trait: 'Strength',
    range: 'Melee',
    damage: { diceType: 10, count: 1, modifier: 6, type: 'phy' },
    burden: 'Two-Handed',
    features: [],
  },
  {
    name: 'Improved Greatsword',
    tier: '2',
    type: 'Primary',
    trait: 'Strength',
    range: 'Melee',
    damage: { diceType: 10, count: 1, modifier: 6, type: 'phy' },
    burden: 'Two-Handed',
    features: [
      {
        name: 'Massive',
        description:
          '−1 to Evasion; on a successful attack, roll an additional damage die and discard the lowest result.',
      },
    ],
  },
  {
    name: 'Improved Mace',
    tier: '2',
    type: 'Primary',
    trait: 'Strength',
    range: 'Melee',
    damage: { diceType: 8, count: 1, modifier: 4, type: 'phy' },
    burden: 'One-Handed',
    features: [],
  },
  {
    name: 'Improved Warhammer',
    tier: '2',
    type: 'Primary',
    trait: 'Strength',
    range: 'Melee',
    damage: { diceType: 12, count: 1, modifier: 6, type: 'phy' },
    burden: 'Two-Handed',
    features: [{ name: 'Heavy', description: '−1 to Evasion' }],
  },
  {
    name: 'Improved Dagger',
    tier: '2',
    type: 'Primary',
    trait: 'Finesse',
    range: 'Melee',
    damage: { diceType: 8, count: 1, modifier: 4, type: 'phy' },
    burden: 'One-Handed',
    features: [],
  },
  {
    name: 'Improved Quarterstaff',
    tier: '2',
    type: 'Primary',
    trait: 'Instinct',
    range: 'Melee',
    damage: { diceType: 10, count: 1, modifier: 6, type: 'phy' },
    burden: 'Two-Handed',
    features: [],
  },
  {
    name: 'Improved Cutlass',
    tier: '2',
    type: 'Primary',
    trait: 'Presence',
    range: 'Melee',
    damage: { diceType: 8, count: 1, modifier: 4, type: 'phy' },
    burden: 'One-Handed',
    features: [],
  },
  {
    name: 'Improved Rapier',
    tier: '2',
    type: 'Primary',
    trait: 'Presence',
    range: 'Melee',
    damage: { diceType: 8, count: 1, modifier: 3, type: 'phy' },
    burden: 'One-Handed',
    features: [
      {
        name: 'Quick',
        description:
          'When you make an attack, you can mark a Stress to target another creature within range.',
      },
    ],
  },
  {
    name: 'Improved Halberd',
    tier: '2',
    type: 'Primary',
    trait: 'Strength',
    range: 'Very Close',
    damage: { diceType: 10, count: 1, modifier: 5, type: 'phy' },
    burden: 'Two-Handed',
    features: [{ name: 'Cumbersome', description: '−1 to Finesse' }],
  },
  {
    name: 'Improved Spear',
    tier: '2',
    type: 'Primary',
    trait: 'Finesse',
    range: 'Very Close',
    damage: { diceType: 10, count: 1, modifier: 5, type: 'phy' },
    burden: 'Two-Handed',
    features: [{ name: 'Cumbersome', description: '−1 to Finesse' }],
  },
  {
    name: 'Improved Shortbow',
    tier: '2',
    type: 'Primary',
    trait: 'Agility',
    range: 'Far',
    damage: { diceType: 6, count: 1, modifier: 6, type: 'phy' },
    burden: 'Two-Handed',
    features: [],
  },
  {
    name: 'Improved Crossbow',
    tier: '2',
    type: 'Primary',
    trait: 'Finesse',
    range: 'Far',
    damage: { diceType: 6, count: 1, modifier: 4, type: 'phy' },
    burden: 'One-Handed',
    features: [],
  },
  {
    name: 'Improved Longbow',
    tier: '2',
    type: 'Primary',
    trait: 'Agility',
    range: 'Very Far',
    damage: { diceType: 8, count: 1, modifier: 6, type: 'phy' },
    burden: 'Two-Handed',
    features: [{ name: 'Cumbersome', description: '−1 to Finesse' }],
  },
  // Named SRD weapons (Tier 2 Physical)
  {
    name: 'Gilded Falchion',
    tier: '2',
    type: 'Primary',
    trait: 'Strength',
    range: 'Melee',
    damage: { diceType: 10, count: 1, modifier: 4, type: 'phy' },
    burden: 'One-Handed',
    features: [
      {
        name: 'Powerful',
        description:
          'On a successful attack, roll an additional damage die and discard the lowest result.',
      },
    ],
  },
  {
    name: 'Knuckle Blades',
    tier: '2',
    type: 'Primary',
    trait: 'Strength',
    range: 'Melee',
    damage: { diceType: 10, count: 1, modifier: 6, type: 'phy' },
    burden: 'Two-Handed',
    features: [
      {
        name: 'Brutal',
        description:
          'When you roll the maximum value on a damage die, roll an additional damage die.',
      },
    ],
  },
  {
    name: 'Urok Broadsword',
    tier: '2',
    type: 'Primary',
    trait: 'Finesse',
    range: 'Melee',
    damage: { diceType: 8, count: 1, modifier: 3, type: 'phy' },
    burden: 'One-Handed',
    features: [
      {
        name: 'Deadly',
        description:
          'When you deal Severe damage, the target must mark an additional HP.',
      },
    ],
  },
  {
    name: 'Bladed Whip',
    tier: '2',
    type: 'Primary',
    trait: 'Agility',
    range: 'Very Close',
    damage: { diceType: 8, count: 1, modifier: 3, type: 'phy' },
    burden: 'One-Handed',
    features: [
      {
        name: 'Quick',
        description:
          'When you make an attack, you can mark a Stress to target another creature within range.',
      },
    ],
  },
  {
    name: 'Steelforged Halberd',
    tier: '2',
    type: 'Primary',
    trait: 'Strength',
    range: 'Very Close',
    damage: { diceType: 8, count: 1, modifier: 4, type: 'phy' },
    burden: 'Two-Handed',
    features: [
      {
        name: 'Scary',
        description: 'On a successful attack, the target must mark a Stress.',
      },
    ],
  },
  {
    name: 'War Scythe',
    tier: '2',
    type: 'Primary',
    trait: 'Finesse',
    range: 'Very Close',
    damage: { diceType: 8, count: 1, modifier: 5, type: 'phy' },
    burden: 'Two-Handed',
    features: [{ name: 'Reliable', description: '+1 to attack rolls' }],
  },
  {
    name: 'Blunderbuss',
    tier: '2',
    type: 'Primary',
    trait: 'Finesse',
    range: 'Close',
    damage: { diceType: 8, count: 1, modifier: 6, type: 'phy' },
    burden: 'Two-Handed',
    features: [
      {
        name: 'Reloading',
        description:
          'After you make an attack, roll a d6. On a result of 1, you must mark a Stress to reload this weapon before you can fire it again.',
      },
    ],
  },
  {
    name: 'Greatbow',
    tier: '2',
    type: 'Primary',
    trait: 'Strength',
    range: 'Far',
    damage: { diceType: 6, count: 1, modifier: 6, type: 'phy' },
    burden: 'Two-Handed',
    features: [
      {
        name: 'Powerful',
        description:
          'On a successful attack, roll an additional damage die and discard the lowest result.',
      },
    ],
  },
  {
    name: 'Finehair Bow',
    tier: '2',
    type: 'Primary',
    trait: 'Agility',
    range: 'Very Far',
    damage: { diceType: 6, count: 1, modifier: 5, type: 'phy' },
    burden: 'Two-Handed',
    features: [{ name: 'Reliable', description: '+1 to attack rolls' }],
  },
];

// Tier 2 (Levels 2–4) — Magic (Requires Spellcast to wield)
export const TIER_2_MAGIC_PRIMARY_WEAPONS: PrimaryWeapon[] = [
  {
    name: 'Improved Arcane Gauntlets',
    tier: '2',
    type: 'Primary',
    trait: 'Strength',
    range: 'Melee',
    damage: { diceType: 10, count: 1, modifier: 6, type: 'mag' },
    burden: 'Two-Handed',
    features: [],
  },
  {
    name: 'Improved Hallowed Axe',
    tier: '2',
    type: 'Primary',
    trait: 'Strength',
    range: 'Melee',
    damage: { diceType: 8, count: 1, modifier: 4, type: 'mag' },
    burden: 'One-Handed',
    features: [],
  },
  {
    name: 'Improved Glowing Rings',
    tier: '2',
    type: 'Primary',
    trait: 'Agility',
    range: 'Very Close',
    damage: { diceType: 10, count: 1, modifier: 5, type: 'mag' },
    burden: 'Two-Handed',
    features: [],
  },
  {
    name: 'Improved Hand Runes',
    tier: '2',
    type: 'Primary',
    trait: 'Instinct',
    range: 'Very Close',
    damage: { diceType: 10, count: 1, modifier: 3, type: 'mag' },
    burden: 'One-Handed',
    features: [],
  },
  {
    name: 'Improved Returning Blade',
    tier: '2',
    type: 'Primary',
    trait: 'Finesse',
    range: 'Close',
    damage: { diceType: 8, count: 1, modifier: 3, type: 'mag' },
    burden: 'One-Handed',
    features: [
      {
        name: 'Returning',
        description:
          'When this weapon is thrown within its range, it appears in your hand immediately after the attack.',
      },
    ],
  },
  {
    name: 'Improved Shortstaff',
    tier: '2',
    type: 'Primary',
    trait: 'Instinct',
    range: 'Close',
    damage: { diceType: 8, count: 1, modifier: 4, type: 'mag' },
    burden: 'One-Handed',
    features: [],
  },
  {
    name: 'Improved Dualstaff',
    tier: '2',
    type: 'Primary',
    trait: 'Instinct',
    range: 'Far',
    damage: { diceType: 6, count: 1, modifier: 6, type: 'mag' },
    burden: 'Two-Handed',
    features: [],
  },
  {
    name: 'Improved Scepter',
    tier: '2',
    type: 'Primary',
    trait: 'Presence',
    range: 'Far',
    damage: { diceType: 6, count: 1, modifier: 3, type: 'mag' },
    burden: 'Two-Handed',
    features: [
      {
        name: 'Versatile',
        description:
          'This weapon can also be used with these statistics—Presence, Melee, d8+3.',
      },
    ],
  },
  {
    name: 'Improved Wand',
    tier: '2',
    type: 'Primary',
    trait: 'Knowledge',
    range: 'Far',
    damage: { diceType: 6, count: 1, modifier: 4, type: 'mag' },
    burden: 'One-Handed',
    features: [],
  },
  {
    name: 'Improved Greatstaff',
    tier: '2',
    type: 'Primary',
    trait: 'Knowledge',
    range: 'Very Far',
    damage: { diceType: 6, count: 1, modifier: 3, type: 'mag' },
    burden: 'Two-Handed',
    features: [
      {
        name: 'Powerful',
        description:
          'On a successful attack, roll an additional damage die and discard the lowest result.',
      },
    ],
  },
  // Named SRD weapons (Tier 2 Magic)
  {
    name: 'Ego Blade',
    tier: '2',
    type: 'Primary',
    trait: 'Agility',
    range: 'Melee',
    damage: { diceType: 12, count: 1, modifier: 4, type: 'mag' },
    burden: 'One-Handed',
    features: [
      {
        name: 'Pompous',
        description:
          'You must have a Presence of 0 or lower to use this weapon.',
      },
    ],
  },
  {
    name: 'Casting Sword',
    tier: '2',
    type: 'Primary',
    trait: 'Strength',
    range: 'Melee',
    damage: { diceType: 10, count: 1, modifier: 4, type: 'mag' },
    burden: 'Two-Handed',
    features: [
      {
        name: 'Versatile',
        description:
          'This weapon can also be used with these statistics—Knowledge, Far, d6+3.',
      },
    ],
  },
  {
    name: 'Devouring Dagger',
    tier: '2',
    type: 'Primary',
    trait: 'Finesse',
    range: 'Melee',
    damage: { diceType: 8, count: 1, modifier: 4, type: 'mag' },
    burden: 'One-Handed',
    features: [
      {
        name: 'Scary',
        description: 'On a successful attack, the target must mark a Stress.',
      },
    ],
  },
  {
    name: 'Hammer of Exota',
    tier: '2',
    type: 'Primary',
    trait: 'Instinct',
    range: 'Melee',
    damage: { diceType: 8, count: 1, modifier: 6, type: 'mag' },
    burden: 'Two-Handed',
    features: [
      {
        name: 'Eruptive',
        description:
          'On a successful attack against a target within Melee range, all other adversaries within Very Close range must succeed on a reaction roll (14) or take half damage.',
      },
    ],
  },
  {
    name: 'Yutari Bloodbow',
    tier: '2',
    type: 'Primary',
    trait: 'Finesse',
    range: 'Far',
    damage: { diceType: 6, count: 1, modifier: 4, type: 'mag' },
    burden: 'Two-Handed',
    features: [
      {
        name: 'Brutal',
        description:
          'When you roll the maximum value on a damage die, roll an additional damage die.',
      },
    ],
  },
  {
    name: 'Elder Bow',
    tier: '2',
    type: 'Primary',
    trait: 'Instinct',
    range: 'Far',
    damage: { diceType: 6, count: 1, modifier: 4, type: 'mag' },
    burden: 'Two-Handed',
    features: [
      {
        name: 'Powerful',
        description:
          'On a successful attack, roll an additional damage die and discard the lowest result.',
      },
    ],
  },
  {
    name: 'Scepter of Elias',
    tier: '2',
    type: 'Primary',
    trait: 'Presence',
    range: 'Far',
    damage: { diceType: 6, count: 1, modifier: 3, type: 'mag' },
    burden: 'One-Handed',
    features: [
      {
        name: 'Invigorating',
        description:
          'On a successful attack, roll a d4. On a result of 4, clear a Stress.',
      },
    ],
  },
  {
    name: 'Wand of Enthrallment',
    tier: '2',
    type: 'Primary',
    trait: 'Presence',
    range: 'Far',
    damage: { diceType: 6, count: 1, modifier: 4, type: 'mag' },
    burden: 'One-Handed',
    features: [
      {
        name: 'Persuasive',
        description:
          'Before you make a Presence Roll, you can mark a Stress to gain a +2 bonus to the result.',
      },
    ],
  },
  {
    name: "Keeper's Staff",
    tier: '2',
    type: 'Primary',
    trait: 'Knowledge',
    range: 'Far',
    damage: { diceType: 6, count: 1, modifier: 4, type: 'mag' },
    burden: 'Two-Handed',
    features: [{ name: 'Reliable', description: '+1 to attack rolls' }],
  },
];

// Tier 3 (Levels 5–7) — Physical
export const TIER_3_PHYSICAL_PRIMARY_WEAPONS: PrimaryWeapon[] = [
  {
    name: 'Advanced Broadsword',
    tier: '3',
    type: 'Primary',
    trait: 'Agility',
    range: 'Melee',
    damage: { diceType: 8, count: 1, modifier: 6, type: 'phy' },
    burden: 'One-Handed',
    features: [{ name: 'Reliable', description: '+1 to attack rolls' }],
  },
  {
    name: 'Advanced Longsword',
    tier: '3',
    type: 'Primary',
    trait: 'Agility',
    range: 'Melee',
    damage: { diceType: 8, count: 1, modifier: 9, type: 'phy' },
    burden: 'Two-Handed',
    features: [],
  },
  {
    name: 'Advanced Battleaxe',
    tier: '3',
    type: 'Primary',
    trait: 'Strength',
    range: 'Melee',
    damage: { diceType: 10, count: 1, modifier: 9, type: 'phy' },
    burden: 'Two-Handed',
    features: [],
  },
  {
    name: 'Advanced Greatsword',
    tier: '3',
    type: 'Primary',
    trait: 'Strength',
    range: 'Melee',
    damage: { diceType: 10, count: 1, modifier: 9, type: 'phy' },
    burden: 'Two-Handed',
    features: [
      {
        name: 'Massive',
        description:
          '−1 to Evasion; on a successful attack, roll an additional damage die and discard the lowest result.',
      },
    ],
  },
  {
    name: 'Advanced Mace',
    tier: '3',
    type: 'Primary',
    trait: 'Strength',
    range: 'Melee',
    damage: { diceType: 8, count: 1, modifier: 7, type: 'phy' },
    burden: 'One-Handed',
    features: [],
  },
  {
    name: 'Advanced Warhammer',
    tier: '3',
    type: 'Primary',
    trait: 'Strength',
    range: 'Melee',
    damage: { diceType: 12, count: 1, modifier: 9, type: 'phy' },
    burden: 'Two-Handed',
    features: [{ name: 'Heavy', description: '−1 to Evasion' }],
  },
  {
    name: 'Advanced Dagger',
    tier: '3',
    type: 'Primary',
    trait: 'Finesse',
    range: 'Melee',
    damage: { diceType: 8, count: 1, modifier: 7, type: 'phy' },
    burden: 'One-Handed',
    features: [],
  },
  {
    name: 'Advanced Quarterstaff',
    tier: '3',
    type: 'Primary',
    trait: 'Instinct',
    range: 'Melee',
    damage: { diceType: 10, count: 1, modifier: 9, type: 'phy' },
    burden: 'Two-Handed',
    features: [],
  },
  {
    name: 'Advanced Cutlass',
    tier: '3',
    type: 'Primary',
    trait: 'Presence',
    range: 'Melee',
    damage: { diceType: 8, count: 1, modifier: 7, type: 'phy' },
    burden: 'One-Handed',
    features: [],
  },
  {
    name: 'Advanced Rapier',
    tier: '3',
    type: 'Primary',
    trait: 'Presence',
    range: 'Melee',
    damage: { diceType: 8, count: 1, modifier: 6, type: 'phy' },
    burden: 'One-Handed',
    features: [
      {
        name: 'Quick',
        description:
          'When you make an attack, you can mark a Stress to target another creature within range.',
      },
    ],
  },
  {
    name: 'Advanced Halberd',
    tier: '3',
    type: 'Primary',
    trait: 'Strength',
    range: 'Very Close',
    damage: { diceType: 10, count: 1, modifier: 8, type: 'phy' },
    burden: 'Two-Handed',
    features: [{ name: 'Cumbersome', description: '−1 to Finesse' }],
  },
  {
    name: 'Advanced Spear',
    tier: '3',
    type: 'Primary',
    trait: 'Finesse',
    range: 'Very Close',
    damage: { diceType: 10, count: 1, modifier: 8, type: 'phy' },
    burden: 'Two-Handed',
    features: [{ name: 'Cumbersome', description: '−1 to Finesse' }],
  },
  {
    name: 'Advanced Shortbow',
    tier: '3',
    type: 'Primary',
    trait: 'Agility',
    range: 'Far',
    damage: { diceType: 6, count: 1, modifier: 9, type: 'phy' },
    burden: 'Two-Handed',
    features: [],
  },
  {
    name: 'Advanced Crossbow',
    tier: '3',
    type: 'Primary',
    trait: 'Finesse',
    range: 'Far',
    damage: { diceType: 6, count: 1, modifier: 7, type: 'phy' },
    burden: 'One-Handed',
    features: [],
  },
  {
    name: 'Advanced Longbow',
    tier: '3',
    type: 'Primary',
    trait: 'Agility',
    range: 'Very Far',
    damage: { diceType: 8, count: 1, modifier: 9, type: 'phy' },
    burden: 'Two-Handed',
    features: [{ name: 'Cumbersome', description: '−1 to Finesse' }],
  },
  // Named SRD weapons (Tier 3 Physical)
  {
    name: 'Flickerfly Blade',
    tier: '3',
    type: 'Primary',
    trait: 'Agility',
    range: 'Melee',
    damage: { diceType: 8, count: 1, modifier: 5, type: 'phy' },
    burden: 'One-Handed',
    features: [
      {
        name: 'Sharpwing',
        description: 'Gain a bonus to your damage rolls equal to your Agility.',
      },
    ],
  },
  {
    name: 'Bravesword',
    tier: '3',
    type: 'Primary',
    trait: 'Strength',
    range: 'Melee',
    damage: { diceType: 12, count: 1, modifier: 7, type: 'phy' },
    burden: 'Two-Handed',
    features: [
      {
        name: 'Brave',
        description: '−1 to Evasion; +3 to Severe damage threshold',
      },
    ],
  },
  {
    name: 'Hammer of Wrath',
    tier: '3',
    type: 'Primary',
    trait: 'Strength',
    range: 'Melee',
    damage: { diceType: 10, count: 1, modifier: 7, type: 'phy' },
    burden: 'Two-Handed',
    features: [
      {
        name: 'Devastating',
        description:
          'Before you make an attack roll, you can mark a Stress to use a d20 as your damage die.',
      },
    ],
  },
  {
    name: 'Labrys Axe',
    tier: '3',
    type: 'Primary',
    trait: 'Strength',
    range: 'Melee',
    damage: { diceType: 10, count: 1, modifier: 7, type: 'phy' },
    burden: 'Two-Handed',
    features: [{ name: 'Protective', description: '+1 to Armor Score' }],
  },
  {
    name: 'Meridian Cutlass',
    tier: '3',
    type: 'Primary',
    trait: 'Presence',
    range: 'Melee',
    damage: { diceType: 10, count: 1, modifier: 5, type: 'phy' },
    burden: 'One-Handed',
    features: [
      {
        name: 'Dueling',
        description:
          'When there are no other creatures within Close range of the target, gain advantage on your attack roll against them.',
      },
    ],
  },
  {
    name: 'Retractable Saber',
    tier: '3',
    type: 'Primary',
    trait: 'Presence',
    range: 'Melee',
    damage: { diceType: 10, count: 1, modifier: 7, type: 'phy' },
    burden: 'One-Handed',
    features: [
      {
        name: 'Retractable',
        description: 'The blade can be hidden in the hilt to avoid detection.',
      },
    ],
  },
  {
    name: 'Double Flail',
    tier: '3',
    type: 'Primary',
    trait: 'Agility',
    range: 'Very Close',
    damage: { diceType: 10, count: 1, modifier: 8, type: 'phy' },
    burden: 'Two-Handed',
    features: [
      {
        name: 'Powerful',
        description:
          'On a successful attack, roll an additional damage die and discard the lowest result.',
      },
    ],
  },
  {
    name: 'Talon Blades',
    tier: '3',
    type: 'Primary',
    trait: 'Finesse',
    range: 'Close',
    damage: { diceType: 10, count: 1, modifier: 7, type: 'phy' },
    burden: 'Two-Handed',
    features: [
      {
        name: 'Brutal',
        description:
          'When you roll the maximum value on a damage die, roll an additional damage die.',
      },
    ],
  },
  {
    name: 'Black Powder Revolver',
    tier: '3',
    type: 'Primary',
    trait: 'Finesse',
    range: 'Far',
    damage: { diceType: 6, count: 1, modifier: 8, type: 'phy' },
    burden: 'One-Handed',
    features: [
      {
        name: 'Reloading',
        description:
          'After you make an attack, roll a d6. On a result of 1, you must mark a Stress to reload this weapon before you can fire it again.',
      },
    ],
  },
  {
    name: 'Spiked Bow',
    tier: '3',
    type: 'Primary',
    trait: 'Agility',
    range: 'Very Far',
    damage: { diceType: 6, count: 1, modifier: 7, type: 'phy' },
    burden: 'Two-Handed',
    features: [
      {
        name: 'Versatile',
        description:
          'This weapon can also be used with these statistics—Agility, Melee, d10+5.',
      },
    ],
  },
];

// Tier 3 (Levels 5–7) — Magic (Requires Spellcast to wield)
export const TIER_3_MAGIC_PRIMARY_WEAPONS: PrimaryWeapon[] = [
  {
    name: 'Advanced Arcane Gauntlets',
    tier: '3',
    type: 'Primary',
    trait: 'Strength',
    range: 'Melee',
    damage: { diceType: 10, count: 1, modifier: 9, type: 'mag' },
    burden: 'Two-Handed',
    features: [],
  },
  {
    name: 'Advanced Hallowed Axe',
    tier: '3',
    type: 'Primary',
    trait: 'Strength',
    range: 'Melee',
    damage: { diceType: 8, count: 1, modifier: 7, type: 'mag' },
    burden: 'One-Handed',
    features: [],
  },
  {
    name: 'Advanced Glowing Rings',
    tier: '3',
    type: 'Primary',
    trait: 'Agility',
    range: 'Very Close',
    damage: { diceType: 10, count: 1, modifier: 8, type: 'mag' },
    burden: 'Two-Handed',
    features: [],
  },
  {
    name: 'Advanced Hand Runes',
    tier: '3',
    type: 'Primary',
    trait: 'Instinct',
    range: 'Very Close',
    damage: { diceType: 10, count: 1, modifier: 6, type: 'mag' },
    burden: 'One-Handed',
    features: [],
  },
  {
    name: 'Advanced Returning Blade',
    tier: '3',
    type: 'Primary',
    trait: 'Finesse',
    range: 'Close',
    damage: { diceType: 8, count: 1, modifier: 6, type: 'mag' },
    burden: 'One-Handed',
    features: [
      {
        name: 'Returning',
        description:
          'When this weapon is thrown within its range, it appears in your hand immediately after the attack.',
      },
    ],
  },
  {
    name: 'Advanced Shortstaff',
    tier: '3',
    type: 'Primary',
    trait: 'Instinct',
    range: 'Close',
    damage: { diceType: 8, count: 1, modifier: 7, type: 'mag' },
    burden: 'One-Handed',
    features: [],
  },
  {
    name: 'Advanced Dualstaff',
    tier: '3',
    type: 'Primary',
    trait: 'Instinct',
    range: 'Far',
    damage: { diceType: 6, count: 1, modifier: 9, type: 'mag' },
    burden: 'Two-Handed',
    features: [],
  },
  {
    name: 'Advanced Scepter',
    tier: '3',
    type: 'Primary',
    trait: 'Presence',
    range: 'Far',
    damage: { diceType: 6, count: 1, modifier: 6, type: 'mag' },
    burden: 'Two-Handed',
    features: [
      {
        name: 'Versatile',
        description:
          'This weapon can also be used with these statistics—Presence, Melee, d8+4.',
      },
    ],
  },
  {
    name: 'Advanced Wand',
    tier: '3',
    type: 'Primary',
    trait: 'Knowledge',
    range: 'Far',
    damage: { diceType: 6, count: 1, modifier: 7, type: 'mag' },
    burden: 'One-Handed',
    features: [],
  },
  {
    name: 'Advanced Greatstaff',
    tier: '3',
    type: 'Primary',
    trait: 'Knowledge',
    range: 'Very Far',
    damage: { diceType: 6, count: 1, modifier: 6, type: 'mag' },
    burden: 'Two-Handed',
    features: [
      {
        name: 'Powerful',
        description:
          'On a successful attack, roll an additional damage die and discard the lowest result.',
      },
    ],
  },
  // Named SRD weapons (Tier 3 Magic)
  {
    name: 'Axe of Fortunis',
    tier: '3',
    type: 'Primary',
    trait: 'Strength',
    range: 'Melee',
    damage: { diceType: 10, count: 1, modifier: 8, type: 'mag' },
    burden: 'Two-Handed',
    features: [
      {
        name: 'Lucky',
        description:
          'On a failed attack, you can mark a Stress to reroll your attack.',
      },
    ],
  },
  {
    name: 'Blessed Anlace',
    tier: '3',
    type: 'Primary',
    trait: 'Instinct',
    range: 'Melee',
    damage: { diceType: 10, count: 1, modifier: 6, type: 'mag' },
    burden: 'One-Handed',
    features: [
      {
        name: 'Healing',
        description: 'During downtime, automatically clear a Hit Point.',
      },
    ],
  },
  {
    name: 'Ghostblade',
    tier: '3',
    type: 'Primary',
    trait: 'Presence',
    range: 'Melee',
    damage: { diceType: 10, count: 1, modifier: 7, type: 'phy' },
    burden: 'One-Handed',
    features: [
      {
        name: 'Otherworldly',
        description:
          'On a successful attack, you can deal physical or magic damage.',
      },
    ],
  },
  {
    name: 'Runes of Ruination',
    tier: '3',
    type: 'Primary',
    trait: 'Knowledge',
    range: 'Very Close',
    damage: { diceType: 20, count: 1, modifier: 4, type: 'mag' },
    burden: 'One-Handed',
    features: [
      {
        name: 'Painful',
        description:
          'Each time you make a successful attack, you must mark a Stress.',
      },
    ],
  },
  {
    name: 'Widogast Pendant',
    tier: '3',
    type: 'Primary',
    trait: 'Knowledge',
    range: 'Close',
    damage: { diceType: 10, count: 1, modifier: 5, type: 'mag' },
    burden: 'One-Handed',
    features: [
      {
        name: 'Timebending',
        description:
          'You choose the target of your attack after making your attack roll.',
      },
    ],
  },
  {
    name: 'Gilded Bow',
    tier: '3',
    type: 'Primary',
    trait: 'Finesse',
    range: 'Far',
    damage: { diceType: 6, count: 1, modifier: 7, type: 'mag' },
    burden: 'Two-Handed',
    features: [
      {
        name: 'Self-Correcting',
        description:
          'When you roll a 1 on a damage die, it deals 6 damage instead.',
      },
    ],
  },
  {
    name: 'Firestaff',
    tier: '3',
    type: 'Primary',
    trait: 'Instinct',
    range: 'Far',
    damage: { diceType: 6, count: 1, modifier: 7, type: 'mag' },
    burden: 'Two-Handed',
    features: [
      {
        name: 'Burning',
        description:
          'When you roll a 6 on a damage die, the target must mark a Stress.',
      },
    ],
  },
  {
    name: 'Mage Orb',
    tier: '3',
    type: 'Primary',
    trait: 'Knowledge',
    range: 'Far',
    damage: { diceType: 6, count: 1, modifier: 7, type: 'mag' },
    burden: 'One-Handed',
    features: [
      {
        name: 'Powerful',
        description:
          'On a successful attack, roll an additional damage die and discard the lowest result.',
      },
    ],
  },
  {
    name: "Ilmari's Rifle",
    tier: '3',
    type: 'Primary',
    trait: 'Finesse',
    range: 'Very Far',
    damage: { diceType: 6, count: 1, modifier: 6, type: 'mag' },
    burden: 'One-Handed',
    features: [
      {
        name: 'Reloading',
        description:
          'After you make an attack, roll a d6. On a result of 1, you must mark a Stress to reload this weapon before you can fire it again.',
      },
    ],
  },
];

// Tier 4 (Levels 8–10) — Physical
export const TIER_4_PHYSICAL_PRIMARY_WEAPONS: PrimaryWeapon[] = [
  {
    name: 'Legendary Broadsword',
    tier: '4',
    type: 'Primary',
    trait: 'Agility',
    range: 'Melee',
    damage: { diceType: 8, count: 1, modifier: 9, type: 'phy' },
    burden: 'One-Handed',
    features: [{ name: 'Reliable', description: '+1 to attack rolls' }],
  },
  {
    name: 'Legendary Longsword',
    tier: '4',
    type: 'Primary',
    trait: 'Agility',
    range: 'Melee',
    damage: { diceType: 8, count: 1, modifier: 12, type: 'phy' },
    burden: 'Two-Handed',
    features: [],
  },
  {
    name: 'Legendary Battleaxe',
    tier: '4',
    type: 'Primary',
    trait: 'Strength',
    range: 'Melee',
    damage: { diceType: 10, count: 1, modifier: 12, type: 'phy' },
    burden: 'Two-Handed',
    features: [],
  },
  {
    name: 'Legendary Greatsword',
    tier: '4',
    type: 'Primary',
    trait: 'Strength',
    range: 'Melee',
    damage: { diceType: 10, count: 1, modifier: 12, type: 'phy' },
    burden: 'Two-Handed',
    features: [
      {
        name: 'Massive',
        description:
          '−1 to Evasion; on a successful attack, roll an additional damage die and discard the lowest result.',
      },
    ],
  },
  {
    name: 'Legendary Mace',
    tier: '4',
    type: 'Primary',
    trait: 'Strength',
    range: 'Melee',
    damage: { diceType: 8, count: 1, modifier: 10, type: 'phy' },
    burden: 'One-Handed',
    features: [],
  },
  {
    name: 'Legendary Warhammer',
    tier: '4',
    type: 'Primary',
    trait: 'Strength',
    range: 'Melee',
    damage: { diceType: 12, count: 1, modifier: 12, type: 'phy' },
    burden: 'Two-Handed',
    features: [{ name: 'Heavy', description: '−1 to Evasion' }],
  },
  {
    name: 'Legendary Dagger',
    tier: '4',
    type: 'Primary',
    trait: 'Finesse',
    range: 'Melee',
    damage: { diceType: 8, count: 1, modifier: 10, type: 'phy' },
    burden: 'One-Handed',
    features: [],
  },
  {
    name: 'Legendary Quarterstaff',
    tier: '4',
    type: 'Primary',
    trait: 'Instinct',
    range: 'Melee',
    damage: { diceType: 10, count: 1, modifier: 12, type: 'phy' },
    burden: 'Two-Handed',
    features: [],
  },
  {
    name: 'Legendary Cutlass',
    tier: '4',
    type: 'Primary',
    trait: 'Presence',
    range: 'Melee',
    damage: { diceType: 8, count: 1, modifier: 10, type: 'phy' },
    burden: 'One-Handed',
    features: [],
  },
  {
    name: 'Legendary Rapier',
    tier: '4',
    type: 'Primary',
    trait: 'Presence',
    range: 'Melee',
    damage: { diceType: 8, count: 1, modifier: 9, type: 'phy' },
    burden: 'One-Handed',
    features: [
      {
        name: 'Quick',
        description:
          'When you make an attack, you can mark a Stress to target another creature within range.',
      },
    ],
  },
  {
    name: 'Legendary Halberd',
    tier: '4',
    type: 'Primary',
    trait: 'Strength',
    range: 'Very Close',
    damage: { diceType: 10, count: 1, modifier: 11, type: 'phy' },
    burden: 'Two-Handed',
    features: [{ name: 'Cumbersome', description: '−1 to Finesse' }],
  },
  {
    name: 'Legendary Spear',
    tier: '4',
    type: 'Primary',
    trait: 'Finesse',
    range: 'Very Close',
    damage: { diceType: 10, count: 1, modifier: 11, type: 'phy' },
    burden: 'Two-Handed',
    features: [{ name: 'Cumbersome', description: '−1 to Finesse' }],
  },
  {
    name: 'Legendary Shortbow',
    tier: '4',
    type: 'Primary',
    trait: 'Agility',
    range: 'Far',
    damage: { diceType: 6, count: 1, modifier: 12, type: 'phy' },
    burden: 'Two-Handed',
    features: [],
  },
  {
    name: 'Legendary Crossbow',
    tier: '4',
    type: 'Primary',
    trait: 'Finesse',
    range: 'Far',
    damage: { diceType: 6, count: 1, modifier: 10, type: 'phy' },
    burden: 'One-Handed',
    features: [],
  },
  {
    name: 'Legendary Longbow',
    tier: '4',
    type: 'Primary',
    trait: 'Agility',
    range: 'Very Far',
    damage: { diceType: 8, count: 1, modifier: 12, type: 'phy' },
    burden: 'Two-Handed',
    features: [{ name: 'Cumbersome', description: '−1 to Finesse' }],
  },
  // Named SRD weapons (Tier 4 Physical)
  {
    name: 'Dual-Ended Sword',
    tier: '4',
    type: 'Primary',
    trait: 'Agility',
    range: 'Melee',
    damage: { diceType: 10, count: 1, modifier: 9, type: 'phy' },
    burden: 'Two-Handed',
    features: [
      {
        name: 'Quick',
        description:
          'When you make an attack, you can mark a Stress to target another creature within range.',
      },
    ],
  },
  {
    name: 'Impact Gauntlet',
    tier: '4',
    type: 'Primary',
    trait: 'Strength',
    range: 'Melee',
    damage: { diceType: 10, count: 1, modifier: 11, type: 'phy' },
    burden: 'One-Handed',
    features: [
      {
        name: 'Concussive',
        description:
          'On a successful attack, you can spend a Hope to knock the target back to Far range.',
      },
    ],
  },
  {
    name: 'Sledge Axe',
    tier: '4',
    type: 'Primary',
    trait: 'Strength',
    range: 'Melee',
    damage: { diceType: 12, count: 1, modifier: 13, type: 'phy' },
    burden: 'Two-Handed',
    features: [
      {
        name: 'Destructive',
        description:
          '−1 to Agility; on a successful attack, all adversaries within Very Close range must mark a Stress.',
      },
    ],
  },
  {
    name: 'Curved Dagger',
    tier: '4',
    type: 'Primary',
    trait: 'Finesse',
    range: 'Melee',
    damage: { diceType: 8, count: 1, modifier: 9, type: 'phy' },
    burden: 'One-Handed',
    features: [
      {
        name: 'Serrated',
        description:
          'When you roll a 1 on a damage die, it deals 8 damage instead.',
      },
    ],
  },
  {
    name: 'Extended Polearm',
    tier: '4',
    type: 'Primary',
    trait: 'Finesse',
    range: 'Very Close',
    damage: { diceType: 8, count: 1, modifier: 10, type: 'phy' },
    burden: 'Two-Handed',
    features: [
      {
        name: 'Long',
        description:
          'This weapon’s attack targets all adversaries in a line within range.',
      },
    ],
  },
  {
    name: 'Swinging Ropeblade',
    tier: '4',
    type: 'Primary',
    trait: 'Presence',
    range: 'Close',
    damage: { diceType: 8, count: 1, modifier: 9, type: 'phy' },
    burden: 'Two-Handed',
    features: [
      {
        name: 'Grappling',
        description:
          'On a successful attack, you can spend a Hope to Restrain the target or pull them into Melee range with you.',
      },
    ],
  },
  {
    name: 'Ricochet Axes',
    tier: '4',
    type: 'Primary',
    trait: 'Agility',
    range: 'Far',
    damage: { diceType: 6, count: 1, modifier: 11, type: 'phy' },
    burden: 'Two-Handed',
    features: [
      {
        name: 'Bouncing',
        description:
          'Mark 1 or more Stress to hit that many targets in range of the attack.',
      },
    ],
  },
  {
    name: 'Aantari Bow',
    tier: '4',
    type: 'Primary',
    trait: 'Finesse',
    range: 'Far',
    damage: { diceType: 6, count: 1, modifier: 11, type: 'phy' },
    burden: 'Two-Handed',
    features: [{ name: 'Reliable', description: '+1 to attack rolls' }],
  },
  {
    name: 'Hand Cannon',
    tier: '4',
    type: 'Primary',
    trait: 'Finesse',
    range: 'Very Far',
    damage: { diceType: 6, count: 1, modifier: 12, type: 'phy' },
    burden: 'One-Handed',
    features: [
      {
        name: 'Reloading',
        description:
          'After you make an attack, roll a d6. On a 1, you must mark a Stress to reload this weapon before you can fire it again.',
      },
    ],
  },
];

// Tier 4 (Levels 8–10) — Magic (Requires Spellcast to wield)
export const TIER_4_MAGIC_PRIMARY_WEAPONS: PrimaryWeapon[] = [
  {
    name: 'Legendary Arcane Gauntlets',
    tier: '4',
    type: 'Primary',
    trait: 'Strength',
    range: 'Melee',
    damage: { diceType: 10, count: 1, modifier: 12, type: 'mag' },
    burden: 'Two-Handed',
    features: [],
  },
  {
    name: 'Legendary Hallowed Axe',
    tier: '4',
    type: 'Primary',
    trait: 'Strength',
    range: 'Melee',
    damage: { diceType: 8, count: 1, modifier: 10, type: 'mag' },
    burden: 'One-Handed',
    features: [],
  },
  {
    name: 'Legendary Glowing Rings',
    tier: '4',
    type: 'Primary',
    trait: 'Agility',
    range: 'Very Close',
    damage: { diceType: 10, count: 1, modifier: 11, type: 'mag' },
    burden: 'Two-Handed',
    features: [],
  },
  {
    name: 'Legendary Hand Runes',
    tier: '4',
    type: 'Primary',
    trait: 'Instinct',
    range: 'Very Close',
    damage: { diceType: 10, count: 1, modifier: 9, type: 'mag' },
    burden: 'One-Handed',
    features: [],
  },
  {
    name: 'Legendary Returning Blade',
    tier: '4',
    type: 'Primary',
    trait: 'Finesse',
    range: 'Close',
    damage: { diceType: 8, count: 1, modifier: 9, type: 'mag' },
    burden: 'One-Handed',
    features: [
      {
        name: 'Returning',
        description:
          'When this weapon is thrown within its range, it appears in your hand immediately after the attack.',
      },
    ],
  },
  {
    name: 'Legendary Shortstaff',
    tier: '4',
    type: 'Primary',
    trait: 'Instinct',
    range: 'Close',
    damage: { diceType: 8, count: 1, modifier: 10, type: 'mag' },
    burden: 'One-Handed',
    features: [],
  },
  {
    name: 'Legendary Dualstaff',
    tier: '4',
    type: 'Primary',
    trait: 'Instinct',
    range: 'Far',
    damage: { diceType: 8, count: 1, modifier: 12, type: 'mag' },
    burden: 'Two-Handed',
    features: [],
  },
  {
    name: 'Legendary Scepter',
    tier: '4',
    type: 'Primary',
    trait: 'Presence',
    range: 'Far',
    damage: { diceType: 6, count: 1, modifier: 9, type: 'mag' },
    burden: 'Two-Handed',
    features: [
      {
        name: 'Versatile',
        description:
          'This weapon can also be used with these statistics—Presence, Melee, d8+6.',
      },
    ],
  },
  {
    name: 'Legendary Wand',
    tier: '4',
    type: 'Primary',
    trait: 'Knowledge',
    range: 'Far',
    damage: { diceType: 6, count: 1, modifier: 10, type: 'mag' },
    burden: 'One-Handed',
    features: [],
  },
  {
    name: 'Legendary Greatstaff',
    tier: '4',
    type: 'Primary',
    trait: 'Knowledge',
    range: 'Very Far',
    damage: { diceType: 6, count: 1, modifier: 9, type: 'mag' },
    burden: 'Two-Handed',
    features: [
      {
        name: 'Powerful',
        description:
          'On a successful attack, roll an additional damage die and discard the lowest result.',
      },
    ],
  },
  // Named SRD weapons (Tier 4 Magic)
  {
    name: 'Sword of Light & Flame',
    tier: '4',
    type: 'Primary',
    trait: 'Strength',
    range: 'Melee',
    damage: { diceType: 10, count: 1, modifier: 11, type: 'mag' },
    burden: 'Two-Handed',
    features: [
      { name: 'Hot', description: 'This weapon cuts through solid material.' },
    ],
  },
  {
    name: 'Siphoning Gauntlets',
    tier: '4',
    type: 'Primary',
    trait: 'Presence',
    range: 'Melee',
    damage: { diceType: 10, count: 1, modifier: 9, type: 'mag' },
    burden: 'Two-Handed',
    features: [
      {
        name: 'Lifestealing',
        description:
          'On a successful attack, roll a d6. On a result of 6, clear a Hit Point or clear a Stress.',
      },
    ],
  },
  {
    name: 'Midas Scythe',
    tier: '4',
    type: 'Primary',
    trait: 'Knowledge',
    range: 'Melee',
    damage: { diceType: 10, count: 1, modifier: 9, type: 'mag' },
    burden: 'Two-Handed',
    features: [
      {
        name: 'Greedy',
        description:
          'Spend a handful of gold to gain a +1 bonus to your Proficiency on a damage roll.',
      },
    ],
  },
  {
    name: 'Floating Bladeshards',
    tier: '4',
    type: 'Primary',
    trait: 'Instinct',
    range: 'Close',
    damage: { diceType: 8, count: 1, modifier: 9, type: 'mag' },
    burden: 'One-Handed',
    features: [
      {
        name: 'Powerful',
        description:
          'On a successful attack, roll an additional damage die and discard the lowest result.',
      },
    ],
  },
  {
    name: 'Bloodstaff',
    tier: '4',
    type: 'Primary',
    trait: 'Instinct',
    range: 'Far',
    damage: { diceType: 20, count: 1, modifier: 7, type: 'mag' },
    burden: 'Two-Handed',
    features: [
      {
        name: 'Painful',
        description:
          'Each time you make a successful attack, you must mark a Stress.',
      },
    ],
  },
  {
    name: 'Thistlebow',
    tier: '4',
    type: 'Primary',
    trait: 'Instinct',
    range: 'Far',
    damage: { diceType: 6, count: 1, modifier: 13, type: 'mag' },
    burden: 'Two-Handed',
    features: [{ name: 'Reliable', description: '+1 to attack rolls' }],
  },
  {
    name: 'Wand of Essek',
    tier: '4',
    type: 'Primary',
    trait: 'Knowledge',
    range: 'Far',
    damage: { diceType: 8, count: 1, modifier: 13, type: 'mag' },
    burden: 'One-Handed',
    features: [
      {
        name: 'Timebending',
        description:
          'You can choose the target of your attack after making your attack roll.',
      },
    ],
  },
  {
    name: 'Magus Revolver',
    tier: '4',
    type: 'Primary',
    trait: 'Finesse',
    range: 'Very Far',
    damage: { diceType: 6, count: 1, modifier: 13, type: 'mag' },
    burden: 'One-Handed',
    features: [
      {
        name: 'Reloading',
        description:
          'After you make an attack, roll a d6. On a result of 1, you must mark a Stress to reload this weapon before you can fire it again.',
      },
    ],
  },
  {
    name: 'Fusion Gloves',
    tier: '4',
    type: 'Primary',
    trait: 'Knowledge',
    range: 'Very Far',
    damage: { diceType: 6, count: 1, modifier: 9, type: 'mag' },
    burden: 'Two-Handed',
    features: [
      {
        name: 'Bonded',
        description: 'Gain a bonus to your damage rolls equal to your level.',
      },
    ],
  },
];

// Convenience groupings
export const TIER_1_PRIMARY_WEAPONS: PrimaryWeapon[] = [
  ...TIER_1_PHYSICAL_PRIMARY_WEAPONS,
  ...TIER_1_MAGIC_PRIMARY_WEAPONS,
];
export const TIER_2_PRIMARY_WEAPONS: PrimaryWeapon[] = [
  ...TIER_2_PHYSICAL_PRIMARY_WEAPONS,
  ...TIER_2_MAGIC_PRIMARY_WEAPONS,
];
export const TIER_3_PRIMARY_WEAPONS: PrimaryWeapon[] = [
  ...TIER_3_PHYSICAL_PRIMARY_WEAPONS,
  ...TIER_3_MAGIC_PRIMARY_WEAPONS,
];
export const TIER_4_PRIMARY_WEAPONS: PrimaryWeapon[] = [
  ...TIER_4_PHYSICAL_PRIMARY_WEAPONS,
  ...TIER_4_MAGIC_PRIMARY_WEAPONS,
];

export const PRIMARY_WEAPONS_BY_TIER = {
  '1': TIER_1_PRIMARY_WEAPONS,
  '2': TIER_2_PRIMARY_WEAPONS,
  '3': TIER_3_PRIMARY_WEAPONS,
  '4': TIER_4_PRIMARY_WEAPONS,
} as const;

// All primary weapons (excluding combat wheelchairs)
export const ALL_PRIMARY_WEAPONS: PrimaryWeapon[] = [
  ...TIER_1_PRIMARY_WEAPONS,
  ...TIER_2_PRIMARY_WEAPONS,
  ...TIER_3_PRIMARY_WEAPONS,
  ...TIER_4_PRIMARY_WEAPONS,
];
