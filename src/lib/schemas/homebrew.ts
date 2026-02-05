/**
 * Homebrew Content Schemas
 *
 * Defines Zod schemas for all homebrew content types.
 * Each homebrew type extends the base game schema with metadata fields.
 */
import { z } from 'zod';

import {
  AdversaryRoleEnum,
  AdversarySchema,
  AdversaryTierEnum,
} from './adversaries';
import {
  BaseClassSchema,
  BaseFeatureSchema,
  BaseSubclassSchema,
  DomainNameSchema,
  FeatureStatModifiersSchema,
} from './core';
import { DomainCardSchema } from './domains';
import {
  EnvironmentSchema,
  EnvironmentTierEnum,
  EnvironmentTypeEnum,
} from './environments';
import {
  ArmorSchema,
  EquipmentTierSchema,
  RaritySchema,
  WeaponSchema,
} from './equipment';

// =====================================================================================
// Content Type Enum
// =====================================================================================

export const HomebrewContentTypeEnum = z.enum([
  'adversary',
  'environment',
  'domain_card',
  'class',
  'subclass',
  'ancestry',
  'community',
  'equipment',
  'item',
]);

export type HomebrewContentType = z.infer<typeof HomebrewContentTypeEnum>;

// =====================================================================================
// Visibility Enum
// =====================================================================================

export const HomebrewVisibilityEnum = z.enum([
  'private',
  'public',
  'campaign_only',
]);

export type HomebrewVisibility = z.infer<typeof HomebrewVisibilityEnum>;

// =====================================================================================
// Base Homebrew Metadata
// =====================================================================================

export const HomebrewMetadataSchema = z.object({
  id: z.string().uuid(),
  ownerId: z.string().uuid(),
  contentType: HomebrewContentTypeEnum,
  visibility: HomebrewVisibilityEnum.default('private'),
  name: z.string().min(1, 'Name is required'),
  description: z.string().default(''),
  tags: z.array(z.string()).default([]),
  forkedFrom: z.string().uuid().nullable().optional(),
  campaignLinks: z.array(z.string().uuid()).default([]),
  forkCount: z.number().int().default(0),
  viewCount: z.number().int().default(0),
  starCount: z.number().int().default(0),
  commentCount: z.number().int().default(0),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  deletedAt: z.string().datetime().nullable().optional(),
});

export type HomebrewMetadata = z.infer<typeof HomebrewMetadataSchema>;

// =====================================================================================
// Homebrew Adversary
// =====================================================================================

export const HomebrewAdversaryContentSchema = AdversarySchema.extend({
  // Allow custom roles beyond the standard enum
  role: z.union([AdversaryRoleEnum, z.string()]),
  // Allow custom tiers
  tier: z.union([AdversaryTierEnum, z.string()]),
});

export const HomebrewAdversarySchema = HomebrewMetadataSchema.extend({
  contentType: z.literal('adversary'),
  content: HomebrewAdversaryContentSchema,
});

export type HomebrewAdversary = z.infer<typeof HomebrewAdversarySchema>;

// =====================================================================================
// Homebrew Environment
// =====================================================================================

export const HomebrewEnvironmentContentSchema = EnvironmentSchema.extend({
  // Allow custom types beyond the standard enum
  type: z.union([EnvironmentTypeEnum, z.string()]),
  // Allow custom tiers
  tier: z.union([EnvironmentTierEnum, z.string()]),
});

export const HomebrewEnvironmentSchema = HomebrewMetadataSchema.extend({
  contentType: z.literal('environment'),
  content: HomebrewEnvironmentContentSchema,
});

export type HomebrewEnvironment = z.infer<typeof HomebrewEnvironmentSchema>;

// =====================================================================================
// Homebrew Domain Card
// =====================================================================================

export const HomebrewDomainCardContentSchema = DomainCardSchema.omit({
  metadata: true,
}).extend({
  // Allow custom domains beyond the standard enum
  domain: z.union([DomainNameSchema, z.string()]),
  // Per SRD: recallCost is standard; hopeCost kept for backward compatibility
  recallCost: z.number().int().min(0).optional(),
  hopeCost: z.number().int().min(0).optional(),
});

export const HomebrewDomainCardSchema = HomebrewMetadataSchema.extend({
  contentType: z.literal('domain_card'),
  content: HomebrewDomainCardContentSchema,
});

export type HomebrewDomainCard = z.infer<typeof HomebrewDomainCardSchema>;

// =====================================================================================
// Homebrew Class
// =====================================================================================

export const HomebrewClassContentSchema = BaseClassSchema.extend({
  // Custom class-specific fields
  isHomebrew: z.literal(true).default(true),
  // Allow any domain names for homebrew
  domains: z.array(z.string()).min(1),
  // Custom starting equipment
  startingEquipment: z
    .array(
      z.object({
        name: z.string(),
        description: z.string().optional(),
      })
    )
    .default([]),
});

export const HomebrewClassSchema = HomebrewMetadataSchema.extend({
  contentType: z.literal('class'),
  content: HomebrewClassContentSchema,
});

export type HomebrewClass = z.infer<typeof HomebrewClassSchema>;

// =====================================================================================
// Homebrew Subclass
// =====================================================================================

export const HomebrewSubclassContentSchema = BaseSubclassSchema.extend({
  isHomebrew: z.literal(true).default(true),
  // Parent class name (can be official or homebrew)
  parentClassName: z.string(),
  // Custom spellcast trait
  spellcastTrait: z.string().optional(),
});

export const HomebrewSubclassSchema = HomebrewMetadataSchema.extend({
  contentType: z.literal('subclass'),
  content: HomebrewSubclassContentSchema,
});

export type HomebrewSubclass = z.infer<typeof HomebrewSubclassSchema>;

// =====================================================================================
// Homebrew Ancestry
// =====================================================================================

export const HomebrewAncestryFeatureSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  type: z.enum(['primary', 'secondary']),
  modifiers: FeatureStatModifiersSchema.optional(),
});

export const HomebrewAncestryContentSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  heightRange: z.string().default(''),
  lifespan: z.string().default(''),
  physicalCharacteristics: z.array(z.string()).default([]),
  primaryFeature: HomebrewAncestryFeatureSchema,
  secondaryFeature: HomebrewAncestryFeatureSchema,
  isHomebrew: z.literal(true).default(true),
});

export const HomebrewAncestrySchema = HomebrewMetadataSchema.extend({
  contentType: z.literal('ancestry'),
  content: HomebrewAncestryContentSchema,
});

export type HomebrewAncestry = z.infer<typeof HomebrewAncestrySchema>;

// =====================================================================================
// Homebrew Community
// =====================================================================================

export const HomebrewCommunityFeatureSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  modifiers: FeatureStatModifiersSchema.optional(),
});

export const HomebrewCommunityContentSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  commonTraits: z.array(z.string()).default([]),
  feature: HomebrewCommunityFeatureSchema,
  isHomebrew: z.literal(true).default(true),
});

export const HomebrewCommunitySchema = HomebrewMetadataSchema.extend({
  contentType: z.literal('community'),
  content: HomebrewCommunityContentSchema,
});

export type HomebrewCommunity = z.infer<typeof HomebrewCommunitySchema>;

// =====================================================================================
// Homebrew Equipment (Weapons, Armor & Combat Wheelchairs)
// =====================================================================================

export const HomebrewWeaponContentSchema = WeaponSchema.omit({
  metadata: true,
}).extend({
  equipmentType: z.literal('weapon'),
  isHomebrew: z.literal(true).default(true),
});

export const HomebrewArmorContentSchema = ArmorSchema.omit({
  metadata: true,
}).extend({
  equipmentType: z.literal('armor'),
  armorType: z
    .union([
      z.enum(['Gambeson', 'Leather', 'Chainmail', 'Full Plate']),
      z.string(),
    ])
    .default('Leather'),
  isHomebrew: z.literal(true).default(true),
});

export const HomebrewWheelchairContentSchema = WeaponSchema.omit({
  metadata: true,
}).extend({
  equipmentType: z.literal('wheelchair'),
  frameType: z.enum(['Light', 'Heavy', 'Arcane']).default('Light'),
  wheelchairFeatures: z.array(z.string()).default([]),
  isHomebrew: z.literal(true).default(true),
});

export const HomebrewCustomEquipmentContentSchema = z.object({
  equipmentType: z.literal('custom'),
  name: z.string().min(1),
  slotName: z.string().default('Custom'),
  slotIconKey: z.string().default('custom'),
  description: z.string().default(''),
  features: z.array(BaseFeatureSchema).default([]),
  isHomebrew: z.literal(true).default(true),
});

export const HomebrewEquipmentContentSchema = z.discriminatedUnion(
  'equipmentType',
  [
    HomebrewWeaponContentSchema,
    HomebrewArmorContentSchema,
    HomebrewWheelchairContentSchema,
    HomebrewCustomEquipmentContentSchema,
  ]
);

export const HomebrewEquipmentSchema = HomebrewMetadataSchema.extend({
  contentType: z.literal('equipment'),
  content: HomebrewEquipmentContentSchema,
});

export type HomebrewEquipment = z.infer<typeof HomebrewEquipmentSchema>;
export type HomebrewWeaponContent = z.infer<typeof HomebrewWeaponContentSchema>;
export type HomebrewArmorContent = z.infer<typeof HomebrewArmorContentSchema>;
export type HomebrewWheelchairContent = z.infer<
  typeof HomebrewWheelchairContentSchema
>;
export type HomebrewCustomEquipmentContent = z.infer<
  typeof HomebrewCustomEquipmentContentSchema
>;

// =====================================================================================
// Homebrew Item (General items, consumables, etc.)
// =====================================================================================

export const HomebrewItemFeatureSchema = z.object({
  name: z.string(),
  description: z.string(),
  modifiers: FeatureStatModifiersSchema.optional(),
});

// Unified item categories used across homebrew and inventory
export const ItemCategorySchema = z.enum([
  'Utility',
  'Consumable',
  'Relic',
  'Weapon Modification',
  'Armor Modification',
  'Recipe',
]);

export type ItemCategory = z.infer<typeof ItemCategorySchema>;

export const HomebrewItemContentSchema = z.object({
  name: z.string().min(1),
  description: z.string().default(''),
  tier: EquipmentTierSchema.optional(),
  category: ItemCategorySchema.default('Utility'),
  rarity: RaritySchema.default('Common'),
  features: z.array(HomebrewItemFeatureSchema).default([]),
  value: z.string().optional(), // Gold value as string (e.g., "50g", "2h")
  weight: z.string().optional(),
  modifiers: FeatureStatModifiersSchema.optional(), // Direct item modifiers
  // Inventory management fields
  maxQuantity: z.number().min(1).default(1),
  isConsumable: z.boolean().default(false),
  isHomebrew: z.literal(true).default(true),
});

export const HomebrewItemSchema = HomebrewMetadataSchema.extend({
  contentType: z.literal('item'),
  content: HomebrewItemContentSchema,
});

export type HomebrewItem = z.infer<typeof HomebrewItemSchema>;
export type HomebrewItemContent = z.infer<typeof HomebrewItemContentSchema>;

// =====================================================================================
// Union Type for Any Homebrew Content
// =====================================================================================

export const HomebrewContentSchema = z.discriminatedUnion('contentType', [
  HomebrewAdversarySchema,
  HomebrewEnvironmentSchema,
  HomebrewDomainCardSchema,
  HomebrewClassSchema,
  HomebrewSubclassSchema,
  HomebrewAncestrySchema,
  HomebrewCommunitySchema,
  HomebrewEquipmentSchema,
  HomebrewItemSchema,
]);

export type HomebrewContent = z.infer<typeof HomebrewContentSchema>;

// =====================================================================================
// Engagement Schemas (Stars, Collections, Comments)
// =====================================================================================

export const HomebrewCollectionSchema = z.object({
  id: z.string().uuid(),
  ownerId: z.string().uuid(),
  name: z.string().min(1),
  description: z.string().default(''),
  isQuicklist: z.boolean().default(false),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  deletedAt: z.string().datetime().nullable().optional(),
});

export type HomebrewCollection = z.infer<typeof HomebrewCollectionSchema>;

export const HomebrewCollectionItemSchema = z.object({
  collectionId: z.string().uuid(),
  homebrewId: z.string().uuid(),
  addedBy: z.string().uuid(),
  createdAt: z.string().datetime(),
});

export type HomebrewCollectionItem = z.infer<
  typeof HomebrewCollectionItemSchema
>;

export const HomebrewCommentSchema = z.object({
  id: z.string().uuid(),
  homebrewId: z.string().uuid(),
  authorId: z.string().uuid(),
  body: z.string().min(1),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  deletedAt: z.string().datetime().nullable().optional(),
});

export type HomebrewComment = z.infer<typeof HomebrewCommentSchema>;

// =====================================================================================
// Database Row Types (for storage layer)
// =====================================================================================

export interface HomebrewContentRow {
  id: string;
  owner_id: string;
  content_type: HomebrewContentType;
  visibility: HomebrewVisibility;
  name: string;
  description: string;
  content: Record<string, unknown>;
  tags: string[];
  forked_from: string | null;
  campaign_links: string[];
  fork_count: number;
  view_count: number;
  star_count: number;
  comment_count: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

// =====================================================================================
// Helper Functions
// =====================================================================================

/**
 * Convert database row to typed homebrew content
 */
export function rowToHomebrewContent(row: HomebrewContentRow): HomebrewContent {
  const base: HomebrewMetadata = {
    id: row.id,
    ownerId: row.owner_id,
    contentType: row.content_type,
    visibility: row.visibility,
    name: row.name,
    description: row.description,
    tags: row.tags,
    forkedFrom: row.forked_from,
    campaignLinks: row.campaign_links,
    forkCount: row.fork_count,
    viewCount: row.view_count,
    starCount: row.star_count,
    commentCount: row.comment_count,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    deletedAt: row.deleted_at,
  };

  return {
    ...base,
    content: row.content,
  } as HomebrewContent;
}

/**
 * Convert typed homebrew content to database row format
 */
export function homebrewContentToRow(
  content: HomebrewContent
): Partial<HomebrewContentRow> {
  const row: Partial<HomebrewContentRow> = {
    content_type: content.contentType,
  };

  if (content.id) row.id = content.id;
  if (content.ownerId) row.owner_id = content.ownerId;
  if (content.visibility) row.visibility = content.visibility;
  if (content.name) row.name = content.name;
  if (content.description !== undefined) row.description = content.description;
  if (content.content) row.content = content.content as Record<string, unknown>;
  if (content.tags) row.tags = content.tags;
  if (content.forkedFrom !== undefined)
    row.forked_from = content.forkedFrom ?? null;
  if (content.campaignLinks) row.campaign_links = content.campaignLinks;

  return row;
}

/**
 * Get display label for content type
 */
export function getContentTypeLabel(type: HomebrewContentType): string {
  const labels: Record<HomebrewContentType, string> = {
    adversary: 'Adversary',
    environment: 'Environment',
    domain_card: 'Domain Card',
    class: 'Class',
    subclass: 'Subclass',
    ancestry: 'Ancestry',
    community: 'Community',
    equipment: 'Equipment',
    item: 'Item',
  };
  return labels[type];
}

/**
 * Get plural label for content type
 */
export function getContentTypePluralLabel(type: HomebrewContentType): string {
  const labels: Record<HomebrewContentType, string> = {
    adversary: 'Adversaries',
    environment: 'Environments',
    domain_card: 'Domain Cards',
    class: 'Classes',
    subclass: 'Subclasses',
    ancestry: 'Ancestries',
    community: 'Communities',
    equipment: 'Equipment',
    item: 'Items',
  };
  return labels[type];
}

/**
 * Get visibility display label
 */
export function getVisibilityLabel(visibility: HomebrewVisibility): string {
  const labels: Record<HomebrewVisibility, string> = {
    private: 'Private',
    public: 'Public',
    campaign_only: 'Campaign Only',
  };
  return labels[visibility];
}

// =====================================================================================
// Default Content Templates
// =====================================================================================

export function createDefaultAdversaryContent(): HomebrewAdversaryContentSchema {
  return {
    name: 'New Adversary',
    tier: '1',
    role: 'Standard',
    description: '',
    motivesAndTactics: '',
    difficulty: 10,
    thresholds: { major: 5, severe: 10, massive: null },
    hp: 6,
    stress: 3,
    attack: {
      name: 'Attack',
      modifier: '+2',
      range: 'Melee',
      damage: '1d6+2',
    },
    experiences: [],
    features: [],
    tags: [],
  };
}

export function createDefaultEnvironmentContent(): HomebrewEnvironmentContentSchema {
  return {
    name: 'New Environment',
    tier: '1',
    type: 'Exploration',
    description: '',
    impulses: [],
    difficulty: 12,
    potentialAdversaries: [],
    features: [],
  };
}

export function createDefaultDomainCardContent(): z.infer<
  typeof HomebrewDomainCardContentSchema
> {
  return {
    name: 'New Domain Card',
    level: 1,
    domain: 'Arcana',
    type: 'Spell',
    recallCost: 0,
    description: '',
  };
}

export function createDefaultClassContent(): z.infer<
  typeof HomebrewClassContentSchema
> {
  return {
    name: 'New Class',
    description: '',
    domains: ['Arcana', 'Blade'],
    startingEvasion: 10,
    startingHitPoints: 6,
    classItems: [],
    hopeFeature: {
      name: 'Hope Feature',
      description: '',
      hopeCost: 3,
    },
    classFeatures: [],
    backgroundQuestions: [],
    connections: [],
    isHomebrew: true,
    startingEquipment: [],
  };
}

export function createDefaultSubclassContent(): z.infer<
  typeof HomebrewSubclassContentSchema
> {
  return {
    name: 'New Subclass',
    description: '',
    features: [],
    parentClassName: '',
    isHomebrew: true,
  };
}

export function createDefaultAncestryContent(): z.infer<
  typeof HomebrewAncestryContentSchema
> {
  return {
    name: 'New Ancestry',
    description: '',
    heightRange: '',
    lifespan: '',
    physicalCharacteristics: [],
    primaryFeature: {
      name: 'Primary Feature',
      description: '',
      type: 'primary',
    },
    secondaryFeature: {
      name: 'Secondary Feature',
      description: '',
      type: 'secondary',
    },
    isHomebrew: true,
  };
}

export function createDefaultCommunityContent(): z.infer<
  typeof HomebrewCommunityContentSchema
> {
  return {
    name: 'New Community',
    description: '',
    commonTraits: [],
    feature: {
      name: 'Community Feature',
      description: '',
    },
    isHomebrew: true,
  };
}

export function createDefaultItemContent(): z.infer<
  typeof HomebrewItemContentSchema
> {
  return {
    name: 'New Item',
    description: '',
    category: 'Utility',
    rarity: 'Common',
    features: [],
    maxQuantity: 1,
    isConsumable: false,
    isHomebrew: true,
  };
}

export function createDefaultWeaponContent(): z.infer<
  typeof HomebrewWeaponContentSchema
> {
  return {
    name: 'New Weapon',
    tier: '1',
    equipmentType: 'weapon',
    type: 'Primary',
    trait: 'Agility',
    range: 'Melee',
    damage: {
      diceType: 6,
      count: 1,
      modifier: 0,
      type: 'phy',
    },
    burden: 'One-Handed',
    features: [],
    isHomebrew: true,
  };
}

export function createDefaultArmorContent(): z.infer<
  typeof HomebrewArmorContentSchema
> {
  return {
    name: 'New Armor',
    tier: '1',
    equipmentType: 'armor',
    armorType: 'Leather',
    baseThresholds: {
      major: 3,
      severe: 6,
    },
    baseScore: 2,
    evasionModifier: 0,
    agilityModifier: 0,
    features: [],
    isHomebrew: true,
  };
}

export function createDefaultWheelchairContent(): z.infer<
  typeof HomebrewWheelchairContentSchema
> {
  return {
    name: 'New Combat Wheelchair',
    tier: '1',
    equipmentType: 'wheelchair',
    type: 'Primary',
    trait: 'Agility',
    range: 'Melee',
    damage: {
      diceType: 6,
      count: 1,
      modifier: 0,
      type: 'phy',
    },
    burden: 'Two-Handed',
    frameType: 'Light',
    wheelchairFeatures: [],
    features: [],
    isHomebrew: true,
  };
}

export function createDefaultCustomEquipmentContent(): z.infer<
  typeof HomebrewCustomEquipmentContentSchema
> {
  return {
    name: 'New Custom Equipment',
    equipmentType: 'custom',
    slotName: 'Custom',
    slotIconKey: 'custom',
    description: '',
    features: [],
    isHomebrew: true,
  };
}

export function createDefaultEquipmentContent(
  type: 'weapon' | 'armor' | 'wheelchair' | 'custom' = 'weapon'
): z.infer<typeof HomebrewEquipmentContentSchema> {
  if (type === 'armor') return createDefaultArmorContent();
  if (type === 'wheelchair') return createDefaultWheelchairContent();
  if (type === 'custom') return createDefaultCustomEquipmentContent();
  return createDefaultWeaponContent();
}

// Type aliases for content schemas
type HomebrewAdversaryContentSchema = z.infer<
  typeof HomebrewAdversaryContentSchema
>;
type HomebrewEnvironmentContentSchema = z.infer<
  typeof HomebrewEnvironmentContentSchema
>;
