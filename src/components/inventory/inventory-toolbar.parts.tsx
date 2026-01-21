import { Filter, Minus, Plus, Search, X } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SmartTooltip } from '@/components/ui/smart-tooltip';
import type { InventoryState } from '@/lib/schemas/equipment';
import { cn } from '@/lib/utils';

import {
  UnlimitedQuantityToggle,
  UnlimitedSlotsToggle,
} from './unlimited-toggles';

interface InventoryToolbarProps {
  inventory: InventoryState;
  searchQuery: string;
  onSearchChange?: (query: string) => void;
  onMaxSlotsChange?: (delta: number) => void;
  onUnlimitedSlotsChange?: (value: boolean) => void;
  onUnlimitedQuantityChange?: (value: boolean) => void;
  onAddClick?: () => void;
  onCustomClick?: () => void;
  showFilters: boolean;
  onToggleFilters: () => void;
  activeFilterCount: number;
  onClearFilters: () => void;
  readOnly?: boolean;
}

export function InventoryToolbar({
  inventory,
  searchQuery,
  onSearchChange,
  onMaxSlotsChange,
  onUnlimitedSlotsChange,
  onUnlimitedQuantityChange,
  onAddClick,
  onCustomClick,
  showFilters,
  onToggleFilters,
  activeFilterCount,
  onClearFilters,
  readOnly,
}: InventoryToolbarProps) {
  const items = inventory?.items ?? [];
  const totalQuantity = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalItems = items.length;

  return (
    <div className="space-y-3">
      {!readOnly && (
        <ToolbarActionButtons
          totalItems={totalItems}
          showFilters={showFilters}
          activeFilterCount={activeFilterCount}
          inventory={inventory}
          onCustomClick={onCustomClick}
          onAddClick={onAddClick}
          onToggleFilters={onToggleFilters}
          onClearFilters={onClearFilters}
          onUnlimitedSlotsChange={onUnlimitedSlotsChange}
          onUnlimitedQuantityChange={onUnlimitedQuantityChange}
        />
      )}

      <ToolbarStatsRow
        inventory={inventory}
        totalQuantity={totalQuantity}
        totalItems={totalItems}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        onMaxSlotsChange={onMaxSlotsChange}
        readOnly={readOnly}
      />
    </div>
  );
}

interface ToolbarActionButtonsProps {
  totalItems: number;
  showFilters: boolean;
  activeFilterCount: number;
  inventory: InventoryState;
  onCustomClick?: () => void;
  onAddClick?: () => void;
  onToggleFilters: () => void;
  onClearFilters: () => void;
  onUnlimitedSlotsChange?: (value: boolean) => void;
  onUnlimitedQuantityChange?: (value: boolean) => void;
}

function ToolbarActionButtons({
  totalItems,
  showFilters,
  activeFilterCount,
  inventory,
  onCustomClick,
  onAddClick,
  onToggleFilters,
  onClearFilters,
  onUnlimitedSlotsChange,
  onUnlimitedQuantityChange,
}: ToolbarActionButtonsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {onCustomClick && (
        <Button
          variant="outline"
          size="sm"
          onClick={onCustomClick}
          className="gap-1.5 border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100 hover:text-purple-800 dark:border-purple-800 dark:bg-purple-950/50 dark:text-purple-300 dark:hover:bg-purple-900/50"
        >
          ✨ Custom Item
        </Button>
      )}
      {onAddClick && (
        <Button
          size="sm"
          onClick={onAddClick}
          className="gap-1.5 bg-sky-600 text-white hover:bg-sky-700 dark:bg-sky-700 dark:hover:bg-sky-600"
        >
          📦 Add Items
        </Button>
      )}

      {totalItems > 0 && (
        <SmartTooltip
          content={
            showFilters
              ? '🔽 Hide filters'
              : '🔍 Show filters to narrow down items'
          }
        >
          <Button
            variant={showFilters ? 'default' : 'outline'}
            size="sm"
            onClick={onToggleFilters}
            className={cn(
              'gap-1.5',
              showFilters &&
                'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600'
            )}
          >
            <Filter className="size-4" />
            {activeFilterCount > 0 && (
              <Badge
                variant="secondary"
                className="size-5 justify-center rounded-full p-0 text-xs"
              >
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </SmartTooltip>
      )}

      {activeFilterCount > 0 && (
        <SmartTooltip content="❌ Clear all filters">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="gap-1 text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/50"
          >
            <X className="size-4" />
            Clear
          </Button>
        </SmartTooltip>
      )}

      <div className="ml-auto flex items-center gap-2">
        {onUnlimitedSlotsChange && (
          <UnlimitedSlotsToggle
            enabled={inventory.unlimitedSlots ?? false}
            onChange={onUnlimitedSlotsChange}
          />
        )}
        {onUnlimitedQuantityChange && (
          <UnlimitedQuantityToggle
            enabled={inventory.unlimitedQuantity ?? false}
            onChange={onUnlimitedQuantityChange}
          />
        )}
      </div>
    </div>
  );
}

interface ToolbarStatsRowProps {
  inventory: InventoryState;
  totalQuantity: number;
  totalItems: number;
  searchQuery: string;
  onSearchChange?: (query: string) => void;
  onMaxSlotsChange?: (delta: number) => void;
  readOnly?: boolean;
}

interface StatBadgeProps {
  count: number;
  emoji: string;
  label: string;
  tooltip: string;
  variant?: 'green' | 'purple';
}

function StatBadge({ count, emoji, label, tooltip, variant }: StatBadgeProps) {
  if (count === 0) return null;

  const colorClasses =
    variant === 'green'
      ? 'border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950/50 dark:text-green-300'
      : variant === 'purple'
        ? 'border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-950/50 dark:text-purple-300'
        : '';

  return (
    <SmartTooltip content={tooltip}>
      <Badge
        variant={variant ? 'outline' : 'secondary'}
        className={cn('gap-1 text-xs', colorClasses)}
      >
        {emoji} {count}
        {label && ` ${label}`}
      </Badge>
    </SmartTooltip>
  );
}

function ToolbarStatsRow({
  inventory,
  totalQuantity,
  totalItems,
  searchQuery,
  onSearchChange,
  onMaxSlotsChange,
  readOnly,
}: ToolbarStatsRowProps) {
  const items = inventory?.items ?? [];
  const slotsFull =
    !inventory.unlimitedSlots && totalQuantity >= inventory.maxSlots;
  const equippedItems = items.filter(i => i.isEquipped).length;
  const customItems = items.filter(i => i.isCustom).length;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <SmartTooltip
          content={
            inventory.unlimitedSlots
              ? '♾️ Unlimited inventory slots'
              : `🎒 ${totalQuantity} of ${inventory.maxSlots} slots used`
          }
        >
          <Badge
            variant="outline"
            className={cn(
              'gap-1.5 px-2.5 py-1 text-sm font-medium',
              slotsFull
                ? 'border-red-300 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/50 dark:text-red-300'
                : 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-300'
            )}
          >
            🎒{' '}
            {inventory.unlimitedSlots
              ? `${totalQuantity}/∞`
              : `${totalQuantity}/${inventory.maxSlots}`}
          </Badge>
        </SmartTooltip>

        {!readOnly && onMaxSlotsChange && !inventory.unlimitedSlots && (
          <div className="flex items-center gap-0.5">
            <SmartTooltip content="➖ Decrease max slots">
              <Button
                variant="ghost"
                size="icon"
                className="size-6"
                onClick={() => onMaxSlotsChange(-1)}
                disabled={inventory.maxSlots <= totalQuantity}
              >
                <Minus className="size-3" />
              </Button>
            </SmartTooltip>
            <SmartTooltip content="➕ Increase max slots">
              <Button
                variant="ghost"
                size="icon"
                className="size-6"
                onClick={() => onMaxSlotsChange(1)}
              >
                <Plus className="size-3" />
              </Button>
            </SmartTooltip>
          </div>
        )}

        {totalItems > 0 && (
          <StatBadge
            count={totalItems}
            emoji="📦"
            label={totalItems !== 1 ? 'types' : 'type'}
            tooltip="📦 Unique item types"
          />
        )}

        <StatBadge
          count={equippedItems}
          emoji="⚔️"
          label=""
          tooltip="⚔️ Currently equipped"
          variant="green"
        />

        <StatBadge
          count={customItems}
          emoji="✨"
          label=""
          tooltip="✨ Custom/homebrew items"
          variant="purple"
        />
      </div>

      {onSearchChange && items.length > 5 && (
        <div className="relative w-full sm:w-auto">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            placeholder="🔍 Search items..."
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            className="w-full pl-9 sm:w-48"
          />
        </div>
      )}
    </div>
  );
}
