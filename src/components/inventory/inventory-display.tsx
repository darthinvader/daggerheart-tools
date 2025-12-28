import { useCallback, useState } from 'react';

import { EditableSection } from '@/components/shared/editable-section';
import type { InventoryState } from '@/lib/schemas/equipment';
import { cn } from '@/lib/utils';

import { InventoryContent } from './inventory-content';
import { InventoryEditor } from './inventory-editor';

interface InventoryDisplayProps {
  inventory: InventoryState;
  onChange?: (inventory: InventoryState) => void;
  className?: string;
  readOnly?: boolean;
}

export function InventoryDisplay({
  inventory,
  onChange,
  className,
  readOnly = false,
}: InventoryDisplayProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftInventory, setDraftInventory] =
    useState<InventoryState>(inventory);
  const [searchQuery, setSearchQuery] = useState('');

  const handleEditToggle = useCallback(() => {
    if (!isEditing) {
      setDraftInventory(inventory);
    }
    setIsEditing(prev => !prev);
  }, [isEditing, inventory]);

  const handleSave = useCallback(() => {
    onChange?.(draftInventory);
  }, [draftInventory, onChange]);

  const handleCancel = useCallback(() => {
    setDraftInventory(inventory);
  }, [inventory]);

  const handleChange = useCallback((newInventory: InventoryState) => {
    setDraftInventory(newInventory);
  }, []);

  const handleQuantityChange = useCallback(
    (id: string, delta: number) => {
      const updated: InventoryState = {
        ...inventory,
        items: inventory.items.map(item => {
          if (item.id !== id) return item;
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }),
      };
      onChange?.(updated);
    },
    [inventory, onChange]
  );

  const handleMaxSlotsChange = useCallback(
    (delta: number) => {
      const newMax = Math.max(
        inventory.items.length,
        inventory.maxSlots + delta
      );
      onChange?.({
        ...inventory,
        maxSlots: newMax,
      });
    },
    [inventory, onChange]
  );

  return (
    <EditableSection
      title="Inventory"
      emoji="🎒"
      isEditing={isEditing}
      onEditToggle={handleEditToggle}
      onSave={handleSave}
      onCancel={handleCancel}
      showEditButton={!readOnly}
      modalSize="xl"
      className={cn(className)}
      editTitle="Manage Inventory"
      editDescription="Add, remove, and organize items in your inventory."
      editContent={
        <InventoryEditor
          value={draftInventory}
          onChange={handleChange}
          hideHeader
        />
      }
    >
      <InventoryContent
        inventory={inventory}
        searchQuery={searchQuery}
        onSearchChange={readOnly ? undefined : setSearchQuery}
        onQuantityChange={readOnly ? undefined : handleQuantityChange}
        onMaxSlotsChange={readOnly ? undefined : handleMaxSlotsChange}
        readOnly={readOnly}
      />
    </EditableSection>
  );
}
