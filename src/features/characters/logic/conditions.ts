import { DEFAULT_CONDITION_MAP } from '@/features/characters/data/conditions';
import {
  type ConditionItem,
  type ConditionsDraft,
  writeConditionsToStorage,
} from '@/features/characters/storage';

type Setter<T> = (updater: (prev: T) => T) => void;

export function createConditionActions(
  id: string,
  setConditions: Setter<ConditionsDraft>
) {
  const addCondition = (label: string, description?: string) => {
    const value = label.trim();
    if (!value) return;
    const key = value.toLowerCase();
    const item: ConditionItem = {
      name: value,
      description: description?.trim() || DEFAULT_CONDITION_MAP[key],
    };
    setConditions(prev => {
      const dedup = new Map<string, ConditionItem>();
      for (const c of prev) dedup.set(c.name.toLowerCase(), c);
      dedup.set(item.name.toLowerCase(), item);
      const next = Array.from(dedup.values()).slice(0, 12);
      writeConditionsToStorage(id, next);
      return next;
    });
  };

  const removeCondition = (label: string) => {
    setConditions(prev => {
      const next = prev.filter(c => c.name !== label);
      writeConditionsToStorage(id, next);
      return next;
    });
  };

  return { addCondition, removeCondition } as const;
}
