import { z } from 'zod';

import { TierEnum } from './shared';

export const EnvironmentTierEnum = TierEnum;
export const EnvironmentTierSchema = EnvironmentTierEnum;

export const EnvironmentTypeEnum = z.enum([
  'Exploration',
  'Event',
  'Social',
  'Traversal',
]);
export const EnvironmentTypeSchema = EnvironmentTypeEnum;

export const EnvironmentDifficultySchema = z.union([z.number(), z.string()]);

export const EnvironmentFeatureSchema = z.object({
  name: z.string(),
  type: z.string().optional(),
  description: z.string(),
});

export const EnvironmentSchema = z.object({
  name: z.string(),
  tier: EnvironmentTierSchema,
  type: EnvironmentTypeSchema,
  description: z.string(),
  impulses: z.array(z.string()),
  difficulty: EnvironmentDifficultySchema,
  potentialAdversaries: z.array(z.string()),
  features: z
    .array(z.union([z.string(), EnvironmentFeatureSchema]))
    .default([]),
});

export type EnvironmentTier = z.infer<typeof EnvironmentTierEnum>;
export type EnvironmentType = z.infer<typeof EnvironmentTypeEnum>;
export type EnvironmentDifficulty = z.infer<typeof EnvironmentDifficultySchema>;
export type EnvironmentFeature = z.infer<typeof EnvironmentFeatureSchema>;
export type Environment = z.infer<typeof EnvironmentSchema>;
