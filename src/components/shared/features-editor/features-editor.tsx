import { Plus, Sparkles, Trash2 } from 'lucide-react';

import { FeatureModifiersSection } from '@/components/shared/feature-modifiers-section';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { FeatureStatModifiers } from '@/lib/schemas/core';

export interface Feature {
  name: string;
  description: string;
  modifiers?: FeatureStatModifiers;
}

export interface FeaturesEditorProps {
  features: Feature[];
  onChange: (features: Feature[]) => void;
  maxFeatures?: number;
  label?: string;
  showIcon?: boolean;
  /** Show trait modifiers (Agility, Strength, etc.) in modifier section */
  showTraitModifiers?: boolean;
}

export function FeaturesEditor({
  features,
  onChange,
  maxFeatures = 5,
  label = 'Features',
  showIcon = true,
  showTraitModifiers = false,
}: FeaturesEditorProps) {
  const handleAdd = () => {
    if (features.length < maxFeatures) {
      onChange([...features, { name: '', description: '' }]);
    }
  };

  const handleUpdate = (
    index: number,
    field: keyof Feature,
    value: string | FeatureStatModifiers | undefined
  ) => {
    const updated = [...features];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const handleRemove = (index: number) => {
    onChange(features.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1 text-sm font-medium">
          {showIcon && <Sparkles className="size-4" />}
          {label}
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAdd}
          disabled={features.length >= maxFeatures}
        >
          <Plus className="mr-1 h-4 w-4" />
          Add Feature
        </Button>
      </div>

      {features.length === 0 && (
        <p className="text-muted-foreground text-center text-sm">
          No features yet. Add one to give your item special abilities.
        </p>
      )}

      {features.map((feature, idx) => (
        <div key={idx} className="bg-muted/50 space-y-2 rounded-lg border p-3">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Feature name..."
              value={feature.name}
              onChange={e => handleUpdate(idx, 'name', e.target.value)}
              className="flex-1"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-destructive hover:bg-destructive/10"
              onClick={() => handleRemove(idx)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <Textarea
            placeholder="Feature description..."
            value={feature.description}
            onChange={e => handleUpdate(idx, 'description', e.target.value)}
            rows={2}
          />
          <FeatureModifiersSection
            modifiers={feature.modifiers}
            onChange={mods => handleUpdate(idx, 'modifiers', mods)}
            title="Feature Modifiers"
            colorClass="text-emerald-500"
            showTraits={showTraitModifiers}
          />
        </div>
      ))}
    </div>
  );
}
