import { z } from 'zod';

import { FeatureStatModifiersSchema } from '@/lib/schemas/core';
import { EquipmentStatModifiersSchema } from '@/lib/schemas/equipment';

// =====================================================================================
// Companion Schema (for Ranger companions)
// =====================================================================================
export const CompanionTrainingSchema = z.object({
  intelligent: z.number().default(0),
  lightInTheDark: z.boolean().default(false),
  creatureComfort: z.boolean().default(false),
  armored: z.boolean().default(false),
  vicious: z.number().default(0),
  resilient: z.number().default(0),
  bonded: z.boolean().default(false),
  aware: z.number().default(0),
});

export const CompanionExperienceSchema = z.object({
  name: z.string(),
  bonus: z.number(),
});

export const CompanionStateSchema = z
  .object({
    name: z.string().default(''),
    type: z.string().default(''),
    evasion: z.number().default(10),
    experiences: z.array(CompanionExperienceSchema).default([]),
    standardAttack: z.string().default(''),
    damageDie: z.enum(['d6', 'd8', 'd10', 'd12']).default('d6'),
    range: z
      .enum(['Melee', 'Very Close', 'Close', 'Far', 'Very Far'])
      .default('Melee'),
    stressSlots: z.number().default(2),
    training: CompanionTrainingSchema.default({
      intelligent: 0,
      lightInTheDark: false,
      creatureComfort: false,
      armored: false,
      vicious: 0,
      resilient: 0,
      bonded: false,
      aware: 0,
    }),
    markedStress: z.number().default(0),
  })
  .nullable();

// =====================================================================================
// Scars Schema
// =====================================================================================
export const ScarSchema = z.object({
  id: z.string(),
  description: z.string(),
  hopeSlotIndex: z.number().int().min(0),
  acquiredAtLevel: z.number().int().min(1).max(10).optional(),
  narrativeImpact: z.string().optional(),
});

// =====================================================================================
// Countdown Schema
// =====================================================================================
export const CountdownSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  segments: z.number(),
  filled: z.number(),
  type: z.enum(['threat', 'opportunity', 'neutral']).default('neutral'),
  createdAt: z.string(),
});

// =====================================================================================
// Session Entry Schema
// =====================================================================================
export const SessionEntrySchema = z.object({
  id: z.string(),
  number: z.number(),
  date: z.string(),
  title: z.string().optional(),
  summary: z.string().optional(),
  xpGained: z.number().default(0),
  goldGained: z.number().default(0),
  notableEvents: z.array(z.string()).default([]),
});

// =====================================================================================
// Character Notes Schema
// =====================================================================================
export const CharacterNoteSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  category: z
    .enum(['general', 'session', 'npc', 'location', 'quest', 'lore'])
    .default('general'),
  createdAt: z.string(),
  updatedAt: z.string(),
  isPinned: z.boolean().optional(),
});

// =====================================================================================
// Downtime Activity Schema
// =====================================================================================
export const DowntimeActivitySchema = z.object({
  id: z.string(),
  moveId: z.string(),
  moveName: z.string(),
  notes: z.string().default(''),
  hoursSpent: z.number().default(0),
  completed: z.boolean().default(false),
  outcome: z.string().optional(),
  sessionDate: z.string(),
});

// =====================================================================================
// Relaxed identity schema for API storage
// =====================================================================================
export const ApiIdentitySchema = z.object({
  name: z.string().default(''),
  pronouns: z.string().default(''),
  ancestry: z.string().default(''),
  community: z.string().default(''),
  description: z.string().default(''),
  calling: z.string().default(''),
  ancestryDetails: z
    .object({
      type: z.enum(['standard', 'mixed', 'homebrew']).default('standard'),
      mixed: z
        .object({
          name: z.string().optional(),
          primaryFrom: z.string(),
          secondaryFrom: z.string(),
        })
        .optional(),
      homebrew: z
        .object({
          name: z.string(),
          description: z.string().optional().default(''),
          heightRange: z.string().optional(),
          lifespan: z.string().optional(),
          physicalCharacteristics: z.array(z.string()).optional(),
          primaryFeature: z.object({
            name: z.string(),
            description: z.string(),
            modifiers: FeatureStatModifiersSchema.optional(),
          }),
          secondaryFeature: z.object({
            name: z.string(),
            description: z.string(),
            modifiers: FeatureStatModifiersSchema.optional(),
          }),
        })
        .optional(),
    })
    .optional(),
  communityDetails: z
    .object({
      type: z.enum(['standard', 'homebrew']).default('standard'),
      homebrew: z
        .object({
          name: z.string(),
          description: z.string().optional().default(''),
          commonTraits: z.array(z.string()).default([]),
          feature: z.object({
            name: z.string(),
            description: z.string().optional(),
            modifiers: FeatureStatModifiersSchema.optional(),
          }),
        })
        .optional(),
    })
    .optional(),
  background: z
    .union([
      z.string(),
      z.array(z.object({ question: z.string(), answer: z.string() })),
    ])
    .optional(),
  descriptionDetails: z
    .object({
      eyes: z.string().optional(),
      hair: z.string().optional(),
      skin: z.string().optional(),
      body: z.string().optional(),
      clothing: z.string().optional(),
      mannerisms: z.string().optional(),
      other: z.string().optional(),
    })
    .optional(),
  connections: z
    .array(
      z.object({
        prompt: z.string(),
        answer: z.string(),
        withPlayer: z
          .object({ id: z.string().optional(), name: z.string().optional() })
          .optional(),
      })
    )
    .optional(),
});

// =====================================================================================
// Relaxed API Inventory Schema
// =====================================================================================
export const ApiInventorySlotSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  quantity: z.number().min(1).default(1),
  location: z.string().optional(),
  isEquipped: z.boolean().optional(),
  item: z
    .object({
      name: z.string(),
      tier: z.string().optional(),
      description: z.string().optional(),
      category: z.string().optional(),
      features: z
        .array(
          z.object({
            name: z.string(),
            description: z.string(),
            modifiers: FeatureStatModifiersSchema.optional(),
          })
        )
        .optional(),
      statModifiers: EquipmentStatModifiersSchema.optional(),
      rarity: z.string().optional(),
      isConsumable: z.boolean().optional(),
      maxQuantity: z.number().optional(),
      weight: z.string().optional(),
      cost: z.number().optional(),
    })
    .optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const ApiInventorySchema = z.object({
  slots: z.array(ApiInventorySlotSchema).default([]),
  maxItems: z.number().min(1).default(50),
  weightCapacity: z.number().min(0).optional(),
  currentWeight: z.number().min(0).default(0),
  unlimitedSlots: z.boolean().optional(),
  unlimitedQuantity: z.boolean().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

// =====================================================================================
// Relaxed API Equipment Schema
// =====================================================================================
export const ApiEquipmentSchema = z.object({
  primaryWeapon: z.any().optional().nullable(),
  primaryWeaponMode: z.enum(['standard', 'homebrew']).optional(),
  homebrewPrimaryWeapon: z.any().optional(),
  secondaryWeapon: z.any().optional().nullable(),
  secondaryWeaponMode: z.enum(['standard', 'homebrew']).optional(),
  homebrewSecondaryWeapon: z.any().optional(),
  armor: z.any().optional().nullable(),
  armorMode: z.enum(['standard', 'homebrew']).optional(),
  homebrewArmor: z.any().optional(),
  useCombatWheelchair: z.boolean().optional(),
  combatWheelchair: z.any().optional().nullable(),
  wheelchairMode: z.enum(['standard', 'homebrew']).optional(),
  homebrewWheelchair: z.any().optional(),
  customSlots: z.array(z.any()).optional(),
  items: z.array(z.any()).default([]),
  consumables: z.record(z.string(), z.any()).default({}),
});
