export function getLoadoutLimits(
  creationComplete: boolean,
  currentLoadoutCount: number,
  startingLimit: number,
  softLimit: number
) {
  const maxAllowed = creationComplete ? softLimit : startingLimit;
  const overHardLimit = currentLoadoutCount > maxAllowed && !creationComplete;
  const disableAdd = !creationComplete && currentLoadoutCount >= startingLimit;
  return { maxAllowed, overHardLimit, disableAdd } as const;
}
