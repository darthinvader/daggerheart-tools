import {
  HomebrewIcon,
  MixedIcon,
  type ModeOption,
  ModeTabs,
  StandardIcon,
} from '@/components/shared';
import type { AncestryMode } from '@/lib/schemas/identity';

interface AncestryModeTabsProps {
  activeMode: AncestryMode;
  onModeChange: (mode: AncestryMode) => void;
}

const MODES: ModeOption<AncestryMode>[] = [
  { value: 'standard', label: 'Standard', icon: <StandardIcon /> },
  { value: 'mixed', label: 'Mixed', icon: <MixedIcon /> },
  { value: 'homebrew', label: 'Homebrew', icon: <HomebrewIcon /> },
];

export function AncestryModeTabs({
  activeMode,
  onModeChange,
}: AncestryModeTabsProps) {
  return (
    <ModeTabs
      modes={MODES}
      activeMode={activeMode}
      onModeChange={onModeChange}
    />
  );
}
