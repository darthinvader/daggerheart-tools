/**
 * Character Stats Engine - React Hook
 *
 * Provides a convenient hook for components to calculate character stats.
 */

import { useMemo } from 'react';

import type { EquipmentState } from '@/components/equipment';
import type { TraitsState as ComponentTraitsState } from '@/components/traits';
import type { BeastformState } from '@/lib/schemas/beastform';

import { buildEngineInput } from './adapters';
import {
  calculateCharacterStats,
  getStatTotals,
  hasEquipmentModifiers,
} from './calculate';
import type { CharacterStatsOutput } from './types';

/** Class selection state (minimal interface for hook) */
interface ClassSelectionState {
  className: string | null;
  isHomebrew?: boolean;
  homebrewClass?: {
    startingHitPoints: number;
    startingEvasion: number;
  };
}

/** Progression state (minimal interface for hook) */
interface ProgressionState {
  currentLevel: number;
  tier?: number;
}

/** Hook return type */
export interface UseCharacterStatsResult {
  /** Full calculated stats with breakdowns */
  stats: CharacterStatsOutput;
  /** Just the total values for simple display */
  totals: ReturnType<typeof getStatTotals>;
  /** Whether any equipment modifiers are active */
  hasModifiers: boolean;
}

/**
 * Calculate character stats from component state.
 *
 * @param classSelection - Class selection state
 * @param equipment - Equipment state
 * @param progression - Progression state
 * @param traits - Traits state
 * @param beastform - Optional beastform state (modifiers merged into equipment modifiers)
 * @returns Calculated stats with breakdowns and totals
 */
export function useCharacterStats(
  classSelection: ClassSelectionState | null | undefined,
  equipment: EquipmentState | null | undefined,
  progression: ProgressionState | null | undefined,
  traits: ComponentTraitsState | null | undefined,
  beastform?: BeastformState | null
): UseCharacterStatsResult {
  const stats = useMemo(() => {
    const input = buildEngineInput(
      classSelection,
      equipment,
      progression,
      traits,
      beastform
    );
    return calculateCharacterStats(input);
  }, [classSelection, equipment, progression, traits, beastform]);

  const totals = useMemo(() => getStatTotals(stats), [stats]);
  const hasModifiers = useMemo(() => hasEquipmentModifiers(stats), [stats]);

  return { stats, totals, hasModifiers };
}

/**
 * Calculate just the equipment modifiers (for components that only need that).
 *
 * @param equipment - Equipment state
 * @returns Equipment modifiers
 */
export function useEquipmentModifiers(
  equipment: EquipmentState | null | undefined
) {
  return useMemo(() => {
    const input = buildEngineInput(null, equipment, null, null);
    return input.equipmentModifiers;
  }, [equipment]);
}
