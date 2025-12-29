import { useCallback } from 'react';

import type { LoadoutMode, LoadoutSelection } from '@/lib/schemas/loadout';

import { ALL_DOMAIN_NAMES } from './loadout-utils';

interface UseDomainModeHandlersProps {
  mode: LoadoutMode;
  classDomains: string[];
  setMode: (mode: LoadoutMode) => void;
  setSelectedDomains: React.Dispatch<React.SetStateAction<string[]>>;
  notifyChange: (updates: Partial<LoadoutSelection>) => void;
}

export function useDomainModeHandlers({
  mode,
  classDomains,
  setMode,
  setSelectedDomains,
  notifyChange,
}: UseDomainModeHandlersProps) {
  const handleModeChange = useCallback(
    (newMode: LoadoutMode) => {
      setMode(newMode);
      const newDomains =
        newMode === 'class-domains' ? classDomains : ALL_DOMAIN_NAMES;
      setSelectedDomains(newDomains);
      notifyChange({
        mode: newMode,
        expandedDomainAccess: newMode === 'all-domains',
      });
    },
    [classDomains, notifyChange, setMode, setSelectedDomains]
  );

  const handleToggleDomain = useCallback(
    (domain: string) => {
      setSelectedDomains(prev =>
        prev.includes(domain)
          ? prev.filter(d => d !== domain)
          : [...prev, domain]
      );
    },
    [setSelectedDomains]
  );

  const handleSelectAllDomains = useCallback(() => {
    setSelectedDomains(
      mode === 'class-domains' ? classDomains : ALL_DOMAIN_NAMES
    );
  }, [mode, classDomains, setSelectedDomains]);

  const handleClearDomains = useCallback(
    () => setSelectedDomains([]),
    [setSelectedDomains]
  );

  return {
    handleModeChange,
    handleToggleDomain,
    handleSelectAllDomains,
    handleClearDomains,
  };
}
