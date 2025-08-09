import { z } from 'zod';

import {
  BaseFeatureSchema,
  CharacterTraitEnum,
  EquipmentFeatureTypeEnum,
  MetadataSchema,
  NameDescriptionSchema,
  WeaponTraitEnum,
  unionWithString,
} from './core';

// =============================
// Base Equipment
// =============================

export const RangeEnum = z.enum([
  'Melee',
  'Very Close',
  'Close',
  'Far',
  'Very Far',
]);
export const RangeSchema = unionWithString(RangeEnum);

export const DamageTypeEnum = z.enum(['phy', 'mag']);
export const DamageTypeSchema = unionWithString(DamageTypeEnum);

export const BurdenEnum = z.enum(['One-Handed', 'Two-Handed']);
export const BurdenSchema = unionWithString(BurdenEnum);

export const WeaponTypeEnum = z.enum(['Primary', 'Secondary']);
export const WeaponTypeSchema = unionWithString(WeaponTypeEnum);

export const EquipmentTierEnum = z.enum(['1', '2', '3', '4']);
export const EquipmentTierSchema = unionWithString(EquipmentTierEnum);

export const RarityEnum = z.enum(['Common', 'Uncommon', 'Rare', 'Legendary']);
export const RaritySchema = unionWithString(RarityEnum);

export const DamageSchema = z.object({
  diceType: z.number().min(4).max(20),
  count: z.number().min(1).default(1),
  modifier: z.number().default(0),
  type: DamageTypeSchema,
});

export const BaseEquipmentSchema = z.object({
  name: z.string(),
  tier: EquipmentTierSchema,
  description: z.string().optional(),
  features: z.array(BaseFeatureSchema).default([]),
  tags: z.array(z.string()).optional(),
  metadata: MetadataSchema,
});

export const WeaponSchema = BaseEquipmentSchema.extend({
  type: WeaponTypeSchema,
  trait: z.union([WeaponTraitEnum, z.string()]),
  range: RangeSchema,
  damage: DamageSchema,
  burden: BurdenSchema,
  domainAffinity: z.string().optional(),
});

export const DamageThresholdsSchema = z
  .object({
    major: z.number().min(1),
    severe: z.number().min(1),
  })
  .refine(v => v.severe >= v.major, {
    message:
      'Severe threshold must be greater than or equal to Major threshold',
    path: ['severe'],
  });

export const ArmorSchema = BaseEquipmentSchema.extend({
  baseThresholds: DamageThresholdsSchema,
  baseScore: z.number().min(0),
  evasionModifier: z.number().default(0),
  agilityModifier: z.number().default(0),
});

export const ItemSchema = BaseEquipmentSchema.extend({
  rarity: RaritySchema,
  isConsumable: z.boolean().default(false),
  maxQuantity: z.number().min(1).default(1),
  weight: z
    .union([z.enum(['light', 'medium', 'heavy']), z.string()])
    .optional(),
  cost: z.number().min(0).optional(),
});

export const EquipmentLoadoutSchema = z.object({
  primaryWeapon: WeaponSchema.optional(),
  secondaryWeapon: WeaponSchema.optional(),
  armor: ArmorSchema.optional(),
  items: z.array(ItemSchema).default([]),
  consumables: z.record(z.string(), z.number()).default({}),
});

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

export function getEffectiveDamageThresholds(
  level: number,
  base: DamageThresholds
): DamageThresholds {
  const lvl = Math.max(0, Math.floor(level));
  return { major: base.major + lvl, severe: base.severe + lvl };
}

// =============================
// Weapons
// =============================

export const PrimaryWeaponSchema = WeaponSchema.extend({
  type: z.union([z.literal('Primary'), WeaponTypeSchema]),
  domainAffinity: z.string().optional(),
});

export const SecondaryWeaponSchema = WeaponSchema.extend({
  type: z.union([z.literal('Secondary'), WeaponTypeSchema]),
  domainAffinity: z.string().optional(),
});

export const CombatWheelchairSchema = WeaponSchema.extend({
  type: z.union([z.literal('Primary'), WeaponTypeSchema]),
  frameType: z.union([z.enum(['Light', 'Heavy', 'Arcane']), z.string()]),
  wheelchairFeatures: z.array(z.string()).default([]),
});

export const WeaponCollectionSchema = z.object({
  primaryWeapons: z.array(PrimaryWeaponSchema).default([]),
  secondaryWeapons: z.array(SecondaryWeaponSchema).default([]),
  combatWheelchairs: z.array(CombatWheelchairSchema).default([]),
});

export type PrimaryWeapon = z.infer<typeof PrimaryWeaponSchema>;
export type SecondaryWeapon = z.infer<typeof SecondaryWeaponSchema>;
export type CombatWheelchair = z.infer<typeof CombatWheelchairSchema>;
export type WeaponFeatureType = z.infer<typeof EquipmentFeatureTypeEnum>;
export type WeaponCollection = z.infer<typeof WeaponCollectionSchema>;

// =============================
// Armor
// =============================

export const StandardArmorSchema = ArmorSchema.extend({
  armorType: z.union([
    z.enum(['Gambeson', 'Leather', 'Chainmail', 'Full Plate']),
    z.string(),
  ]),
  isStandard: z.literal(true),
});

export const SpecialArmorSchema = ArmorSchema.extend({
  armorType: z.string(),
  isStandard: z.literal(false),
  materialType: z.string().optional(),
  originDescription: z.string().optional(),
});

export const ArmorSlotSchema = z.object({
  used: z.boolean().default(false),
  damageReduced: z.number().min(0).default(0),
  metadata: MetadataSchema,
});

export const ArmorStatusSchema = z.object({
  currentScore: z.number().min(0),
  slots: z.array(ArmorSlotSchema),
  needsRepair: z.boolean().default(false),
  damageThresholds: DamageThresholdsSchema,
  metadata: MetadataSchema,
});

export const ArmorCollectionSchema = z.object({
  standardArmor: z.array(StandardArmorSchema).default([]),
  specialArmor: z.array(SpecialArmorSchema).default([]),
});

export type StandardArmor = z.infer<typeof StandardArmorSchema>;
export type SpecialArmor = z.infer<typeof SpecialArmorSchema>;
export type ArmorFeatureType = z.infer<typeof EquipmentFeatureTypeEnum>;
export type ArmorSlot = z.infer<typeof ArmorSlotSchema>;
export type ArmorStatus = z.infer<typeof ArmorStatusSchema>;
export type ArmorCollection = z.infer<typeof ArmorCollectionSchema>;

// =============================
// Items & Inventory
// =============================

const TraitBonusSchema = z.object({
  trait: CharacterTraitEnum,
  bonus: z.number().min(1),
});
const DurationEnum = z.enum(['next_roll', 'until_rest', 'permanent']);
const DurationSchema = unionWithString(DurationEnum);
const TraitBonusWithDurationSchema = TraitBonusSchema.extend({
  duration: DurationSchema,
});
const ExperienceBonusSchema = z.object({
  experience: z.string(),
  bonus: z.number().min(1),
});
const TraitChangeSchema = z.object({
  trait: CharacterTraitEnum,
  description: z.string(),
});
const FeatureAddedSchema = NameDescriptionSchema;

export const UtilityItemSchema = ItemSchema.extend({
  category: z.literal('Utility'),
  usageType: z.union([
    z.enum(['unlimited', 'limited', 'consumable']),
    z.string(),
  ]),
  charges: z.number().min(0).optional(),
  rechargePeriod: z
    .union([
      z.enum(['short_rest', 'long_rest', 'session', 'never']),
      z.string(),
    ])
    .optional(),
  metadata: MetadataSchema,
});

export const ConsumableSchema = ItemSchema.extend({
  category: z.literal('Consumable'),
  isConsumable: z.literal(true),
  effect: z.string(),
  duration: z.string().optional(),
  targetType: z
    .union([
      z.enum(['self', 'ally', 'enemy', 'area', 'weapon', 'armor']),
      z.string(),
    ])
    .optional(),
  metadata: MetadataSchema,
});

export const RelicSchema = ItemSchema.extend({
  category: z.literal('Relic'),
  rarity: z.literal('Legendary'),
  traitBonus: TraitBonusSchema.optional(),
  experienceBonus: ExperienceBonusSchema.optional(),
  exclusivity: z.string().default('You can only carry one relic.'),
  metadata: MetadataSchema,
});

export const WeaponModificationSchema = ItemSchema.extend({
  category: z.literal('Weapon Modification'),
  modificationType: z.union([
    z.enum(['gem', 'stone', 'charm', 'enhancement']),
    z.string(),
  ]),
  compatibleWeapons: z.array(z.string()).default([]),
  traitChange: TraitChangeSchema.optional(),
  featureAdded: FeatureAddedSchema.optional(),
  metadata: MetadataSchema,
});

export const ArmorModificationSchema = ItemSchema.extend({
  category: z.literal('Armor Modification'),
  modificationType: z.union([
    z.enum(['stone', 'enhancement', 'enchantment']),
    z.string(),
  ]),
  compatibleArmor: z.array(z.string()).default([]),
  featureAdded: FeatureAddedSchema.optional(),
  metadata: MetadataSchema,
});

export const RecipeSchema = ItemSchema.extend({
  category: z.literal('Recipe'),
  craftedItem: z.string(),
  materials: z.array(z.string()).default([]),
  downtimeRequired: z.boolean().default(true),
  instructions: z.string(),
  metadata: MetadataSchema,
});

export const PotionTypeEnum = z.enum([
  'Health',
  'Stamina',
  'Trait Boost',
  'Major Trait Boost',
  'Special Effect',
]);
export const PotionTypeId = z.union([PotionTypeEnum, z.string()]);

export const PotionSchema = ConsumableSchema.extend({
  subcategory: z.literal('Potion'),
  potionType: PotionTypeId,
  healingAmount: z.string().optional(),
  traitBonus: TraitBonusWithDurationSchema.optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const ItemCollectionSchema = z.object({
  utilityItems: z.array(UtilityItemSchema).default([]),
  consumables: z.array(ConsumableSchema).default([]),
  potions: z.array(PotionSchema).default([]),
  relics: z.array(RelicSchema).default([]),
  weaponModifications: z.array(WeaponModificationSchema).default([]),
  armorModifications: z.array(ArmorModificationSchema).default([]),
  recipes: z.array(RecipeSchema).default([]),
});

export const InventorySlotSchema = z.object({
  item: ItemSchema,
  quantity: z.number().min(1).default(1),
  isEquipped: z.boolean().default(false),
  location: z
    .union([z.enum(['backpack', 'belt', 'equipped', 'stored']), z.string()])
    .default('backpack'),
  metadata: MetadataSchema,
});

export const InventorySchema = z.object({
  slots: z.array(InventorySlotSchema).default([]),
  maxItems: z.number().min(1).default(50),
  weightCapacity: z.number().min(0).optional(),
  currentWeight: z.number().min(0).default(0),
  metadata: MetadataSchema,
});

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
