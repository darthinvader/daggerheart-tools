import { z } from 'zod';

import { AdversarySchema } from './adversaries';
import { EnvironmentSchema } from './environments';

/**
 * Tracked character in a battle (simplified PC representation)
 */
export const BattleCharacterSchema = z.object({
  id: z.string(),
  name: z.string(),
  evasion: z.number().nullable(),
  hp: z.object({
    current: z.number(),
    max: z.number(),
  }),
  stress: z.object({
    current: z.number(),
    max: z.number(),
  }),
  conditions: z.record(z.string(), z.boolean()).default({}),
  notes: z.string().default(''),
});

/**
 * Attack override for adversaries
 */
export const AdversaryAttackOverrideSchema = z.object({
  name: z.string().optional(),
  modifier: z.union([z.string(), z.number()]).optional(),
  range: z.string().optional(),
  damage: z.string().optional(),
});

/**
 * Thresholds override for adversaries
 */
export const AdversaryThresholdsOverrideSchema = z.object({
  major: z.number().nullable().optional(),
  severe: z.number().nullable().optional(),
  massive: z.number().nullable().optional(),
});

/**
 * Feature override for adversaries
 */
export const AdversaryFeatureOverrideSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string().optional(),
  description: z.string(),
  isCustom: z.boolean().optional(),
});

/**
 * Tracked adversary in a battle
 */
export const BattleAdversarySchema = z.object({
  id: z.string(),
  source: AdversarySchema,
  hp: z.object({
    current: z.number(),
    max: z.number(),
  }),
  stress: z.object({
    current: z.number(),
    max: z.number(),
  }),
  conditions: z.record(z.string(), z.boolean()).default({}),
  notes: z.string().default(''),
  difficultyOverride: z.number().optional(),
  attackOverride: AdversaryAttackOverrideSchema.optional(),
  thresholdsOverride: AdversaryThresholdsOverrideSchema.optional(),
  featuresOverride: z.array(AdversaryFeatureOverrideSchema).optional(),
  lastAttackRoll: z
    .object({
      roll: z.number(),
      total: z.number(),
      modStr: z.string().optional(),
      timestamp: z.number(),
    })
    .optional(),
  lastDamageRoll: z
    .object({
      dice: z.string(),
      rolls: z.array(z.number()),
      total: z.number(),
      timestamp: z.number(),
    })
    .optional(),
});

/**
 * Tracked environment feature
 */
export const BattleEnvironmentFeatureSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  type: z.string().optional(),
  active: z.boolean().default(false),
});

/**
 * Tracked environment in a battle
 */
export const BattleEnvironmentSchema = z.object({
  id: z.string(),
  source: EnvironmentSchema,
  notes: z.string().default(''),
  features: z.array(BattleEnvironmentFeatureSchema).default([]),
  countdown: z.number().optional(),
});

/**
 * Selection reference for spotlight tracking
 */
export const BattleSelectionSchema = z.object({
  kind: z.enum(['character', 'adversary', 'environment']),
  id: z.string(),
});

/**
 * Complete battle state that can be saved/loaded
 */
export const BattleStateSchema = z.object({
  id: z.string(),
  name: z.string().default('Untitled Battle'),
  campaignId: z.string().optional(),
  sessionId: z.string().optional(),
  characters: z.array(BattleCharacterSchema).default([]),
  adversaries: z.array(BattleAdversarySchema).default([]),
  environments: z.array(BattleEnvironmentSchema).default([]),
  spotlight: BattleSelectionSchema.nullable().default(null),
  spotlightHistory: z.array(BattleSelectionSchema).default([]),
  fearPool: z.number().default(0),
  notes: z.string().default(''),
  status: z
    .enum(['planning', 'active', 'paused', 'completed'])
    .default('planning'),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type BattleCharacter = z.infer<typeof BattleCharacterSchema>;
export type BattleAdversary = z.infer<typeof BattleAdversarySchema>;
export type BattleEnvironmentFeature = z.infer<
  typeof BattleEnvironmentFeatureSchema
>;
export type BattleEnvironment = z.infer<typeof BattleEnvironmentSchema>;
export type BattleSelection = z.infer<typeof BattleSelectionSchema>;
export type BattleState = z.infer<typeof BattleStateSchema>;
