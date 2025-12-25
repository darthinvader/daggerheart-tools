import { type ModeOption, ModeTabs } from '@/components/shared';
import type { CommunityMode } from '@/lib/schemas/identity';

import { HomebrewIcon, StandardIcon } from './community-icons';

interface CommunityModeTabsProps {
  activeMode: CommunityMode;
  onModeChange: (mode: CommunityMode) => void;
}

const MODES: ModeOption<CommunityMode>[] = [
  { value: 'standard', label: 'Standard', icon: <StandardIcon /> },
  { value: 'homebrew', label: 'Homebrew', icon: <HomebrewIcon /> },
];

export function CommunityModeTabs({
  activeMode,
  onModeChange,
}: CommunityModeTabsProps) {
  return (
    <ModeTabs
      modes={MODES}
      activeMode={activeMode}
      onModeChange={onModeChange}
    />
  );
}
