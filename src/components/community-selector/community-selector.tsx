import { useCallback, useState } from 'react';

import { HomebrewContentBrowser } from '@/components/shared';
import type {
  Community,
  CommunityMode,
  CommunitySelection,
  CustomCommunity,
  HomebrewCommunity,
} from '@/lib/schemas/identity';

import { CommunityModeTabs } from './community-mode-tabs';
import { HomebrewCommunityCard } from './homebrew-community-card';
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
  const [customSelection, setCustomSelection] =
    useState<CustomCommunity | null>(
      value?.mode === 'custom' ? value.custom : null
    );

  // Use local mode state for tab display - value.mode only sets initial state
  const activeMode = mode;
  // Use local selections, falling back to value if not yet set locally
  const activeStandardSelection = standardSelection;
  const activeHomebrewSelection = homebrewSelection;
  const activeCustomSelection = customSelection;

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

  const handleHomebrewSelect = useCallback(
    (homebrew: HomebrewCommunity, homebrewContentId: string) => {
      setHomebrewSelection(homebrew);
      onChange?.({ mode: 'homebrew', homebrew, homebrewContentId });
    },
    [onChange]
  );

  const handleCustomChange = useCallback(
    (custom: CustomCommunity) => {
      setCustomSelection(custom);
      onChange?.({ mode: 'custom', custom });
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
        <HomebrewContentBrowser<HomebrewCommunity>
          contentType="community"
          campaignId={campaignId}
          selectedItem={activeHomebrewSelection}
          onSelect={handleHomebrewSelect}
          renderItem={(content, isSelected, onClick) => (
            <HomebrewCommunityCard
              key={content.id}
              content={content}
              isSelected={isSelected}
              onClick={onClick}
            />
          )}
          extractContent={c => c.content as unknown as HomebrewCommunity}
          emptyMessage="No homebrew communities found."
        />
      )}

      {activeMode === 'custom' && (
        <HomebrewCommunityForm
          homebrew={activeCustomSelection}
          onChange={handleCustomChange}
        />
      )}
    </div>
  );
}
