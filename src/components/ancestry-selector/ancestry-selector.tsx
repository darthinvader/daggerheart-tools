import { useCallback, useState } from 'react';

import { HomebrewContentBrowser } from '@/components/shared';
import type {
  Ancestry,
  AncestryMode,
  AncestrySelection,
  CustomAncestry,
  HomebrewAncestry,
  MixedAncestry,
} from '@/lib/schemas/identity';

import { AncestryModeTabs } from './ancestry-mode-tabs';
import { HomebrewAncestryCard } from './homebrew-ancestry-card';
import { HomebrewAncestryForm } from './homebrew-ancestry-form';
import { MixedAncestrySelector } from './mixed-ancestry-selector';
import { StandardAncestryList } from './standard-ancestry-list';

interface AncestrySelectorProps {
  value?: AncestrySelection;
  onChange?: (selection: AncestrySelection) => void;
  campaignId?: string;
}

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
  const [customSelection, setCustomSelection] = useState<CustomAncestry | null>(
    value?.mode === 'custom' ? value.custom : null
  );

  // Use local mode state for tab display - value.mode only sets initial state
  const activeMode = mode;
  // Use local selections, falling back to value if not yet set locally
  const activeStandardSelection = standardSelection;
  const activeMixedSelection = mixedSelection;
  const activeHomebrewSelection = homebrewSelection;
  const activeCustomSelection = customSelection;

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

  const handleHomebrewSelect = useCallback(
    (homebrew: HomebrewAncestry, homebrewContentId: string) => {
      setHomebrewSelection(homebrew);
      onChange?.({ mode: 'homebrew', homebrew, homebrewContentId });
    },
    [onChange]
  );

  const handleCustomChange = useCallback(
    (custom: CustomAncestry) => {
      setCustomSelection(custom);
      onChange?.({ mode: 'custom', custom });
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
        <HomebrewContentBrowser<HomebrewAncestry>
          contentType="ancestry"
          campaignId={campaignId}
          selectedItem={activeHomebrewSelection}
          onSelect={handleHomebrewSelect}
          renderItem={(content, isSelected, onClick) => (
            <HomebrewAncestryCard
              key={content.id}
              content={content}
              isSelected={isSelected}
              onClick={onClick}
            />
          )}
          extractContent={c => c.content as unknown as HomebrewAncestry}
          emptyMessage="No homebrew ancestries found."
        />
      )}

      {activeMode === 'custom' && (
        <HomebrewAncestryForm
          homebrew={activeCustomSelection}
          onChange={handleCustomChange}
          hideSaveButton
        />
      )}
    </div>
  );
}
