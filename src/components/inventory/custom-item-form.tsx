/**
 * Custom Item Form Dialog - Inventory Page Wrapper
 *
 * Thin wrapper that uses the unified ItemForm from the homebrew module.
 * Presents the form in a dialog for creating/editing inventory items.
 */
import { useMemo, useState } from 'react';

import { ItemForm, type ItemFormData } from '@/components/homebrew';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Check, Pencil, Save, Wrench } from '@/lib/icons';
import type { AnyItem, EquipmentTier, Rarity } from '@/lib/schemas/equipment';
import type { ItemCategory } from '@/lib/schemas/homebrew';

interface CustomItemFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (item: AnyItem) => void;
  initialItem?: AnyItem | null;
}

/** Convert AnyItem to ItemFormData */
function itemToFormData(
  item: AnyItem | null | undefined
): ItemFormData | undefined {
  if (!item) return undefined;
  return {
    name: item.name,
    description: (item as { description?: string }).description ?? '',
    tier: item.tier as EquipmentTier | undefined,
    category:
      ((item as { category?: string }).category as ItemCategory) ?? 'Utility',
    rarity: (item.rarity as Rarity) ?? 'Common',
    features: item.features ?? [],
    maxQuantity: item.maxQuantity ?? 1,
    isConsumable: (item as { isConsumable?: boolean }).isConsumable ?? false,
    isHomebrew: true,
  };
}

/** Convert ItemFormData to AnyItem */
function formDataToItem(data: ItemFormData): AnyItem {
  const validFeatures = data.features.filter(
    f => f.name.trim() && f.description.trim()
  );
  return {
    name: data.name.trim(),
    tier: data.tier as EquipmentTier,
    rarity: data.rarity,
    category: data.category,
    description: data.description?.trim() || undefined,
    features: validFeatures,
    isConsumable: data.isConsumable,
    maxQuantity: data.maxQuantity,
  } as AnyItem;
}

export function CustomItemForm({
  open,
  onOpenChange,
  onSave,
  initialItem,
}: CustomItemFormProps) {
  const isEditing = !!initialItem;
  const initialData = useMemo(() => itemToFormData(initialItem), [initialItem]);

  // Track form data and validity as state
  const [formData, setFormData] = useState<ItemFormData | null>(null);
  const isValid = formData?.name?.trim();

  const handleChange = (data: ItemFormData) => {
    setFormData(data);
  };

  const handleSave = () => {
    if (formData && formData.name.trim()) {
      onSave(formDataToItem(formData));
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-full w-full flex-col overflow-y-auto sm:h-auto sm:max-h-[90vh] sm:w-[98vw] sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isEditing ? (
              <Pencil className="size-6" />
            ) : (
              <Wrench className="size-6" />
            )}
            {isEditing ? 'Edit Item' : 'Create Custom Item'}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {isEditing
              ? 'Edit your custom item properties'
              : 'Create a new custom item with your own properties'}
          </DialogDescription>
        </DialogHeader>

        <ItemForm
          initialData={initialData}
          onChange={handleChange}
          showActions={false}
        />

        <div className="flex justify-end gap-2 border-t pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!isValid} className="gap-1.5">
            {isEditing ? (
              <>
                <Save className="size-4" /> Save Changes
              </>
            ) : (
              <>
                <Check className="size-4" /> Create Item
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
