import type { CompanionState } from '@/components/companion';
import type { CoreScoresState } from '@/components/core-scores';
import type { ExperiencesState } from '@/components/experiences';
import type { LevelUpResult, LevelUpSelection } from '@/components/level-up';
import type { ResourcesState } from '@/components/resources';
import type { TraitsState } from '@/components/traits';
import type { ThresholdsSettings } from '@/lib/schemas/character-state';
import type { ClassSelection } from '@/lib/schemas/class-selection';
import type { CompanionTraining } from '@/lib/schemas/core';
import type { LoadoutSelection } from '@/lib/schemas/loadout';
import {
  addCardToLoadout,
  addNewExperience,
  applyCompanionTrainingSelection,
  applyTraitSelection,
  boostExperiences,
  clearTraitsMarks,
  createDomainCardLite,
} from './level-up-helpers';

export function computeUpdatedCompanionFromLevelUpResult(
  companion: CompanionState | undefined,
  result: LevelUpResult
): CompanionState | undefined {
  if (!companion) return companion;

  let updated = companion;

  for (const selection of result.selections) {
    if (selection.optionId === 'companion-training') {
      const trainingKey = selection.details?.selectedCompanionTraining;
      if (trainingKey) {
        updated = applyCompanionTrainingSelection(
          updated,
          trainingKey as keyof CompanionTraining,
          selection.details?.selectedCompanionExperienceIndex
        );
      }
    }
  }

  if (result.companionTrainingSelection) {
    updated = applyCompanionTrainingSelection(
      updated,
      result.companionTrainingSelection as keyof CompanionTraining,
      result.companionTrainingExperienceIndex
    );
  }

  return updated;
}

type SelectionHandlers = {
  setTraits: React.Dispatch<React.SetStateAction<TraitsState>>;
  setExperiences: React.Dispatch<React.SetStateAction<ExperiencesState>>;
  setResources: React.Dispatch<React.SetStateAction<ResourcesState>>;
  setCoreScores: React.Dispatch<React.SetStateAction<CoreScoresState>>;
  setLoadout: React.Dispatch<React.SetStateAction<LoadoutSelection>>;
  setClassSelection: React.Dispatch<
    React.SetStateAction<ClassSelection | null>
  >;
  setUnlockedSubclassFeatures: React.Dispatch<
    React.SetStateAction<Record<string, string[]>>
  >;
  setCompanion?: React.Dispatch<
    React.SetStateAction<CompanionState | undefined>
  >;
};

function handleTraitsSelection(
  handlers: SelectionHandlers,
  details: LevelUpSelection['details']
): void {
  if (details?.selectedTraits) {
    handlers.setTraits(prev =>
      applyTraitSelection(prev, details.selectedTraits!)
    );
  }
}

function handleExperiencesSelection(
  handlers: SelectionHandlers,
  details: LevelUpSelection['details'],
  newLevel: number
): void {
  if (details?.selectedExperiences) {
    const newExpId = `new-exp-${newLevel}`;
    const regularExpIds = details.selectedExperiences.filter(
      id => id !== newExpId
    );
    if (regularExpIds.length > 0) {
      handlers.setExperiences(prev => boostExperiences(prev, regularExpIds));
    }
  }
}

function handleHpSelection(handlers: SelectionHandlers, count: number): void {
  handlers.setResources(prev => ({
    ...prev,
    hp: { ...prev.hp, max: prev.hp.max + count },
  }));
}

function handleStressSelection(
  handlers: SelectionHandlers,
  count: number
): void {
  handlers.setResources(prev => ({
    ...prev,
    stress: { ...prev.stress, max: prev.stress.max + count },
  }));
}

function handleEvasionSelection(
  handlers: SelectionHandlers,
  count: number
): void {
  handlers.setCoreScores(prev => ({ ...prev, evasion: prev.evasion + count }));
}

function handleProficiencySelection(
  handlers: SelectionHandlers,
  count: number
): void {
  handlers.setCoreScores(prev => ({
    ...prev,
    proficiency: prev.proficiency + count,
  }));
}

function handleDomainCardSelection(
  handlers: SelectionHandlers,
  details: LevelUpSelection['details']
): void {
  if (!details?.selectedDomainCard) return;
  const cardLite = createDomainCardLite(details.selectedDomainCard);
  if (cardLite) {
    handlers.setLoadout(prev => addCardToLoadout(prev, cardLite));
  }
}

function handleMulticlassSelection(
  handlers: SelectionHandlers,
  details: LevelUpSelection['details']
): void {
  if (!details?.selectedMulticlass) return;
  const mc = details.selectedMulticlass;
  handlers.setClassSelection(prev => {
    if (!prev) return prev;
    return {
      ...prev,
      isMulticlass: true,
      classes: [
        ...(prev.classes ?? [
          {
            className: prev.className,
            subclassName: prev.subclassName,
            spellcastTrait: prev.spellcastTrait,
          },
        ]),
        { className: mc.className, subclassName: mc.subclassName },
      ],
      domains: [...new Set([...prev.domains, ...mc.domains])],
    };
  });
  handlers.setLoadout(prev => ({
    ...prev,
    classDomains: [...new Set([...prev.classDomains, ...mc.domains])],
  }));
}

function handleSubclassSelection(
  handlers: SelectionHandlers,
  details: LevelUpSelection['details']
): void {
  if (!details?.selectedSubclassUpgrade) return;
  const upgrade = details.selectedSubclassUpgrade;
  const key = `${upgrade.className}:${upgrade.subclassName}`;
  handlers.setUnlockedSubclassFeatures(prev => ({
    ...prev,
    [key]: [...(prev[key] ?? []), upgrade.featureName],
  }));
}

function handleCompanionTrainingSelection(
  handlers: SelectionHandlers,
  details: LevelUpSelection['details']
): void {
  if (!details?.selectedCompanionTraining || !handlers.setCompanion) return;
  const trainingKey = details.selectedCompanionTraining;
  handlers.setCompanion(prev => {
    if (!prev) return prev;
    return applyCompanionTrainingSelection(
      prev,
      trainingKey as keyof CompanionTraining,
      details.selectedCompanionExperienceIndex
    );
  });
}

export function processLevelUpSelection(
  selection: LevelUpSelection,
  newLevel: number,
  handlers: SelectionHandlers
): void {
  const { optionId, count, details } = selection;

  const handlerMap: Record<string, () => void> = {
    traits: () => handleTraitsSelection(handlers, details),
    experiences: () => handleExperiencesSelection(handlers, details, newLevel),
    hp: () => handleHpSelection(handlers, count),
    stress: () => handleStressSelection(handlers, count),
    evasion: () => handleEvasionSelection(handlers, count),
    proficiency: () => handleProficiencySelection(handlers, count),
    'domain-card': () => handleDomainCardSelection(handlers, details),
    multiclass: () => handleMulticlassSelection(handlers, details),
    subclass: () => handleSubclassSelection(handlers, details),
    'companion-training': () =>
      handleCompanionTrainingSelection(handlers, details),
  };

  handlerMap[optionId]?.();
}

function applyAutomaticBenefits(
  result: LevelUpResult,
  handlers: SelectionHandlers
): void {
  if (result.automaticBenefits.proficiencyGained) {
    handlers.setCoreScores(prev => ({
      ...prev,
      proficiency: prev.proficiency + 1,
    }));
  }

  if (
    result.automaticBenefits.experienceGained &&
    result.automaticBenefits.experienceName
  ) {
    const expSelection = result.selections.find(
      s => s.optionId === 'experiences'
    );
    const boostedNewExp = expSelection?.details?.selectedExperiences?.some(
      id => id === `new-exp-${result.newLevel}`
    );
    handlers.setExperiences(prev =>
      addNewExperience(
        prev,
        result.automaticBenefits.experienceName!,
        !!boostedNewExp
      )
    );
  }

  if (result.automaticBenefits.freeDomainCard) {
    const cardLite = createDomainCardLite(
      result.automaticBenefits.freeDomainCard
    );
    if (cardLite) {
      handlers.setLoadout(prev => addCardToLoadout(prev, cardLite));
    }
  }

  if (result.automaticBenefits.traitsCleared) {
    handlers.setTraits(clearTraitsMarks);
  }
}

function applyCompanionTraining(
  result: LevelUpResult,
  handlers: SelectionHandlers
): void {
  if (!result.companionTrainingSelection || !handlers.setCompanion) return;

  const trainingKey = result.companionTrainingSelection;
  handlers.setCompanion(prev => {
    if (!prev) return prev;
    return applyCompanionTrainingSelection(
      prev,
      trainingKey as keyof CompanionTraining,
      result.companionTrainingExperienceIndex
    );
  });
}

export function processLevelUpResult(
  result: LevelUpResult,
  handlers: SelectionHandlers & {
    setProgression: React.Dispatch<
      React.SetStateAction<{
        currentLevel: number;
        currentTier: string;
        tierHistory: Record<string, number>;
      }>
    >;
    setThresholds: React.Dispatch<React.SetStateAction<ThresholdsSettings>>;
    setIsLevelUpOpen: React.Dispatch<React.SetStateAction<boolean>>;
  },
  currentTier: string,
  tierHistory: Record<string, number>
): void {
  const tierChanged = result.newTier !== currentTier;
  const updatedTierHistory = tierChanged ? {} : { ...tierHistory };

  for (const selection of result.selections) {
    updatedTierHistory[selection.optionId] =
      (updatedTierHistory[selection.optionId] ?? 0) + selection.count;
  }

  handlers.setProgression({
    currentLevel: result.newLevel,
    currentTier: result.newTier,
    tierHistory: updatedTierHistory,
  });

  applyAutomaticBenefits(result, handlers);

  for (const selection of result.selections) {
    processLevelUpSelection(selection, result.newLevel, handlers);
  }

  applyCompanionTraining(result, handlers);

  handlers.setThresholds(prev => ({
    ...prev,
    values: {
      ...prev.values,
      major: prev.values.major + 1,
      severe: prev.values.severe + 1,
    },
  }));

  handlers.setIsLevelUpOpen(false);
}
