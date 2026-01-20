'use client';

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
 * A responsive tabs list that shows primary tabs as buttons and
 * secondary tabs in a dropdown on mobile, but all as buttons on desktop.
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
  const activeSecondaryTab = secondaryTabs.find(t => t.value === value);

  // On mobile, show primary tabs + dropdown for secondary
  if (isMobile) {
    return (
      <div className={cn('flex w-full items-center gap-2', className)}>
        <TabsList className="flex-1">
          {primaryTabs.map(tab => (
            <TabsTrigger key={tab.value} value={tab.value} className="flex-1">
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <Select
          value={activeSecondaryTab ? value : ''}
          onValueChange={onValueChange}
        >
          <SelectTrigger
            className={cn(
              'h-9 w-auto min-w-[100px] gap-1 text-sm font-medium',
              activeSecondaryTab &&
                'bg-background dark:bg-input/30 border-input shadow-sm'
            )}
          >
            <SelectValue placeholder="More...">
              {activeSecondaryTab ? activeSecondaryTab.label : 'More...'}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {secondaryTabs.map(tab => (
              <SelectItem key={tab.value} value={tab.value}>
                {tab.label}
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
          {tab.label}
        </TabsTrigger>
      ))}
    </TabsList>
  );
}
