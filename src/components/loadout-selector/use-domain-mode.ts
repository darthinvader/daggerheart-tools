import { useCallback, useState } from 'react';

import type { LoadoutMode, LoadoutSelection } from '@/lib/schemas/loadout';

import { ALL_DOMAIN_NAMES } from './loadout-utils';

interface UseDomainModeProps {
  initialMode: LoadoutMode;
  classDomains: string[];
  onNotifyChange: (updates: Partial<LoadoutSelection>) => void;
}

/**
 * Hook to manage domain mode selection and domain filtering
 */
export function useDomainMode({
  initialMode,
  classDomains,
  onNotifyChange,
}: UseDomainModeProps) {
  const [mode, setMode] = useState<LoadoutMode>(initialMode);
  const [selectedDomains, setSelectedDomains] = useState<string[]>(
    initialMode === 'class-domains' ? classDomains : ALL_DOMAIN_NAMES
  );

  const handleModeChange = useCallback(
    (newMode: LoadoutMode) => {
      setMode(newMode);
      if (newMode === 'class-domains') {
        setSelectedDomains(classDomains);
      } else if (newMode === 'all-domains') {
        setSelectedDomains(ALL_DOMAIN_NAMES);
      }
      onNotifyChange({
        mode: newMode,
        expandedDomainAccess: newMode === 'all-domains',
      });
    },
    [classDomains, onNotifyChange]
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

  const domainsToShow =
    mode === 'class-domains' ? classDomains : ALL_DOMAIN_NAMES;

  return {
    mode,
    selectedDomains,
    domainsToShow,
    handleModeChange,
    handleToggleDomain,
    handleSelectAllDomains,
    handleClearDomains,
  };
}
