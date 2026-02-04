import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { DomainCard } from '@/lib/schemas/domains';
import type { LoadoutRules, LoadoutSelection } from '@/lib/schemas/loadout';
import { getLoadoutRulesForLevel } from '@/lib/schemas/loadout';

import {
  type CardFiltersState,
  createDefaultFilters,
} from './card-filters-utils';
import { ALL_DOMAIN_NAMES, getAvailableCards } from './loadout-utils';
import { useCardHandlers } from './use-card-handlers';
import { useDomainModeHandlers } from './use-domain-mode-handlers';
import {
  useLoadoutCardState,
  useMaxActiveCards,
} from './use-loadout-card-state';

interface UseLoadoutStateProps {
  value?: LoadoutSelection;
  onChange?: (selection: LoadoutSelection) => void;
  onComplete?: (selection: LoadoutSelection) => void;
  classDomains: string[];
  /** Character level (1-10) for accurate domain card restrictions per SRD */
  level: number;
  campaignHomebrewCards?: DomainCard[];
}

export function useLoadoutState({
  value,
  onChange,
  onComplete,
  classDomains,
  level,
  campaignHomebrewCards = [],
}: UseLoadoutStateProps) {
  // Per SRD: "You cannot acquire a domain card with a level higher than your PC's"
  const baseRules: LoadoutRules = getLoadoutRulesForLevel(level);
  const {
    mode,
    setMode,
    activeCards,
    setActiveCards,
    vaultCards,
    setVaultCards,
    homebrewCards,
    setHomebrewCards,
    activeCardNames,
    vaultCardNames,
    isVaultFull,
    isActiveFull,
  } = useLoadoutCardState({ initialValue: value, rules: baseRules });

  const { maxActiveCards, handleChangeMaxActiveCards } = useMaxActiveCards({
    baseMaxCards: baseRules.maxActiveCards,
    currentActiveCount: activeCards.length,
  });
  const rules: LoadoutRules = useMemo(
    () => ({ ...baseRules, maxActiveCards }),
    [baseRules, maxActiveCards]
  );

  const [selectedDomains, setSelectedDomains] = useState<string[]>(
    mode === 'class-domains' ? classDomains : ALL_DOMAIN_NAMES
  );
  const [cardFilters, setCardFilters] = useState<CardFiltersState>(() =>
    createDefaultFilters(baseRules.maxCardLevel)
  );

  const stateRef = useRef({ mode, activeCards, vaultCards, homebrewCards });
  useEffect(() => {
    stateRef.current = { mode, activeCards, vaultCards, homebrewCards };
  }, [mode, activeCards, vaultCards, homebrewCards]);

  const notifyChange = useCallback(
    (updates: Partial<LoadoutSelection>) =>
      onChange?.({
        ...stateRef.current,
        classDomains,
        expandedDomainAccess: stateRef.current.mode === 'all-domains',
        creationComplete: false,
        ...updates,
      }),
    [classDomains, onChange]
  );

  const effectiveMaxCardLevel = cardFilters.showHigherLevelCards
    ? 10
    : rules.maxCardLevel;
  const availableCards = useMemo(
    () =>
      getAvailableCards(
        mode,
        classDomains,
        effectiveMaxCardLevel,
        selectedDomains,
        homebrewCards,
        campaignHomebrewCards
      ),
    [
      mode,
      classDomains,
      effectiveMaxCardLevel,
      selectedDomains,
      homebrewCards,
      campaignHomebrewCards,
    ]
  );

  const domainModeHandlers = useDomainModeHandlers({
    mode,
    classDomains,
    setMode,
    setSelectedDomains,
    notifyChange,
  });
  const cardHandlers = useCardHandlers({
    activeCards,
    vaultCards,
    homebrewCards,
    activeCardNames,
    vaultCardNames,
    rules,
    setActiveCards,
    setVaultCards,
    setHomebrewCards,
    notifyChange,
  });

  const handleComplete = useCallback(() => {
    onComplete?.({
      mode,
      activeCards,
      vaultCards,
      homebrewCards,
      classDomains,
      expandedDomainAccess: mode === 'all-domains',
      creationComplete: true,
    });
  }, [mode, activeCards, vaultCards, homebrewCards, classDomains, onComplete]);

  const domainsToShow =
    mode === 'class-domains' ? classDomains : ALL_DOMAIN_NAMES;

  return {
    mode,
    activeCards,
    vaultCards,
    homebrewCards,
    selectedDomains,
    availableCards,
    rules,
    domainsToShow,
    activeCardNames,
    vaultCardNames,
    isActiveFull,
    isVaultFull,
    cardFilters,
    setCardFilters,
    ...domainModeHandlers,
    ...cardHandlers,
    handleChangeMaxActiveCards,
    handleComplete,
  };
}
