import { z } from 'zod';

import { EquipmentFeatureTypeEnum } from '../core/enums';
import { WeaponSchema, WeaponTypeSchema } from './base-equipment';

// Extended weapon schemas for specific weapon categories
export const PrimaryWeaponSchema = WeaponSchema.extend({
  type: z.union([z.literal('Primary'), WeaponTypeSchema]),
  domainAffinity: z.string().optional(), // Optional for primary weapons (SRD doesn't bind by domain)
});

export const SecondaryWeaponSchema = WeaponSchema.extend({
  type: z.union([z.literal('Secondary'), WeaponTypeSchema]),
  domainAffinity: z.string().optional(), // Optional for secondary weapons
});

export const CombatWheelchairSchema = WeaponSchema.extend({
  type: z.union([z.literal('Primary'), WeaponTypeSchema]),
  frameType: z.union([z.enum(['Light', 'Heavy', 'Arcane']), z.string()]),
  wheelchairFeatures: z.array(z.string()).default([]),
});

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
export type WeaponFeatureType = z.infer<typeof EquipmentFeatureTypeEnum>;
export type WeaponCollection = z.infer<typeof WeaponCollectionSchema>;
