import { useCallback, useMemo, useState } from 'react';

import { ItemForm, type ItemFormData } from '@/components/homebrew';
import {
  CustomIcon,
  HomebrewIcon,
  type ModeOption,
  ModeTabs,
  StandardIcon,
} from '@/components/shared';
import { HomebrewSourceTabs } from '@/components/shared/homebrew-source-tabs';
import type { HomebrewSource } from '@/components/shared/homebrew-source-tabs/homebrew-source-tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { useIsMobile } from '@/hooks/use-mobile';
import { Backpack, Check, Wrench } from '@/lib/icons';
import type {
  AnyItem,
  EquipmentTier,
  InventoryItemEntry,
  Rarity,
} from '@/lib/schemas/equipment';
import type { ItemCategory } from '@/lib/schemas/homebrew';

import { ItemFilters } from './item-filters';
import { ItemPickerGrid } from './item-picker-grid';
import { ItemSearchHeader } from './item-search-header';
import { useHomebrewItemData } from './use-homebrew-item-data';
import {
  useItemFilters,
  useItemSelection,
  usePickerFiltersState,
  usePickerReset,
} from './use-item-picker';

// Mode type for the item picker tabs
type ItemPickerMode = 'official' | 'homebrew' | 'custom';

const ITEM_PICKER_MODES: ModeOption<ItemPickerMode>[] = [
  { value: 'official', label: 'Official', icon: <StandardIcon /> },
  { value: 'homebrew', label: 'Homebrew', icon: <HomebrewIcon /> },
  { value: 'custom', label: 'Custom', icon: <CustomIcon /> },
];

/** Convert ItemFormData to AnyItem */
function formDataToItem(data: ItemFormData): AnyItem {
  const validFeatures = data.features.filter(
    f => f.name.trim() && f.description.trim()
  );
  // Create a custom item with minimal required fields
  // The 'as unknown as AnyItem' is needed because AnyItem is a union type
  // and custom items don't fit neatly into any specific category
  return {
    id: `custom-${Date.now()}`,
    name: data.name.trim(),
    description: data.description ?? '',
    tier: data.tier as EquipmentTier,
    category: data.category as ItemCategory,
    rarity: data.rarity as Rarity,
    features: validFeatures,
    maxQuantity: data.maxQuantity ?? 1,
    isConsumable: data.isConsumable ?? false,
    isHomebrew: true,
  } as unknown as AnyItem;
}

interface ItemPickerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectItems: (items: AnyItem[]) => void;
  onAddCustomItem?: (item: AnyItem) => void;
  inventoryItems?: InventoryItemEntry[];
  unlimitedQuantity?: boolean;
  allowedTiers?: string[];
  campaignId?: string;
}

function PickerHeader({
  totalQuantity,
  mobile,
}: {
  totalQuantity: number;
  mobile: boolean;
}) {
  const Header = mobile ? DrawerHeader : DialogHeader;
  const Title = mobile ? DrawerTitle : DialogTitle;

  const titleContent = (
    <>
      <Backpack className="size-6" />
      Add Items to Inventory
      {totalQuantity > 0 && (
        <Badge className="bg-green-500">{totalQuantity} selected</Badge>
      )}
    </>
  );

  if (mobile) {
    return (
      <Header className="shrink-0">
        <Title className="flex flex-wrap items-center gap-2">
          {titleContent}
        </Title>
        <DrawerDescription className="sr-only">
          Browse and select items to add to your inventory
        </DrawerDescription>
      </Header>
    );
  }

  return (
    <Header className="shrink-0">
      <Title className="flex flex-wrap items-center gap-2">
        {titleContent}
      </Title>
      <DialogDescription className="sr-only">
        Browse and select items to add to your inventory
      </DialogDescription>
    </Header>
  );
}

function getEmptyHomebrewMessage(source: HomebrewSource): string {
  if (source === 'linked')
    return 'No homebrew items are linked to this campaign yet.';
  if (source === 'private')
    return "You haven't created any homebrew items yet.";
  if (source === 'quicklist')
    return "You haven't added any items to your quicklist.";
  return 'No public homebrew items found.';
}

function PickerFooter({
  totalQuantity,
  onCancel,
  onConfirm,
  disabled,
  mode,
}: {
  totalQuantity: number;
  onCancel: () => void;
  onConfirm: () => void;
  disabled: boolean;
  mode: ItemPickerMode;
}) {
  return (
    <div className="bg-background relative z-10 flex shrink-0 items-center justify-between gap-4 border-t pt-4">
      <span className="text-muted-foreground text-sm">
        {mode === 'custom' ? '' : `${totalQuantity} items selected`}
      </span>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          className="touch-manipulation"
          onClick={onCancel}
        >
          Cancel
        </Button>
        {mode !== 'custom' && (
          <Button
            type="button"
            className="touch-manipulation"
            disabled={disabled}
            onClick={onConfirm}
          >
            ✅ Add Items
          </Button>
        )}
      </div>
    </div>
  );
}

// -- Sub-components for each mode tab --

interface SharedPickerProps {
  tempSelected: Map<string, { item: AnyItem; quantity: number }>;
  onToggleItem: (item: AnyItem) => void;
  onQuantityChange: (item: AnyItem, delta: number, maxAllowed?: number) => void;
  inventoryItems: InventoryItemEntry[];
  unlimitedQuantity: boolean;
  allowedTiers?: string[];
}

interface OfficialModeContentProps extends SharedPickerProps {
  filters: ReturnType<typeof usePickerFiltersState>;
  filteredItems: AnyItem[];
}

function OfficialModeContent({
  filters,
  filteredItems,
  tempSelected,
  onToggleItem,
  onQuantityChange,
  inventoryItems,
  unlimitedQuantity,
  allowedTiers,
}: OfficialModeContentProps) {
  const handleToggleFilters = useCallback(
    () => filters.setShowFilters(v => !v),
    [filters]
  );

  return (
    <>
      <div className="shrink-0 space-y-4">
        <ItemSearchHeader
          search={filters.search}
          onSearchChange={filters.setSearch}
          showFilters={filters.showFilters}
          onToggleFilters={handleToggleFilters}
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
          onToggleItem={onToggleItem}
          onQuantityChange={onQuantityChange}
          inventoryItems={inventoryItems}
          unlimitedQuantity={unlimitedQuantity}
        />
      </div>
    </>
  );
}

interface HomebrewModeContentProps extends SharedPickerProps {
  homebrewData: ReturnType<typeof useHomebrewItemData>;
  showHomebrewFilters: boolean;
  onToggleHomebrewFilters: () => void;
}

function HomebrewModeContent({
  homebrewData,
  showHomebrewFilters,
  onToggleHomebrewFilters,
  tempSelected,
  onToggleItem,
  onQuantityChange,
  inventoryItems,
  unlimitedQuantity,
  allowedTiers,
}: HomebrewModeContentProps) {
  const homebrewItems = useMemo(
    () => homebrewData.filteredItems.map(h => h.item),
    [homebrewData.filteredItems]
  );

  return (
    <>
      <div className="shrink-0 space-y-4">
        <HomebrewSourceTabs
          activeSource={homebrewData.source}
          onSourceChange={homebrewData.setSource}
          hasCampaign={homebrewData.hasCampaign}
        />

        <ItemSearchHeader
          search={homebrewData.searchQuery}
          onSearchChange={homebrewData.setSearchQuery}
          showFilters={showHomebrewFilters}
          onToggleFilters={onToggleHomebrewFilters}
          activeFilterCount={homebrewData.activeFilterCount}
          onClearFilters={homebrewData.clearFilters}
        />

        {showHomebrewFilters && (
          <ItemFilters
            selectedCategories={homebrewData.selectedCategories}
            selectedRarities={homebrewData.selectedRarities}
            selectedTiers={homebrewData.selectedTiers}
            onToggleCategory={homebrewData.toggleCategory}
            onToggleRarity={homebrewData.toggleRarity}
            onToggleTier={homebrewData.toggleTier}
            allowedTiers={allowedTiers}
            lockTiers={false}
          />
        )}
      </div>

      <div className="mt-4 flex-1 touch-pan-y overflow-y-auto pr-2">
        <HomebrewItemsList
          isLoading={homebrewData.isLoading}
          items={homebrewItems}
          source={homebrewData.source}
          tempSelected={tempSelected}
          onToggleItem={onToggleItem}
          onQuantityChange={onQuantityChange}
          inventoryItems={inventoryItems}
          unlimitedQuantity={unlimitedQuantity}
        />
      </div>
    </>
  );
}

interface HomebrewItemsListProps {
  isLoading: boolean;
  items: AnyItem[];
  source: HomebrewSource;
  tempSelected: Map<string, { item: AnyItem; quantity: number }>;
  onToggleItem: (item: AnyItem) => void;
  onQuantityChange: (item: AnyItem, delta: number, maxAllowed?: number) => void;
  inventoryItems: InventoryItemEntry[];
  unlimitedQuantity: boolean;
}

function HomebrewItemsList({
  isLoading,
  items,
  source,
  tempSelected,
  onToggleItem,
  onQuantityChange,
  inventoryItems,
  unlimitedQuantity,
}: HomebrewItemsListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-muted h-32 animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center py-12 text-center">
        <Wrench className="text-muted-foreground mb-4 size-12 opacity-50" />
        <h3 className="mb-2 text-lg font-medium">No Homebrew Items</h3>
        <p className="text-muted-foreground max-w-sm text-sm">
          {getEmptyHomebrewMessage(source)}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="text-muted-foreground mb-2 text-sm">
        {items.length} homebrew items found
      </div>
      <ItemPickerGrid
        items={items}
        selectedItems={tempSelected}
        onToggleItem={onToggleItem}
        onQuantityChange={onQuantityChange}
        inventoryItems={inventoryItems}
        unlimitedQuantity={unlimitedQuantity}
      />
    </>
  );
}

interface CustomModeContentProps {
  onFormChange: (data: ItemFormData | null) => void;
  onSave: () => void;
  isValid: boolean;
}

function CustomModeContent({
  onFormChange,
  onSave,
  isValid,
}: CustomModeContentProps) {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="space-y-4 py-4">
        <div className="text-muted-foreground text-sm">
          Create a custom item with your own properties.
        </div>
        <ItemForm onChange={onFormChange} showActions={false} />
        <div className="flex justify-end pt-4">
          <Button onClick={onSave} disabled={!isValid} className="gap-1.5">
            <Check className="size-4" /> Create Item
          </Button>
        </div>
      </div>
    </div>
  );
}

// -- Main component --

export function ItemPickerModal({
  open,
  onOpenChange,
  onSelectItems,
  onAddCustomItem,
  inventoryItems = [],
  unlimitedQuantity = false,
  allowedTiers,
  campaignId,
}: ItemPickerModalProps) {
  const [mode, setMode] = useState<ItemPickerMode>('official');
  const [customFormData, setCustomFormData] = useState<ItemFormData | null>(
    null
  );
  const [showHomebrewFilters, setShowHomebrewFilters] = useState(false);

  const {
    tempSelected,
    toggleItem,
    handleQuantityChange,
    totalQuantity,
    getItemsArray,
    reset,
  } = useItemSelection();

  const filters = usePickerFiltersState({
    initialTiers: allowedTiers,
    lockTiers: Boolean(allowedTiers && allowedTiers.length > 0),
  });

  // Homebrew items data
  const homebrewData = useHomebrewItemData({ campaignId });

  usePickerReset(open, () => {
    reset();
    setMode('official');
    setCustomFormData(null);
    setShowHomebrewFilters(false);
    homebrewData.clearFilters();
  });

  const filteredItems = useItemFilters(
    filters.selectedCategories,
    filters.selectedRarities,
    filters.selectedTiers,
    filters.deferredSearch,
    allowedTiers
  );

  const handleCancel = useCallback(() => onOpenChange(false), [onOpenChange]);

  const handleConfirm = useCallback(() => {
    onSelectItems(getItemsArray());
    onOpenChange(false);
  }, [onSelectItems, getItemsArray, onOpenChange]);

  const handleCustomItemSave = useCallback(() => {
    if (customFormData && customFormData.name.trim() && onAddCustomItem) {
      onAddCustomItem(formDataToItem(customFormData));
      onOpenChange(false);
    }
  }, [customFormData, onAddCustomItem, onOpenChange]);

  const handleToggleHomebrewFilters = useCallback(
    () => setShowHomebrewFilters(v => !v),
    []
  );

  const isCustomValid = Boolean(customFormData?.name?.trim());

  const isMobile = useIsMobile();

  const sharedPickerProps: SharedPickerProps = {
    tempSelected,
    onToggleItem: toggleItem,
    onQuantityChange: handleQuantityChange,
    inventoryItems,
    unlimitedQuantity,
    allowedTiers,
  };

  const pickerBody = (
    <>
      <PickerHeader totalQuantity={totalQuantity} mobile={isMobile} />

      <ModeTabs
        modes={ITEM_PICKER_MODES}
        activeMode={mode}
        onModeChange={setMode}
        className="shrink-0"
      />

      {mode === 'official' && (
        <OfficialModeContent
          {...sharedPickerProps}
          filters={filters}
          filteredItems={filteredItems}
        />
      )}

      {mode === 'homebrew' && (
        <HomebrewModeContent
          {...sharedPickerProps}
          homebrewData={homebrewData}
          showHomebrewFilters={showHomebrewFilters}
          onToggleHomebrewFilters={handleToggleHomebrewFilters}
        />
      )}

      {mode === 'custom' && (
        <CustomModeContent
          onFormChange={setCustomFormData}
          onSave={handleCustomItemSave}
          isValid={isCustomValid}
        />
      )}

      <PickerFooter
        totalQuantity={totalQuantity}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
        disabled={tempSelected.size === 0}
        mode={mode}
      />
    </>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="flex max-h-[90vh] flex-col overflow-hidden px-4 pb-4">
          {pickerBody}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-full w-full flex-col overflow-hidden sm:h-auto sm:max-h-[90vh] sm:w-[98vw] sm:max-w-5xl lg:max-w-6xl">
        {pickerBody}
      </DialogContent>
    </Dialog>
  );
}
