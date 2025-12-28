import { Minus, Plus, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { SmartTooltip } from '@/components/ui/smart-tooltip';
import type { InventoryState } from '@/lib/schemas/equipment';

import { CompactInventoryList } from './compact-inventory-list';
import { EmptyInventoryDisplay, InventoryStats } from './inventory-stats';

interface InventoryContentProps {
  inventory: InventoryState;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onQuantityChange?: (id: string, delta: number) => void;
  onMaxSlotsChange?: (delta: number) => void;
  readOnly?: boolean;
}

export function InventoryContent({
  inventory,
  searchQuery = '',
  onSearchChange,
  onQuantityChange,
  onMaxSlotsChange,
  readOnly,
}: InventoryContentProps) {
  const hasItems = inventory.items.length > 0;

  if (!hasItems) {
    return (
      <EmptyInventoryDisplay
        maxSlots={inventory.maxSlots}
        unlimitedSlots={inventory.unlimitedSlots}
      />
    );
  }

  return (
    <div className="space-y-4">
      <InventoryToolbar
        inventory={inventory}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        onMaxSlotsChange={onMaxSlotsChange}
        readOnly={readOnly}
      />
      <Separator />
      <CompactInventoryList
        inventory={inventory}
        searchQuery={searchQuery}
        onQuantityChange={onQuantityChange}
        readOnly={readOnly}
      />
    </div>
  );
}

interface InventoryToolbarProps {
  inventory: InventoryState;
  searchQuery: string;
  onSearchChange?: (query: string) => void;
  onMaxSlotsChange?: (delta: number) => void;
  readOnly?: boolean;
}

function InventoryToolbar({
  inventory,
  searchQuery,
  onSearchChange,
  onMaxSlotsChange,
  readOnly,
}: InventoryToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <InventoryStats
        inventory={inventory}
        unlimitedSlots={inventory.unlimitedSlots}
      />
      <div className="flex items-center gap-2">
        {!readOnly && onMaxSlotsChange && !inventory.unlimitedSlots && (
          <div className="flex items-center gap-1">
            <SmartTooltip content="Decrease max slots">
              <Button
                variant="ghost"
                size="icon"
                className="size-7"
                onClick={() => onMaxSlotsChange(-1)}
                disabled={inventory.maxSlots <= inventory.items.length}
              >
                <Minus className="size-3" />
              </Button>
            </SmartTooltip>
            <SmartTooltip content="Increase max slots">
              <Button
                variant="ghost"
                size="icon"
                className="size-7"
                onClick={() => onMaxSlotsChange(1)}
              >
                <Plus className="size-3" />
              </Button>
            </SmartTooltip>
          </div>
        )}
        {onSearchChange && inventory.items.length > 5 && (
          <div className="relative w-full sm:w-auto">
            <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <Input
              placeholder="Search items..."
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              className="w-full pl-9 sm:w-48"
            />
          </div>
        )}
      </div>
    </div>
  );
}
