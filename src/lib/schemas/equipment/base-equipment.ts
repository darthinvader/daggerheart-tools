import { z } from 'zod';

import { BaseFeatureSchema } from '../core/base-schemas';
import { WeaponTraitEnum } from '../core/enums';

// Enums for equipment (using shared trait enum from core)
export const RangeEnum = z.enum([
  'Melee',
  'Very Close',
  'Close',
  'Far',
  'Very Far',
]);
export const RangeSchema = z.union([RangeEnum, z.string()]);

export const DamageTypeEnum = z.enum(['phy', 'mag']);
export const DamageTypeSchema = z.union([DamageTypeEnum, z.string()]);

export const BurdenEnum = z.enum(['One-Handed', 'Two-Handed']);
export const BurdenSchema = z.union([BurdenEnum, z.string()]);

export const WeaponTypeEnum = z.enum(['Primary', 'Secondary']);
export const WeaponTypeSchema = z.union([WeaponTypeEnum, z.string()]);

export const EquipmentTierEnum = z.enum(['1', '2', '3', '4']);
export const EquipmentTierSchema = z.union([EquipmentTierEnum, z.string()]);

export const RarityEnum = z.enum(['Common', 'Uncommon', 'Rare', 'Legendary']);
export const RaritySchema = z.union([RarityEnum, z.string()]);

// Base damage schema
export const DamageSchema = z.object({
  diceType: z.number().min(4).max(20), // d4, d6, d8, d10, d12, d20
  count: z.number().min(1).default(1),
  modifier: z.number().default(0),
  type: DamageTypeSchema,
});

// Base equipment schema
export const BaseEquipmentSchema = z.object({
  name: z.string(),
  tier: EquipmentTierSchema,
  description: z.string().optional(),
  features: z.array(BaseFeatureSchema).default([]),
  tags: z.array(z.string()).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

// Weapon-specific schemas
export const WeaponSchema = BaseEquipmentSchema.extend({
  type: WeaponTypeSchema,
  trait: z.union([WeaponTraitEnum, z.string()]),
  range: RangeSchema,
  damage: DamageSchema,
  burden: BurdenSchema,
  domainAffinity: z.string().optional(), // For primary weapons tied to domains
});

// Armor damage thresholds schema
// SRD armor lists two base thresholds (Major / Severe). Minor is derived from play rules, not stored here.
export const DamageThresholdsSchema = z.object({
  major: z.number().min(1),
  severe: z.number().min(1),
});

export const ArmorSchema = BaseEquipmentSchema.extend({
  baseThresholds: DamageThresholdsSchema,
  baseScore: z.number().min(0),
  evasionModifier: z.number().default(0),
  agilityModifier: z.number().default(0),
});

// General item schema
export const ItemSchema = BaseEquipmentSchema.extend({
  rarity: RaritySchema,
  isConsumable: z.boolean().default(false),
  maxQuantity: z.number().min(1).default(1), // For consumables
  weight: z
    .union([z.enum(['light', 'medium', 'heavy']), z.string()])
    .optional(),
  cost: z.number().min(0).optional(),
});

// Equipment collection schema for character sheets
export const EquipmentLoadoutSchema = z.object({
  primaryWeapon: WeaponSchema.optional(),
  secondaryWeapon: WeaponSchema.optional(),
  armor: ArmorSchema.optional(),
  items: z.array(ItemSchema).default([]),
  consumables: z.record(z.string(), z.number()).default({}), // itemName: quantity
});

// Type exports
export type WeaponTrait = z.infer<typeof WeaponTraitEnum>;
export type Range = z.infer<typeof RangeEnum>;
export type DamageType = z.infer<typeof DamageTypeEnum>;
export type Burden = z.infer<typeof BurdenEnum>;
export type WeaponType = z.infer<typeof WeaponTypeEnum>;
export type EquipmentTier = z.infer<typeof EquipmentTierEnum>;
export type Rarity = z.infer<typeof RarityEnum>;
export type Damage = z.infer<typeof DamageSchema>;
export type BaseEquipment = z.infer<typeof BaseEquipmentSchema>;
export type Weapon = z.infer<typeof WeaponSchema>;
export type DamageThresholds = z.infer<typeof DamageThresholdsSchema>;
export type Armor = z.infer<typeof ArmorSchema>;
export type Item = z.infer<typeof ItemSchema>;
export type EquipmentLoadout = z.infer<typeof EquipmentLoadoutSchema>;
