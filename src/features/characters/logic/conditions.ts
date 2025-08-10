import {
  type ConditionsDraft,
  writeConditionsToStorage,
} from '@/features/characters/storage';

type Setter<T> = (updater: (prev: T) => T) => void;

export function createConditionActions(
  id: string,
  setConditions: Setter<ConditionsDraft>
) {
  const addCondition = (label: string) => {
    const value = label.trim();
    if (!value) return;
    setConditions(prev => {
      const next = Array.from(new Set([...prev, value])).slice(0, 12);
      writeConditionsToStorage(id, next);
      return next;
    });
  };

  const removeCondition = (label: string) => {
    setConditions(prev => {
      const next = prev.filter(c => c !== label);
      writeConditionsToStorage(id, next);
      return next;
    });
  };

  return { addCondition, removeCondition } as const;
}
