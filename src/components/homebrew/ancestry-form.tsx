/**
 * Homebrew Ancestry Form
 *
 * Form for creating and editing homebrew ancestries.
 * Uses singular primaryFeature/secondaryFeature objects per schema.
 */
import { Dna, Plus, Sparkles, Trash2, Users } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import { FeatureModifiersSection } from '@/components/shared';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import type { FeatureStatModifiers } from '@/lib/schemas/core';
import { cn } from '@/lib/utils';

// Predefined physical characteristics from official ancestries
const PHYSICAL_CHARACTERISTIC_SUGGESTIONS = [
  'Pointed ears',
  'Thick protective scales',
  'Luminous eyes',
  'Sharp claws',
  'Natural camouflage',
  'Bioluminescent markings',
  'Thick fur or hair',
  'Horns or antlers',
  'Tail (prehensile or decorative)',
  'Wings (functional or vestigial)',
  'Gills or aquatic features',
  'Elongated limbs',
  'Dense musculature',
  'Crystalline skin',
  'Elemental features',
  'Multiple arms',
  'Extra eyes',
  'Feathers',
  'Natural armor plating',
  'Retractable claws',
] as const;

/**
 * Data shape that the AncestryForm works with.
 * Compatible with both HomebrewAncestry['content'] (homebrew page)
 * and the character page inline ancestry type.
 */
export interface AncestryFormData {
  name: string;
  description: string;
  heightRange: string;
  lifespan: string;
  physicalCharacteristics: string[];
  primaryFeature: {
    name: string;
    description: string;
    type: 'primary' | 'secondary';
    modifiers?: FeatureStatModifiers;
  };
  secondaryFeature: {
    name: string;
    description: string;
    type: 'primary' | 'secondary';
    modifiers?: FeatureStatModifiers;
  };
  isHomebrew: true;
}

interface AncestryFormProps {
  initialData?: AncestryFormData;
  /** Called on form submit (dialog mode) */
  onSubmit?: (data: AncestryFormData) => void;
  /** Called on cancel (dialog mode) */
  onCancel?: () => void;
  /** Called on every change (inline mode) */
  onChange?: (data: AncestryFormData) => void;
  isSubmitting?: boolean;
  /** Show submit/cancel buttons (default: true, set false for inline mode) */
  showActions?: boolean;
}

const DEFAULT_ANCESTRY_DATA: AncestryFormData = {
  name: '',
  description: '',
  heightRange: '',
  lifespan: '',
  physicalCharacteristics: [],
  primaryFeature: { name: '', description: '', type: 'primary' },
  secondaryFeature: { name: '', description: '', type: 'secondary' },
  isHomebrew: true,
};

export function AncestryForm({
  initialData,
  onSubmit,
  onCancel,
  onChange,
  isSubmitting = false,
  showActions = true,
}: AncestryFormProps) {
  const [formData, setFormData] = useState<AncestryFormData>(
    initialData ?? DEFAULT_ANCESTRY_DATA
  );
  const [characteristics, setCharacteristics] = useState<string[]>(
    initialData?.physicalCharacteristics ?? []
  );
  const [newCharacteristic, setNewCharacteristic] = useState('');

  // Build current data for callbacks
  const buildCurrentData = useCallback((): AncestryFormData => {
    return {
      ...formData,
      physicalCharacteristics: characteristics.filter(c => c.trim()),
      isHomebrew: true,
    };
  }, [formData, characteristics]);

  // Auto-notify on changes (for inline mode)
  useEffect(() => {
    if (onChange) {
      onChange(buildCurrentData());
    }
  }, [formData, characteristics]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (onSubmit) {
        onSubmit(buildCurrentData());
      }
    },
    [onSubmit, buildCurrentData]
  );

  const addCharacteristic = (value: string) => {
    if (value.trim() && !characteristics.includes(value.trim())) {
      setCharacteristics(prev => [...prev, value.trim()]);
    }
  };

  const addCustomCharacteristic = () => {
    if (
      newCharacteristic.trim() &&
      !characteristics.includes(newCharacteristic.trim())
    ) {
      setCharacteristics(prev => [...prev, newCharacteristic.trim()]);
      setNewCharacteristic('');
    }
  };

  const removeCharacteristic = (index: number) => {
    setCharacteristics(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ScrollArea className="h-[60vh] pr-4">
        <div className="space-y-6">
          {/* Basic Info */}
          <section className="space-y-4 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
            <h3 className="flex items-center gap-2 font-semibold">
              <Users className="size-4 text-amber-500" /> Ancestry Information
            </h3>

            <div className="space-y-2">
              <Label htmlFor="name">Ancestry Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={e =>
                  setFormData(prev => ({ ...prev, name: e.target.value }))
                }
                placeholder="e.g., Cloudkin"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description ?? ''}
                onChange={e =>
                  setFormData(prev => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Describe this ancestry's culture, origins, and typical traits..."
                rows={3}
                required
              />
            </div>
          </section>

          <Separator />

          {/* Physical Characteristics */}
          <section className="space-y-4 rounded-lg border border-cyan-500/30 bg-cyan-500/10 p-4">
            <h3 className="flex items-center gap-2 font-semibold">
              <Dna className="size-4 text-cyan-500" /> Physical Characteristics
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="heightRange">Height Range</Label>
                <Input
                  id="heightRange"
                  value={formData.heightRange ?? ''}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      heightRange: e.target.value,
                    }))
                  }
                  placeholder={'e.g., 5\'0" to 6\'4"'}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lifespan">Lifespan</Label>
                <Input
                  id="lifespan"
                  value={formData.lifespan ?? ''}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      lifespan: e.target.value,
                    }))
                  }
                  placeholder="e.g., 80-120 years"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Physical Traits</Label>

              {/* Quick-add suggestions */}
              <div className="flex flex-wrap gap-1">
                {PHYSICAL_CHARACTERISTIC_SUGGESTIONS.filter(
                  trait => !characteristics.includes(trait)
                )
                  .slice(0, 12)
                  .map(trait => (
                    <Button
                      key={trait}
                      type="button"
                      variant="outline"
                      size="sm"
                      className={cn(
                        'h-7 text-xs',
                        'border-cyan-500/30 hover:bg-cyan-500/20'
                      )}
                      onClick={() => addCharacteristic(trait)}
                    >
                      <Plus className="mr-1 size-3" /> {trait}
                    </Button>
                  ))}
              </div>

              {/* Selected characteristics */}
              <div className="flex flex-wrap gap-2">
                {characteristics.map((char, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="gap-1 border-cyan-500/50 bg-cyan-500/20"
                  >
                    {char}
                    <button
                      type="button"
                      onClick={() => removeCharacteristic(index)}
                      className="hover:text-destructive"
                    >
                      <Trash2 className="size-3" />
                    </button>
                  </Badge>
                ))}
              </div>

              {/* Custom input */}
              <div className="flex gap-2">
                <Input
                  value={newCharacteristic}
                  onChange={e => setNewCharacteristic(e.target.value)}
                  placeholder="Add custom physical trait..."
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCustomCharacteristic();
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={addCustomCharacteristic}
                >
                  <Plus className="size-4" />
                </Button>
              </div>
            </div>
          </section>

          <Separator />

          {/* Primary Feature */}
          <section className="space-y-4 rounded-lg border border-purple-500/30 bg-purple-500/10 p-4">
            <h3 className="flex items-center gap-2 font-semibold">
              <Sparkles className="size-4 text-purple-500" /> Primary Feature
            </h3>
            <p className="text-muted-foreground text-sm">
              The main ancestry feature that defines this heritage.
            </p>

            <div className="bg-background/50 space-y-3 rounded-lg border border-purple-500/20 p-4">
              <div className="space-y-2">
                <Label htmlFor="primaryFeatureName">Feature Name *</Label>
                <Input
                  id="primaryFeatureName"
                  value={formData.primaryFeature.name}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      primaryFeature: {
                        ...prev.primaryFeature,
                        name: e.target.value,
                      },
                    }))
                  }
                  placeholder="e.g., Cloud Form"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="primaryFeatureDesc">Description *</Label>
                <Textarea
                  id="primaryFeatureDesc"
                  value={formData.primaryFeature.description}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      primaryFeature: {
                        ...prev.primaryFeature,
                        description: e.target.value,
                      },
                    }))
                  }
                  placeholder="Describe what this feature does..."
                  rows={3}
                  required
                />
              </div>

              <FeatureModifiersSection
                modifiers={formData.primaryFeature.modifiers}
                onChange={modifiers =>
                  setFormData(prev => ({
                    ...prev,
                    primaryFeature: {
                      ...prev.primaryFeature,
                      modifiers,
                    },
                  }))
                }
                title="Primary Feature Modifiers"
                colorClass="text-purple-500"
                showTraits
              />
            </div>
          </section>

          <Separator />

          {/* Secondary Feature */}
          <section className="space-y-4 rounded-lg border border-indigo-500/30 bg-indigo-500/10 p-4">
            <h3 className="flex items-center gap-2 font-semibold">
              <Sparkles className="size-4 text-indigo-500" /> Secondary Feature
            </h3>
            <p className="text-muted-foreground text-sm">
              An additional feature that complements the primary one.
            </p>

            <div className="bg-background/50 space-y-3 rounded-lg border border-indigo-500/20 p-4">
              <div className="space-y-2">
                <Label htmlFor="secondaryFeatureName">Feature Name *</Label>
                <Input
                  id="secondaryFeatureName"
                  value={formData.secondaryFeature.name}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      secondaryFeature: {
                        ...prev.secondaryFeature,
                        name: e.target.value,
                      },
                    }))
                  }
                  placeholder="e.g., Wind Affinity"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="secondaryFeatureDesc">Description *</Label>
                <Textarea
                  id="secondaryFeatureDesc"
                  value={formData.secondaryFeature.description}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      secondaryFeature: {
                        ...prev.secondaryFeature,
                        description: e.target.value,
                      },
                    }))
                  }
                  placeholder="Describe what this feature does..."
                  rows={3}
                  required
                />
              </div>

              <FeatureModifiersSection
                modifiers={formData.secondaryFeature.modifiers}
                onChange={modifiers =>
                  setFormData(prev => ({
                    ...prev,
                    secondaryFeature: {
                      ...prev.secondaryFeature,
                      modifiers,
                    },
                  }))
                }
                title="Secondary Feature Modifiers"
                colorClass="text-indigo-500"
                showTraits
              />
            </div>
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
              {isSubmitting ? 'Saving...' : 'Save Ancestry'}
            </Button>
          </div>
        </>
      )}
    </form>
  );
}
