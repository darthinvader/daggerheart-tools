import { useCallback, useMemo, useState } from 'react';

import type { DomainCard } from '@/lib/schemas/domains';
import type { DomainCardLite } from '@/lib/schemas/loadout';

import type { CardFiltersState } from './card-filters-utils';

interface UseCardGridStateProps {
  cards: DomainCard[];
  activeCards: DomainCardLite[];
  vaultCards: DomainCardLite[];
  onToggleActive: (card: DomainCard) => void;
  onToggleVault: (card: DomainCard) => void;
  maxActiveCards: number;
  maxVaultCards?: number;
  activeCardNames?: Set<string>;
  vaultCardNames?: Set<string>;
  filters?: CardFiltersState;
}

// Filter cards by type and level filters
function applyFilters(
  cards: DomainCard[],
  filters: CardFiltersState | undefined
): DomainCard[] {
  if (!filters) return cards;
  return cards.filter(
    card =>
      filters.types.includes(card.type as CardFiltersState['types'][number]) &&
      filters.levels.includes(card.level)
  );
}

// Filter cards by search term
function applySearchFilter(cards: DomainCard[], search: string): DomainCard[] {
  if (!search.trim()) return cards;
  const term = search.toLowerCase();
  return cards.filter(
    card =>
      card.name.toLowerCase().includes(term) ||
      card.domain.toLowerCase().includes(term) ||
      card.type.toLowerCase().includes(term) ||
      card.description.toLowerCase().includes(term)
  );
}

export function useCardGridState({
  cards,
  activeCards,
  vaultCards,
  onToggleActive,
  onToggleVault,
  maxActiveCards,
  maxVaultCards,
  activeCardNames: providedActiveNames,
  vaultCardNames: providedVaultNames,
  filters,
}: UseCardGridStateProps) {
  const [search, setSearch] = useState('');

  const activeCardNames = useMemo(
    () => providedActiveNames ?? new Set(activeCards.map(c => c.name)),
    [providedActiveNames, activeCards]
  );
  const vaultCardNames = useMemo(
    () => providedVaultNames ?? new Set(vaultCards.map(c => c.name)),
    [providedVaultNames, vaultCards]
  );

  const hasVaultLimit = maxVaultCards !== undefined;
  const isActiveFull = activeCards.length >= maxActiveCards;
  const isVaultFull = hasVaultLimit && vaultCards.length >= maxVaultCards;

  const filteredCards = useMemo(() => {
    const filtered = applyFilters(cards, filters);
    return applySearchFilter(filtered, search);
  }, [cards, search, filters]);

  const getSelectionType = useCallback(
    (card: DomainCard): 'active' | 'vault' | null => {
      if (activeCardNames.has(card.name)) return 'active';
      if (vaultCardNames.has(card.name)) return 'vault';
      return null;
    },
    [activeCardNames, vaultCardNames]
  );

  const handleToggle = useCallback(
    (card: DomainCard) => {
      const inActive = activeCardNames.has(card.name);
      const inVault = vaultCardNames.has(card.name);

      if (inActive) onToggleActive(card);
      else if (inVault) onToggleVault(card);
      else if (!isActiveFull) onToggleActive(card);
      else if (!isVaultFull) onToggleVault(card);
    },
    [
      activeCardNames,
      vaultCardNames,
      isActiveFull,
      isVaultFull,
      onToggleActive,
      onToggleVault,
    ]
  );

  const isDisabled = useCallback(
    (card: DomainCard) =>
      !activeCardNames.has(card.name) &&
      !vaultCardNames.has(card.name) &&
      isActiveFull &&
      isVaultFull,
    [activeCardNames, vaultCardNames, isActiveFull, isVaultFull]
  );

  return {
    search,
    setSearch,
    filteredCards,
    isActiveFull,
    isVaultFull,
    getSelectionType,
    handleToggle,
    isDisabled,
  };
}
