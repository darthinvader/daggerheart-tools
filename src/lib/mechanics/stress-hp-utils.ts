/**
 * Stress & HP Overflow Mechanics
 *
 * Per SRD Page 38:
 * - "If you ever have to mark a Stress slot but don't have any available,
 *    you must mark a Hit Point instead"
 * - "When your Stress is full, you become Vulnerable"
 */

export interface StressMarkResult {
  /** Amount of stress actually marked */
  stressMarked: number;
  /** Amount that overflowed to HP (when stress is full) */
  hpOverflow: number;
  /** Whether character should become Vulnerable (stress now full) */
  shouldBecomeVulnerable: boolean;
  /** New stress current value */
  newStressCurrent: number;
}

/**
 * Calculate stress marking with overflow to HP per SRD rules.
 *
 * @param currentStress - Current stress value
 * @param maxStress - Maximum stress slots
 * @param amountToMark - How much stress to mark
 * @returns Result with stress marked, HP overflow, and vulnerability status
 */
export function calculateStressMark(
  currentStress: number,
  maxStress: number,
  amountToMark: number
): StressMarkResult {
  if (amountToMark <= 0) {
    return {
      stressMarked: 0,
      hpOverflow: 0,
      shouldBecomeVulnerable: currentStress >= maxStress,
      newStressCurrent: currentStress,
    };
  }

  const availableSlots = maxStress - currentStress;
  const stressMarked = Math.min(amountToMark, availableSlots);
  const hpOverflow = Math.max(0, amountToMark - availableSlots);
  const newStressCurrent = currentStress + stressMarked;

  return {
    stressMarked,
    hpOverflow,
    shouldBecomeVulnerable: newStressCurrent >= maxStress,
    newStressCurrent,
  };
}

/**
 * Apply stress change with HP overflow and vulnerability tracking.
 *
 * @returns Updated resources and whether Vulnerable should be added
 */
export function applyStressWithOverflow(
  currentStress: number,
  maxStress: number,
  currentHp: number,
  targetStress: number
): {
  newStress: number;
  newHp: number;
  shouldBecomeVulnerable: boolean;
} {
  // If reducing stress (clearing), no overflow
  if (targetStress <= currentStress) {
    return {
      newStress: Math.max(0, targetStress),
      newHp: currentHp,
      shouldBecomeVulnerable: false,
    };
  }

  // Marking additional stress
  const amountToMark = targetStress - currentStress;
  const result = calculateStressMark(currentStress, maxStress, amountToMark);

  return {
    newStress: result.newStressCurrent,
    newHp: Math.max(0, currentHp - result.hpOverflow),
    shouldBecomeVulnerable: result.shouldBecomeVulnerable,
  };
}

/**
 * Check if "Vulnerable" condition should be auto-added based on stress state.
 */
export function shouldAddVulnerableFromStress(
  currentStress: number,
  maxStress: number,
  currentConditions: string[]
): boolean {
  const isStressFull = currentStress >= maxStress;
  const hasVulnerable = currentConditions.some(
    c => c.toLowerCase() === 'vulnerable'
  );
  return isStressFull && !hasVulnerable;
}

/**
 * Per SRD Page 29: "When you critically succeed, you clear one Stress if any is marked"
 */
export function clearStressOnCriticalSuccess(currentStress: number): number {
  return Math.max(0, currentStress - 1);
}

/**
 * Per SRD Page 32: Tag Team costs 3 Hope, once per session
 */
export const TAG_TEAM_HOPE_COST = 3;

export interface TagTeamResult {
  success: boolean;
  newHope: number;
  errorMessage?: string;
}

/**
 * Attempt to use Tag Team ability.
 *
 * @param currentHope - Current Hope amount
 * @param tagTeamUsedThisSession - Whether Tag Team was already used this session
 * @returns Result with success status and new hope value
 */
export function tryTagTeam(
  currentHope: number,
  tagTeamUsedThisSession: boolean
): TagTeamResult {
  if (tagTeamUsedThisSession) {
    return {
      success: false,
      newHope: currentHope,
      errorMessage: 'Tag Team can only be used once per session',
    };
  }

  if (currentHope < TAG_TEAM_HOPE_COST) {
    return {
      success: false,
      newHope: currentHope,
      errorMessage: `Tag Team requires ${TAG_TEAM_HOPE_COST} Hope (you have ${currentHope})`,
    };
  }

  return {
    success: true,
    newHope: currentHope - TAG_TEAM_HOPE_COST,
  };
}
