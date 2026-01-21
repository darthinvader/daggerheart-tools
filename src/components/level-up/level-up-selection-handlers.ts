import type {
  LevelUpOptionConfig,
  LevelUpSelection,
  LevelUpSelectionDetails,
} from './types';

export function createSelectOptionHandler(
  setSelections: React.Dispatch<React.SetStateAction<LevelUpSelection[]>>,
  setPendingOption: React.Dispatch<
    React.SetStateAction<LevelUpOptionConfig | null>
  >
) {
  return (option: LevelUpOptionConfig) => {
    if (option.requiresSubModal) {
      setPendingOption(option);
      return;
    }
    setSelections(prev => {
      const existing = prev.find(s => s.optionId === option.id);
      if (existing) {
        return prev.map(s =>
          s.optionId === option.id ? { ...s, count: s.count + 1 } : s
        );
      }
      return [...prev, { optionId: option.id, count: 1 }];
    });
  };
}

export function createRemoveSelectionHandler(
  setSelections: React.Dispatch<React.SetStateAction<LevelUpSelection[]>>
) {
  return (optionId: string) => {
    setSelections(prev => {
      const existing = prev.find(s => s.optionId === optionId);
      if (!existing) return prev;
      if (existing.count <= 1) return prev.filter(s => s.optionId !== optionId);
      const updatedDetails = existing.details
        ? {
            ...existing.details,
            selectedTraits: existing.details.selectedTraits?.slice(0, -2),
            selectedExperiences: existing.details.selectedExperiences?.slice(
              0,
              -2
            ),
          }
        : undefined;
      return prev.map(s =>
        s.optionId === optionId
          ? { ...s, count: s.count - 1, details: updatedDetails }
          : s
      );
    });
  };
}

function mergeSelectionDetails(
  existing: LevelUpSelectionDetails | undefined,
  incoming: LevelUpSelectionDetails
): LevelUpSelectionDetails {
  return {
    selectedTraits: mergeArray(
      existing?.selectedTraits,
      incoming.selectedTraits
    ),
    selectedExperiences: mergeArray(
      existing?.selectedExperiences,
      incoming.selectedExperiences
    ),
    selectedDomainCard: mergeValue(
      existing?.selectedDomainCard,
      incoming.selectedDomainCard
    ),
    selectedMulticlass: mergeValue(
      existing?.selectedMulticlass,
      incoming.selectedMulticlass
    ),
    selectedSubclassUpgrade: mergeValue(
      existing?.selectedSubclassUpgrade,
      incoming.selectedSubclassUpgrade
    ),
    selectedCompanionTraining: mergeValue(
      existing?.selectedCompanionTraining,
      incoming.selectedCompanionTraining
    ),
    selectedCompanionExperienceIndex: mergeValue(
      existing?.selectedCompanionExperienceIndex,
      incoming.selectedCompanionExperienceIndex
    ),
  };
}

function mergeArray<T>(existing: T[] | undefined, incoming: T[] | undefined) {
  if (!existing) return incoming ?? [];
  if (!incoming) return existing;
  return [...existing, ...incoming];
}

function mergeValue<T>(existing: T | undefined, incoming: T | undefined) {
  return incoming ?? existing;
}

function upsertSelection(
  selections: LevelUpSelection[],
  option: LevelUpOptionConfig,
  details: LevelUpSelectionDetails
): LevelUpSelection[] {
  const existing = selections.find(s => s.optionId === option.id);
  if (!existing) {
    return [...selections, { optionId: option.id, count: 1, details }];
  }
  const mergedDetails = mergeSelectionDetails(existing.details, details);
  return selections.map(s =>
    s.optionId === option.id
      ? { ...s, count: s.count + 1, details: mergedDetails }
      : s
  );
}

export function createSubModalConfirmHandler(
  setSelections: React.Dispatch<React.SetStateAction<LevelUpSelection[]>>,
  setPendingOption: React.Dispatch<
    React.SetStateAction<LevelUpOptionConfig | null>
  >,
  pendingOption: LevelUpOptionConfig | null
) {
  return (details: LevelUpSelectionDetails) => {
    if (!pendingOption) return;
    setSelections(prev => upsertSelection(prev, pendingOption, details));
    setPendingOption(null);
  };
}
