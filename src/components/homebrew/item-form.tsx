/**
 * Homebrew Item Form
 *
 * Form for creating and editing homebrew general items.
 * Unified with inventory custom item form - includes inventory management fields.
 */
import { Coins, Package, Plus, Sparkles, Tag, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import { FeatureModifiersSection } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import type { Rarity } from '@/lib/schemas/equipment';
import type { ItemCategory } from '@/lib/schemas/homebrew';

// Category color mapping - aligned with inventory constants
const CATEGORY_COLORS: Record<
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

const ITEM_CATEGORIES: Array<{
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

const RARITIES: Array<{ value: Rarity; label: string; color: string }> = [
  { value: 'Common', label: 'Common', color: 'text-gray-500' },
  { value: 'Uncommon', label: 'Uncommon', color: 'text-emerald-500' },
  { value: 'Rare', label: 'Rare', color: 'text-blue-500' },
  { value: 'Legendary', label: 'Legendary', color: 'text-purple-500' },
];

const TIERS = ['1', '2', '3', '4'] as const;

/**
 * Data shape that the ItemForm works with.
 * Compatible with both HomebrewItem['content'] (homebrew page)
 * and the character page custom item form.
 */
export interface ItemFormData {
  name: string;
  description: string;
  tier?: string;
  category: ItemCategory;
  rarity: Rarity;
  features: Array<{ name: string; description: string }>;
  value?: string;
  weight?: string;
  modifiers?: import('@/lib/schemas/core').FeatureStatModifiers;
  // Inventory management
  maxQuantity: number;
  isConsumable: boolean;
  isHomebrew: true;
}

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

interface FeatureState {
  id: string;
  name: string;
  description: string;
}

const DEFAULT_ITEM_DATA: ItemFormData = {
  name: '',
  description: '',
  category: 'Utility',
  rarity: 'Common',
  features: [],
  maxQuantity: 1,
  isConsumable: false,
  isHomebrew: true,
};

export function ItemForm({
  initialData,
  onSubmit,
  onCancel,
  onChange,
  isSubmitting = false,
  showActions = true,
}: ItemFormProps) {
  const [formData, setFormData] = useState<ItemFormData>(
    initialData ?? DEFAULT_ITEM_DATA
  );
  const [features, setFeatures] = useState<FeatureState[]>(
    (initialData?.features ?? []).map((f, i) => ({
      id: `feature-${i}`,
      name: f.name,
      description: f.description,
    }))
  );

  // Build current data for callbacks
  const buildCurrentData = useCallback((): ItemFormData => {
    return {
      ...formData,
      features: features.map(f => ({
        name: f.name,
        description: f.description,
      })),
      isHomebrew: true,
    };
  }, [formData, features]);

  // Auto-notify on changes (for inline mode)
  useEffect(() => {
    if (onChange) {
      onChange(buildCurrentData());
    }
  }, [formData, features]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (onSubmit) {
        onSubmit(buildCurrentData());
      }
    },
    [onSubmit, buildCurrentData]
  );

  const addFeature = () => {
    setFeatures(prev => [
      ...prev,
      { id: `feature-${Date.now()}`, name: '', description: '' },
    ]);
  };

  const removeFeature = (id: string) => {
    setFeatures(prev => prev.filter(f => f.id !== id));
  };

  const updateFeature = (id: string, updates: Partial<FeatureState>) => {
    setFeatures(prev =>
      prev.map(f => (f.id === id ? { ...f, ...updates } : f))
    );
  };

  // Get color based on current category
  const categoryStyle =
    CATEGORY_COLORS[formData.category] ?? CATEGORY_COLORS.Utility;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ScrollArea className="h-[60vh] pr-4">
        <div className="space-y-6">
          {/* Basic Info */}
          <section
            className={`space-y-4 rounded-lg border p-4 ${categoryStyle.border} ${categoryStyle.bg}`}
          >
            <h3 className="flex items-center gap-2 font-semibold">
              <Package className={`size-4 ${categoryStyle.text}`} /> Item
              Information
            </h3>

            <div className="space-y-2">
              <Label htmlFor="name">Item Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={e =>
                  setFormData(prev => ({ ...prev, name: e.target.value }))
                }
                placeholder="e.g., Healing Potion"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description ?? ''}
                onChange={e =>
                  setFormData(prev => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Describe the item's appearance and properties..."
                rows={3}
              />
            </div>
          </section>

          <Separator />

          {/* Classification */}
          <section className="space-y-4 rounded-lg border border-teal-500/30 bg-teal-500/10 p-4">
            <h3 className="flex items-center gap-2 font-semibold">
              <Tag className="size-4 text-teal-500" /> Classification
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={v =>
                    setFormData(prev => ({
                      ...prev,
                      category: v as ItemCategory,
                    }))
                  }
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
                  value={formData.rarity}
                  onValueChange={v =>
                    setFormData(prev => ({
                      ...prev,
                      rarity: v as Rarity,
                    }))
                  }
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
                  value={formData.tier ?? ''}
                  onValueChange={v =>
                    setFormData(prev => ({
                      ...prev,
                      tier: v || undefined,
                    }))
                  }
                >
                  <SelectTrigger id="tier">
                    <SelectValue placeholder="Select tier (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIERS.map(tier => (
                      <SelectItem key={tier} value={tier}>
                        Tier {tier}
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
                  value={formData.value ?? ''}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      value: e.target.value || undefined,
                    }))
                  }
                  placeholder="e.g., 50g, 2h"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight">Weight</Label>
                <Input
                  id="weight"
                  value={formData.weight ?? ''}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      weight: e.target.value || undefined,
                    }))
                  }
                  placeholder="e.g., light, 1 lb"
                />
              </div>
            </div>
          </section>

          <Separator />

          {/* Inventory Management */}
          <section className="space-y-4 rounded-lg border border-orange-500/30 bg-orange-500/10 p-4">
            <h3 className="flex items-center gap-2 font-semibold">
              <Package className="size-4 text-orange-500" /> Inventory
              Management
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="maxQuantity">Max Stack Size</Label>
                <Input
                  id="maxQuantity"
                  type="number"
                  min={1}
                  value={formData.maxQuantity}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      maxQuantity: Math.max(
                        1,
                        parseInt(e.target.value, 10) || 1
                      ),
                    }))
                  }
                />
                <p className="text-muted-foreground text-xs">
                  How many can stack in one inventory slot
                </p>
              </div>

              <div className="flex items-center gap-3 pt-6">
                <Checkbox
                  id="isConsumable"
                  checked={formData.isConsumable}
                  onCheckedChange={checked =>
                    setFormData(prev => ({
                      ...prev,
                      isConsumable: checked === true,
                    }))
                  }
                />
                <Label htmlFor="isConsumable" className="cursor-pointer">
                  Consumable (uses are tracked)
                </Label>
              </div>
            </div>
          </section>

          <Separator />

          {/* Features */}
          <section className="space-y-4 rounded-lg border border-purple-500/30 bg-purple-500/10 p-4">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-semibold">
                <Sparkles className="size-4 text-purple-500" /> Features
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addFeature}
              >
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
                            updateFeature(feature.id, {
                              description: e.target.value,
                            })
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

          <Separator />

          {/* Item Stat Modifiers */}
          <section className="space-y-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4">
            <FeatureModifiersSection
              modifiers={formData.modifiers}
              onChange={modifiers =>
                setFormData(prev => ({
                  ...prev,
                  modifiers,
                }))
              }
              title="Item Stat Modifiers"
              colorClass="text-emerald-500"
              showTraits
            />
          </section>
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
