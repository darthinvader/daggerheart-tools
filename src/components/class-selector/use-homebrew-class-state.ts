import { useCallback, useState } from 'react';

import type {
  HomebrewClass,
  HomebrewSubclass,
} from '@/lib/schemas/class-selection';
import type { ClassFeature, SubclassFeature } from '@/lib/schemas/core';

const EMPTY_CLASS_FEATURE: ClassFeature = {
  name: '',
  description: '',
  metadata: { source: 'homebrew' },
};

const EMPTY_FEATURE: SubclassFeature = {
  name: '',
  description: '',
  type: 'foundation',
  level: 1,
  metadata: { source: 'homebrew' },
};

const EMPTY_SUBCLASS: HomebrewSubclass = {
  isHomebrew: true,
  name: '',
  description: '',
  features: [],
};

const EMPTY_CLASS: HomebrewClass = {
  isHomebrew: true,
  name: '',
  description: '',
  domains: ['Arcana', 'Blade'],
  startingEvasion: 10,
  startingHitPoints: 6,
  classItems: [],
  hopeFeature: { name: '', description: '', hopeCost: 3 },
  classFeatures: [],
  backgroundQuestions: [],
  connections: [],
  subclasses: [{ ...EMPTY_SUBCLASS }],
};

interface UseHomebrewClassStateProps {
  homebrewClass: HomebrewClass | null;
  onChange: (homebrewClass: HomebrewClass) => void;
}

export function useHomebrewClassState({
  homebrewClass,
  onChange,
}: UseHomebrewClassStateProps) {
  const [draft, setDraft] = useState<HomebrewClass>(
    homebrewClass ?? { ...EMPTY_CLASS }
  );

  const updateDraft = useCallback(
    (updates: Partial<HomebrewClass>) => {
      const updated = { ...draft, ...updates };
      setDraft(updated);
      onChange(updated);
    },
    [draft, onChange]
  );

  const handleDomainChange = useCallback(
    (index: 0 | 1, domain: string) => {
      const newDomains = [...draft.domains] as [string, string];
      newDomains[index] = domain;
      updateDraft({ domains: newDomains });
    },
    [draft.domains, updateDraft]
  );

  const updateSubclass = useCallback(
    (index: number, updates: Partial<HomebrewSubclass>) => {
      const newSubclasses = [...draft.subclasses];
      newSubclasses[index] = { ...newSubclasses[index], ...updates };
      updateDraft({ subclasses: newSubclasses });
    },
    [draft.subclasses, updateDraft]
  );

  const addSubclass = useCallback(() => {
    updateDraft({
      subclasses: [...draft.subclasses, { ...EMPTY_SUBCLASS }],
    });
  }, [draft.subclasses, updateDraft]);

  const removeSubclass = useCallback(
    (index: number) => {
      if (draft.subclasses.length <= 1) return;
      const newSubclasses = draft.subclasses.filter((_, i) => i !== index);
      updateDraft({ subclasses: newSubclasses });
    },
    [draft.subclasses, updateDraft]
  );

  const addFeature = useCallback(
    (subclassIndex: number) => {
      const subclass = draft.subclasses[subclassIndex];
      const newFeatures = [...subclass.features, { ...EMPTY_FEATURE }];
      updateSubclass(subclassIndex, { features: newFeatures });
    },
    [draft.subclasses, updateSubclass]
  );

  const updateFeature = useCallback(
    (
      subclassIndex: number,
      featureIndex: number,
      updates: Partial<SubclassFeature>
    ) => {
      const subclass = draft.subclasses[subclassIndex];
      const newFeatures = [...subclass.features];
      newFeatures[featureIndex] = { ...newFeatures[featureIndex], ...updates };
      updateSubclass(subclassIndex, { features: newFeatures });
    },
    [draft.subclasses, updateSubclass]
  );

  const removeFeature = useCallback(
    (subclassIndex: number, featureIndex: number) => {
      const subclass = draft.subclasses[subclassIndex];
      const newFeatures = subclass.features.filter(
        (_, i) => i !== featureIndex
      );
      updateSubclass(subclassIndex, { features: newFeatures });
    },
    [draft.subclasses, updateSubclass]
  );

  const addClassFeature = useCallback(() => {
    updateDraft({
      classFeatures: [
        ...(draft.classFeatures ?? []),
        { ...EMPTY_CLASS_FEATURE },
      ],
    });
  }, [draft.classFeatures, updateDraft]);

  const updateClassFeature = useCallback(
    (index: number, updates: Partial<ClassFeature>) => {
      const newFeatures = [...(draft.classFeatures ?? [])];
      newFeatures[index] = { ...newFeatures[index], ...updates };
      updateDraft({ classFeatures: newFeatures });
    },
    [draft.classFeatures, updateDraft]
  );

  const removeClassFeature = useCallback(
    (index: number) => {
      const newFeatures = (draft.classFeatures ?? []).filter(
        (_, i) => i !== index
      );
      updateDraft({ classFeatures: newFeatures });
    },
    [draft.classFeatures, updateDraft]
  );

  return {
    draft,
    updateDraft,
    handleDomainChange,
    updateSubclass,
    addSubclass,
    removeSubclass,
    addFeature,
    updateFeature,
    removeFeature,
    addClassFeature,
    updateClassFeature,
    removeClassFeature,
  };
}
