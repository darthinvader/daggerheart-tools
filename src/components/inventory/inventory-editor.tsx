import { useMemo, useState } from 'react';

import { Card, CardContent } from '@/components/ui/card';
import type {
  AnyItem,
  InventoryItemEntry,
  InventoryState,
} from '@/lib/schemas/equipment';
import { generateId } from '@/lib/utils';
import { rankBy } from '@/utils/search/rank';

import { CustomItemForm } from './custom-item-form';
import { EmptyInventory } from './empty-inventory';
import { InventoryHeader } from './inventory-header';
import { InventoryTabs } from './inventory-tabs';
import { ItemPickerModal } from './item-picker-modal';

interface InventoryEditorProps {
  value?: InventoryState;
  onChange?: (value: InventoryState) => void;
}

const DEFAULT_STATE: InventoryState = { items: [], maxSlots: 50 };

function useInventoryActions(
  state: InventoryState,
  updateState: (updates: Partial<InventoryState>) => void,
  unlimitedQuantity: boolean = false
) {
  const handleAddItems = (items: AnyItem[]) => {
    const updatedItems = [...state.items];

    for (const item of items) {
      const existingIndex = updatedItems.findIndex(
        i => i.item.name === item.name && !i.isCustom
      );
      if (existingIndex >= 0) {
        const existing = updatedItems[existingIndex];
        const maxQty = unlimitedQuantity ? Infinity : existing.item.maxQuantity;
        updatedItems[existingIndex] = {
          ...existing,
          quantity: Math.min(maxQty, existing.quantity + 1),
        };
      } else {
        updatedItems.push({
          id: generateId(),
          item,
          quantity: 1,
          isEquipped: false,
          location: 'backpack',
        });
      }
    }

    updateState({ items: updatedItems });
  };

  const handleAddCustomItem = (item: AnyItem) => {
    updateState({
      items: [
        ...state.items,
        {
          id: generateId(),
          item,
          quantity: 1,
          isEquipped: false,
          location: 'backpack',
          isCustom: true,
        },
      ],
    });
  };

  const handleRemove = (id: string) =>
    updateState({ items: state.items.filter(i => i.id !== id) });

  const handleQuantityChange = (id: string, delta: number) => {
    updateState({
      items: state.items.map(i => {
        if (i.id !== id) return i;
        const maxQty = unlimitedQuantity ? Infinity : i.item.maxQuantity;
        return {
          ...i,
          quantity: Math.max(1, Math.min(maxQty, i.quantity + delta)),
        };
      }),
    });
  };

  const handleEquipToggle = (id: string) => {
    updateState({
      items: state.items.map(i =>
        i.id === id
          ? {
              ...i,
              isEquipped: !i.isEquipped,
              location: i.isEquipped ? 'backpack' : 'equipped',
            }
          : i
      ),
    });
  };

  const handleUpdateItem = (id: string, updatedItem: AnyItem) => {
    updateState({
      items: state.items.map(i =>
        i.id === id ? { ...i, item: updatedItem } : i
      ),
    });
  };

  return {
    handleAddItems,
    handleAddCustomItem,
    handleRemove,
    handleQuantityChange,
    handleEquipToggle,
    handleUpdateItem,
  };
}

function useFilteredItems(items: InventoryItemEntry[], searchQuery: string) {
  return useMemo(() => {
    if (!searchQuery.trim()) return items;
    return rankBy(items, searchQuery, [
      item => item.item.name,
      item => item.item.features?.map(f => f.name).join(' ') ?? '',
      item => ((item.item as { category?: string }).category as string) ?? '',
    ]);
  }, [items, searchQuery]);
}

export function InventoryEditor({ value, onChange }: InventoryEditorProps) {
  const [internalState, setInternalState] =
    useState<InventoryState>(DEFAULT_STATE);
  const state = value ?? internalState;

  const [pickerOpen, setPickerOpen] = useState(false);
  const [customFormOpen, setCustomFormOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [unlimitedSlots, setUnlimitedSlots] = useState(false);
  const [unlimitedQuantity, setUnlimitedQuantity] = useState(false);

  const updateState = (updates: Partial<InventoryState>) => {
    const newState = { ...state, ...updates };
    if (onChange) {
      onChange(newState);
    } else {
      setInternalState(newState);
    }
  };

  const actions = useInventoryActions(state, updateState, unlimitedQuantity);
  const filteredItems = useFilteredItems(state.items, searchQuery);

  const editingItem = editingItemId
    ? (state.items.find(i => i.id === editingItemId)?.item ?? null)
    : null;

  const handleEdit = (id: string) => {
    setEditingItemId(id);
    setCustomFormOpen(true);
  };

  const handleCustomFormClose = (open: boolean) => {
    setCustomFormOpen(open);
    if (!open) setEditingItemId(null);
  };

  const handleCustomFormSave = (item: AnyItem) => {
    if (editingItemId) {
      actions.handleUpdateItem(editingItemId, item);
    } else {
      actions.handleAddCustomItem(item);
    }
    setEditingItemId(null);
  };

  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const equippedItems = filteredItems.filter(i => i.isEquipped);

  return (
    <>
      <Card>
        <InventoryHeader
          totalItems={totalItems}
          maxSlots={state.maxSlots}
          unlimitedSlots={unlimitedSlots}
          unlimitedQuantity={unlimitedQuantity}
          onUnlimitedSlotsChange={setUnlimitedSlots}
          onUnlimitedQuantityChange={setUnlimitedQuantity}
          onMaxSlotsChange={delta =>
            updateState({ maxSlots: Math.max(1, state.maxSlots + delta) })
          }
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onCustomClick={() => setCustomFormOpen(true)}
          onAddClick={() => setPickerOpen(true)}
        />
        <CardContent>
          {state.items.length === 0 ? (
            <EmptyInventory
              onCustomClick={() => setCustomFormOpen(true)}
              onAddClick={() => setPickerOpen(true)}
            />
          ) : (
            <InventoryTabs
              items={filteredItems}
              equippedItems={equippedItems}
              onRemove={actions.handleRemove}
              onQuantityChange={actions.handleQuantityChange}
              onEquipToggle={actions.handleEquipToggle}
              onEdit={handleEdit}
              unlimitedQuantity={unlimitedQuantity}
            />
          )}
        </CardContent>
      </Card>

      <ItemPickerModal
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        onSelectItems={actions.handleAddItems}
        inventoryItems={state.items}
        unlimitedQuantity={unlimitedQuantity}
      />
      <CustomItemForm
        open={customFormOpen}
        onOpenChange={handleCustomFormClose}
        onSave={handleCustomFormSave}
        initialItem={editingItem}
      />
    </>
  );
}
