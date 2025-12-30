import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { LoadoutRules, LoadoutSelection } from '@/lib/schemas/loadout';
import { getLoadoutRulesForTier } from '@/lib/schemas/loadout';

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
  tier: string;
}

export function useLoadoutState({
  value,
  onChange,
  onComplete,
  classDomains,
  tier,
}: UseLoadoutStateProps) {
  const baseRules: LoadoutRules = getLoadoutRulesForTier(tier);
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
        homebrewCards
      ),
    [mode, classDomains, effectiveMaxCardLevel, selectedDomains, homebrewCards]
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
