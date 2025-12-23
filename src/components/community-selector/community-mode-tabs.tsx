import type { CommunityMode } from '@/lib/schemas/identity';
import { cn } from '@/lib/utils';

import { HomebrewIcon, StandardIcon } from './community-icons';

interface CommunityModeTabsProps {
  activeMode: CommunityMode;
  onModeChange: (mode: CommunityMode) => void;
}

const MODES: { value: CommunityMode; label: string; icon: React.ReactNode }[] =
  [
    { value: 'standard', label: 'Standard', icon: <StandardIcon /> },
    { value: 'homebrew', label: 'Homebrew', icon: <HomebrewIcon /> },
  ];

export function CommunityModeTabs({
  activeMode,
  onModeChange,
}: CommunityModeTabsProps) {
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
