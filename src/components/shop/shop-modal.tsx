import { useCallback, useMemo, useState } from 'react';

import { ItemFilters } from '@/components/inventory/item-filters';
import { ItemPickerGrid } from '@/components/inventory/item-picker-grid';
import { ItemSearchHeader } from '@/components/inventory/item-search-header';
import {
  useItemFilters,
  useItemSelection,
  usePickerFiltersState,
  usePickerReset,
} from '@/components/inventory/use-item-picker';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatGoldAmount } from '@/features/shop/gold-math';
import { usePurchaseHandler } from '@/features/shop/use-purchase-handler';
import type { CartEntry } from '@/features/shop/use-shop-cart';
import { useShopPricing } from '@/features/shop/use-shop-pricing';
import type { ShopSettings } from '@/lib/schemas/campaign';
import type { Gold } from '@/lib/schemas/character-state';
import type { InventoryState } from '@/lib/schemas/equipment';

import { CheckoutPanel } from './checkout-panel';

export interface ShopModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gold: Gold;
  setGold: (gold: Gold) => void;
  inventory: InventoryState;
  setInventory: (inventory: InventoryState) => void;
  pushUndo?: (label: string) => void;
  shopSettings?: ShopSettings;
  campaignName?: string;
}

export function ShopModal({
  open,
  onOpenChange,
  gold,
  setGold,
  inventory,
  setInventory,
  pushUndo,
  shopSettings,
  campaignName,
}: ShopModalProps) {
  const [purchaseError, setPurchaseError] = useState<string>();

  // Reuse existing inventory filter hooks
  const filterState = usePickerFiltersState();
  const filteredItems = useItemFilters(
    filterState.selectedCategories,
    filterState.selectedRarities,
    filterState.selectedTiers,
    filterState.search
  );

  // Pricing — build a formatted price map for display on cards
  const pricingConfig = shopSettings ?? {};
  const prices = useShopPricing(filteredItems, pricingConfig);

  const priceMap = useMemo(() => {
    const m = new Map<string, string>();
    for (const [name, resolved] of prices) {
      m.set(name, formatGoldAmount(resolved.handfuls));
    }
    return m;
  }, [prices]);

  // Use the same selection hook as the item picker — selected items = cart
  const currentInventoryQuantity = inventory.items.reduce(
    (sum, i) => sum + i.quantity,
    0
  );
  const availableSlots = inventory.unlimitedSlots
    ? Infinity
    : Math.max(0, inventory.maxSlots - currentInventoryQuantity);

  const {
    tempSelected,
    toggleItem,
    handleQuantityChange,
    totalQuantity,
    reset,
  } = useItemSelection(availableSlots);

  usePickerReset(open, () => {
    reset();
    setPurchaseError(undefined);
    filterState.clearFilters();
  });

  // Purchase handler
  const { purchase } = usePurchaseHandler({
    gold,
    inventory,
    setGold,
    setInventory,
    pushUndo,
    onSuccess: () => {
      reset();
      setPurchaseError(undefined);
    },
  });

  // Convert selection map to CartEntry[] for the checkout panel
  const cartEntries = useMemo<CartEntry[]>(() => {
    const entries: CartEntry[] = [];
    for (const [, { item, quantity }] of tempSelected) {
      const price = prices.get(item.name);
      if (price) {
        entries.push({ item, quantity, unitPrice: price.handfuls });
      }
    }
    return entries;
  }, [tempSelected, prices]);

  const totalPrice = cartEntries.reduce(
    (sum, e) => sum + e.unitPrice * e.quantity,
    0
  );

  const handlePurchase = useCallback(() => {
    const result = purchase(cartEntries);
    if (!result.success) {
      setPurchaseError(result.error);
    }
  }, [purchase, cartEntries]);

  const handleUpdateQuantity = useCallback(
    (itemName: string, quantity: number) => {
      const entry = tempSelected.get(itemName);
      if (!entry) return;
      if (quantity <= 0) {
        toggleItem(entry.item);
      } else {
        const delta = quantity - entry.quantity;
        const maxAllowed = inventory.unlimitedQuantity ? Infinity : undefined;
        handleQuantityChange(entry.item, delta, maxAllowed);
      }
    },
    [
      tempSelected,
      toggleItem,
      handleQuantityChange,
      inventory.unlimitedQuantity,
    ]
  );

  const handleRemoveFromCart = useCallback(
    (itemName: string) => {
      const entry = tempSelected.get(itemName);
      if (entry) toggleItem(entry.item);
    },
    [tempSelected, toggleItem]
  );

  const activeFilterCount =
    filterState.selectedCategories.length +
    filterState.selectedRarities.length +
    filterState.selectedTiers.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-full w-full flex-col gap-0 overflow-hidden p-0 sm:h-auto sm:max-h-[90vh] sm:w-[98vw] sm:max-w-5xl lg:max-w-6xl">
        <DialogHeader className="border-b px-6 py-4">
          <DialogTitle className="flex items-center gap-2">
            Shop
            {campaignName && (
              <span className="text-muted-foreground text-sm font-normal">
                — {campaignName}
              </span>
            )}
          </DialogTitle>
          <DialogDescription>
            Browse items and add them to your cart. Gold will be deducted on
            purchase.
          </DialogDescription>
        </DialogHeader>

        <div className="flex min-h-0 flex-1 overflow-hidden">
          {/* Left: Browse items — same layout as ItemPickerModal */}
          <div className="flex min-h-0 flex-1 flex-col border-r">
            <div className="shrink-0 border-b px-4 py-3">
              <ItemSearchHeader
                search={filterState.search}
                onSearchChange={filterState.setSearch}
                showFilters={filterState.showFilters}
                onToggleFilters={() =>
                  filterState.setShowFilters(!filterState.showFilters)
                }
                activeFilterCount={activeFilterCount}
                onClearFilters={filterState.clearFilters}
              />
              {filterState.showFilters && (
                <div className="mt-3">
                  <ItemFilters
                    selectedCategories={filterState.selectedCategories}
                    selectedRarities={filterState.selectedRarities}
                    selectedTiers={filterState.selectedTiers}
                    onToggleCategory={filterState.toggleCategory}
                    onToggleRarity={filterState.toggleRarity}
                    onToggleTier={filterState.toggleTier}
                  />
                </div>
              )}
            </div>

            <ScrollArea className="min-h-0 flex-1 px-4 py-2">
              <div className="text-muted-foreground mb-2 text-sm">
                {filteredItems.length} items found
              </div>
              <ItemPickerGrid
                items={filteredItems}
                selectedItems={tempSelected}
                onToggleItem={toggleItem}
                onQuantityChange={handleQuantityChange}
                inventoryItems={inventory.items}
                unlimitedQuantity={inventory.unlimitedQuantity}
                priceMap={priceMap}
              />
            </ScrollArea>
          </div>

          {/* Right: Checkout panel */}
          <div className="flex w-72 shrink-0 flex-col p-4">
            <CheckoutPanel
              entries={cartEntries}
              totalPrice={totalPrice}
              totalItems={totalQuantity}
              gold={gold}
              onUpdateQuantity={handleUpdateQuantity}
              onRemove={handleRemoveFromCart}
              onClear={reset}
              onPurchase={handlePurchase}
              purchaseError={purchaseError}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
