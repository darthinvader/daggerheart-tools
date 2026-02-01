import type { CompanionState } from '@/components/companion';
import type { ExperiencesState } from '@/components/experiences';
import type { TraitsState } from '@/components/traits';
import { getCardByName } from '@/lib/data/domains';
import type {
  CompanionDamageDie,
  CompanionRange,
  CompanionTraining,
} from '@/lib/schemas/core';
import type { DomainCardLite, LoadoutSelection } from '@/lib/schemas/loadout';
import { generateId } from '@/lib/utils';

const MAX_ACTIVE_CARDS = 5;
const DAMAGE_DICE_ORDER: CompanionDamageDie[] = ['d6', 'd8', 'd10', 'd12'];
const RANGE_ORDER: CompanionRange[] = ['Melee', 'Close', 'Far'];

function incrementDamageDie(die: CompanionDamageDie): CompanionDamageDie {
  const index = DAMAGE_DICE_ORDER.indexOf(die);
  if (index < 0) return 'd6';
  return DAMAGE_DICE_ORDER[Math.min(DAMAGE_DICE_ORDER.length - 1, index + 1)];
}

function incrementRange(range: CompanionRange): CompanionRange {
  const index = RANGE_ORDER.indexOf(range);
  if (index < 0) return 'Melee';
  return RANGE_ORDER[Math.min(RANGE_ORDER.length - 1, index + 1)];
}

export function applyCompanionTrainingSelection(
  companion: CompanionState,
  trainingKey: keyof CompanionTraining,
  experienceIndex?: number
): CompanionState {
  const training = { ...companion.training };
  const current = training[trainingKey];
  if (typeof current === 'number') {
    (training as Record<string, number | boolean>)[trainingKey] = Math.min(
      current + 1,
      3
    );
  } else if (typeof current === 'boolean') {
    (training as Record<string, number | boolean>)[trainingKey] = true;
  }

  let updated: CompanionState = { ...companion, training };

  if (trainingKey === 'vicious') {
    const nextDie = incrementDamageDie(companion.damageDie);
    if (nextDie !== companion.damageDie) {
      updated = { ...updated, damageDie: nextDie };
    } else {
      const nextRange = incrementRange(companion.range);
      updated = { ...updated, range: nextRange };
    }
  }

  if (trainingKey === 'intelligent' && experienceIndex !== undefined) {
    const experiences = companion.experiences.map((exp, index) =>
      index === experienceIndex ? { ...exp, bonus: exp.bonus + 1 } : exp
    );
    updated = { ...updated, experiences };
  }

  return updated;
}

export function createDomainCardLite(cardName: string): DomainCardLite | null {
  const card = getCardByName(cardName);
  if (!card) return null;

  return {
    name: card.name,
    domain: String(card.domain),
    level: card.level,
    type: String(card.type),
    description: card.description,
    hopeCost: card.hopeCost,
    recallCost: card.recallCost,
    stressCost: card.stressCost,
    tags: card.tags,
    modifiers: card.modifiers,
    metadata: card.metadata,
    isActivated: true,
  };
}

export function addCardToLoadout(
  prev: LoadoutSelection,
  cardLite: DomainCardLite
): LoadoutSelection {
  if (prev.activeCards.length < MAX_ACTIVE_CARDS) {
    return { ...prev, activeCards: [...prev.activeCards, cardLite] };
  }
  return { ...prev, vaultCards: [...prev.vaultCards, cardLite] };
}

export function clearTraitsMarks(prev: TraitsState): TraitsState {
  const cleared = { ...prev };
  for (const key of Object.keys(cleared) as (keyof TraitsState)[]) {
    cleared[key] = { ...cleared[key], marked: false };
  }
  return cleared;
}

export function applyTraitSelection(
  prev: TraitsState,
  selectedTraits: string[]
): TraitsState {
  const updated = { ...prev };
  for (const traitName of selectedTraits) {
    const key = traitName as keyof TraitsState;
    if (updated[key]) {
      updated[key] = {
        ...updated[key],
        value: updated[key].value + 1,
        marked: true,
      };
    }
  }
  return updated;
}

export function boostExperiences(
  prev: ExperiencesState,
  experienceIds: string[]
): ExperiencesState {
  return {
    items: prev.items.map(exp =>
      experienceIds.includes(exp.id) ? { ...exp, value: exp.value + 1 } : exp
    ),
  };
}

export function addNewExperience(
  prev: ExperiencesState,
  name: string,
  isBoosted: boolean
): ExperiencesState {
  return {
    items: [
      ...prev.items,
      { id: generateId(), name, value: isBoosted ? 3 : 2 },
    ],
  };
}
