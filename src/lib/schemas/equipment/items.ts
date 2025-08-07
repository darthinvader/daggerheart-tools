import { z } from 'zod';

import { CharacterTraitEnum } from '../core/base-schemas';
// Base schemas for different item types
// ======================================================================================

import { ItemSchema } from './base-equipment';

// Shared schemas for equipment features and bonuses

const TraitBonusSchema = z.object({
  trait: CharacterTraitEnum,
  bonus: z.number().min(1),
});

const TraitBonusWithDurationSchema = TraitBonusSchema.extend({
  duration: z.enum(['next_roll', 'until_rest', 'permanent']),
});

const ExperienceBonusSchema = z.object({
  experience: z.string(),
  bonus: z.number().min(1),
});

const TraitChangeSchema = z.object({
  trait: CharacterTraitEnum,
  description: z.string(),
});

const FeatureAddedSchema = z.object({
  name: z.string(),
  description: z.string(),
});

// ======================================================================================

// Extended item schemas for different item categories
export const UtilityItemSchema = ItemSchema.extend({
  category: z.literal('Utility'),
  usageType: z.enum(['unlimited', 'limited', 'consumable']),
  charges: z.number().min(0).optional(), // For limited use items
  rechargePeriod: z
    .enum(['short_rest', 'long_rest', 'session', 'never'])
    .optional(),
});

export const ConsumableSchema = ItemSchema.extend({
  category: z.literal('Consumable'),
  isConsumable: z.literal(true),
  effect: z.string(),
  duration: z.string().optional(),
  targetType: z
    .enum(['self', 'ally', 'enemy', 'area', 'weapon', 'armor'])
    .optional(),
});

export const RelicSchema = ItemSchema.extend({
  category: z.literal('Relic'),
  rarity: z.literal('Legendary'),
  traitBonus: TraitBonusSchema.optional(),
  experienceBonus: ExperienceBonusSchema.optional(),
  exclusivity: z.string().default('You can only carry one relic.'),
});

export const WeaponModificationSchema = ItemSchema.extend({
  category: z.literal('Weapon Modification'),
  modificationType: z.enum(['gem', 'stone', 'charm', 'enhancement']),
  compatibleWeapons: z.array(z.string()).default([]), // Weapon types this can modify
  traitChange: TraitChangeSchema.optional(),
  featureAdded: FeatureAddedSchema.optional(),
});

export const ArmorModificationSchema = ItemSchema.extend({
  category: z.literal('Armor Modification'),
  modificationType: z.enum(['stone', 'enhancement', 'enchantment']),
  compatibleArmor: z.array(z.string()).default([]), // Armor types this can modify
  featureAdded: FeatureAddedSchema.optional(),
});

export const RecipeSchema = ItemSchema.extend({
  category: z.literal('Recipe'),
  craftedItem: z.string(), // Name of item this recipe creates
  materials: z.array(z.string()).default([]), // Required materials
  downtimeRequired: z.boolean().default(true),
  instructions: z.string(),
});

// Potion subcategories
export const PotionTypeEnum = z.enum([
  'Health',
  'Stamina',
  'Trait Boost',
  'Major Trait Boost',
  'Special Effect',
]);

export const PotionSchema = ConsumableSchema.extend({
  subcategory: z.literal('Potion'),
  potionType: PotionTypeEnum,
  healingAmount: z.string().optional(), // e.g., "1d4", "1d4+1"
  traitBonus: TraitBonusWithDurationSchema.optional(),
});

// Complete item collection schema
export const ItemCollectionSchema = z.object({
  utilityItems: z.array(UtilityItemSchema).default([]),
  consumables: z.array(ConsumableSchema).default([]),
  potions: z.array(PotionSchema).default([]),
  relics: z.array(RelicSchema).default([]),
  weaponModifications: z.array(WeaponModificationSchema).default([]),
  armorModifications: z.array(ArmorModificationSchema).default([]),
  recipes: z.array(RecipeSchema).default([]),
});

// Inventory management schema
export const InventorySlotSchema = z.object({
  item: ItemSchema,
  quantity: z.number().min(1).default(1),
  isEquipped: z.boolean().default(false),
  location: z
    .enum(['backpack', 'belt', 'equipped', 'stored'])
    .default('backpack'),
});

export const InventorySchema = z.object({
  slots: z.array(InventorySlotSchema).default([]),
  maxItems: z.number().min(1).default(50), // Configurable inventory limit
  weightCapacity: z.number().min(0).optional(),
  currentWeight: z.number().min(0).default(0),
});

// Type exports
export type UtilityItem = z.infer<typeof UtilityItemSchema>;
export type Consumable = z.infer<typeof ConsumableSchema>;
export type Relic = z.infer<typeof RelicSchema>;
export type WeaponModification = z.infer<typeof WeaponModificationSchema>;
export type ArmorModification = z.infer<typeof ArmorModificationSchema>;
export type Recipe = z.infer<typeof RecipeSchema>;
export type PotionType = z.infer<typeof PotionTypeEnum>;
export type Potion = z.infer<typeof PotionSchema>;
export type ItemCollection = z.infer<typeof ItemCollectionSchema>;
export type InventorySlot = z.infer<typeof InventorySlotSchema>;
export type Inventory = z.infer<typeof InventorySchema>;
