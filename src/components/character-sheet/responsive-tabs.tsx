'use client';

import type { ReactNode } from 'react';

import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface TabDefinition {
  value: string;
  label: string;
  icon?: ReactNode;
}

interface ResponsiveTabsListProps {
  /** Tabs always visible as buttons */
  primaryTabs: TabDefinition[];
  /** Tabs shown in dropdown on mobile, as buttons on desktop */
  secondaryTabs: TabDefinition[];
  /** Current selected tab value (used by the Tabs component parent) */
  value?: string;
  /** Callback when tab changes (used by the Tabs component parent) */
  onValueChange?: (value: string) => void;
  className?: string;
}

/**
 * A responsive tabs list that hides on mobile (replaced by bottom nav),
 * and shows all tabs with enhanced styling on desktop.
 */
export function ResponsiveTabsList({
  primaryTabs,
  secondaryTabs,
  className,
}: ResponsiveTabsListProps) {
  const isMobile = useIsMobile();

  const allTabs = [...primaryTabs, ...secondaryTabs];

  // On mobile, tabs are handled by MobileBottomNav — hide the tab bar
  if (isMobile) {
    return null;
  }

  // On desktop, show all tabs with enhanced styling
  return (
    <div className="character-tabs-bar">
      <TabsList
        className={cn('grid w-full', className)}
        style={{
          gridTemplateColumns: `repeat(${allTabs.length}, minmax(0, 1fr))`,
        }}
      >
        {allTabs.map(tab => (
          <TabsTrigger key={tab.value} value={tab.value}>
            <span className="flex items-center gap-1.5">
              {tab.icon}
              {tab.label}
            </span>
          </TabsTrigger>
        ))}
      </TabsList>
    </div>
  );
}
