import {
  CustomIcon,
  HomebrewIcon,
  type ModeOption,
  ModeTabs,
  StandardIcon,
} from '@/components/shared';
import type { ClassMode } from '@/lib/schemas/class-selection';

interface ClassModeTabsProps {
  activeMode: ClassMode;
  onModeChange: (mode: ClassMode) => void;
}

const MODES: ModeOption<ClassMode>[] = [
  { value: 'standard', label: 'Standard Classes', icon: <StandardIcon /> },
  { value: 'homebrew', label: 'Homebrew', icon: <HomebrewIcon /> },
  { value: 'custom', label: 'Custom', icon: <CustomIcon /> },
];

export function ClassModeTabs({
  activeMode,
  onModeChange,
}: ClassModeTabsProps) {
  return (
    <ModeTabs
      modes={MODES}
      activeMode={activeMode}
      onModeChange={onModeChange}
    />
  );
}
