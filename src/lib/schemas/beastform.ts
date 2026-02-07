import { z } from 'zod';

import { CharacterTraitEnum } from './core';

/**
 * Beastform activation state schema.
 *
 * Tracks whether beastform is active, which form is selected,
 * and how it was activated (Stress vs. Evolution Hope feature).
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
