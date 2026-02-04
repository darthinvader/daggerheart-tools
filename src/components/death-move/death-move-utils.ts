/**
 * Simulates rolling a d12 die
 */
export function rollD12(): number {
  return Math.floor(Math.random() * 12) + 1;
}

/**
 * Checks if duality dice result is a critical success (both dice same value)
 */
export function isCriticalSuccess(hopeDie: number, fearDie: number): boolean {
  return hopeDie === fearDie;
}

/**
 * Determines the outcome of a "Risk It All" death move.
 * Per SRD: On non-critical success (Hope > Fear), player can divide Hope Die value
 * between HP and Stress however they prefer. On critical (matching), clears all.
 */
export function resolveRiskItAll(
  hopeDie: number,
  fearDie: number
): {
  survived: boolean;
  isCritical: boolean;
  /** Total value to divide between HP and Stress (for non-critical success) */
  clearingValue: number;
  /** Whether player needs to allocate clearing value (non-critical success only) */
  needsAllocation: boolean;
} {
  const isCritical = isCriticalSuccess(hopeDie, fearDie);

  if (isCritical) {
    return {
      survived: true,
      isCritical: true,
      clearingValue: 0, // Not used; clears all
      needsAllocation: false,
    };
  }

  if (hopeDie > fearDie) {
    return {
      survived: true,
      isCritical: false,
      clearingValue: hopeDie,
      needsAllocation: true,
    };
  }

  return {
    survived: false,
    isCritical: false,
    clearingValue: 0,
    needsAllocation: false,
  };
}

/**
 * Determines if a scar is gained when avoiding death
 * @param hopeDieRoll - The roll of the Hope Die
 * @param characterLevel - The character's current level
 */
export function checkForScar(
  hopeDieRoll: number,
  characterLevel: number
): boolean {
  return hopeDieRoll <= characterLevel;
}
