import type { ConditionsState } from '@/components/conditions';
import type { CharacterRecord } from '@/lib/api/characters';
import type { getStatTotals } from '@/lib/character-stats-engine';

export type ResourceSnapshot = {
  hpMax: number;
  hpCurrent: number;
  stressMax: number;
  stressCurrent: number;
  evasion: number;
  armorScore: number;
  armorSlotsCurrent: number;
  hopeMax: number;
  hopeCurrent: number;
  gold: number;
};

export function buildResourceSnapshot(
  character: CharacterRecord,
  totals: ReturnType<typeof getStatTotals>
): ResourceSnapshot {
  const resources = character.resources;
  const { hpMax, hpCurrent } = getHpSnapshot(resources, totals);
  const { stressMax, stressCurrent } = getStressSnapshot(resources);
  const { hopeMax, hopeCurrent } = getHopeSnapshot(resources);
  const { armorScore, armorSlotsCurrent } = getArmorSnapshot(resources, totals);

  return {
    hpMax,
    hpCurrent,
    stressMax,
    stressCurrent,
    evasion: getEvasionValue(resources, totals),
    armorScore,
    armorSlotsCurrent,
    hopeMax,
    hopeCurrent,
    gold: getGoldValue(resources),
  };
}

export function buildConditions(character: CharacterRecord): ConditionsState {
  const conditionItems = Array.isArray(character.conditions)
    ? character.conditions.map(c => c.name)
    : [];
  return { items: conditionItems };
}

function getHpSnapshot(
  resources: CharacterRecord['resources'],
  totals: ReturnType<typeof getStatTotals>
) {
  const hpMax = resources?.hp?.max ?? totals.hp;
  const hpCurrent = resources?.hp?.current ?? hpMax;
  return { hpMax, hpCurrent };
}

function getStressSnapshot(resources: CharacterRecord['resources']) {
  const stressMax = resources?.stress?.max ?? 6;
  const stressCurrent = resources?.stress?.current ?? 0;
  return { stressMax, stressCurrent };
}

function getHopeSnapshot(resources: CharacterRecord['resources']) {
  const hopeMax = resources?.hope?.max ?? 6;
  const hopeCurrent = resources?.hope?.current ?? 0;
  return { hopeMax, hopeCurrent };
}

function getArmorSnapshot(
  resources: CharacterRecord['resources'],
  totals: ReturnType<typeof getStatTotals>
) {
  const armorScore = resources?.armorScore?.max ?? totals.armorScore;
  const armorSlotsCurrent = resources?.armorScore?.current ?? armorScore;
  return { armorScore, armorSlotsCurrent };
}

function getEvasionValue(
  resources: CharacterRecord['resources'],
  totals: ReturnType<typeof getStatTotals>
) {
  return resources?.evasion ?? totals.evasion;
}

function getGoldValue(resources: CharacterRecord['resources']) {
  return calculateTotalGold(resources?.gold);
}

function calculateTotalGold(
  goldObj?: CharacterRecord['resources']['gold']
): number {
  if (!goldObj) return 0;
  return (
    (goldObj.coins ?? 0) +
    (goldObj.handfuls ?? 0) * 10 +
    (goldObj.bags ?? 0) * 100 +
    (goldObj.chests ?? 0) * 1000
  );
}
