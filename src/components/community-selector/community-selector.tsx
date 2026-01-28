import { useCallback, useState } from 'react';

import type {
  Community,
  CommunityMode,
  CommunitySelection,
  HomebrewCommunity,
} from '@/lib/schemas/identity';

import { CommunityModeTabs } from './community-mode-tabs';
import { HomebrewCommunityForm } from './homebrew-community-form';
import { StandardCommunityList } from './standard-community-list';

interface CommunitySelectorProps {
  value?: CommunitySelection;
  onChange?: (selection: CommunitySelection) => void;
  campaignId?: string;
}

export function CommunitySelector({
  value,
  onChange,
  campaignId,
}: CommunitySelectorProps) {
  const [mode, setMode] = useState<CommunityMode>(value?.mode ?? 'standard');

  const [standardSelection, setStandardSelection] = useState<Community | null>(
    value?.mode === 'standard' ? value.community : null
  );
  const [homebrewSelection, setHomebrewSelection] =
    useState<HomebrewCommunity | null>(
      value?.mode === 'homebrew' ? value.homebrew : null
    );

  const activeMode = value?.mode ?? mode;
  const activeStandardSelection =
    value?.mode === 'standard' ? value.community : standardSelection;
  const activeHomebrewSelection =
    value?.mode === 'homebrew' ? value.homebrew : homebrewSelection;

  const handleModeChange = useCallback((newMode: CommunityMode) => {
    setMode(newMode);
  }, []);

  const handleStandardSelect = useCallback(
    (community: Community) => {
      setStandardSelection(community);
      onChange?.({ mode: 'standard', community });
    },
    [onChange]
  );

  const handleHomebrewChange = useCallback(
    (homebrew: HomebrewCommunity) => {
      setHomebrewSelection(homebrew);
      onChange?.({ mode: 'homebrew', homebrew });
    },
    [onChange]
  );

  return (
    <div className="space-y-6">
      <CommunityModeTabs
        activeMode={activeMode}
        onModeChange={handleModeChange}
      />

      {activeMode === 'standard' && (
        <StandardCommunityList
          selectedCommunity={activeStandardSelection}
          onSelect={handleStandardSelect}
          campaignId={campaignId}
        />
      )}

      {activeMode === 'homebrew' && (
        <HomebrewCommunityForm
          homebrew={activeHomebrewSelection}
          onChange={handleHomebrewChange}
        />
      )}
    </div>
  );
}
