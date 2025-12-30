import type {
  ClassSelection,
  ClassSubclassPair,
} from '@/lib/schemas/class-selection';
import type { CharacterTier } from '@/lib/schemas/core';

import type { LevelUpOptionConfig, LevelUpSelection } from './types';
import { getOptionsForTier } from './types';

export function computeClassPairs(
  classSelection: ClassSelection | null
): ClassSubclassPair[] {
  if (!classSelection) return [];
  if (classSelection.classes && classSelection.classes.length > 0) {
    return classSelection.classes;
  }
  return [
    {
      className: classSelection.className,
      subclassName: classSelection.subclassName,
      spellcastTrait: classSelection.spellcastTrait,
    },
  ];
}

export function computeCardsSelectedThisSession(
  freeDomainCard: string | null,
  selections: LevelUpSelection[]
): string[] {
  const cards: string[] = [];
  if (freeDomainCard) cards.push(freeDomainCard);
  const domainCardSelection = selections.find(
    s => s.optionId === 'domain-card'
  );
  if (domainCardSelection?.details?.selectedDomainCard) {
    cards.push(domainCardSelection.details.selectedDomainCard);
  }
  return cards;
}

export function computePointsSpent(
  selections: LevelUpSelection[],
  availableOptions: LevelUpOptionConfig[]
): number {
  return selections.reduce((sum, sel) => {
    const option = availableOptions.find(o => o.id === sel.optionId);
    return sum + (option?.cost ?? 0) * sel.count;
  }, 0);
}

export function computeAvailableTraitsForSelection(
  currentTraits: { name: string; marked: boolean }[],
  alreadySelectedTraitsThisSession: string[]
): { name: string; marked: boolean }[] {
  return currentTraits.filter(
    t => !t.marked && !alreadySelectedTraitsThisSession.includes(t.name)
  );
}

export function computeAvailableExperiencesForSelection(
  currentExperiences: { id: string; name: string; value: number }[],
  alreadyBoostedExperiencesThisSession: string[],
  getsNewExperience: boolean,
  newExperienceName: string | null,
  targetLevel: number
): { id: string; name: string; value: number }[] {
  const baseExperiences =
    getsNewExperience && newExperienceName
      ? [
          ...currentExperiences,
          { id: `new-exp-${targetLevel}`, name: newExperienceName, value: 2 },
        ]
      : currentExperiences;
  return baseExperiences.filter(
    e => !alreadyBoostedExperiencesThisSession.includes(e.id)
  );
}

export function getAvailableOptionsForTier(
  targetTier: CharacterTier,
  className?: string
): LevelUpOptionConfig[] {
  return getOptionsForTier(targetTier, className);
}

export function extractSelectedTraitsThisSession(
  selections: LevelUpSelection[]
): string[] {
  const traitSelection = selections.find(s => s.optionId === 'traits');
  return traitSelection?.details?.selectedTraits ?? [];
}

export function extractBoostedExperiencesThisSession(
  selections: LevelUpSelection[]
): string[] {
  const expSelection = selections.find(s => s.optionId === 'experiences');
  return expSelection?.details?.selectedExperiences ?? [];
}

export function computeAllOwnedCardNames(
  ownedCardNames: string[],
  cardsSelectedThisSession: string[]
): string[] {
  return [...ownedCardNames, ...cardsSelectedThisSession];
}

export function shouldGetNewExperience(targetLevel: number): boolean {
  return targetLevel === 2 || targetLevel === 5 || targetLevel === 8;
}

export function canProceedToOptions(
  freeDomainCard: string | null,
  getsNewExperience: boolean,
  newExperienceName: string | null
): boolean {
  return (
    freeDomainCard !== null &&
    (!getsNewExperience || newExperienceName !== null)
  );
}
