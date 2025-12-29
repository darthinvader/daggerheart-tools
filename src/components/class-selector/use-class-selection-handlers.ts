import { useCallback } from 'react';

import type { GameClass, GameSubclass } from '@/lib/data/classes';
import type { ClassDraft } from '@/lib/schemas/class-selection';

interface UseClassSelectionHandlersProps {
  isMulticlass: boolean;
  selectedClasses: GameClass[];
  setSelectedClasses: React.Dispatch<React.SetStateAction<GameClass[]>>;
  selectedSubclasses: Map<string, GameSubclass>;
  setSelectedSubclasses: React.Dispatch<
    React.SetStateAction<Map<string, GameSubclass>>
  >;
  setIsMulticlass: React.Dispatch<React.SetStateAction<boolean>>;
  onChange?: (draft: ClassDraft) => void;
}

function removeClassFromSubclasses(
  prevSubs: Map<string, GameSubclass>,
  className: string
): Map<string, GameSubclass> {
  const newSubs = new Map(prevSubs);
  newSubs.delete(className);
  return newSubs;
}

function handleMulticlassClassSelect(
  prev: GameClass[],
  gameClass: GameClass,
  setSelectedSubclasses: React.Dispatch<
    React.SetStateAction<Map<string, GameSubclass>>
  >
): GameClass[] {
  const exists = prev.some(c => c.name === gameClass.name);
  if (exists) {
    setSelectedSubclasses(prevSubs =>
      removeClassFromSubclasses(prevSubs, gameClass.name)
    );
    return prev.filter(c => c.name !== gameClass.name);
  }
  return [...prev, gameClass];
}

export function useClassSelectionHandlers({
  isMulticlass,
  selectedClasses,
  setSelectedClasses,
  selectedSubclasses,
  setSelectedSubclasses,
  setIsMulticlass,
  onChange,
}: UseClassSelectionHandlersProps) {
  const handleMulticlassToggle = useCallback(
    (enabled: boolean) => {
      setIsMulticlass(enabled);
      if (!enabled && selectedClasses.length > 1) {
        const firstClass = selectedClasses[0];
        setSelectedClasses([firstClass]);
        const firstSubclass = selectedSubclasses.get(firstClass.name);
        setSelectedSubclasses(
          new Map(firstSubclass ? [[firstClass.name, firstSubclass]] : [])
        );
      }
    },
    [
      selectedClasses,
      selectedSubclasses,
      setSelectedClasses,
      setSelectedSubclasses,
      setIsMulticlass,
    ]
  );

  const handleClassSelect = useCallback(
    (gameClass: GameClass) => {
      if (isMulticlass) {
        setSelectedClasses(prev =>
          handleMulticlassClassSelect(prev, gameClass, setSelectedSubclasses)
        );
      } else {
        setSelectedClasses([gameClass]);
        setSelectedSubclasses(new Map());
      }
      onChange?.({
        mode: 'standard',
        className: gameClass.name,
        subclassName: undefined,
      });
    },
    [isMulticlass, onChange, setSelectedClasses, setSelectedSubclasses]
  );

  const handleSubclassSelect = useCallback(
    (className: string, subclass: GameSubclass) => {
      setSelectedSubclasses(prev => {
        const newMap = new Map(prev);
        newMap.set(className, subclass);
        return newMap;
      });
      if (selectedClasses.length === 1) {
        onChange?.({
          mode: 'standard',
          className: selectedClasses[0].name,
          subclassName: subclass.name,
        });
      }
    },
    [selectedClasses, onChange, setSelectedSubclasses]
  );

  return {
    handleMulticlassToggle,
    handleClassSelect,
    handleSubclassSelect,
  };
}
