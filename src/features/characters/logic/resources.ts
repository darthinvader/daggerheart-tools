/* eslint-disable max-lines-per-function */
import {
  type ResourcesDraft,
  writeResourcesToStorage,
} from '@/features/characters/storage';

type Setter<T> = (updater: (prev: T) => T) => void;

const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));

export function createResourceActions(
  id: string,
  setResources: Setter<ResourcesDraft>
) {
  const updateStress = (delta: number) => {
    setResources(prev => {
      const next: ResourcesDraft = {
        ...prev,
        stress: {
          current: clamp(prev.stress.current + delta, 0, prev.stress.max),
          max: prev.stress.max,
        },
      };
      writeResourcesToStorage(id, next);
      return next;
    });
  };

  const updateArmorScore = (delta: number) => {
    setResources(prev => {
      const next: ResourcesDraft = {
        ...prev,
        armorScore: {
          current: clamp(
            prev.armorScore.current + delta,
            0,
            prev.armorScore.max
          ),
          max: prev.armorScore.max,
        },
      };
      writeResourcesToStorage(id, next);
      return next;
    });
  };

  const updateArmorScoreMax = (delta: number) => {
    setResources(prev => {
      const max = Math.max(0, prev.armorScore.max + delta);
      const current = clamp(prev.armorScore.current, 0, max);
      const next: ResourcesDraft = { ...prev, armorScore: { current, max } };
      writeResourcesToStorage(id, next);
      return next;
    });
  };

  const updateStressMax = (delta: number) => {
    setResources(prev => {
      const max = Math.max(1, prev.stress.max + delta);
      const current = clamp(prev.stress.current, 0, max);
      const next: ResourcesDraft = { ...prev, stress: { current, max } };
      writeResourcesToStorage(id, next);
      return next;
    });
  };

  const updateHp = (delta: number) => {
    setResources(prev => {
      const next: ResourcesDraft = {
        ...prev,
        hp: {
          current: clamp(prev.hp.current + delta, 0, prev.hp.max),
          max: prev.hp.max,
        },
      };
      writeResourcesToStorage(id, next);
      return next;
    });
  };

  const updateHpMax = (delta: number) => {
    setResources(prev => {
      const max = Math.max(1, prev.hp.max + delta);
      const current = clamp(prev.hp.current, 0, max);
      const next: ResourcesDraft = { ...prev, hp: { current, max } };
      writeResourcesToStorage(id, next);
      return next;
    });
  };

  const updateHope = (delta: number) => {
    setResources(prev => {
      const next: ResourcesDraft = {
        ...prev,
        hope: {
          current: clamp(prev.hope.current + delta, 0, prev.hope.max),
          max: prev.hope.max,
        },
      };
      writeResourcesToStorage(id, next);
      return next;
    });
  };

  const updateHopeMax = (delta: number) => {
    setResources(prev => {
      const max = Math.max(1, prev.hope.max + delta);
      const current = clamp(prev.hope.current, 0, max);
      const next: ResourcesDraft = { ...prev, hope: { current, max } };
      writeResourcesToStorage(id, next);
      return next;
    });
  };

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

  const updateGold = (kind: 'handfuls' | 'bags' | 'chests', delta: number) => {
    setResources(prev => {
      const current = prev.gold?.[kind] ?? 0;
      const nextGold: ResourcesDraft['gold'] = {
        handfuls: prev.gold?.handfuls ?? 0,
        bags: prev.gold?.bags ?? 0,
        chests: prev.gold?.chests ?? 0,
        coins: prev.gold?.coins ?? 0,
        showCoins: prev.gold?.showCoins ?? false,
        [kind]: Math.max(0, current + delta),
      };
      const next: ResourcesDraft = { ...prev, gold: nextGold };
      writeResourcesToStorage(id, next);
      return next;
    });
  };

  const setGold = (kind: 'handfuls' | 'bags' | 'chests', value: number) => {
    setResources(prev => {
      const nextGold: ResourcesDraft['gold'] = {
        handfuls: prev.gold?.handfuls ?? 0,
        bags: prev.gold?.bags ?? 0,
        chests: prev.gold?.chests ?? 0,
        coins: prev.gold?.coins ?? 0,
        showCoins: prev.gold?.showCoins ?? false,
        [kind]: Math.max(0, Math.floor(value) || 0),
      };
      const next: ResourcesDraft = { ...prev, gold: nextGold };
      writeResourcesToStorage(id, next);
      return next;
    });
  };

  return {
    updateStress,
    updateStressMax,
    updateHp,
    updateHpMax,
    updateHope,
    updateHopeMax,
    updateNumber,
    updateGold,
    setGold,
    updateArmorScore,
    updateArmorScoreMax,
  } as const;
}
