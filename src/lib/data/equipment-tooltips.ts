/** Tooltip descriptions for weapon traits, features, ranges, damage types, and burdens. */

const EQUIPMENT_TOOLTIPS: Record<string, string> = {
  // Weapon Features (from SRD / common-features.ts / weapon data files)
  Reliable: '+1 to attack rolls',
  Brutal:
    'When you roll the maximum value on a damage die, roll an additional damage die',
  Heavy: '−1 to Evasion',
  Quick:
    'When you make an attack, you can mark a Stress to target another creature within range',
  Paired: 'Bonus to primary weapon damage to targets within Melee range',
  Protective: 'Bonus to Armor Score',
  Barrier: 'Bonus to Armor Score; −1 to Evasion',
  Massive:
    '−1 to Evasion; on a successful attack, roll an additional damage die and discard the lowest result',
  Cumbersome: '−1 to Finesse',
  Returning:
    'When this weapon is thrown within its range, it appears in your hand immediately after the attack',
  Versatile: 'This weapon can also be used with alternate statistics',
  Powerful:
    'On a successful attack, roll an additional damage die and discard the lowest result',
  Startling:
    'Mark a Stress to force all adversaries within Melee range back to Close range',
  Hooked: 'On a successful attack, you can pull the target into Melee range',
  'Double Duty':
    '+1 to Armor Score; +1 to primary weapon damage within Melee range',
  Parry:
    "When attacked, roll this weapon's damage dice. Matching results are discarded from the attacker's damage",
  Deflecting:
    'When attacked, mark an Armor Slot to gain a bonus to Evasion equal to your Armor Score',
  Charged: 'Mark a Stress to gain +1 to Proficiency on a primary weapon attack',
  Sheltering:
    'When you mark an Armor Slot, it reduces damage for you and all allies within Melee range',
  'Doubled Up':
    'When you attack with your primary weapon, you can deal damage to another target within Melee range',
  'Locked On':
    'On a successful attack, your next attack against the same target with your primary weapon automatically succeeds',
  Burning: 'When you roll a 6 on a damage die, the target must mark a Stress',

  // Weapon Traits
  Agility: 'Use Agility trait for attack rolls',
  Strength: 'Use Strength trait for attack rolls',
  Finesse: 'Use Finesse trait for attack rolls',
  Instinct: 'Use Instinct trait for attack rolls',
  Presence: 'Use Presence trait for attack rolls',
  Knowledge: 'Use Knowledge trait for attack rolls',
  Spellcast: 'Use Spellcast for attack rolls',

  // Ranges
  Melee: "Within arm's reach of the target",
  'Very Close': 'A few steps away from the target',
  Close: 'A short distance away, such as across a room',
  Far: 'A significant distance away, such as across a field',
  'Very Far': 'An extreme distance away, near the limit of sight',

  // Damage Types
  Physical: 'Physical damage — resisted by armor',
  Magic: 'Magic damage — bypasses physical defenses',

  // Burdens
  'One-Handed': 'Requires one hand to wield; allows a secondary weapon',
  'Two-Handed': 'Requires both hands to wield; cannot use a secondary weapon',
};

/** Look up a tooltip description by name. Returns undefined if no tooltip exists. */
export function getEquipmentTooltip(name: string): string | undefined {
  return EQUIPMENT_TOOLTIPS[name];
}
