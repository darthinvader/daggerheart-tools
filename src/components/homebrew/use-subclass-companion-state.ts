/**
 * Hook for managing companion state in subclass form
 *
 * Extracts companion-related state and handlers from SubclassForm
 * to reduce component complexity.
 */
import { useCallback, useState } from 'react';

import type { RangerCompanion } from '@/lib/schemas/core';

const DEFAULT_COMPANION: Partial<RangerCompanion> = {
  name: '',
  type: 'Wolf',
  evasion: 10,
  experiences: [],
  standardAttack: '',
  damageDie: 'd6',
  range: 'Melee',
  stressSlots: 2,
};

export interface CompanionExperience {
  name: string;
  bonus: number;
}

export function useSubclassCompanionState(
  initialCompanion?: Partial<RangerCompanion>
) {
  const [hasCompanion, setHasCompanion] = useState(!!initialCompanion?.name);
  const [companion, setCompanion] = useState<Partial<RangerCompanion>>(
    initialCompanion ?? DEFAULT_COMPANION
  );
  const [newExperience, setNewExperience] = useState('');

  const updateCompanionField = useCallback((field: string, value: unknown) => {
    setCompanion(prev => ({ ...prev, [field]: value }));
  }, []);

  const addExperience = useCallback(() => {
    if (!newExperience.trim()) return;
    setCompanion(prev => ({
      ...prev,
      experiences: [
        ...(prev.experiences ?? []),
        { name: newExperience.trim(), bonus: 2 },
      ],
    }));
    setNewExperience('');
  }, [newExperience]);

  const removeExperience = useCallback((index: number) => {
    setCompanion(prev => ({
      ...prev,
      experiences: (prev.experiences ?? []).filter((_, i) => i !== index),
    }));
  }, []);

  const handleExperienceKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        addExperience();
      }
    },
    [addExperience]
  );

  /**
   * Build the companion content for form submission
   */
  const buildCompanionContent = useCallback((): RangerCompanion | undefined => {
    if (!hasCompanion || !companion.name) return undefined;

    return {
      name: companion.name,
      type: companion.type ?? 'Wolf',
      evasion: companion.evasion ?? 10,
      experiences: (companion.experiences ?? []).map(exp => ({
        name: exp.name,
        bonus: exp.bonus ?? 2,
      })),
      standardAttack: companion.standardAttack ?? '',
      damageDie: (companion.damageDie ?? 'd6') as 'd6' | 'd8' | 'd10' | 'd12',
      range: (companion.range ?? 'Melee') as 'Melee' | 'Close' | 'Far',
      stressSlots: companion.stressSlots ?? 2,
      training: companion.training,
    };
  }, [hasCompanion, companion]);

  return {
    // State
    hasCompanion,
    companion,
    newExperience,

    // Setters
    setHasCompanion,
    setNewExperience,

    // Handlers
    updateCompanionField,
    addExperience,
    removeExperience,
    handleExperienceKeyDown,

    // Build content
    buildCompanionContent,
  };
}
