import * as React from 'react';

import {
  readExperiencesFromStorage,
  writeExperiencesToStorage,
} from '@/features/characters/storage';

export type Experience = {
  name: string;
  trait?: string;
  bonus: number;
  notes?: string;
};

export function useExperiences(id: string) {
  const [experiences, setExperiences] = React.useState<Experience[]>(
    () => readExperiencesFromStorage(id) as never
  );

  const add = React.useCallback(
    (item: Experience) => {
      setExperiences(prev => {
        const next = [...prev, item];
        writeExperiencesToStorage(id, next as never);
        return next;
      });
    },
    [id]
  );

  const updateAt = React.useCallback(
    (index: number, next: Experience) => {
      setExperiences(prev => {
        const list = [...prev];
        if (!list[index]) return prev;
        list[index] = next;
        writeExperiencesToStorage(id, list as never);
        return list;
      });
    },
    [id]
  );

  const removeAt = React.useCallback(
    (index: number) => {
      setExperiences(prev => {
        const list = prev.slice();
        list.splice(index, 1);
        writeExperiencesToStorage(id, list as never);
        return list;
      });
    },
    [id]
  );

  const reload = React.useCallback(() => {
    setExperiences(readExperiencesFromStorage(id) as never);
  }, [id]);

  return { experiences, add, updateAt, removeAt, reload } as const;
}
