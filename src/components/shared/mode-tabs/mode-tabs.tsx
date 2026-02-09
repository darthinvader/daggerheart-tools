import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

export interface ModeOption<T extends string> {
  value: T;
  label: string;
  shortLabel?: string;
  icon?: ReactNode;
}

export interface ModeTabsProps<T extends string> {
  modes: readonly ModeOption<T>[];
  activeMode: T;
  onModeChange: (mode: T) => void;
  className?: string;
}

export function ModeTabs<T extends string>({
  modes,
  activeMode,
  onModeChange,
  className,
}: ModeTabsProps<T>) {
  return (
    <div
      className={cn(
        'bg-muted flex gap-1 overflow-x-auto rounded-lg p-1',
        className
      )}
    >
      {modes.map(({ value, label, shortLabel, icon }) => (
        <button
          key={value}
          type="button"
          onClick={() => onModeChange(value)}
          className={cn(
            'flex flex-1 items-center justify-center gap-2 rounded-md px-2 py-2 text-sm font-medium transition-all sm:px-4',
            'focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
            activeMode === value
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
          )}
        >
          {icon}
          <span className="hidden sm:inline">{label}</span>
          {shortLabel && <span className="sm:hidden">{shortLabel}</span>}
        </button>
      ))}
    </div>
  );
}
