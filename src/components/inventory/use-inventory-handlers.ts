import { useCallback, useState } from 'react';

import type { AnyItem, InventoryState } from '@/lib/schemas/equipment';
import { generateId } from '@/lib/utils';

interface UseInventoryHandlersProps {
  inventory: InventoryState;
  onChange?: (inventory: InventoryState) => void;
}

function useQuantityHandler(
  inventory: InventoryState,
  onChange?: (inventory: InventoryState) => void
) {
  return useCallback(
    (id: string, delta: number) => {
      const updated: InventoryState = {
        ...inventory,
        items: inventory.items.map(item => {
          if (item.id !== id) return item;
          const maxQty = inventory.unlimitedQuantity
            ? Infinity
            : item.item.maxQuantity;
          const newQty = Math.max(1, Math.min(maxQty, item.quantity + delta));
          return { ...item, quantity: newQty };
        }),
      };
      onChange?.(updated);
    },
    [inventory, onChange]
  );
}

function useSlotHandlers(
  inventory: InventoryState,
  onChange?: (inventory: InventoryState) => void
) {
  const handleMaxSlotsChange = useCallback(
    (delta: number) => {
      const totalQuantity = inventory.items.reduce(
        (sum, i) => sum + i.quantity,
        0
      );
      const newMax = Math.max(totalQuantity, inventory.maxSlots + delta);
      onChange?.({ ...inventory, maxSlots: newMax });
    },
    [inventory, onChange]
  );

  const handleUnlimitedSlotsChange = useCallback(
    (value: boolean) => {
      onChange?.({ ...inventory, unlimitedSlots: value });
    },
    [inventory, onChange]
  );

  const handleUnlimitedQuantityChange = useCallback(
    (value: boolean) => {
      onChange?.({ ...inventory, unlimitedQuantity: value });
    },
    [inventory, onChange]
  );

  return {
    handleMaxSlotsChange,
    handleUnlimitedSlotsChange,
    handleUnlimitedQuantityChange,
  };
}

function useItemHandlers(
  inventory: InventoryState,
  onChange?: (inventory: InventoryState) => void
) {
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [pickerHomebrewItem, setPickerHomebrewItem] = useState<AnyItem | null>(
    null
  );

  const handleRemove = useCallback(
    (id: string) => {
      onChange?.({
        ...inventory,
        items: inventory.items.filter(item => item.id !== id),
      });
    },
    [inventory, onChange]
  );

  const handleConvertToHomebrew = useCallback((id: string) => {
    setEditingItemId(id);
  }, []);

  const handlePickerConvertToHomebrew = useCallback((item: AnyItem) => {
    setPickerHomebrewItem(item);
  }, []);

  const handleAddItems = useCallback(
    (items: AnyItem[]) => {
      const updatedItems = [...inventory.items];
      let currentTotalQuantity = updatedItems.reduce(
        (sum, i) => sum + i.quantity,
        0
      );

      for (const item of items) {
        if (
          !inventory.unlimitedSlots &&
          currentTotalQuantity >= inventory.maxSlots
        ) {
          break;
        }

        const existingIndex = updatedItems.findIndex(
          i => i.item.name === item.name && !i.isCustom
        );
        if (existingIndex >= 0) {
          const existing = updatedItems[existingIndex];
          const maxQty = inventory.unlimitedQuantity
            ? Infinity
            : existing.item.maxQuantity;
          const newQty = Math.min(maxQty, existing.quantity + 1);
          if (newQty > existing.quantity) {
            updatedItems[existingIndex] = { ...existing, quantity: newQty };
            currentTotalQuantity++;
          }
        } else {
          updatedItems.push({
            id: generateId(),
            item,
            quantity: 1,
            isEquipped: false,
            location: 'backpack',
          });
          currentTotalQuantity++;
        }
      }

      onChange?.({ ...inventory, items: updatedItems });
    },
    [inventory, onChange]
  );

  const handleAddCustomItem = useCallback(
    (item: AnyItem) => {
      if (editingItemId) {
        onChange?.({
          ...inventory,
          items: inventory.items.map(i =>
            i.id === editingItemId ? { ...i, item } : i
          ),
        });
      } else {
        onChange?.({
          ...inventory,
          items: [
            ...inventory.items,
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
      }
      setEditingItemId(null);
    },
    [inventory, onChange, editingItemId]
  );

  const editingItem = editingItemId
    ? (inventory.items.find(i => i.id === editingItemId)?.item ?? null)
    : pickerHomebrewItem;

  return {
    editingItem,
    editingItemId,
    setEditingItemId,
    pickerHomebrewItem,
    setPickerHomebrewItem,
    handleRemove,
    handleConvertToHomebrew,
    handlePickerConvertToHomebrew,
    handleAddItems,
    handleAddCustomItem,
  };
}

export function useInventoryHandlers({
  inventory,
  onChange,
}: UseInventoryHandlersProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [customFormOpen, setCustomFormOpen] = useState(false);

  const handleQuantityChange = useQuantityHandler(inventory, onChange);
  const slotHandlers = useSlotHandlers(inventory, onChange);
  const itemHandlers = useItemHandlers(inventory, onChange);

  const handleConvertToHomebrew = useCallback(
    (id: string) => {
      itemHandlers.handleConvertToHomebrew(id);
      itemHandlers.setEditingItemId(id);
      setCustomFormOpen(true);
    },
    [itemHandlers]
  );

  const handlePickerConvertToHomebrew = useCallback(
    (item: AnyItem) => {
      itemHandlers.handlePickerConvertToHomebrew(item);
      itemHandlers.setPickerHomebrewItem(item);
      setPickerOpen(false);
      setCustomFormOpen(true);
    },
    [itemHandlers]
  );

  const handleCustomFormClose = useCallback(
    (open: boolean) => {
      setCustomFormOpen(open);
      if (!open) {
        itemHandlers.setEditingItemId(null);
        itemHandlers.setPickerHomebrewItem(null);
      }
    },
    [itemHandlers]
  );

  return {
    pickerOpen,
    setPickerOpen,
    customFormOpen,
    editingItem: itemHandlers.editingItem,
    handleQuantityChange,
    handleMaxSlotsChange: slotHandlers.handleMaxSlotsChange,
    handleUnlimitedSlotsChange: slotHandlers.handleUnlimitedSlotsChange,
    handleUnlimitedQuantityChange: slotHandlers.handleUnlimitedQuantityChange,
    handleRemove: itemHandlers.handleRemove,
    handleConvertToHomebrew,
    handlePickerConvertToHomebrew,
    handleAddItems: itemHandlers.handleAddItems,
    handleAddCustomItem: itemHandlers.handleAddCustomItem,
    handleCustomFormClose,
  };
}
