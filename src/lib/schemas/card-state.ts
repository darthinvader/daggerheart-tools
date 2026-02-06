import { z } from 'zod';

export const CardUsageStateSchema = z.object({
  /** Whether the card is "tapped" / exhausted (rotated 90°) */
  tapped: z.boolean().default(false),
  /** Current number of uses remaining (for limited-use abilities) */
  usesRemaining: z.number().int().min(0).optional(),
  /** Maximum uses per session/rest */
  maxUses: z.number().int().min(1).optional(),
  /** Free-form enhancement text overlay */
  enhancementText: z.string().max(200).optional(),
});
export type CardUsageState = z.infer<typeof CardUsageStateSchema>;

/** Map of card name → usage state */
export const CardUsageMapSchema = z.record(z.string(), CardUsageStateSchema);
export type CardUsageMap = z.infer<typeof CardUsageMapSchema>;
