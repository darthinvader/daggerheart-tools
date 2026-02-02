import type { ReactNode } from 'react';

import { Globe, Library, Link2, Lock, Zap } from '@/lib/icons';
import { cn } from '@/lib/utils';

// Source types for homebrew content
export type HomebrewSource = 'linked' | 'public' | 'private' | 'quicklist';

export interface HomebrewSourceOption {
  value: HomebrewSource;
  label: string;
  shortLabel: string;
  icon: ReactNode;
  description: string;
}

const SOURCES: HomebrewSourceOption[] = [
  {
    value: 'linked',
    label: 'Campaign',
    shortLabel: 'Campaign',
    icon: <Link2 className="size-4" />,
    description: 'Homebrew linked to your campaign',
  },
  {
    value: 'public',
    label: 'Public',
    shortLabel: 'Public',
    icon: <Globe className="size-4" />,
    description: 'Community homebrew content',
  },
  {
    value: 'private',
    label: 'My Homebrew',
    shortLabel: 'Mine',
    icon: <Lock className="size-4" />,
    description: 'Your private homebrew',
  },
  {
    value: 'quicklist',
    label: 'Quicklist',
    shortLabel: 'Quick',
    icon: <Zap className="size-4" />,
    description: 'Your saved favorites',
  },
];

interface HomebrewSourceTabsProps {
  activeSource: HomebrewSource;
  onSourceChange: (source: HomebrewSource) => void;
  hasCampaign?: boolean;
  className?: string;
}

export function HomebrewSourceTabs({
  activeSource,
  onSourceChange,
  hasCampaign = false,
  className,
}: HomebrewSourceTabsProps) {
  // Filter out 'linked' if no campaign
  const availableSources = hasCampaign
    ? SOURCES
    : SOURCES.filter(s => s.value !== 'linked');

  return (
    <div className={cn('space-y-2', className)}>
      <div className="text-muted-foreground flex items-center gap-2 text-sm">
        <Library className="size-4" />
        <span>Select homebrew source:</span>
      </div>
      <div className="bg-muted/50 flex flex-wrap gap-1 rounded-lg p-1">
        {availableSources.map(({ value, label, shortLabel, icon }) => (
          <button
            key={value}
            type="button"
            onClick={() => onSourceChange(value)}
            className={cn(
              'flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all',
              'focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
              'min-w-[80px]',
              activeSource === value
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
            )}
          >
            {icon}
            <span className="hidden sm:inline">{label}</span>
            <span className="sm:hidden">{shortLabel}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
