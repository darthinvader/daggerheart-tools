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
  campaignId?: string;
}

// eslint-disable-next-line complexity
export function AncestrySelector({
  value,
  onChange,
  campaignId,
}: AncestrySelectorProps) {
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

  const activeMode = value?.mode ?? mode;
  const activeStandardSelection =
    value?.mode === 'standard' ? value.ancestry : standardSelection;
  const activeMixedSelection =
    value?.mode === 'mixed' ? value.mixedAncestry : mixedSelection;
  const activeHomebrewSelection =
    value?.mode === 'homebrew' ? value.homebrew : homebrewSelection;

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
      <AncestryModeTabs
        activeMode={activeMode}
        onModeChange={handleModeChange}
      />

      {activeMode === 'standard' && (
        <StandardAncestryList
          selectedAncestry={activeStandardSelection}
          onSelect={handleStandardSelect}
          campaignId={campaignId}
        />
      )}

      {activeMode === 'mixed' && (
        <MixedAncestrySelector
          mixedAncestry={activeMixedSelection}
          onChange={handleMixedChange}
        />
      )}

      {activeMode === 'homebrew' && (
        <HomebrewAncestryForm
          homebrew={activeHomebrewSelection}
          onChange={handleHomebrewChange}
          hideSaveButton
        />
      )}
    </div>
  );
}
