import { z } from 'zod';

import { CharacterTraitEnum } from './core';

/**
 * Beastform activation state schema.
 *
 * Tracks whether beastform is active, which form is selected,
 * and how it was activated (Stress vs. Evolution Hope feature).
 * Also tracks customization for special forms (Evolved / Hybrid).
 */
export const BeastformStateSchema = z.object({
  /** Whether beastform is currently active */
  active: z.boolean(),
  /** ID of the selected beastform (from BEASTFORMS data) */
  formId: z.string().nullable(),
  /** How beastform was activated: 'stress' (1 Stress) or 'evolution' (3 Hope) */
  activationMethod: z.enum(['stress', 'evolution']).nullable(),
  /** Bonus trait from Evolution (3 Hope) activation — +1 to chosen trait */
  evolutionBonusTrait: z
    .object({
      trait: CharacterTraitEnum,
      value: z.number(),
    })
    .nullable(),
  /** ISO timestamp when beastform was activated */
  activatedAt: z.string().datetime().nullable(),
  /** For Evolved forms (Legendary Beast, Mythic Beast): ID of the chosen base form */
  evolvedBaseFormId: z.string().nullable().optional(),
  /** For Hybrid forms: IDs of chosen base forms */
  hybridBaseFormIds: z.array(z.string()).nullable().optional(),
  /** For Hybrid forms: chosen advantage names from the base forms */
  selectedAdvantages: z.array(z.string()).nullable().optional(),
  /** For Hybrid forms: chosen features from the base forms */
  selectedFeatures: z
    .array(z.object({ name: z.string(), description: z.string() }))
    .nullable()
    .optional(),
});

export type BeastformState = z.infer<typeof BeastformStateSchema>;

/** Default (inactive) beastform state */
export const DEFAULT_BEASTFORM_STATE: BeastformState = {
  active: false,
  formId: null,
  activationMethod: null,
  evolutionBonusTrait: null,
  activatedAt: null,
};
