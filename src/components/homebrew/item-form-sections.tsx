/**
 * Item Form Section Components
 *
 * Extracted section components for the item form to reduce complexity.
 */
import { Coins, Package, Plus, Sparkles, Tag, Trash2 } from 'lucide-react';

import { FeatureModifiersSection } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { TIERS } from '@/lib/constants';
import type { FeatureStatModifiers } from '@/lib/schemas/core';
import type { Rarity } from '@/lib/schemas/equipment';
import type { ItemCategory } from '@/lib/schemas/homebrew';

import type { FeatureState, ItemFormData } from './use-item-form-state';

// =====================================================================================
// Constants
// =====================================================================================

export const CATEGORY_COLORS: Record<
  string,
  { bg: string; border: string; text: string }
> = {
  Utility: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    text: 'text-blue-500',
  },
  Consumable: {
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
    text: 'text-green-500',
  },
  Relic: {
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    text: 'text-purple-500',
  },
  'Weapon Modification': {
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    text: 'text-red-500',
  },
  'Armor Modification': {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    text: 'text-amber-500',
  },
  Recipe: {
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
    text: 'text-cyan-500',
  },
};

export const ITEM_CATEGORIES: Array<{
  value: ItemCategory;
  label: string;
  icon: string;
}> = [
  { value: 'Utility', label: 'Utility', icon: '🔧' },
  { value: 'Consumable', label: 'Consumable', icon: '🧪' },
  { value: 'Relic', label: 'Relic', icon: '✨' },
  { value: 'Weapon Modification', label: 'Weapon Mod', icon: '⚔️' },
  { value: 'Armor Modification', label: 'Armor Mod', icon: '🛡️' },
  { value: 'Recipe', label: 'Recipe', icon: '📜' },
];

export const RARITIES: Array<{ value: Rarity; label: string; color: string }> =
  [
    { value: 'Common', label: 'Common', color: 'text-gray-500' },
    { value: 'Uncommon', label: 'Uncommon', color: 'text-emerald-500' },
    { value: 'Rare', label: 'Rare', color: 'text-blue-500' },
    { value: 'Legendary', label: 'Legendary', color: 'text-purple-500' },
  ];

export { TIERS };

// =====================================================================================
// ItemBasicInfoSection
// =====================================================================================

interface ItemBasicInfoSectionProps {
  name: string;
  description: string;
  categoryStyle: { bg: string; border: string; text: string };
  updateField: <K extends keyof ItemFormData>(
    key: K,
    value: ItemFormData[K]
  ) => void;
}

export function ItemBasicInfoSection({
  name,
  description,
  categoryStyle,
  updateField,
}: ItemBasicInfoSectionProps) {
  return (
    <section
      className={`space-y-4 rounded-lg border p-4 ${categoryStyle.border} ${categoryStyle.bg}`}
    >
      <h3 className="flex items-center gap-2 font-semibold">
        <Package className={`size-4 ${categoryStyle.text}`} /> Item Information
      </h3>

      <div className="space-y-2">
        <Label htmlFor="name">Item Name *</Label>
        <Input
          id="name"
          value={name}
          onChange={e => updateField('name', e.target.value)}
          placeholder="e.g., Healing Potion"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description ?? ''}
          onChange={e => updateField('description', e.target.value)}
          placeholder="Describe the item's appearance and properties..."
          rows={3}
        />
      </div>
    </section>
  );
}

// =====================================================================================
// ItemClassificationSection
// =====================================================================================

interface ItemClassificationSectionProps {
  category: ItemCategory;
  rarity: Rarity;
  tier?: string;
  value?: string;
  weight?: string;
  updateField: <K extends keyof ItemFormData>(
    key: K,
    value: ItemFormData[K]
  ) => void;
  updateOptionalString: (
    key: 'tier' | 'value' | 'weight',
    value: string
  ) => void;
}

export function ItemClassificationSection({
  category,
  rarity,
  tier,
  value,
  weight,
  updateField,
  updateOptionalString,
}: ItemClassificationSectionProps) {
  return (
    <section className="space-y-4 rounded-lg border border-teal-500/30 bg-teal-500/10 p-4">
      <h3 className="flex items-center gap-2 font-semibold">
        <Tag className="size-4 text-teal-500" /> Classification
      </h3>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Select
            value={category}
            onValueChange={v => updateField('category', v as ItemCategory)}
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {ITEM_CATEGORIES.map(cat => (
                <SelectItem key={cat.value} value={cat.value}>
                  <span className="flex items-center gap-2">
                    <span>{cat.icon}</span> {cat.label}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="rarity">Rarity</Label>
          <Select
            value={rarity}
            onValueChange={v => updateField('rarity', v as Rarity)}
          >
            <SelectTrigger id="rarity">
              <SelectValue placeholder="Select rarity" />
            </SelectTrigger>
            <SelectContent>
              {RARITIES.map(r => (
                <SelectItem key={r.value} value={r.value}>
                  <span className={r.color}>{r.label}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tier">Tier</Label>
          <Select
            value={tier ?? ''}
            onValueChange={v => updateOptionalString('tier', v)}
          >
            <SelectTrigger id="tier">
              <SelectValue placeholder="Select tier (optional)" />
            </SelectTrigger>
            <SelectContent>
              {TIERS.map(t => (
                <SelectItem key={t} value={t}>
                  Tier {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="value" className="flex items-center gap-1">
            <Coins className="size-3" /> Value
          </Label>
          <Input
            id="value"
            value={value ?? ''}
            onChange={e => updateOptionalString('value', e.target.value)}
            placeholder="e.g., 50g, 2h"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="weight">Weight</Label>
          <Input
            id="weight"
            value={weight ?? ''}
            onChange={e => updateOptionalString('weight', e.target.value)}
            placeholder="e.g., light, 1 lb"
          />
        </div>
      </div>
    </section>
  );
}

// =====================================================================================
// ItemInventorySection
// =====================================================================================

interface ItemInventorySectionProps {
  maxQuantity: number;
  isConsumable: boolean;
  updateMaxQuantity: (value: string) => void;
  toggleConsumable: (checked: boolean) => void;
}

export function ItemInventorySection({
  maxQuantity,
  isConsumable,
  updateMaxQuantity,
  toggleConsumable,
}: ItemInventorySectionProps) {
  return (
    <section className="space-y-4 rounded-lg border border-orange-500/30 bg-orange-500/10 p-4">
      <h3 className="flex items-center gap-2 font-semibold">
        <Package className="size-4 text-orange-500" /> Inventory Management
      </h3>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="maxQuantity">Max Stack Size</Label>
          <Input
            id="maxQuantity"
            type="number"
            min={1}
            value={maxQuantity}
            onChange={e => updateMaxQuantity(e.target.value)}
          />
          <p className="text-muted-foreground text-xs">
            How many can stack in one inventory slot
          </p>
        </div>

        <div className="flex items-center gap-3 pt-6">
          <Checkbox
            id="isConsumable"
            checked={isConsumable}
            onCheckedChange={checked => toggleConsumable(checked === true)}
          />
          <Label htmlFor="isConsumable" className="cursor-pointer">
            Consumable (uses are tracked)
          </Label>
        </div>
      </div>
    </section>
  );
}

// =====================================================================================
// ItemFeaturesSection
// =====================================================================================

interface ItemFeaturesSectionProps {
  features: FeatureState[];
  addFeature: () => void;
  removeFeature: (id: string) => void;
  updateFeature: (id: string, updates: Partial<FeatureState>) => void;
}

export function ItemFeaturesSection({
  features,
  addFeature,
  removeFeature,
  updateFeature,
}: ItemFeaturesSectionProps) {
  return (
    <section className="space-y-4 rounded-lg border border-purple-500/30 bg-purple-500/10 p-4">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-semibold">
          <Sparkles className="size-4 text-purple-500" /> Features
        </h3>
        <Button type="button" variant="outline" size="sm" onClick={addFeature}>
          <Plus className="mr-1 size-4" /> Add Feature
        </Button>
      </div>

      {features.length === 0 ? (
        <p className="text-muted-foreground text-sm italic">
          No features added yet.
        </p>
      ) : (
        <div className="space-y-3">
          {features.map(feature => (
            <div
              key={feature.id}
              className="bg-background/50 space-y-2 rounded-lg border border-purple-500/20 p-3"
            >
              <div className="flex items-start gap-2">
                <div className="flex-1 space-y-2">
                  <Input
                    value={feature.name}
                    onChange={e =>
                      updateFeature(feature.id, { name: e.target.value })
                    }
                    placeholder="Feature name"
                  />
                  <Textarea
                    value={feature.description}
                    onChange={e =>
                      updateFeature(feature.id, { description: e.target.value })
                    }
                    placeholder="Feature description..."
                    rows={2}
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFeature(feature.id)}
                  className="text-destructive"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

// =====================================================================================
// ItemModifiersSection
// =====================================================================================

interface ItemModifiersSectionProps {
  modifiers?: FeatureStatModifiers;
  onChange: (modifiers?: FeatureStatModifiers) => void;
}

export function ItemModifiersSection({
  modifiers,
  onChange,
}: ItemModifiersSectionProps) {
  return (
    <section className="space-y-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4">
      <FeatureModifiersSection
        modifiers={modifiers}
        onChange={onChange}
        title="Item Stat Modifiers"
        colorClass="text-emerald-500"
        showTraits
      />
    </section>
  );
}
