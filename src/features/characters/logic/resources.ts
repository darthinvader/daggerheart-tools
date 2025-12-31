import {
  type ResourcesDraft,
  writeResourcesToStorage,
} from '@/features/characters/storage';

type Setter<T> = (updater: (prev: T) => T) => void;

const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));

type ResourceKey = 'hp' | 'stress' | 'hope' | 'armorScore';

function createMinMaxUpdater(
  id: string,
  key: ResourceKey,
  setResources: Setter<ResourcesDraft>
) {
  const updateCurrent = (delta: number) => {
    setResources(prev => {
      const resource = prev[key];
      const next: ResourcesDraft = {
        ...prev,
        [key]: {
          current: clamp(resource.current + delta, 0, resource.max),
          max: resource.max,
        },
      };
      writeResourcesToStorage(id, next);
      return next;
    });
  };

  const updateMax = (delta: number, minMax = 0) => {
    setResources(prev => {
      const resource = prev[key];
      const max = Math.max(minMax, resource.max + delta);
      const current = clamp(resource.current, 0, max);
      const next: ResourcesDraft = { ...prev, [key]: { current, max } };
      writeResourcesToStorage(id, next);
      return next;
    });
  };

  return { updateCurrent, updateMax };
}

function createGoldActions(id: string, setResources: Setter<ResourcesDraft>) {
  const getDefaultGold = (
    prev: ResourcesDraft
  ): NonNullable<ResourcesDraft['gold']> => ({
    handfuls: prev.gold?.handfuls ?? 0,
    bags: prev.gold?.bags ?? 0,
    chests: prev.gold?.chests ?? 0,
    coins: prev.gold?.coins ?? 0,
    showCoins: prev.gold?.showCoins ?? false,
    displayDenomination: prev.gold?.displayDenomination ?? 'handfuls',
  });

  const updateGold = (kind: 'handfuls' | 'bags' | 'chests', delta: number) => {
    setResources(prev => {
      const current = prev.gold?.[kind] ?? 0;
      const nextGold = {
        ...getDefaultGold(prev),
        [kind]: Math.max(0, current + delta),
      };
      const next: ResourcesDraft = { ...prev, gold: nextGold };
      writeResourcesToStorage(id, next);
      return next;
    });
  };

  const setGold = (kind: 'handfuls' | 'bags' | 'chests', value: number) => {
    setResources(prev => {
      const nextGold = {
        ...getDefaultGold(prev),
        [kind]: Math.max(0, Math.floor(value) || 0),
      };
      const next: ResourcesDraft = { ...prev, gold: nextGold };
      writeResourcesToStorage(id, next);
      return next;
    });
  };

  return { updateGold, setGold };
}

export function createResourceActions(
  id: string,
  setResources: Setter<ResourcesDraft>
) {
  const stress = createMinMaxUpdater(id, 'stress', setResources);
  const armorScore = createMinMaxUpdater(id, 'armorScore', setResources);
  const hp = createMinMaxUpdater(id, 'hp', setResources);
  const hope = createMinMaxUpdater(id, 'hope', setResources);
  const gold = createGoldActions(id, setResources);

  const updateNumber = <K extends keyof ResourcesDraft>(
    key: K,
    delta: number,
    min: number
  ) => {
    setResources(prev => {
      const nextValue = Math.max(min, (prev[key] as number) + delta);
      const next: ResourcesDraft = {
        ...prev,
        [key]: nextValue,
      } as ResourcesDraft;
      writeResourcesToStorage(id, next);
      return next;
    });
  };

  return {
    updateStress: stress.updateCurrent,
    updateStressMax: (delta: number) => stress.updateMax(delta, 1),
    updateHp: hp.updateCurrent,
    updateHpMax: (delta: number) => hp.updateMax(delta, 1),
    updateHope: hope.updateCurrent,
    updateHopeMax: (delta: number) => hope.updateMax(delta, 1),
    updateNumber,
    updateGold: gold.updateGold,
    setGold: gold.setGold,
    updateArmorScore: armorScore.updateCurrent,
    updateArmorScoreMax: armorScore.updateMax,
  } as const;
}
