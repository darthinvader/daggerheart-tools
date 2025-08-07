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

export const DamageTypeEnum = z.enum([
  'phy', // Physical
  'mag', // Magic
]);

export const BurdenEnum = z.enum(['One-Handed', 'Two-Handed']);

export const WeaponTypeEnum = z.enum(['Primary', 'Secondary']);

export const EquipmentTierEnum = z.enum(['1', '2', '3', '4']);

export const RarityEnum = z.enum(['Common', 'Uncommon', 'Rare', 'Legendary']);

// Base damage schema
export const DamageSchema = z.object({
  diceType: z.number().min(4).max(20), // d4, d6, d8, d10, d12, d20
  count: z.number().min(1).default(1),
  modifier: z.number().default(0),
  type: DamageTypeEnum,
});

// Base equipment schema
export const BaseEquipmentSchema = z.object({
  name: z.string(),
  tier: EquipmentTierEnum,
  description: z.string().optional(),
  features: z.array(BaseFeatureSchema).default([]),
});

// Weapon-specific schemas
export const WeaponSchema = BaseEquipmentSchema.extend({
  type: WeaponTypeEnum,
  trait: WeaponTraitEnum,
  range: RangeEnum,
  damage: DamageSchema,
  burden: BurdenEnum,
  domainAffinity: z.string().optional(), // For primary weapons tied to domains
});

// Armor damage thresholds schema
export const DamageThresholdsSchema = z.object({
  minor: z.number().min(1),
  major: z.number().min(1),
  severe: z.number().min(1),
});

export const ArmorSchema = BaseEquipmentSchema.extend({
  baseThresholds: DamageThresholdsSchema,
  baseScore: z.number().min(0),
  evasionModifier: z.number().default(0),
  agilityModifier: z.number().default(0),
  slots: z.number().min(1).default(3), // Number of armor slots
});

// General item schema
export const ItemSchema = BaseEquipmentSchema.extend({
  rarity: RarityEnum,
  isConsumable: z.boolean().default(false),
  maxQuantity: z.number().min(1).default(1), // For consumables
  weight: z.enum(['light', 'medium', 'heavy']).optional(),
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
