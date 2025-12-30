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
 * Determines the outcome of a "Risk It All" death move
 */
export function resolveRiskItAll(
  hopeDie: number,
  fearDie: number
): {
  survived: boolean;
  isCritical: boolean;
  hpCleared: number;
  stressCleared: number;
} {
  const isCritical = isCriticalSuccess(hopeDie, fearDie);

  if (isCritical) {
    return {
      survived: true,
      isCritical: true,
      hpCleared: 999, // Represents "all"
      stressCleared: 999,
    };
  }

  if (hopeDie > fearDie) {
    return {
      survived: true,
      isCritical: false,
      hpCleared: hopeDie,
      stressCleared: 0,
    };
  }

  return {
    survived: false,
    isCritical: false,
    hpCleared: 0,
    stressCleared: 0,
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
