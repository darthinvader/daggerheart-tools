import { Library, type LucideIcon, Star, Wrench } from 'lucide-react';
import { CustomIcon, type ModeOption, ModeTabs } from '@/components/shared';

const LoadoutModeIcons: Record<string, LucideIcon> = {
  standard: Library,
  allCards: Star,
  homebrew: Wrench,
} as const;
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
    icon: <LoadoutModeIcons.standard size={16} />,
  },
  {
    value: 'all-domains',
    label: 'All Domains',
    shortLabel: 'All',
    icon: <LoadoutModeIcons.allCards size={16} />,
  },
  {
    value: 'homebrew',
    label: 'Homebrew',
    shortLabel: 'Homebrew',
    icon: <LoadoutModeIcons.homebrew size={16} />,
  },
  {
    value: 'custom',
    label: 'Custom',
    shortLabel: 'Custom',
    icon: <CustomIcon size={16} />,
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
