/**
 * Character Stats Engine
 *
 * Unified calculation engine for all character stats.
 * This is the SINGLE source of truth for stat calculations.
 *
 * Usage in components:
 * ```tsx
 * import { useCharacterStats } from '@/lib/character-stats-engine';
 *
 * function MyComponent({ classSelection, equipment, progression, traits }) {
 *   const { stats, totals, hasModifiers } = useCharacterStats(
 *     classSelection,
 *     equipment,
 *     progression,
 *     traits
 *   );
 *
 *   return <div>Evasion: {totals.evasion}</div>;
 * }
 * ```
 *
 * For non-React code:
 * ```ts
 * import { calculateCharacterStats, buildEngineInput } from '@/lib/character-stats-engine';
 *
 * const input = buildEngineInput(classSelection, equipment, progression, traits);
 * const stats = calculateCharacterStats(input);
 * ```
 */

// Types
export * from './types';

// Core calculation engine
export {
  calculateArmorScore,
  calculateCharacterStats,
  calculateEvasion,
  calculateHp,
  calculateProficiency,
  calculateThresholds,
  calculateTraits,
  getStatTotals,
  hasEquipmentModifiers,
} from './calculate';

// State adapters
export {
  buildEngineInput,
  extractArmorInput,
  extractClassInput,
  extractEquipmentModifiers,
  extractProgressionInput,
  extractTraitsInput,
  getTierFromLevel,
} from './adapters';

// React hook
export {
  useCharacterStats,
  type UseCharacterStatsResult,
  useEquipmentModifiers,
} from './use-character-stats';
