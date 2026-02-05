import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface BottomNavTab {
  value: string;
  label: string;
  icon: ReactNode;
}

interface MobileBottomNavProps {
  tabs: BottomNavTab[];
  activeTab: string;
  onTabChange: (value: string) => void;
}

export function MobileBottomNav({
  tabs,
  activeTab,
  onTabChange,
}: MobileBottomNavProps) {
  return (
    <nav
      className="character-bottom-nav md:hidden"
      aria-label="Character sheet navigation"
    >
      <div
        className="grid h-14"
        style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}
      >
        {tabs.map(tab => {
          const isActive = tab.value === activeTab;
          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => onTabChange(tab.value)}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
              aria-selected={isActive}
              role="tab"
            >
              <div
                className={cn(
                  'flex size-7 items-center justify-center rounded-lg transition-colors',
                  isActive && 'bg-primary/10'
                )}
              >
                {tab.icon}
              </div>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
