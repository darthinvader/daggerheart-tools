'use client';

import type { ReactNode } from 'react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  /** Current selected tab value */
  value: string;
  /** Callback when tab changes */
  onValueChange: (value: string) => void;
  className?: string;
}

/**
 * A responsive tabs list that shows all tabs in a dropdown on mobile,
 * but as buttons on desktop.
 */
export function ResponsiveTabsList({
  primaryTabs,
  secondaryTabs,
  value,
  onValueChange,
  className,
}: ResponsiveTabsListProps) {
  const isMobile = useIsMobile();

  const allTabs = [...primaryTabs, ...secondaryTabs];
  const activeTab = allTabs.find(t => t.value === value);

  // On mobile, show all tabs in a single dropdown
  if (isMobile) {
    return (
      <div className={cn('w-full', className)}>
        <Select value={value} onValueChange={onValueChange}>
          <SelectTrigger className="h-10 w-full text-sm font-medium">
            <SelectValue placeholder="Select tab...">
              {activeTab ? (
                <span className="flex items-center gap-2">
                  {activeTab.icon}
                  {activeTab.label}
                </span>
              ) : (
                'Select tab...'
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {allTabs.map(tab => (
              <SelectItem key={tab.value} value={tab.value}>
                <span className="flex items-center gap-2">
                  {tab.icon}
                  {tab.label}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  // On desktop, show all tabs as buttons
  return (
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
  );
}
