import { z } from 'zod';

export const AdversaryTierEnum = z.enum(['1', '2', '3', '4']);
export const AdversaryTierSchema = AdversaryTierEnum;

export const AdversaryRoleEnum = z.enum([
  'Bruiser',
  'Horde',
  'Leader',
  'Minion',
  'Ranged',
  'Skulk',
  'Social',
  'Solo',
  'Standard',
  'Support',
]);
export const AdversaryRoleSchema = AdversaryRoleEnum;

export const AdversaryThresholdsSchema = z.union([
  z.string(),
  z.object({
    major: z.number().nullable(),
    severe: z.number().nullable(),
    massive: z.number().nullable().optional(),
  }),
]);

export const AdversaryAttackSchema = z.object({
  modifier: z.union([z.string(), z.number()]),
  name: z.string(),
  range: z.string(),
  damage: z.string(),
});

export const AdversaryExperienceSchema = z.object({
  name: z.string(),
  bonus: z.number().int(),
  description: z.string().optional(),
});

export const AdversaryFeatureSchema = z.object({
  name: z.string(),
  type: z.string().optional(),
  description: z.string(),
});

export const AdversarySchema = z.object({
  name: z.string(),
  tier: AdversaryTierSchema,
  role: AdversaryRoleSchema,
  description: z.string(),
  motivesAndTactics: z.string().optional(),
  difficulty: z.number(),
  thresholds: AdversaryThresholdsSchema,
  hp: z.number(),
  stress: z.number(),
  attack: AdversaryAttackSchema,
  experiences: z
    .array(z.union([z.string(), AdversaryExperienceSchema]))
    .default([]),
  features: z.array(z.union([z.string(), AdversaryFeatureSchema])).default([]),
  tags: z.array(z.string()).optional(),
});

export type AdversaryTier = z.infer<typeof AdversaryTierEnum>;
export type AdversaryRole = z.infer<typeof AdversaryRoleEnum>;
export type AdversaryAttack = z.infer<typeof AdversaryAttackSchema>;
export type AdversaryThresholds = z.infer<typeof AdversaryThresholdsSchema>;
export type AdversaryExperience = z.infer<typeof AdversaryExperienceSchema>;
export type AdversaryFeature = z.infer<typeof AdversaryFeatureSchema>;
export type Adversary = z.infer<typeof AdversarySchema>;
