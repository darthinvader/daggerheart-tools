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

export function createSubModalConfirmHandler(
  setSelections: React.Dispatch<React.SetStateAction<LevelUpSelection[]>>,
  setPendingOption: React.Dispatch<
    React.SetStateAction<LevelUpOptionConfig | null>
  >,
  pendingOption: LevelUpOptionConfig | null
) {
  return (details: LevelUpSelectionDetails) => {
    if (!pendingOption) return;
    setSelections(prev => {
      const existing = prev.find(s => s.optionId === pendingOption.id);
      if (existing) {
        const mergedDetails: LevelUpSelectionDetails = {
          selectedTraits: [
            ...(existing.details?.selectedTraits ?? []),
            ...(details.selectedTraits ?? []),
          ],
          selectedExperiences: [
            ...(existing.details?.selectedExperiences ?? []),
            ...(details.selectedExperiences ?? []),
          ],
          selectedDomainCard:
            details.selectedDomainCard ?? existing.details?.selectedDomainCard,
          selectedMulticlass:
            details.selectedMulticlass ?? existing.details?.selectedMulticlass,
          selectedSubclassUpgrade:
            details.selectedSubclassUpgrade ??
            existing.details?.selectedSubclassUpgrade,
          selectedCompanionTraining:
            details.selectedCompanionTraining ??
            existing.details?.selectedCompanionTraining,
          selectedCompanionExperienceIndex:
            details.selectedCompanionExperienceIndex ??
            existing.details?.selectedCompanionExperienceIndex,
        };
        return prev.map(s =>
          s.optionId === pendingOption.id
            ? { ...s, count: s.count + 1, details: mergedDetails }
            : s
        );
      }
      return [...prev, { optionId: pendingOption.id, count: 1, details }];
    });
    setPendingOption(null);
  };
}
