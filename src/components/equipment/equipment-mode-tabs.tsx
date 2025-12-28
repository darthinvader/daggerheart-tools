import {
  HomebrewIcon,
  type ModeOption,
  ModeTabs,
  StandardIcon,
} from '@/components/shared';

export type EquipmentMode = 'standard' | 'homebrew';

interface EquipmentModeTabsProps {
  activeMode: EquipmentMode;
  onModeChange: (mode: EquipmentMode) => void;
}

const MODES: ModeOption<EquipmentMode>[] = [
  { value: 'standard', label: 'Standard', icon: <StandardIcon /> },
  { value: 'homebrew', label: 'Homebrew', icon: <HomebrewIcon /> },
];

export function EquipmentModeTabs({
  activeMode,
  onModeChange,
}: EquipmentModeTabsProps) {
  return (
    <ModeTabs
      modes={MODES}
      activeMode={activeMode}
      onModeChange={onModeChange}
    />
  );
}
