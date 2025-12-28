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
      if (
        rules.maxVaultCards !== undefined &&
        vaultCards.length >= rules.maxVaultCards
      )
        return;
      const card = activeCards.find(c => c.name === cardName);
      if (!card) return;
      const newActive = activeCards.filter(c => c.name !== cardName);
      const newVault = [...vaultCards, card];
      setActiveCards(newActive);
      setVaultCards(newVault);
      notifyChange({ activeCards: newActive, vaultCards: newVault });
    },
    [activeCards, vaultCards, rules.maxVaultCards, notifyChange]
  );

  const handleMoveToActive = useCallback(
    (cardName: string) => {
      if (activeCards.length >= rules.maxActiveCards) return;
      const card = vaultCards.find(c => c.name === cardName);
      if (!card) return;
      const newVault = vaultCards.filter(c => c.name !== cardName);
      const newActive = [...activeCards, card];
      setVaultCards(newVault);
      setActiveCards(newActive);
      notifyChange({ activeCards: newActive, vaultCards: newVault });
    },
    [activeCards, vaultCards, rules.maxActiveCards, notifyChange]
  );

  // Swap an active card with a vault card (works even when both are full)
  const handleSwapCards = useCallback(
    (activeCardName: string, vaultCardName: string) => {
      const activeCard = activeCards.find(c => c.name === activeCardName);
      const vaultCard = vaultCards.find(c => c.name === vaultCardName);
      if (!activeCard || !vaultCard) return;

      const newActive = activeCards
        .filter(c => c.name !== activeCardName)
        .concat(vaultCard);
      const newVault = vaultCards
        .filter(c => c.name !== vaultCardName)
        .concat(activeCard);

      setActiveCards(newActive);
      setVaultCards(newVault);
      notifyChange({ activeCards: newActive, vaultCards: newVault });
    },
    [activeCards, vaultCards, notifyChange]
  );

  // Quick swap: move card to other slot, replacing the first card there
  const handleQuickSwapToVault = useCallback(
    (activeCardName: string) => {
      if (
        rules.maxVaultCards === undefined ||
        vaultCards.length < rules.maxVaultCards
      ) {
        // Not full, just move
        const card = activeCards.find(c => c.name === activeCardName);
        if (!card) return;
        const newActive = activeCards.filter(c => c.name !== activeCardName);
        const newVault = [...vaultCards, card];
        setActiveCards(newActive);
        setVaultCards(newVault);
        notifyChange({ activeCards: newActive, vaultCards: newVault });
      } else if (vaultCards.length > 0) {
        // Full, swap with first vault card
        handleSwapCards(activeCardName, vaultCards[0].name);
      }
    },
    [
      activeCards,
      vaultCards,
      rules.maxVaultCards,
      notifyChange,
      handleSwapCards,
    ]
  );

  const handleQuickSwapToActive = useCallback(
    (vaultCardName: string) => {
      if (activeCards.length < rules.maxActiveCards) {
        // Not full, just move
        const card = vaultCards.find(c => c.name === vaultCardName);
        if (!card) return;
        const newVault = vaultCards.filter(c => c.name !== vaultCardName);
        const newActive = [...activeCards, card];
        setVaultCards(newVault);
        setActiveCards(newActive);
        notifyChange({ activeCards: newActive, vaultCards: newVault });
      } else if (activeCards.length > 0) {
        // Full, swap with first active card
        handleSwapCards(activeCards[0].name, vaultCardName);
      }
    },
    [
      activeCards,
      vaultCards,
      rules.maxActiveCards,
      notifyChange,
      handleSwapCards,
    ]
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
