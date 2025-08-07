import { z } from 'zod';

// Domain and Trait Enums
// ======================================================================================

export const DomainNameEnum = z.enum([
  'Arcana',
  'Blade',
  'Bone',
  'Codex',
  'Grace',
  'Midnight',
  'Sage',
  'Splendor',
  'Valor',
  'Chaos',
  'Moon',
  'Sun',
  'Blood',
  'Fate',
]);

// Core character traits used for rolls and abilities
export const CharacterTraitEnum = z.enum([
  'Agility',
  'Strength',
  'Finesse',
  'Instinct',
  'Presence',
  'Knowledge',
]);

// Extended trait enum for weapons and equipment (includes Spellcast)
export const WeaponTraitEnum = z.enum([
  'Agility',
  'Strength',
  'Finesse',
  'Instinct',
  'Presence',
  'Knowledge',
  'Spellcast',
]);

// Character tier levels (based on character sheet analysis)
export const CharacterTierSchema = z.enum(['1', '2-4', '5-7', '8-10']);

export const EquipmentFeatureTypeEnum = z.enum([
  'Flexible',
  'Heavy',
  'Very Heavy',
  'Warded',
  'Resilient',
  'Reinforced',
  'Shifting',
  'Quiet',
  'Hopeful',
  'Gilded',
  'Impenetrable',
  'Sharp',
  'Physical',
  'Magic',
  'Painful',
  'Timeslowing',
  'Channeling',
  'Burning',
  'Fortified',
  'Truthseeking',
  'Difficult',
  'Reliable',
  'Brutal',
  'Quick',
  'Paired',
  'Protective',
  'Barrier',
  'Startling',
  'Hooked',
  'Double Duty',
  'Parry',
  'Returning',
  'Deflecting',
  'Charged',
  'Versatile',
  'Sheltering',
  'Doubled Up',
  'Locked On',
]);
