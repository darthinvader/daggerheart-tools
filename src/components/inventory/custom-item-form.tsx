import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { AnyItem } from '@/lib/schemas/equipment';

import {
  ItemPreviewBadge,
  QuantityConsumableRow,
} from './custom-item-subcomponents';
import { FeatureListEditor } from './feature-list-editor';
import { ItemPropertySelectors } from './item-property-selectors';
import { useCustomItemForm } from './use-custom-item-form';

interface CustomItemFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (item: AnyItem) => void;
  initialItem?: AnyItem | null;
}

export function CustomItemForm({
  open,
  onOpenChange,
  onSave,
  initialItem,
}: CustomItemFormProps) {
  const form = useCustomItemForm(initialItem);
  const isEditing = !!initialItem;

  const handleSave = () => {
    onSave(form.buildItem());
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-auto max-h-[90vh] w-[95vw] max-w-3xl flex-col overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-2xl">{isEditing ? '✏️' : '🛠️'}</span>
            {isEditing ? 'Edit Item' : 'Create Custom Item'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <ItemPreviewBadge
            name={form.name}
            category={form.category}
            rarity={form.rarity}
            tier={form.tier}
          />

          <div className="space-y-2">
            <Label htmlFor="item-name">📝 Name *</Label>
            <Input
              id="item-name"
              placeholder="Enter item name..."
              value={form.name}
              onChange={e => form.setField('name', e.target.value)}
            />
          </div>

          <ItemPropertySelectors
            category={form.category}
            rarity={form.rarity}
            tier={form.tier}
            onCategoryChange={v => form.setField('category', v)}
            onRarityChange={v => form.setField('rarity', v)}
            onTierChange={v => form.setField('tier', v)}
          />

          <QuantityConsumableRow
            maxQuantity={form.maxQuantity}
            isConsumable={form.isConsumable}
            onMaxQuantityChange={v => form.setField('maxQuantity', v)}
            onConsumableChange={v => form.setField('isConsumable', v)}
          />

          <div className="space-y-2">
            <Label htmlFor="description">📖 Description</Label>
            <Textarea
              id="description"
              placeholder="Optional item description..."
              value={form.description}
              onChange={e => form.setField('description', e.target.value)}
              rows={2}
            />
          </div>

          <FeatureListEditor
            features={form.features}
            onAdd={form.addFeature}
            onUpdate={form.updateFeature}
            onRemove={form.removeFeature}
          />
        </div>

        <div className="flex justify-end gap-2 border-t pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!form.isValid}>
            {isEditing ? '💾 Save Changes' : '✅ Create Item'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
