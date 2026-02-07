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
        role="tablist"
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
                'relative flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-all',
                isActive
                  ? 'bottom-nav-item-active text-primary'
                  : 'text-muted-foreground active:scale-95'
              )}
              aria-selected={isActive}
              role="tab"
            >
              {/* Active indicator pill at top */}
              <span className="bottom-nav-indicator" />
              <div
                className={cn(
                  'flex size-7 items-center justify-center rounded-lg transition-all duration-200',
                  isActive ? 'bg-primary/10 shadow-sm' : 'hover:bg-muted/50'
                )}
              >
                {tab.icon}
              </div>
              <span className={cn(isActive && 'font-semibold')}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
