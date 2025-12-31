import { type ModeOption, ModeTabs } from '@/components/shared';
import type { LoadoutMode } from '@/lib/schemas/loadout';

interface LoadoutModeTabsProps {
  activeMode: LoadoutMode;
  onModeChange: (mode: LoadoutMode) => void;
  classDomains?: string[];
}

const MODES: ModeOption<LoadoutMode>[] = [
  {
    value: 'class-domains',
    label: 'Class Domains',
    shortLabel: 'Class',
    icon: <span>📚</span>,
  },
  {
    value: 'all-domains',
    label: 'All Domains',
    shortLabel: 'All',
    icon: <span>🌟</span>,
  },
  {
    value: 'homebrew',
    label: 'Homebrew',
    shortLabel: 'Custom',
    icon: <span>🛠️</span>,
  },
];

export function LoadoutModeTabs({
  activeMode,
  onModeChange,
}: LoadoutModeTabsProps) {
  return (
    <ModeTabs
      modes={MODES}
      activeMode={activeMode}
      onModeChange={onModeChange}
    />
  );
}
