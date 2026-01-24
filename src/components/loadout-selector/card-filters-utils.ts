import type { DomainCardType } from '@/lib/schemas/domains';

export const CARD_TYPES: DomainCardType[] = ['Spell', 'Ability', 'Grimoire'];

export const CARD_LEVELS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;

export interface CardFiltersState {
  types: DomainCardType[];
  levels: number[];
  showHigherLevelCards: boolean;
}

export function createDefaultFilters(maxLevel = 10): CardFiltersState {
  return {
    types: [...CARD_TYPES],
    levels: CARD_LEVELS.filter(l => l <= maxLevel),
    showHigherLevelCards: false,
  };
}
