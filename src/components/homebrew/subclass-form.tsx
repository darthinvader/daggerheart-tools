/**
 * Homebrew Subclass Form
 *
 * Form for creating and editing homebrew subclasses.
 * Uses features array with SubclassFeatureSchema structure.
 */
import { Plus, Shield, Sparkles, Trash2, Wand2 } from 'lucide-react';
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
import { useMyHomebrewContent } from '@/features/homebrew/use-homebrew-query';
import { ClassNameEnum } from '@/lib/schemas/core';
import type { HomebrewSubclass } from '@/lib/schemas/homebrew';
import { createDefaultSubclassContent } from '@/lib/schemas/homebrew';

const FEATURE_LEVELS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;

// Spellcast traits used by official subclasses
const SPELLCAST_TRAITS = [
  'Agility',
  'Strength',
  'Finesse',
  'Instinct',
  'Presence',
  'Knowledge',
] as const;

interface SubclassFormProps {
  initialData?: HomebrewSubclass['content'];
  onSubmit: (data: HomebrewSubclass['content']) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

interface FeatureState {
  id: string;
  name: string;
  description: string;
  type: string;
  level?: number;
}

interface FeatureSectionProps {
  title: string;
  description: string;
  type: string;
  levelHint: string;
  features: FeatureState[];
  onAdd: (type: string) => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, updates: Partial<FeatureState>) => void;
}

function FeatureSection({
  title,
  description,
  type,
  levelHint,
  features,
  onAdd,
  onRemove,
  onUpdate,
}: FeatureSectionProps) {
  const typeFeatures = features.filter(feature => feature.type === type);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-2 font-semibold">
            <Sparkles className="size-4" /> {title}
          </h3>
          <p className="text-muted-foreground text-sm">
            {description} {levelHint}
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onAdd(type)}
        >
          <Plus className="mr-1 size-4" /> Add
        </Button>
      </div>

      {typeFeatures.length === 0 ? (
        <p className="text-muted-foreground text-sm italic">
          No {type} features added yet.
        </p>
      ) : (
        <div className="space-y-3">
          {typeFeatures.map(feature => (
            <div
              key={feature.id}
              className="bg-muted/50 space-y-2 rounded-lg border p-3"
            >
              <div className="flex items-start gap-2">
                <div className="flex-1 space-y-2">
                  <div className="flex gap-2">
                    <Input
                      value={feature.name}
                      onChange={e =>
                        onUpdate(feature.id, { name: e.target.value })
                      }
                      placeholder="Feature name"
                      className="flex-1"
                    />
                    <Select
                      value={String(feature.level ?? '')}
                      onValueChange={v =>
                        onUpdate(feature.id, {
                          level: v ? parseInt(v, 10) : undefined,
                        })
                      }
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue placeholder="Level" />
                      </SelectTrigger>
                      <SelectContent>
                        {FEATURE_LEVELS.map(level => (
                          <SelectItem key={level} value={String(level)}>
                            Lvl {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Textarea
                    value={feature.description}
                    onChange={e =>
                      onUpdate(feature.id, {
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
                  onClick={() => onRemove(feature.id)}
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

export function SubclassForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: SubclassFormProps) {
  const [formData, setFormData] = useState(
    initialData ?? createDefaultSubclassContent()
  );
  const [features, setFeatures] = useState<FeatureState[]>(
    (initialData?.features ?? []).map((f, i) => ({
      id: `feature-${i}`,
      name: f.name,
      description: f.description,
      type: f.type ?? 'foundation',
      level: f.level,
    }))
  );

  // Fetch homebrew classes to allow creating subclasses for them
  const { data: homebrewClassesResult } = useMyHomebrewContent({
    contentType: 'class',
  });
  const homebrewClasses = homebrewClassesResult?.items ?? [];

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      const content: HomebrewSubclass['content'] = {
        ...formData,
        features: features.map(f => ({
          name: f.name,
          description: f.description,
          type: f.type as 'foundation' | 'specialization' | 'mastery',
          level: f.level,
        })),
        isHomebrew: true,
      };

      onSubmit(content);
    },
    [formData, features, onSubmit]
  );

  const addFeature = (type: string) => {
    setFeatures(prev => [
      ...prev,
      {
        id: `feature-${Date.now()}`,
        name: '',
        description: '',
        type,
        level: type === 'foundation' ? 1 : type === 'specialization' ? 5 : 9,
      },
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ScrollArea className="h-[60vh] pr-4">
        <div className="space-y-6">
          {/* Basic Info */}
          <section className="space-y-4">
            <h3 className="font-semibold">Subclass Information</h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Subclass Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="e.g., Way of the Storm"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Shield className="size-4 text-blue-500" />
                  Parent Class *
                </Label>
                <Select
                  value={formData.parentClassName ?? ''}
                  onValueChange={v =>
                    setFormData(prev => ({
                      ...prev,
                      parentClassName: v,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="text-muted-foreground px-2 py-1.5 text-xs font-semibold">
                      Official Classes
                    </div>
                    {ClassNameEnum.options.map(cls => (
                      <SelectItem key={cls} value={cls}>
                        {cls}
                      </SelectItem>
                    ))}
                    {homebrewClasses.length > 0 && (
                      <>
                        <div className="text-muted-foreground px-2 py-1.5 text-xs font-semibold">
                          Your Homebrew Classes
                        </div>
                        {homebrewClasses.map(cls => (
                          <SelectItem key={cls.id} value={cls.content.name}>
                            {cls.content.name}
                          </SelectItem>
                        ))}
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
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
                placeholder="Describe the subclass fantasy and how it differs from other subclasses..."
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="spellcastTrait"
                className="flex items-center gap-2"
              >
                <Wand2 className="size-4 text-purple-500" />
                Spellcast Trait
              </Label>
              <Select
                value={formData.spellcastTrait ?? ''}
                onValueChange={v =>
                  setFormData(prev => ({
                    ...prev,
                    spellcastTrait: v === '__none__' ? undefined : v,
                  }))
                }
              >
                <SelectTrigger id="spellcastTrait">
                  <SelectValue placeholder="Select trait (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">None</SelectItem>
                  {SPELLCAST_TRAITS.map(trait => (
                    <SelectItem key={trait} value={trait}>
                      {trait}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-muted-foreground text-xs">
                The trait used for spellcasting, if applicable.
              </p>
            </div>
          </section>

          <Separator />

          {/* Foundation Features (Tier 1) */}
          <FeatureSection
            title="Foundation Features"
            description="Core features available early in character progression."
            type="foundation"
            levelHint="(Typically levels 1-4)"
            features={features}
            onAdd={addFeature}
            onRemove={removeFeature}
            onUpdate={updateFeature}
          />

          <Separator />

          {/* Specialization Features (Tier 2-3) */}
          <FeatureSection
            title="Specialization Features"
            description="Features that deepen the subclass identity."
            type="specialization"
            levelHint="(Typically levels 5-7)"
            features={features}
            onAdd={addFeature}
            onRemove={removeFeature}
            onUpdate={updateFeature}
          />

          <Separator />

          {/* Mastery Features (Tier 4) */}
          <FeatureSection
            title="Mastery Features"
            description="Capstone features that define the subclass at its peak."
            type="mastery"
            levelHint="(Typically levels 8-10)"
            features={features}
            onAdd={addFeature}
            onRemove={removeFeature}
            onUpdate={updateFeature}
          />
        </div>
      </ScrollArea>

      <Separator />

      {/* Actions */}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={
            isSubmitting || !formData.name.trim() || !formData.parentClassName
          }
        >
          {isSubmitting ? 'Saving...' : 'Save Subclass'}
        </Button>
      </div>
    </form>
  );
}
