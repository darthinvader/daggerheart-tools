import type { AncestryMode } from '@/lib/schemas/identity';
import { cn } from '@/lib/utils';

import {
  HomebrewIcon,
  MixedAncestryIcon,
  StandardIcon,
} from './ancestry-icons';

interface AncestryModeTabsProps {
  activeMode: AncestryMode;
  onModeChange: (mode: AncestryMode) => void;
}

const MODES: { value: AncestryMode; label: string; icon: React.ReactNode }[] = [
  { value: 'standard', label: 'Standard', icon: <StandardIcon /> },
  { value: 'mixed', label: 'Mixed', icon: <MixedAncestryIcon /> },
  { value: 'homebrew', label: 'Homebrew', icon: <HomebrewIcon /> },
];

export function AncestryModeTabs({
  activeMode,
  onModeChange,
}: AncestryModeTabsProps) {
  return (
    <div className="bg-muted flex gap-1 rounded-lg p-1">
      {MODES.map(({ value, label, icon }) => (
        <button
          key={value}
          type="button"
          onClick={() => onModeChange(value)}
          className={cn(
            'flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all',
            'focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
            activeMode === value
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
          )}
        >
          {icon}
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );
}
