export function getLoadoutLimits(
  _creationComplete: boolean,
  _currentLoadoutCount: number,
  _startingLimit: number,
  _softLimit: number
) {
  // * REVIEW: Loadout capacity will depend on Recall Cost, not raw card count.
  // For now, disable gating by count and return neutral values.
  const maxAllowed = Infinity;
  const overHardLimit = false;
  const disableAdd = false;
  return { maxAllowed, overHardLimit, disableAdd } as const;
}
