import {
  type TraitsDraft,
  writeTraitsToStorage,
} from '@/features/characters/storage';

type Setter<T> = (updater: (prev: T) => T) => void;

export function createTraitActions(id: string, setTraits: Setter<TraitsDraft>) {
  const canIncrement = (_key: string) => true;

  const incTrait = (key: string, delta: 1 | -1) => {
    setTraits(prev => {
      const current = prev[key].value;
      const nextValue = delta === 1 ? current + 1 : current - 1;
      const next: TraitsDraft = {
        ...prev,
        [key]: { ...prev[key], value: nextValue },
      } as TraitsDraft;
      writeTraitsToStorage(id, next);
      return next;
    });
  };

  const toggleMarked = (key: string) => {
    setTraits(prev => {
      const next: TraitsDraft = {
        ...prev,
        [key]: { ...prev[key], marked: !prev[key].marked },
      } as TraitsDraft;
      writeTraitsToStorage(id, next);
      return next;
    });
  };

  const setBonus = (key: string, bonus: number) => {
    setTraits(prev => {
      const next: TraitsDraft = {
        ...prev,
        [key]: { ...prev[key], bonus: Math.floor(bonus) || 0 },
      } as TraitsDraft;
      writeTraitsToStorage(id, next);
      return next;
    });
  };

  return { canIncrement, incTrait, toggleMarked, setBonus } as const;
}
