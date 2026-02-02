import { FeatureModifiersSection } from '@/components/shared/feature-modifiers-section';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { ClassFeature } from '@/lib/schemas/core';

interface ClassFeatureItemProps {
  feature: ClassFeature;
  index: number;
  onUpdate: (updates: Partial<ClassFeature>) => void;
  onRemove: () => void;
}

function ClassFeatureItem({
  feature,
  index,
  onUpdate,
  onRemove,
}: ClassFeatureItemProps) {
  return (
    <div className="bg-muted/30 space-y-3 rounded border p-3">
      <div className="flex items-center justify-between gap-2">
        <Badge
          variant="outline"
          className="border-green-500/30 bg-green-500/10 text-green-700"
        >
          ⭐ Class Feature
        </Badge>
        <Button
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="text-destructive hover:text-destructive h-7 w-7 p-0"
          aria-label={`Remove feature ${index + 1}`}
        >
          ✕
        </Button>
      </div>
      <div className="space-y-2">
        <Label className="text-xs">Name</Label>
        <Input
          placeholder="Feature name..."
          value={feature.name}
          onChange={e => onUpdate({ name: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label className="text-xs">Description</Label>
        <Textarea
          placeholder="Describe what this feature does..."
          value={feature.description}
          onChange={e => onUpdate({ description: e.target.value })}
          rows={2}
        />
      </div>
      <FeatureModifiersSection
        modifiers={feature.modifiers}
        onChange={modifiers => onUpdate({ modifiers })}
        title="Feature Modifiers"
        colorClass="text-green-500"
        showTraits
      />
    </div>
  );
}

interface ClassFeaturesListProps {
  features: ClassFeature[];
  onAdd: () => void;
  onUpdate: (index: number, updates: Partial<ClassFeature>) => void;
  onRemove: (index: number) => void;
}

export function ClassFeaturesList({
  features,
  onAdd,
  onUpdate,
  onRemove,
}: ClassFeaturesListProps) {
  return (
    <div className="space-y-4 border-t pt-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span>⭐</span>
          <h4 className="font-medium">Class Features</h4>
          <Badge variant="secondary" className="text-xs">
            {features.length}
          </Badge>
        </div>
        <Button variant="outline" size="sm" onClick={onAdd}>
          ➕ Add Feature
        </Button>
      </div>
      <p className="text-muted-foreground text-sm">
        Class features are always-active abilities unique to this class.
      </p>

      {features.length === 0 ? (
        <p className="text-muted-foreground text-sm italic">
          No class features yet. These are always-on abilities for this class.
        </p>
      ) : (
        <div className="space-y-3">
          {features.map((feature, idx) => (
            <ClassFeatureItem
              key={idx}
              feature={feature}
              index={idx}
              onUpdate={updates => onUpdate(idx, updates)}
              onRemove={() => onRemove(idx)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
