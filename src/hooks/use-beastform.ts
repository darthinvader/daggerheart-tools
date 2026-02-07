/**
 * Beastform Hooks
 *
 * Custom hooks for managing beastform activation, deactivation,
 * and derived state (whether beastform is available, current form data, etc.)
 */

import { useCallback, useMemo } from 'react';

import { getTierFromLevel } from '@/lib/character-stats-engine/adapters';
import type { CharacterTrait } from '@/lib/character-stats-engine/types';
import { getBeastformById, getBeastformsForTier } from '@/lib/data/beastforms';
import type { BeastformDefinition } from '@/lib/data/beastforms';
import {
  type BeastformState,
  DEFAULT_BEASTFORM_STATE,
} from '@/lib/schemas/beastform';

interface BeastformStateResult {
  /** Whether beastform is currently active */
  isActive: boolean;
  /** The currently active beastform definition, if any */
  activeForm: BeastformDefinition | undefined;
  /** All beastforms available at the character's tier or below */
  availableForms: BeastformDefinition[];
  /** Whether the character is a Druid (can use beastform) */
  isDruid: boolean;
  /** Current beastform state */
  beastform: BeastformState;
}

/**
 * Derive beastform-related state from character state.
 */
export function useBeastformState(
  className: string | null | undefined,
  currentLevel: number,
  beastform: BeastformState
): BeastformStateResult {
  const isDruid = useMemo(
    () => className?.toLowerCase() === 'druid',
    [className]
  );

  const tier = useMemo(() => getTierFromLevel(currentLevel), [currentLevel]);

  const availableForms = useMemo(
    () => (isDruid ? getBeastformsForTier(tier) : []),
    [isDruid, tier]
  );

  const activeForm = useMemo(
    () =>
      beastform.active && beastform.formId
        ? getBeastformById(beastform.formId)
        : undefined,
    [beastform.active, beastform.formId]
  );

  return {
    isActive: beastform.active,
    activeForm,
    availableForms,
    isDruid,
    beastform,
  };
}

interface BeastformActions {
  /** Activate beastform by spending 1 Stress */
  activateWithStress: (formId: string) => void;
  /** Activate beastform via Evolution (3 Hope), with a bonus trait */
  activateWithEvolution: (formId: string, bonusTrait: CharacterTrait) => void;
  /** Drop out of beastform (voluntary or forced) */
  deactivate: () => void;
}

/**
 * Actions to activate/deactivate beastform.
 * Callers are responsible for paying costs (marking Stress / spending Hope).
 */
export function useBeastformActions(
  setBeastform: (value: BeastformState) => void
): BeastformActions {
  const activateWithStress = useCallback(
    (formId: string) => {
      setBeastform({
        active: true,
        formId,
        activationMethod: 'stress',
        evolutionBonusTrait: null,
        activatedAt: new Date().toISOString(),
      });
    },
    [setBeastform]
  );

  const activateWithEvolution = useCallback(
    (formId: string, bonusTrait: CharacterTrait) => {
      setBeastform({
        active: true,
        formId,
        activationMethod: 'evolution',
        evolutionBonusTrait: { trait: bonusTrait, value: 1 },
        activatedAt: new Date().toISOString(),
      });
    },
    [setBeastform]
  );

  const deactivate = useCallback(() => {
    setBeastform(DEFAULT_BEASTFORM_STATE);
  }, [setBeastform]);

  return { activateWithStress, activateWithEvolution, deactivate };
}
