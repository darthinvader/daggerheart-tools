/**
 * Homebrew Item Form
 *
 * Form for creating and editing homebrew general items.
 * Uses features array per schema structure.
 */
import { Coins, Package, Plus, Sparkles, Tag, Trash2 } from 'lucide-react';
import { useCallback, useState } from 'react';

import { Button } from '@/components/ui/button';
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
import type { HomebrewItem } from '@/lib/schemas/homebrew';
import { createDefaultItemContent } from '@/lib/schemas/homebrew';

// Category color mapping
const CATEGORY_COLORS: Record<
  string,
  { bg: string; border: string; text: string }
> = {
  consumable: {
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
    text: 'text-green-500',
  },
  tool: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    text: 'text-blue-500',
  },
  treasure: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    text: 'text-amber-500',
  },
  misc: {
    bg: 'bg-gray-500/10',
    border: 'border-gray-500/30',
    text: 'text-gray-500',
  },
  quest: {
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    text: 'text-purple-500',
  },
  container: {
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
    text: 'text-orange-500',
  },
};

const ITEM_CATEGORIES = [
  { value: 'consumable', label: 'Consumable', icon: '🧪' },
  { value: 'tool', label: 'Tool', icon: '🔧' },
  { value: 'treasure', label: 'Treasure', icon: '💎' },
  { value: 'misc', label: 'Miscellaneous', icon: '📦' },
  { value: 'quest', label: 'Quest Item', icon: '📜' },
  { value: 'container', label: 'Container', icon: '🎒' },
] as const;

const TIERS = ['1', '2', '3', '4'] as const;

interface ItemFormProps {
  initialData?: HomebrewItem['content'];
  onSubmit: (data: HomebrewItem['content']) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

interface FeatureState {
  id: string;
  name: string;
  description: string;
}

export function ItemForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: ItemFormProps) {
  const [formData, setFormData] = useState(
    initialData ?? createDefaultItemContent()
  );
  const [features, setFeatures] = useState<FeatureState[]>(
    (initialData?.features ?? []).map((f, i) => ({
      id: `feature-${i}`,
      name: f.name,
      description: f.description,
    }))
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      const content: HomebrewItem['content'] = {
        ...formData,
        features: features.map(f => ({
          name: f.name,
          description: f.description,
        })),
      };

      onSubmit(content);
    },
    [formData, features, onSubmit]
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
    CATEGORY_COLORS[formData.category] ?? CATEGORY_COLORS.misc;

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
                      category: v as typeof formData.category,
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
        </div>
      </ScrollArea>

      <Separator />

      {/* Actions */}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting || !formData.name.trim()}>
          {isSubmitting ? 'Saving...' : 'Save Item'}
        </Button>
      </div>
    </form>
  );
}
