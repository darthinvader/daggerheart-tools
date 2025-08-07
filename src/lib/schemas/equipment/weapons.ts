import { z } from 'zod';

import { WeaponSchema } from './base-equipment';

// Extended weapon schemas for specific weapon categories
export const PrimaryWeaponSchema = WeaponSchema.extend({
  type: z.literal('Primary'),
  domainAffinity: z.string(), // Required for primary weapons
});

export const SecondaryWeaponSchema = WeaponSchema.extend({
  type: z.literal('Secondary'),
  domainAffinity: z.string().optional(), // Optional for secondary weapons
});

export const CombatWheelchairSchema = WeaponSchema.extend({
  type: z.literal('Primary'),
  frameType: z.enum(['Light', 'Heavy', 'Arcane']),
  wheelchairFeatures: z.array(z.string()).default([]),
});

// Weapon feature types specific to combat
export const WeaponFeatureTypeEnum = z.enum([
  'Reliable',
  'Brutal',
  'Quick',
  'Heavy',
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
  'Flexible',
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
]);

// Complete weapon collection schema
export const WeaponCollectionSchema = z.object({
  primaryWeapons: z.array(PrimaryWeaponSchema).default([]),
  secondaryWeapons: z.array(SecondaryWeaponSchema).default([]),
  combatWheelchairs: z.array(CombatWheelchairSchema).default([]),
});

// Type exports
export type PrimaryWeapon = z.infer<typeof PrimaryWeaponSchema>;
export type SecondaryWeapon = z.infer<typeof SecondaryWeaponSchema>;
export type CombatWheelchair = z.infer<typeof CombatWheelchairSchema>;
export type WeaponFeatureType = z.infer<typeof WeaponFeatureTypeEnum>;
export type WeaponCollection = z.infer<typeof WeaponCollectionSchema>;
