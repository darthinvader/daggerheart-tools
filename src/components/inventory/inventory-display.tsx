import { useState } from 'react';

import type { InventoryState } from '@/lib/schemas/equipment';
import { cn } from '@/lib/utils';

import { CustomItemForm } from './custom-item-form';
import { InventoryContent } from './inventory-content';
import { ItemPickerModal } from './item-picker-modal';
import { useInventoryHandlers } from './use-inventory-handlers';

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
  const [searchQuery, setSearchQuery] = useState('');

  const {
    pickerOpen,
    setPickerOpen,
    customFormOpen,
    editingItem,
    handleQuantityChange,
    handleMaxSlotsChange,
    handleUnlimitedSlotsChange,
    handleUnlimitedQuantityChange,
    handleRemove,
    handleConvertToHomebrew,
    handlePickerConvertToHomebrew,
    handleAddItems,
    handleAddCustomItem,
    handleCustomFormClose,
  } = useInventoryHandlers({ inventory, onChange });

  return (
    <section
      className={cn(
        'bg-card hover:border-primary/20 rounded-xl border shadow-sm transition-colors',
        className
      )}
    >
      <div className="flex items-center justify-between border-b px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <span className="text-xl">🎒</span>
          <h3 className="text-lg font-semibold">Inventory</h3>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        <InventoryContent
          inventory={inventory}
          searchQuery={searchQuery}
          onSearchChange={readOnly ? undefined : setSearchQuery}
          onQuantityChange={readOnly ? undefined : handleQuantityChange}
          onRemove={readOnly ? undefined : handleRemove}
          onConvertToHomebrew={readOnly ? undefined : handleConvertToHomebrew}
          onMaxSlotsChange={readOnly ? undefined : handleMaxSlotsChange}
          onUnlimitedSlotsChange={
            readOnly ? undefined : handleUnlimitedSlotsChange
          }
          onUnlimitedQuantityChange={
            readOnly ? undefined : handleUnlimitedQuantityChange
          }
          onAddClick={readOnly ? undefined : () => setPickerOpen(true)}
          onCustomClick={
            readOnly ? undefined : () => handleCustomFormClose(true)
          }
          readOnly={readOnly}
        />
      </div>

      <ItemPickerModal
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        onSelectItems={handleAddItems}
        inventoryItems={inventory.items}
        unlimitedQuantity={inventory.unlimitedQuantity}
        unlimitedSlots={inventory.unlimitedSlots}
        maxSlots={inventory.maxSlots}
        onConvertToHomebrew={handlePickerConvertToHomebrew}
      />
      <CustomItemForm
        open={customFormOpen}
        onOpenChange={handleCustomFormClose}
        onSave={handleAddCustomItem}
        initialItem={editingItem}
      />
    </section>
  );
}
