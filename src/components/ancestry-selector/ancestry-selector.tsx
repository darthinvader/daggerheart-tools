import { useCallback, useState } from 'react';

import type {
  Ancestry,
  AncestryMode,
  AncestrySelection,
  HomebrewAncestry,
  MixedAncestry,
} from '@/lib/schemas/identity';

import { AncestryModeTabs } from './ancestry-mode-tabs';
import { HomebrewAncestryForm } from './homebrew-ancestry-form';
import { MixedAncestrySelector } from './mixed-ancestry-selector';
import { StandardAncestryList } from './standard-ancestry-list';

interface AncestrySelectorProps {
  value?: AncestrySelection;
  onChange?: (selection: AncestrySelection) => void;
}

export function AncestrySelector({ value, onChange }: AncestrySelectorProps) {
  const [mode, setMode] = useState<AncestryMode>(value?.mode ?? 'standard');

  const [standardSelection, setStandardSelection] = useState<Ancestry | null>(
    value?.mode === 'standard' ? value.ancestry : null
  );
  const [mixedSelection, setMixedSelection] = useState<MixedAncestry | null>(
    value?.mode === 'mixed' ? value.mixedAncestry : null
  );
  const [homebrewSelection, setHomebrewSelection] =
    useState<HomebrewAncestry | null>(
      value?.mode === 'homebrew' ? value.homebrew : null
    );

  const handleModeChange = useCallback((newMode: AncestryMode) => {
    setMode(newMode);
  }, []);

  const handleStandardSelect = useCallback(
    (ancestry: Ancestry) => {
      setStandardSelection(ancestry);
      onChange?.({ mode: 'standard', ancestry });
    },
    [onChange]
  );

  const handleMixedChange = useCallback(
    (mixedAncestry: MixedAncestry) => {
      setMixedSelection(mixedAncestry);
      onChange?.({ mode: 'mixed', mixedAncestry });
    },
    [onChange]
  );

  const handleHomebrewChange = useCallback(
    (homebrew: HomebrewAncestry) => {
      setHomebrewSelection(homebrew);
      onChange?.({ mode: 'homebrew', homebrew });
    },
    [onChange]
  );

  return (
    <div className="space-y-6">
      <AncestryModeTabs activeMode={mode} onModeChange={handleModeChange} />

      {mode === 'standard' && (
        <StandardAncestryList
          selectedAncestry={standardSelection}
          onSelect={handleStandardSelect}
        />
      )}

      {mode === 'mixed' && (
        <MixedAncestrySelector
          mixedAncestry={mixedSelection}
          onChange={handleMixedChange}
        />
      )}

      {mode === 'homebrew' && (
        <HomebrewAncestryForm
          homebrew={homebrewSelection}
          onChange={handleHomebrewChange}
        />
      )}
    </div>
  );
}
