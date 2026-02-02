import {
  CustomIcon,
  HomebrewIcon,
  type ModeOption,
  ModeTabs,
  StandardIcon,
} from '@/components/shared';

// 'standard' = Official content
// 'homebrew' = Homebrew content (Campaign, Public, Private, Quicklist)
// 'custom' = Player-created custom content on the fly
export type EquipmentMode = 'standard' | 'homebrew' | 'custom';

interface EquipmentModeTabsProps {
  activeMode: EquipmentMode;
  onModeChange: (mode: EquipmentMode) => void;
}

const MODES: ModeOption<EquipmentMode>[] = [
  { value: 'standard', label: 'Standard', icon: <StandardIcon /> },
  { value: 'homebrew', label: 'Homebrew', icon: <HomebrewIcon /> },
  { value: 'custom', label: 'Custom', icon: <CustomIcon /> },
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
