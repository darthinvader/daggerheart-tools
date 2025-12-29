/* eslint-disable max-lines-per-function */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { DomainCard } from '@/lib/schemas/domains';
import type {
  DomainCardLite,
  HomebrewDomainCard,
  LoadoutMode,
  LoadoutRules,
  LoadoutSelection,
} from '@/lib/schemas/loadout';
import { getLoadoutRulesForTier } from '@/lib/schemas/loadout';

import {
  type CardFiltersState,
  createDefaultFilters,
} from './card-filters-utils';
import { cardToLite, homebrewToLite } from './card-utils';
import {
  moveToActive,
  moveToVault,
  quickSwapToActive,
  quickSwapToVault,
  swapCards,
} from './loadout-card-operations';
import { ALL_DOMAIN_NAMES, getAvailableCards } from './loadout-utils';

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

  const [maxActiveCards, setMaxActiveCards] = useState<number>(
    baseRules.maxActiveCards
  );
  const rules: LoadoutRules = useMemo(
    () => ({ ...baseRules, maxActiveCards }),
    [baseRules, maxActiveCards]
  );

  const [mode, setMode] = useState<LoadoutMode>(value?.mode ?? 'class-domains');
  const [activeCards, setActiveCards] = useState<DomainCardLite[]>(
    value?.activeCards ?? []
  );
  const [vaultCards, setVaultCards] = useState<DomainCardLite[]>(
    value?.vaultCards ?? []
  );
  const [homebrewCards, setHomebrewCards] = useState<HomebrewDomainCard[]>(
    value?.homebrewCards ?? []
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
    (updates: Partial<LoadoutSelection>) => {
      const current = stateRef.current;
      onChange?.({
        mode: current.mode,
        activeCards: current.activeCards,
        vaultCards: current.vaultCards,
        homebrewCards: current.homebrewCards,
        classDomains,
        expandedDomainAccess: current.mode === 'all-domains',
        creationComplete: false,
        ...updates,
      });
    },
    [classDomains, onChange]
  );

  // Memoize card name sets for O(1) lookups
  const activeCardNames = useMemo(
    () => new Set(activeCards.map(c => c.name)),
    [activeCards]
  );
  const vaultCardNames = useMemo(
    () => new Set(vaultCards.map(c => c.name)),
    [vaultCards]
  );

  const availableCards = useMemo(
    () =>
      getAvailableCards(
        mode,
        classDomains,
        rules.maxCardLevel,
        selectedDomains,
        homebrewCards
      ),
    [mode, classDomains, rules.maxCardLevel, selectedDomains, homebrewCards]
  );

  const handleModeChange = useCallback(
    (newMode: LoadoutMode) => {
      setMode(newMode);
      if (newMode === 'class-domains') {
        setSelectedDomains(classDomains);
      } else if (newMode === 'all-domains') {
        setSelectedDomains(ALL_DOMAIN_NAMES);
      }
      notifyChange({
        mode: newMode,
        expandedDomainAccess: newMode === 'all-domains',
      });
    },
    [classDomains, notifyChange]
  );

  const handleToggleDomain = useCallback((domain: string) => {
    setSelectedDomains(prev =>
      prev.includes(domain) ? prev.filter(d => d !== domain) : [...prev, domain]
    );
  }, []);

  const handleSelectAllDomains = useCallback(() => {
    setSelectedDomains(
      mode === 'class-domains' ? classDomains : ALL_DOMAIN_NAMES
    );
  }, [mode, classDomains]);

  const handleClearDomains = useCallback(() => setSelectedDomains([]), []);

  const handleToggleActive = useCallback(
    (card: DomainCard) => {
      const isInActive = activeCardNames.has(card.name);
      let newActive: DomainCardLite[];
      if (isInActive) {
        newActive = activeCards.filter(c => c.name !== card.name);
      } else if (activeCards.length < rules.maxActiveCards) {
        newActive = [...activeCards, cardToLite(card)];
      } else {
        return;
      }
      setActiveCards(newActive);
      notifyChange({ activeCards: newActive });
    },
    [activeCards, activeCardNames, rules.maxActiveCards, notifyChange]
  );

  const isVaultFull =
    rules.maxVaultCards !== undefined &&
    vaultCards.length >= rules.maxVaultCards;
  const isActiveFull = activeCards.length >= rules.maxActiveCards;

  const handleToggleVault = useCallback(
    (card: DomainCard) => {
      const isInVault = vaultCardNames.has(card.name);
      let newVault: DomainCardLite[];
      if (isInVault) {
        newVault = vaultCards.filter(c => c.name !== card.name);
      } else if (
        rules.maxVaultCards === undefined ||
        vaultCards.length < rules.maxVaultCards
      ) {
        newVault = [...vaultCards, cardToLite(card)];
      } else {
        return;
      }
      setVaultCards(newVault);
      notifyChange({ vaultCards: newVault });
    },
    [vaultCards, vaultCardNames, rules.maxVaultCards, notifyChange]
  );

  const handleRemoveActive = useCallback(
    (cardName: string) => {
      const newActive = activeCards.filter(c => c.name !== cardName);
      setActiveCards(newActive);
      notifyChange({ activeCards: newActive });
    },
    [activeCards, notifyChange]
  );

  const handleRemoveVault = useCallback(
    (cardName: string) => {
      const newVault = vaultCards.filter(c => c.name !== cardName);
      setVaultCards(newVault);
      notifyChange({ vaultCards: newVault });
    },
    [vaultCards, notifyChange]
  );

  const handleMoveToVault = useCallback(
    (cardName: string) => {
      const result = moveToVault(cardName, activeCards, vaultCards, rules);
      if (!result) return;
      setActiveCards(result.activeCards);
      setVaultCards(result.vaultCards);
      notifyChange(result);
    },
    [activeCards, vaultCards, rules, notifyChange]
  );

  const handleMoveToActive = useCallback(
    (cardName: string) => {
      const result = moveToActive(cardName, activeCards, vaultCards, rules);
      if (!result) return;
      setVaultCards(result.vaultCards);
      setActiveCards(result.activeCards);
      notifyChange(result);
    },
    [activeCards, vaultCards, rules, notifyChange]
  );

  const handleSwapCards = useCallback(
    (activeCardName: string, vaultCardName: string) => {
      const result = swapCards(
        activeCardName,
        vaultCardName,
        activeCards,
        vaultCards
      );
      if (!result) return;
      setActiveCards(result.activeCards);
      setVaultCards(result.vaultCards);
      notifyChange(result);
    },
    [activeCards, vaultCards, notifyChange]
  );

  const handleQuickSwapToVault = useCallback(
    (activeCardName: string) => {
      const result = quickSwapToVault(
        activeCardName,
        activeCards,
        vaultCards,
        rules
      );
      if (!result) return;
      setActiveCards(result.activeCards);
      setVaultCards(result.vaultCards);
      notifyChange(result);
    },
    [activeCards, vaultCards, rules, notifyChange]
  );

  const handleQuickSwapToActive = useCallback(
    (vaultCardName: string) => {
      const result = quickSwapToActive(
        vaultCardName,
        activeCards,
        vaultCards,
        rules
      );
      if (!result) return;
      setVaultCards(result.vaultCards);
      setActiveCards(result.activeCards);
      notifyChange(result);
    },
    [activeCards, vaultCards, rules, notifyChange]
  );

  const handleAddHomebrew = useCallback(
    (card: HomebrewDomainCard) => {
      const newHomebrew = [...homebrewCards, card];
      setHomebrewCards(newHomebrew);
      notifyChange({ homebrewCards: newHomebrew });
    },
    [homebrewCards, notifyChange]
  );

  const handleAddHomebrewToLoadout = useCallback(
    (card: HomebrewDomainCard) => {
      if (activeCards.length >= rules.maxActiveCards) return;
      const newActive = [...activeCards, homebrewToLite(card)];
      setActiveCards(newActive);
      notifyChange({ activeCards: newActive });
    },
    [activeCards, rules.maxActiveCards, notifyChange]
  );

  const handleAddHomebrewToVault = useCallback(
    (card: HomebrewDomainCard) => {
      if (
        rules.maxVaultCards !== undefined &&
        vaultCards.length >= rules.maxVaultCards
      )
        return;
      const newVault = [...vaultCards, homebrewToLite(card)];
      setVaultCards(newVault);
      notifyChange({ vaultCards: newVault });
    },
    [vaultCards, rules.maxVaultCards, notifyChange]
  );

  const handleChangeMaxActiveCards = useCallback(
    (delta: number) => {
      setMaxActiveCards(prev => {
        const next = prev + delta;
        if (next < 1 || next < activeCards.length) return prev;
        return next;
      });
    },
    [activeCards.length]
  );

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
    handleModeChange,
    handleToggleDomain,
    handleSelectAllDomains,
    handleClearDomains,
    handleToggleActive,
    handleToggleVault,
    handleRemoveActive,
    handleRemoveVault,
    handleMoveToVault,
    handleMoveToActive,
    handleSwapCards,
    handleQuickSwapToVault,
    handleQuickSwapToActive,
    handleAddHomebrew,
    handleAddHomebrewToLoadout,
    handleAddHomebrewToVault,
    handleChangeMaxActiveCards,
    handleComplete,
  };
}
