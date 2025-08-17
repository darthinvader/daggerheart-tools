import * as React from 'react';

import {
  readLevelFromStorage,
  readLevelingFromStorage,
  writeLevelToStorage,
  writeLevelingToStorage,
} from '@/features/characters/storage';

export type LevelUpPayload = {
  level: number;
  notes?: string;
  selections: Record<string, number>;
};

export function useLeveling(id: string) {
  const [currentLevel, setCurrentLevel] = React.useState<number>(() =>
    readLevelFromStorage(id)
  );
  const [levelHistory, setLevelHistory] = React.useState(() =>
    readLevelingFromStorage(id)
  );

  const saveLevelUp = React.useCallback(
    (values: LevelUpPayload) => {
      const lv = Math.max(1, Math.min(10, Math.floor(values.level)));
      const entry = {
        level: lv,
        selections: values.selections ?? {},
        notes: values.notes,
      };
      setLevelHistory(prev => {
        const next = [...prev.filter(e => e.level !== lv), entry].sort(
          (a, b) => a.level - b.level
        );
        writeLevelingToStorage(id, next);
        return next;
      });
      setCurrentLevel(lv);
      writeLevelToStorage(id, lv);
    },
    [id]
  );

  const reload = React.useCallback(() => {
    setCurrentLevel(readLevelFromStorage(id));
    setLevelHistory(readLevelingFromStorage(id));
  }, [id]);

  return {
    currentLevel,
    levelHistory,
    setLevelHistory,
    setCurrentLevel,
    saveLevelUp,
    reload,
  } as const;
}
