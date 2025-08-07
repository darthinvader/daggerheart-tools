import type { SecondaryWeapon } from '../weapons';

// Tier 1 Secondary Weapons
export const TIER_1_SECONDARY_WEAPONS: SecondaryWeapon[] = [
  {
    name: 'Shortsword',
    tier: '1',
    type: 'Secondary',
    trait: 'Agility',
    range: 'Melee',
    damage: { diceType: 8, count: 1, modifier: 0, type: 'phy' },
    burden: 'One-Handed',
    features: [
      {
        name: 'Paired',
        description:
          '+2 to primary weapon damage to targets within Melee range',
      },
    ],
  },
  {
    name: 'Round Shield',
    tier: '1',
    type: 'Secondary',
    trait: 'Strength',
    range: 'Melee',
    damage: { diceType: 4, count: 1, modifier: 0, type: 'phy' },
    burden: 'One-Handed',
    features: [
      {
        name: 'Protective',
        description: '+1 to Armor Score',
      },
    ],
  },
  {
    name: 'Tower Shield',
    tier: '1',
    type: 'Secondary',
    trait: 'Strength',
    range: 'Melee',
    damage: { diceType: 6, count: 1, modifier: 0, type: 'phy' },
    burden: 'One-Handed',
    features: [
      {
        name: 'Barrier',
        description: '+2 to Armor Score; −1 to Evasion',
      },
    ],
  },
  {
    name: 'Small Dagger',
    tier: '1',
    type: 'Secondary',
    trait: 'Finesse',
    range: 'Melee',
    damage: { diceType: 8, count: 1, modifier: 0, type: 'phy' },
    burden: 'One-Handed',
    features: [
      {
        name: 'Paired',
        description:
          '+2 to primary weapon damage to targets within Melee range',
      },
    ],
  },
  {
    name: 'Whip',
    tier: '1',
    type: 'Secondary',
    trait: 'Presence',
    range: 'Very Close',
    damage: { diceType: 6, count: 1, modifier: 0, type: 'phy' },
    burden: 'One-Handed',
    features: [
      {
        name: 'Startling',
        description:
          'Mark a Stress to crack the whip and force all adversaries within Melee range back to Close range.',
      },
    ],
  },
  {
    name: 'Grappler',
    tier: '1',
    type: 'Secondary',
    trait: 'Finesse',
    range: 'Close',
    damage: { diceType: 6, count: 1, modifier: 0, type: 'phy' },
    burden: 'One-Handed',
    features: [
      {
        name: 'Hooked',
        description:
          'On a successful attack, you can pull the target into Melee range.',
      },
    ],
  },
  {
    name: 'Hand Crossbow',
    tier: '1',
    type: 'Secondary',
    trait: 'Finesse',
    range: 'Far',
    damage: { diceType: 6, count: 1, modifier: 1, type: 'phy' },
    burden: 'One-Handed',
    features: [],
  },
];

// Tier 2 Secondary Weapons
export const TIER_2_SECONDARY_WEAPONS: SecondaryWeapon[] = [
  {
    name: 'Improved Shortsword',
    tier: '2',
    type: 'Secondary',
    trait: 'Agility',
    range: 'Melee',
    damage: { diceType: 8, count: 1, modifier: 2, type: 'phy' },
    burden: 'One-Handed',
    features: [
      {
        name: 'Paired',
        description:
          '+3 to primary weapon damage to targets within Melee range',
      },
    ],
  },
  {
    name: 'Improved Round Shield',
    tier: '2',
    type: 'Secondary',
    trait: 'Strength',
    range: 'Melee',
    damage: { diceType: 4, count: 1, modifier: 2, type: 'phy' },
    burden: 'One-Handed',
    features: [
      {
        name: 'Protective',
        description: '+2 to Armor Score',
      },
    ],
  },
  {
    name: 'Improved Tower Shield',
    tier: '2',
    type: 'Secondary',
    trait: 'Strength',
    range: 'Melee',
    damage: { diceType: 6, count: 1, modifier: 2, type: 'phy' },
    burden: 'One-Handed',
    features: [
      {
        name: 'Barrier',
        description: '+3 to Armor Score; −1 to Evasion',
      },
    ],
  },
  {
    name: 'Improved Small Dagger',
    tier: '2',
    type: 'Secondary',
    trait: 'Finesse',
    range: 'Melee',
    damage: { diceType: 8, count: 1, modifier: 2, type: 'phy' },
    burden: 'One-Handed',
    features: [
      {
        name: 'Paired',
        description:
          '+3 to primary weapon damage to targets within Melee range',
      },
    ],
  },
  {
    name: 'Improved Whip',
    tier: '2',
    type: 'Secondary',
    trait: 'Presence',
    range: 'Very Close',
    damage: { diceType: 6, count: 1, modifier: 2, type: 'phy' },
    burden: 'One-Handed',
    features: [
      {
        name: 'Startling',
        description:
          'Mark a Stress to crack the whip and force all adversaries within Melee range back to Close range.',
      },
    ],
  },
  {
    name: 'Improved Grappler',
    tier: '2',
    type: 'Secondary',
    trait: 'Finesse',
    range: 'Close',
    damage: { diceType: 6, count: 1, modifier: 2, type: 'phy' },
    burden: 'One-Handed',
    features: [
      {
        name: 'Hooked',
        description:
          'On a successful attack, you can pull the target into Melee range.',
      },
    ],
  },
  {
    name: 'Improved Hand Crossbow',
    tier: '2',
    type: 'Secondary',
    trait: 'Finesse',
    range: 'Far',
    damage: { diceType: 6, count: 1, modifier: 3, type: 'phy' },
    burden: 'One-Handed',
    features: [],
  },
  {
    name: 'Spiked Shield',
    tier: '2',
    type: 'Secondary',
    trait: 'Strength',
    range: 'Melee',
    damage: { diceType: 6, count: 1, modifier: 2, type: 'phy' },
    burden: 'One-Handed',
    features: [
      {
        name: 'Double Duty',
        description:
          '+1 to Armor Score; +1 to primary weapon damage within Melee range',
      },
    ],
  },
  {
    name: 'Parrying Dagger',
    tier: '2',
    type: 'Secondary',
    trait: 'Finesse',
    range: 'Melee',
    damage: { diceType: 6, count: 1, modifier: 2, type: 'phy' },
    burden: 'One-Handed',
    features: [
      {
        name: 'Parry',
        description:
          "When you are attacked, roll this weapon's damage dice. If any of the attacker's damage dice rolled the same value as your dice, the matching results are discarded from the attacker's damage dice before the damage you take is totaled.",
      },
    ],
  },
  {
    name: 'Returning Axe',
    tier: '2',
    type: 'Secondary',
    trait: 'Agility',
    range: 'Close',
    damage: { diceType: 6, count: 1, modifier: 4, type: 'phy' },
    burden: 'One-Handed',
    features: [
      {
        name: 'Returning',
        description:
          'When this weapon is thrown within its range, it appears in your hand immediately after the attack.',
      },
    ],
  },
];

// Tier 3 Secondary Weapons
export const TIER_3_SECONDARY_WEAPONS: SecondaryWeapon[] = [
  {
    name: 'Advanced Shortsword',
    tier: '3',
    type: 'Secondary',
    trait: 'Agility',
    range: 'Melee',
    damage: { diceType: 8, count: 1, modifier: 4, type: 'phy' },
    burden: 'One-Handed',
    features: [
      {
        name: 'Paired',
        description:
          '+4 to primary weapon damage to targets within Melee range',
      },
    ],
  },
  {
    name: 'Advanced Round Shield',
    tier: '3',
    type: 'Secondary',
    trait: 'Strength',
    range: 'Melee',
    damage: { diceType: 4, count: 1, modifier: 4, type: 'phy' },
    burden: 'One-Handed',
    features: [
      {
        name: 'Protective',
        description: '+3 to Armor Score',
      },
    ],
  },
  {
    name: 'Advanced Tower Shield',
    tier: '3',
    type: 'Secondary',
    trait: 'Strength',
    range: 'Melee',
    damage: { diceType: 6, count: 1, modifier: 4, type: 'phy' },
    burden: 'One-Handed',
    features: [
      {
        name: 'Barrier',
        description: '+4 to Armor Score; −1 to Evasion',
      },
    ],
  },
  {
    name: 'Advanced Small Dagger',
    tier: '3',
    type: 'Secondary',
    trait: 'Finesse',
    range: 'Melee',
    damage: { diceType: 8, count: 1, modifier: 4, type: 'phy' },
    burden: 'One-Handed',
    features: [
      {
        name: 'Paired',
        description:
          '+4 to primary weapon damage to targets within Melee range',
      },
    ],
  },
  {
    name: 'Advanced Whip',
    tier: '3',
    type: 'Secondary',
    trait: 'Presence',
    range: 'Very Close',
    damage: { diceType: 6, count: 1, modifier: 4, type: 'phy' },
    burden: 'One-Handed',
    features: [
      {
        name: 'Startling',
        description:
          'Mark a Stress to crack the whip and force all adversaries within Melee range back to Close range.',
      },
    ],
  },
  {
    name: 'Advanced Grappler',
    tier: '3',
    type: 'Secondary',
    trait: 'Finesse',
    range: 'Close',
    damage: { diceType: 6, count: 1, modifier: 4, type: 'phy' },
    burden: 'One-Handed',
    features: [
      {
        name: 'Hooked',
        description:
          'On a successful attack, you can pull the target into Melee range.',
      },
    ],
  },
  {
    name: 'Advanced Hand Crossbow',
    tier: '3',
    type: 'Secondary',
    trait: 'Finesse',
    range: 'Far',
    damage: { diceType: 6, count: 1, modifier: 5, type: 'phy' },
    burden: 'One-Handed',
    features: [],
  },
  {
    name: 'Buckler',
    tier: '3',
    type: 'Secondary',
    trait: 'Agility',
    range: 'Melee',
    damage: { diceType: 4, count: 1, modifier: 4, type: 'phy' },
    burden: 'One-Handed',
    features: [
      {
        name: 'Deflecting',
        description:
          'When you are attacked, you can mark an Armor Slot to gain a bonus to your Evasion equal to your Armor Score against the attack.',
      },
    ],
  },
  {
    name: 'Powered Gauntlet',
    tier: '3',
    type: 'Secondary',
    trait: 'Knowledge',
    range: 'Close',
    damage: { diceType: 6, count: 1, modifier: 4, type: 'phy' },
    burden: 'One-Handed',
    features: [
      {
        name: 'Charged',
        description:
          'Mark a Stress to gain a +1 bonus to your Proficiency on a primary weapon attack.',
      },
    ],
  },
  {
    name: 'Hand Sling',
    tier: '3',
    type: 'Secondary',
    trait: 'Finesse',
    range: 'Very Far',
    damage: { diceType: 6, count: 1, modifier: 4, type: 'phy' },
    burden: 'One-Handed',
    features: [
      {
        name: 'Versatile',
        description:
          'This weapon can also be used with these statistics—Finesse, Close, d8+4.',
      },
    ],
  },
];

// Tier 4 Secondary Weapons
export const TIER_4_SECONDARY_WEAPONS: SecondaryWeapon[] = [
  {
    name: 'Legendary Shortsword',
    tier: '4',
    type: 'Secondary',
    trait: 'Agility',
    range: 'Melee',
    damage: { diceType: 8, count: 1, modifier: 6, type: 'phy' },
    burden: 'One-Handed',
    features: [
      {
        name: 'Paired',
        description:
          '+5 to primary weapon damage to targets within Melee range',
      },
    ],
  },
  {
    name: 'Legendary Round Shield',
    tier: '4',
    type: 'Secondary',
    trait: 'Strength',
    range: 'Melee',
    damage: { diceType: 4, count: 1, modifier: 6, type: 'phy' },
    burden: 'One-Handed',
    features: [
      {
        name: 'Protective',
        description: '+4 to Armor Score',
      },
    ],
  },
  {
    name: 'Legendary Tower Shield',
    tier: '4',
    type: 'Secondary',
    trait: 'Strength',
    range: 'Melee',
    damage: { diceType: 6, count: 1, modifier: 6, type: 'phy' },
    burden: 'One-Handed',
    features: [
      {
        name: 'Barrier',
        description: '+5 to Armor Score; −1 to Evasion.',
      },
    ],
  },
  {
    name: 'Legendary Small Dagger',
    tier: '4',
    type: 'Secondary',
    trait: 'Finesse',
    range: 'Melee',
    damage: { diceType: 8, count: 1, modifier: 6, type: 'phy' },
    burden: 'One-Handed',
    features: [
      {
        name: 'Paired',
        description:
          '+5 to primary weapon damage to targets within Melee range',
      },
    ],
  },
  {
    name: 'Legendary Whip',
    tier: '4',
    type: 'Secondary',
    trait: 'Presence',
    range: 'Very Close',
    damage: { diceType: 6, count: 1, modifier: 6, type: 'phy' },
    burden: 'One-Handed',
    features: [
      {
        name: 'Startling',
        description:
          'Mark a Stress to crack the whip and force all adversaries within Melee range back to Close range.',
      },
    ],
  },
  {
    name: 'Legendary Grappler',
    tier: '4',
    type: 'Secondary',
    trait: 'Finesse',
    range: 'Close',
    damage: { diceType: 6, count: 1, modifier: 6, type: 'phy' },
    burden: 'One-Handed',
    features: [
      {
        name: 'Hooked',
        description:
          'On a successful attack, you can pull the target into Melee range.',
      },
    ],
  },
  {
    name: 'Legendary Hand Crossbow',
    tier: '4',
    type: 'Secondary',
    trait: 'Finesse',
    range: 'Far',
    damage: { diceType: 6, count: 1, modifier: 7, type: 'phy' },
    burden: 'One-Handed',
    features: [],
  },
  {
    name: 'Braveshield',
    tier: '4',
    type: 'Secondary',
    trait: 'Agility',
    range: 'Melee',
    damage: { diceType: 4, count: 1, modifier: 6, type: 'phy' },
    burden: 'One-Handed',
    features: [
      {
        name: 'Sheltering',
        description:
          'When you mark an Armor Slot, it reduces damage for you and all allies within Melee range of you who took the same damage.',
      },
    ],
  },
  {
    name: 'Knuckle Claws',
    tier: '4',
    type: 'Secondary',
    trait: 'Strength',
    range: 'Melee',
    damage: { diceType: 6, count: 1, modifier: 8, type: 'phy' },
    burden: 'One-Handed',
    features: [
      {
        name: 'Doubled Up',
        description:
          'When you make an attack with your primary weapon, you can deal damage to another target within Melee range.',
      },
    ],
  },
  {
    name: 'Primer Shard',
    tier: '4',
    type: 'Secondary',
    trait: 'Instinct',
    range: 'Very Close',
    damage: { diceType: 4, count: 1, modifier: 0, type: 'phy' },
    burden: 'One-Handed',
    features: [
      {
        name: 'Locked On',
        description:
          'On a successful attack, your next attack against the same target with your primary weapon automatically succeeds.',
      },
    ],
  },
];

// All secondary weapons by tier
export const SECONDARY_WEAPONS_BY_TIER = {
  '1': TIER_1_SECONDARY_WEAPONS,
  '2': TIER_2_SECONDARY_WEAPONS,
  '3': TIER_3_SECONDARY_WEAPONS,
  '4': TIER_4_SECONDARY_WEAPONS,
} as const;

// All secondary weapons
export const ALL_SECONDARY_WEAPONS: SecondaryWeapon[] = [
  ...TIER_1_SECONDARY_WEAPONS,
  ...TIER_2_SECONDARY_WEAPONS,
  ...TIER_3_SECONDARY_WEAPONS,
  ...TIER_4_SECONDARY_WEAPONS,
];
