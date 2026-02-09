/**
 * Homebrew Item Form
 *
 * Form for creating and editing homebrew general items.
 * Unified with inventory custom item form - includes inventory management fields.
 */
import { useCallback } from 'react';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

import {
  CATEGORY_COLORS,
  ItemBasicInfoSection,
  ItemClassificationSection,
  ItemFeaturesSection,
  ItemInventorySection,
  ItemModifiersSection,
} from './item-form-sections';
import { type ItemFormData, useItemFormState } from './use-item-form-state';

// Re-export for backwards compatibility
export type { ItemFormData } from './use-item-form-state';

interface ItemFormProps {
  initialData?: ItemFormData;
  /** Called on form submit (dialog mode) */
  onSubmit?: (data: ItemFormData) => void;
  /** Called on cancel (dialog mode) */
  onCancel?: () => void;
  /** Called on every change (inline mode) */
  onChange?: (data: ItemFormData) => void;
  isSubmitting?: boolean;
  /** Show submit/cancel buttons (default: true, set false for inline mode) */
  showActions?: boolean;
}

export function ItemForm({
  initialData,
  onSubmit,
  onCancel,
  onChange,
  isSubmitting = false,
  showActions = true,
}: ItemFormProps) {
  const {
    formData,
    features,
    buildCurrentData,
    updateField,
    updateOptionalString,
    updateMaxQuantity,
    toggleConsumable,
    addFeature,
    removeFeature,
    updateFeature,
  } = useItemFormState(initialData, onChange);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (onSubmit) {
        onSubmit(buildCurrentData());
      }
    },
    [onSubmit, buildCurrentData]
  );

  const handleModifiersChange = useCallback(
    (modifiers: ItemFormData['modifiers']) => {
      updateField('modifiers', modifiers);
    },
    [updateField]
  );

  // Get color based on current category
  const categoryStyle =
    CATEGORY_COLORS[formData.category] ?? CATEGORY_COLORS.Utility;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ScrollArea className="h-[60vh] pr-4">
        <div className="space-y-6">
          <ItemBasicInfoSection
            name={formData.name}
            description={formData.description ?? ''}
            categoryStyle={categoryStyle}
            updateField={updateField}
          />

          <Separator />

          <ItemClassificationSection
            category={formData.category}
            rarity={formData.rarity}
            tier={formData.tier}
            value={formData.value}
            weight={formData.weight}
            updateField={updateField}
            updateOptionalString={updateOptionalString}
          />

          <Separator />

          <ItemInventorySection
            maxQuantity={formData.maxQuantity}
            isConsumable={formData.isConsumable}
            updateMaxQuantity={updateMaxQuantity}
            toggleConsumable={toggleConsumable}
          />

          <Separator />

          <ItemFeaturesSection
            features={features}
            addFeature={addFeature}
            removeFeature={removeFeature}
            updateFeature={updateFeature}
          />

          <Separator />

          <ItemModifiersSection
            modifiers={formData.modifiers}
            onChange={handleModifiersChange}
          />
        </div>
      </ScrollArea>

      {showActions && (
        <>
          <Separator />

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !formData.name.trim()}
            >
              {isSubmitting ? 'Saving...' : 'Save Item'}
            </Button>
          </div>
        </>
      )}
    </form>
  );
}
