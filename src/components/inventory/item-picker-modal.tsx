import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AlertTriangle, Backpack, Ban, Package } from '@/lib/icons';
import type { AnyItem, InventoryItemEntry } from '@/lib/schemas/equipment';

import { ItemFilters } from './item-filters';
import { ItemPickerGrid } from './item-picker-grid';
import { ItemSearchHeader } from './item-search-header';
import {
  useItemFilters,
  useItemSelection,
  usePickerFiltersState,
  usePickerReset,
} from './use-item-picker';

interface ItemPickerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectItems: (items: AnyItem[]) => void;
  inventoryItems?: InventoryItemEntry[];
  unlimitedQuantity?: boolean;
  unlimitedSlots?: boolean;
  maxSlots?: number;
  onConvertToHomebrew?: (item: AnyItem) => void;
  allowedTiers?: string[];
}

function PickerHeader({
  totalQuantity,
  slotsRemaining,
  isAtCapacity,
  unlimitedSlots,
}: {
  totalQuantity: number;
  slotsRemaining: number;
  isAtCapacity: boolean;
  unlimitedSlots: boolean;
}) {
  return (
    <DialogHeader className="shrink-0">
      <DialogTitle className="flex flex-wrap items-center gap-2">
        <Backpack className="size-6" />
        Add Items to Inventory
        {totalQuantity > 0 && (
          <Badge className="bg-green-500">{totalQuantity} selected</Badge>
        )}
        {!unlimitedSlots && (
          <Badge
            variant="outline"
            className={
              isAtCapacity
                ? 'border-red-300 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/50 dark:text-red-300'
                : 'border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-300'
            }
          >
            {slotsRemaining <= 0 ? (
              <span className="flex items-center gap-1">
                <Ban className="size-3" /> Full
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <Package className="size-3" /> {slotsRemaining} slots left
              </span>
            )}
          </Badge>
        )}
      </DialogTitle>
      <DialogDescription className="sr-only">
        Browse and select items to add to your inventory
      </DialogDescription>
    </DialogHeader>
  );
}

function CapacityWarning({ maxSlots }: { maxSlots: number }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-700 dark:bg-amber-950/50 dark:text-amber-200">
      <AlertTriangle className="size-5 shrink-0" />
      <div>
        <span className="font-medium">Inventory Full!</span> You've reached your
        maximum of <strong>{maxSlots} slots</strong>. Remove items or enable{' '}
        <strong>∞ Slots</strong> to add more.
      </div>
    </div>
  );
}

function PickerFooter({
  totalQuantity,
  onCancel,
  onConfirm,
  disabled,
}: {
  totalQuantity: number;
  onCancel: () => void;
  onConfirm: () => void;
  disabled: boolean;
}) {
  return (
    <div className="bg-background relative z-10 flex shrink-0 items-center justify-between gap-4 border-t pt-4">
      <span className="text-muted-foreground text-sm">
        {totalQuantity} items selected
      </span>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          className="touch-manipulation"
          onPointerUp={e => {
            e.preventDefault();
            onCancel();
          }}
        >
          Cancel
        </Button>
        <Button
          type="button"
          className="touch-manipulation"
          disabled={disabled}
          onPointerUp={e => {
            e.preventDefault();
            if (!disabled) onConfirm();
          }}
        >
          ✅ Add Items
        </Button>
      </div>
    </div>
  );
}

export function ItemPickerModal({
  open,
  onOpenChange,
  onSelectItems,
  inventoryItems = [],
  unlimitedQuantity = false,
  unlimitedSlots = false,
  maxSlots = 50,
  onConvertToHomebrew,
  allowedTiers,
}: ItemPickerModalProps) {
  const currentInventoryQuantity = inventoryItems.reduce(
    (sum, i) => sum + i.quantity,
    0
  );
  const availableSlots = unlimitedSlots
    ? Infinity
    : Math.max(0, maxSlots - currentInventoryQuantity);

  const {
    tempSelected,
    toggleItem,
    handleQuantityChange,
    totalQuantity,
    getItemsArray,
    reset,
  } = useItemSelection(availableSlots);

  const filters = usePickerFiltersState({
    initialTiers: allowedTiers,
    lockTiers: Boolean(allowedTiers && allowedTiers.length > 0),
  });

  usePickerReset(open, reset);

  const filteredItems = useItemFilters(
    filters.selectedCategories,
    filters.selectedRarities,
    filters.selectedTiers,
    filters.search,
    allowedTiers
  );

  const slotsRemaining = unlimitedSlots
    ? Infinity
    : availableSlots - totalQuantity;
  const isAtCapacity = !unlimitedSlots && slotsRemaining <= 0;

  const handleConfirm = () => {
    onSelectItems(getItemsArray());
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] w-[98vw] max-w-5xl flex-col overflow-hidden sm:max-w-5xl lg:max-w-6xl">
        <PickerHeader
          totalQuantity={totalQuantity}
          slotsRemaining={slotsRemaining}
          isAtCapacity={isAtCapacity}
          unlimitedSlots={unlimitedSlots}
        />

        {isAtCapacity && <CapacityWarning maxSlots={maxSlots} />}

        <div className="shrink-0 space-y-4">
          <ItemSearchHeader
            search={filters.search}
            onSearchChange={filters.setSearch}
            showFilters={filters.showFilters}
            onToggleFilters={() => filters.setShowFilters(v => !v)}
            activeFilterCount={filters.activeFilterCount}
            onClearFilters={filters.clearFilters}
          />
          {filters.showFilters && (
            <ItemFilters
              selectedCategories={filters.selectedCategories}
              selectedRarities={filters.selectedRarities}
              selectedTiers={filters.selectedTiers}
              onToggleCategory={filters.toggleCategory}
              onToggleRarity={filters.toggleRarity}
              onToggleTier={filters.toggleTier}
              allowedTiers={allowedTiers}
              lockTiers={filters.lockTiers}
            />
          )}
        </div>

        <div className="mt-4 flex-1 touch-pan-y overflow-y-auto pr-2">
          <div className="text-muted-foreground mb-2 text-sm">
            {filteredItems.length} items found
          </div>
          <ItemPickerGrid
            items={filteredItems}
            selectedItems={tempSelected}
            onToggleItem={toggleItem}
            onQuantityChange={handleQuantityChange}
            inventoryItems={inventoryItems}
            unlimitedQuantity={unlimitedQuantity}
            onConvertToHomebrew={onConvertToHomebrew}
          />
        </div>

        <PickerFooter
          totalQuantity={totalQuantity}
          onCancel={() => onOpenChange(false)}
          onConfirm={handleConfirm}
          disabled={tempSelected.size === 0}
        />
      </DialogContent>
    </Dialog>
  );
}
