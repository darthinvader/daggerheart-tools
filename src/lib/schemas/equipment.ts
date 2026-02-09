import { z } from 'zod';

import {
  BaseFeatureSchema,
  CharacterTraitEnum,
  MetadataSchema,
  NameDescriptionSchema,
  unionWithString,
  WeaponTraitEnum,
  WeaponTraitSchema,
} from './core';
import { TierEnum } from './shared';

// =============================
// Stat Modifiers (shared across all equipment)
// =============================

/** Trait modifiers schema for equipment bonuses/penalties */
export const TraitModifiersSchema = z.object({
  Agility: z.number().default(0),
  Strength: z.number().default(0),
  Finesse: z.number().default(0),
  Instinct: z.number().default(0),
  Presence: z.number().default(0),
  Knowledge: z.number().default(0),
});

/**
 * Unified stat modifiers that any equipment can apply.
 * These are explicit numeric fields that override/supplement feature parsing.
 */
export const EquipmentStatModifiersSchema = z.object({
  /** Evasion modifier */
  evasion: z.number().default(0),
  /** Proficiency modifier */
  proficiency: z.number().default(0),
  /** Armor Score modifier (from shields, etc.) */
  armorScore: z.number().default(0),
  /** Major damage threshold modifier */
  majorThreshold: z.number().default(0),
  /** Severe damage threshold modifier */
  severeThreshold: z.number().default(0),
  /** Attack roll modifier */
  attackRolls: z.number().default(0),
  /** Spellcast roll modifier */
  spellcastRolls: z.number().default(0),
  /** Trait modifiers */
  traits: TraitModifiersSchema.default({
    Agility: 0,
    Strength: 0,
    Finesse: 0,
    Instinct: 0,
    Presence: 0,
    Knowledge: 0,
  }),
});

export type TraitModifiers = z.infer<typeof TraitModifiersSchema>;
export type EquipmentStatModifiers = z.infer<
  typeof EquipmentStatModifiersSchema
>;

/** Default empty stat modifiers */
export const DEFAULT_STAT_MODIFIERS: EquipmentStatModifiers = {
  evasion: 0,
  proficiency: 0,
  armorScore: 0,
  majorThreshold: 0,
  severeThreshold: 0,
  attackRolls: 0,
  spellcastRolls: 0,
  traits: {
    Agility: 0,
    Strength: 0,
    Finesse: 0,
    Instinct: 0,
    Presence: 0,
    Knowledge: 0,
  },
};

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

export const EquipmentTierEnum = TierEnum;
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
  // Keep equipment tags general to allow broader categorization
  tags: z.array(z.string()).optional(),
  metadata: MetadataSchema,
  /**
   * Explicit stat modifiers for homebrew equipment.
   * When present, these override parsed feature modifiers.
   */
  statModifiers: EquipmentStatModifiersSchema.optional(),
});

export const WeaponSchema = BaseEquipmentSchema.extend({
  type: WeaponTypeSchema,
  trait: WeaponTraitSchema,
  range: RangeSchema,
  damage: DamageSchema,
  burden: BurdenSchema,
  // Free-form affinity text; not enforced to official domain names to support homebrew
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
});

export const SecondaryWeaponSchema = WeaponSchema.extend({
  type: z.union([z.literal('Secondary'), WeaponTypeSchema]),
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
// Feature types for weapons are captured in BaseFeatureSchema.tags as strings
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
export type ArmorFeatureType = string;
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
export const PotionTypeId = unionWithString(PotionTypeEnum);

export const PotionSchema = ConsumableSchema.extend({
  subcategory: z.literal('Potion'),
  potionType: PotionTypeId,
  healingAmount: z.string().optional(),
  traitBonus: TraitBonusWithDurationSchema.optional(),
  metadata: MetadataSchema,
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
  trackWeight: z.boolean().default(false),
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

export type AnyItem =
  | UtilityItem
  | Consumable
  | Relic
  | WeaponModification
  | ArmorModification
  | Recipe;

export interface InventoryItemEntry {
  id: string;
  item: AnyItem;
  quantity: number;
  isEquipped: boolean;
  location: 'backpack' | 'belt' | 'equipped' | 'stored';
  isCustom?: boolean;
  /** Whether bonuses from this item are active - defaults to true */
  isActivated?: boolean;
}

export interface InventoryState {
  items: InventoryItemEntry[];
  maxSlots: number;
  unlimitedSlots?: boolean;
  unlimitedQuantity?: boolean;
  /** Maximum weight capacity (undefined = no limit) */
  weightCapacity?: number;
  /** Whether weight tracking is enabled */
  trackWeight?: boolean;
}

// =============================
// Weight Constants & Utilities
// =============================

/** Weight values for qualitative weights */
export const WEIGHT_VALUES: Record<string, number> = {
  light: 1,
  medium: 2,
  heavy: 3,
};

/** Get the numeric weight value for an item */
export function getItemWeight(item: AnyItem | Item): number {
  const weight = (item as Item).weight;
  if (!weight) return 0;
  if (typeof weight === 'string' && weight in WEIGHT_VALUES) {
    return WEIGHT_VALUES[weight];
  }
  // Try to parse as number for custom weights
  const parsed = parseFloat(weight);
  return isNaN(parsed) ? 0 : parsed;
}

/** Calculate total weight of inventory items */
export function calculateInventoryWeight(items: InventoryItemEntry[]): number {
  return items.reduce((total, entry) => {
    const weight = getItemWeight(entry.item);
    return total + weight * entry.quantity;
  }, 0);
}

/** Check if adding items would exceed weight capacity */
export function wouldExceedWeightCapacity(
  currentItems: InventoryItemEntry[],
  newItem: AnyItem,
  quantity: number,
  weightCapacity: number | undefined
): boolean {
  if (weightCapacity === undefined) return false;
  const currentWeight = calculateInventoryWeight(currentItems);
  const additionalWeight = getItemWeight(newItem) * quantity;
  return currentWeight + additionalWeight > weightCapacity;
}

// =============================
// Active Effects (Potion/Consumable Tracking)
// =============================

/**
 * Duration types for active effects.
 * - next_roll: Expires after the next roll
 * - until_rest: Expires on short or long rest
 * - until_long_rest: Expires only on long rest
 * - permanent: Does not expire automatically
 * - rounds: Expires after a number of rounds (combat only)
 */
export const EffectDurationTypeEnum = z.enum([
  'next_roll',
  'until_rest',
  'until_long_rest',
  'permanent',
  'rounds',
]);

/**
 * Active effect from a consumed potion or item.
 */
export const ActiveEffectSchema = z.object({
  id: z.string(),
  /** Name of the effect (usually the item name) */
  name: z.string(),
  /** Description of what the effect does */
  description: z.string().default(''),
  /** Source item name */
  sourceName: z.string().default(''),
  /** Duration type */
  durationType: EffectDurationTypeEnum,
  /** Remaining rounds (only for 'rounds' duration type) */
  roundsRemaining: z.number().min(0).optional(),
  /** When the effect was applied */
  appliedAt: z.string().datetime(),
  /** Session number when applied (for tracking across sessions) */
  sessionNumber: z.number().optional(),
  /** Trait bonus from effect */
  traitBonus: z
    .object({
      trait: z.string(),
      bonus: z.number(),
    })
    .optional(),
  /** Other modifiers from the effect */
  modifiers: z.record(z.string(), z.number()).optional(),
  /** Whether this effect has been used (for next_roll effects) */
  hasBeenUsed: z.boolean().default(false),
});

export type EffectDurationType = z.infer<typeof EffectDurationTypeEnum>;
export type ActiveEffect = z.infer<typeof ActiveEffectSchema>;

/**
 * State for tracking active effects.
 */
export const ActiveEffectsStateSchema = z.object({
  effects: z.array(ActiveEffectSchema).default([]),
});

export type ActiveEffectsState = z.infer<typeof ActiveEffectsStateSchema>;

/**
 * Create an active effect from a consumed potion.
 */
export function createActiveEffectFromPotion(
  potion: Potion,
  sessionNumber?: number
): ActiveEffect {
  const now = new Date().toISOString();
  const durationType =
    (potion.traitBonus?.duration as EffectDurationType) ?? 'until_rest';

  return {
    id: `effect-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: potion.name,
    description: potion.effect ?? potion.description ?? '',
    sourceName: potion.name,
    durationType,
    appliedAt: now,
    sessionNumber,
    traitBonus: potion.traitBonus
      ? {
          trait: potion.traitBonus.trait,
          bonus: potion.traitBonus.bonus,
        }
      : undefined,
    hasBeenUsed: false,
  };
}

/**
 * Clear effects on rest based on their duration type.
 */
export function clearEffectsOnRest(
  effects: ActiveEffect[],
  restType: 'short' | 'long'
): ActiveEffect[] {
  return effects.filter(effect => {
    // Permanent effects never clear
    if (effect.durationType === 'permanent') return true;
    // until_rest clears on any rest
    if (effect.durationType === 'until_rest') return false;
    // until_long_rest only clears on long rest
    if (effect.durationType === 'until_long_rest') return restType !== 'long';
    // Others (next_roll, rounds) don't clear on rest
    return true;
  });
}

/**
 * Clear next_roll effects that have been used.
 */
export function clearUsedNextRollEffects(
  effects: ActiveEffect[]
): ActiveEffect[] {
  return effects.filter(effect => {
    if (effect.durationType === 'next_roll' && effect.hasBeenUsed) return false;
    return true;
  });
}

/**
 * Mark a next_roll effect as used.
 */
export function markEffectAsUsed(
  effects: ActiveEffect[],
  effectId: string
): ActiveEffect[] {
  return effects.map(effect =>
    effect.id === effectId ? { ...effect, hasBeenUsed: true } : effect
  );
}

/**
 * Decrement round counters and remove expired effects.
 */
export function decrementRoundCounters(
  effects: ActiveEffect[]
): ActiveEffect[] {
  return effects
    .map(effect => {
      if (
        effect.durationType !== 'rounds' ||
        effect.roundsRemaining === undefined
      ) {
        return effect;
      }
      return { ...effect, roundsRemaining: effect.roundsRemaining - 1 };
    })
    .filter(effect => {
      if (
        effect.durationType === 'rounds' &&
        effect.roundsRemaining !== undefined
      ) {
        return effect.roundsRemaining > 0;
      }
      return true;
    });
}
