import { ChevronDown, Filter, Search, X } from 'lucide-react';
import * as React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
  color?: string;
}

export interface FilterGroup {
  id: string;
  label: string;
  options: FilterOption[];
  defaultOpen?: boolean;
}

interface FilterState {
  search: string;
  filters: Record<string, Set<string>>;
}

interface ReferenceFilterProps {
  filterGroups: FilterGroup[];
  filterState: FilterState;
  onSearchChange: (search: string) => void;
  onFilterChange: (groupId: string, value: string, checked: boolean) => void;
  onClearFilters: () => void;
  resultCount: number;
  totalCount: number;
  searchPlaceholder?: string;
  hideSearch?: boolean;
}

function FilterGroupComponent({
  group,
  selectedValues,
  onFilterChange,
}: {
  group: FilterGroup;
  selectedValues: Set<string>;
  onFilterChange: (value: string, checked: boolean) => void;
}) {
  const [isOpen, setIsOpen] = React.useState(group.defaultOpen ?? true);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="hover:text-primary hover:bg-muted/50 flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm font-medium transition-colors">
        <span>{group.label}</span>
        <ChevronDown
          className={cn(
            'size-3.5 transition-transform',
            isOpen && 'rotate-180'
          )}
        />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="space-y-1.5 px-2 pt-1 pb-3">
          {group.options.map(option => {
            const isChecked = selectedValues.has(option.value);
            return (
              <Tooltip key={option.value}>
                <TooltipTrigger asChild>
                  <label className="hover:text-primary hover:bg-muted/30 flex cursor-pointer items-center gap-2 rounded px-1.5 py-1 text-sm transition-colors">
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={checked =>
                        onFilterChange(option.value, checked === true)
                      }
                    />
                    <span className="flex-1 truncate">{option.label}</span>
                    {option.count !== undefined && (
                      <Badge
                        variant="secondary"
                        className="px-1.5 py-0 text-xs"
                      >
                        {option.count}
                      </Badge>
                    )}
                  </label>
                </TooltipTrigger>
                <TooltipContent side="right" className="text-xs">
                  Filter by {option.label}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

function FilterContent({
  filterGroups,
  filterState,
  onSearchChange,
  onFilterChange,
  onClearFilters,
  resultCount,
  totalCount,
  searchPlaceholder = 'Search...',
  hideSearch = false,
}: ReferenceFilterProps) {
  const activeFilterCount = Object.values(filterState.filters).reduce(
    (sum, set) => sum + set.size,
    0
  );

  return (
    <div className="flex h-full flex-col">
      {/* Search - conditionally rendered */}
      {!hideSearch && (
        <div className="shrink-0 border-b p-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="relative">
                <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                <Input
                  placeholder={searchPlaceholder}
                  value={filterState.search}
                  onChange={e => onSearchChange(e.target.value)}
                  className="pr-9 pl-9"
                />
                {filterState.search && (
                  <button
                    onClick={() => onSearchChange('')}
                    className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
                    aria-label="Clear search"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" className="text-xs">
              Search by name
            </TooltipContent>
          </Tooltip>
        </div>
      )}

      {/* Results count and clear */}
      <div className="bg-muted/30 flex shrink-0 items-center justify-between border-b px-3 py-2 text-sm">
        <span className="text-muted-foreground text-xs">
          {resultCount === totalCount ? (
            <>{totalCount} items</>
          ) : (
            <>
              <span className="text-foreground font-medium">{resultCount}</span>{' '}
              of {totalCount}
            </>
          )}
        </span>
        {activeFilterCount > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className="h-auto px-2 py-1 text-xs"
              >
                Clear ({activeFilterCount})
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="text-xs">
              Clear all active filters
            </TooltipContent>
          </Tooltip>
        )}
      </div>

      {/* Filter groups - scrollable */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="space-y-0.5 p-3">
          {filterGroups.map(group => (
            <FilterGroupComponent
              key={group.id}
              group={group}
              selectedValues={filterState.filters[group.id] ?? new Set()}
              onFilterChange={(value, checked) =>
                onFilterChange(group.id, value, checked)
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function ReferenceFilter(props: ReferenceFilterProps) {
  const isMobile = useIsMobile();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const activeFilterCount = Object.values(props.filterState.filters).reduce(
    (sum, set) => sum + set.size,
    0
  );

  if (isMobile) {
    return (
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="size-4" />
            Filters
            {activeFilterCount > 0 && (
              <Badge className="ml-1 px-1.5 py-0">{activeFilterCount}</Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="flex w-[85vw] max-w-sm flex-col p-0"
          hideCloseButton
        >
          <SheetHeader className="flex shrink-0 flex-row items-center justify-between border-b p-4">
            <SheetTitle>Filters</SheetTitle>
            <SheetClose asChild>
              <Button variant="ghost" size="icon" className="size-8">
                <X className="size-4" />
                <span className="sr-only">Close</span>
              </Button>
            </SheetClose>
          </SheetHeader>
          <div className="min-h-0 flex-1">
            <FilterContent {...props} />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <aside className="bg-muted/20 flex w-72 shrink-0 flex-col border-r">
      <FilterContent {...props} />
    </aside>
  );
}
