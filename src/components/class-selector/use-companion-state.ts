/**
 * Hook for managing companion section state
 * Extracted from CompanionSection to reduce complexity
 */
import { useCallback, useState } from 'react';

import type { RangerCompanion } from '@/lib/schemas/core';

interface UseCompanionStateOptions {
  companion: RangerCompanion | undefined;
  onUpdate: (companion: RangerCompanion | undefined) => void;
}

const DEFAULT_COMPANION: RangerCompanion = {
  name: '',
  type: 'Wolf',
  evasion: 10,
  experiences: [],
  standardAttack: '',
  damageDie: 'd6',
  range: 'Melee',
  stressSlots: 2,
};

export function useCompanionState({
  companion,
  onUpdate,
}: UseCompanionStateOptions) {
  const [hasCompanion, setHasCompanion] = useState(!!companion);
  const [experiences, setExperiences] = useState<
    { name: string; bonus: number }[]
  >(companion?.experiences ?? []);
  const [newExperience, setNewExperience] = useState('');

  const handleToggle = useCallback(
    (enabled: boolean) => {
      setHasCompanion(enabled);
      if (!enabled) {
        onUpdate(undefined);
      } else {
        onUpdate({
          name: companion?.name ?? DEFAULT_COMPANION.name,
          type: companion?.type ?? DEFAULT_COMPANION.type,
          evasion: companion?.evasion ?? DEFAULT_COMPANION.evasion,
          experiences: [],
          standardAttack:
            companion?.standardAttack ?? DEFAULT_COMPANION.standardAttack,
          damageDie: companion?.damageDie ?? DEFAULT_COMPANION.damageDie,
          range: companion?.range ?? DEFAULT_COMPANION.range,
          stressSlots: companion?.stressSlots ?? DEFAULT_COMPANION.stressSlots,
        });
      }
    },
    [companion, onUpdate]
  );

  const updateCompanion = useCallback(
    (updates: Partial<RangerCompanion>) => {
      if (!companion) return;
      onUpdate({ ...companion, ...updates });
    },
    [companion, onUpdate]
  );

  const addExperience = useCallback(() => {
    if (!newExperience.trim() || !companion) return;
    const newExp = { name: newExperience.trim(), bonus: 2 };
    const updated = [...experiences, newExp];
    setExperiences(updated);
    updateCompanion({ experiences: updated });
    setNewExperience('');
  }, [newExperience, companion, experiences, updateCompanion]);

  const removeExperience = useCallback(
    (idx: number) => {
      const updated = experiences.filter((_, i) => i !== idx);
      setExperiences(updated);
      updateCompanion({ experiences: updated });
    },
    [experiences, updateCompanion]
  );

  return {
    hasCompanion,
    experiences,
    newExperience,
    setNewExperience,
    handleToggle,
    updateCompanion,
    addExperience,
    removeExperience,
  };
}
