import { z } from 'zod';

// =====================================================================================
// Dice Result Schemas
// =====================================================================================

/**
 * The four possible outcomes of a resolved Duality Roll.
 * Per SRD Page 28-29.
 */
export const DualityOutcomeEnum = z.enum([
  'critical_success',
  'success_with_hope',
  'success_with_fear',
  'failure_with_fear',
]);
export type DualityOutcome = z.infer<typeof DualityOutcomeEnum>;

/** Validates dice notation strings like "1d8", "2d6", "3d10" */
export const DiceNotationSchema = z.string().regex(/^\d+d\d+$/, {
  message: 'Invalid dice notation. Expected format: NdS (e.g., "2d6")',
});
export type DiceNotation = z.infer<typeof DiceNotationSchema>;

/** Result of rolling one or more dice of the same type */
export const DiceRollResultSchema = z.object({
  sides: z.number().int().positive(),
  rolls: z.array(z.number().int().positive()),
  total: z.number().int(),
});
export type DiceRollResult = z.infer<typeof DiceRollResultSchema>;

/** Result of rolling effect/damage dice */
export const EffectDieResultSchema = z.object({
  notation: DiceNotationSchema,
  rolls: z.array(z.number().int().positive()),
  total: z.number().int().nonnegative(),
});
export type EffectDieResult = z.infer<typeof EffectDieResultSchema>;

/** Options for a Duality Roll */
export const DualityRollOptionsSchema = z.object({
  advantage: z.boolean().default(false),
  disadvantage: z.boolean().default(false),
  effectDie: DiceNotationSchema.optional(),
});
export type DualityRollOptions = z.infer<typeof DualityRollOptionsSchema>;

/**
 * Raw result of a Duality Roll before difficulty comparison.
 * Contains the dice values and computed total.
 */
export const DualityRollResultSchema = z.object({
  hopeDie: z.number().int().min(1).max(12),
  fearDie: z.number().int().min(1).max(12),
  modifier: z.number().int(),
  advantageDie: z.number().int().min(1).max(6).optional(),
  disadvantageDie: z.number().int().min(1).max(6).optional(),
  total: z.number().int(),
  effectDieResult: EffectDieResultSchema.optional(),
  isMatching: z.boolean(),
  timestamp: z.number(),
});
export type DualityRollResult = z.infer<typeof DualityRollResultSchema>;

/**
 * A fully resolved Duality Roll with outcome determination.
 * Per SRD Pages 28-29.
 */
export const ResolvedDualityRollSchema = DualityRollResultSchema.extend({
  difficulty: z.number().int(),
  outcome: DualityOutcomeEnum,
  hopeGenerated: z.number().int().min(0),
  fearGenerated: z.number().int().min(0),
  clearsStress: z.boolean(),
});
export type ResolvedDualityRoll = z.infer<typeof ResolvedDualityRollSchema>;
