import { useCallback, useMemo, useState } from 'react';

import type {
  DomainCardLite,
  HomebrewDomainCard,
  LoadoutMode,
  LoadoutRules,
  LoadoutSelection,
} from '@/lib/schemas/loadout';

interface UseLoadoutCardStateParams {
  initialValue?: LoadoutSelection;
  rules: LoadoutRules;
}

export function useLoadoutCardState({
  initialValue,
  rules,
}: UseLoadoutCardStateParams) {
  const [mode, setMode] = useState<LoadoutMode>(
    initialValue?.mode ?? 'class-domains'
  );
  const [activeCards, setActiveCards] = useState<DomainCardLite[]>(
    initialValue?.activeCards ?? []
  );
  const [vaultCards, setVaultCards] = useState<DomainCardLite[]>(
    initialValue?.vaultCards ?? []
  );
  const [homebrewCards, setHomebrewCards] = useState<HomebrewDomainCard[]>(
    initialValue?.homebrewCards ?? []
  );

  const activeCardNames = useMemo(
    () => new Set(activeCards.map(c => c.name)),
    [activeCards]
  );
  const vaultCardNames = useMemo(
    () => new Set(vaultCards.map(c => c.name)),
    [vaultCards]
  );

  const isVaultFull =
    rules.maxVaultCards !== undefined &&
    vaultCards.length >= rules.maxVaultCards;
  const isActiveFull = activeCards.length >= rules.maxActiveCards;

  return {
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
  };
}

interface UseMaxActiveCardsParams {
  baseMaxCards: number;
  currentActiveCount: number;
}

export function useMaxActiveCards({
  baseMaxCards,
  currentActiveCount,
}: UseMaxActiveCardsParams) {
  const [maxActiveCards, setMaxActiveCards] = useState(baseMaxCards);

  const handleChangeMaxActiveCards = useCallback(
    (delta: number) => {
      setMaxActiveCards(prev => {
        const next = prev + delta;
        if (next < 1 || next < currentActiveCount) return prev;
        return next;
      });
    },
    [currentActiveCount]
  );

  return {
    maxActiveCards,
    handleChangeMaxActiveCards,
  };
}
