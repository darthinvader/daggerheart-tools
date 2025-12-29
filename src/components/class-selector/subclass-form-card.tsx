import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import type { HomebrewSubclass } from '@/lib/schemas/class-selection';
import type { SubclassFeature } from '@/lib/schemas/core';

import { SubclassFeatureItem } from './subclass-feature-item';

interface SubclassFormCardProps {
  subclass: HomebrewSubclass;
  index: number;
  canRemove: boolean;
  onUpdate: (updates: Partial<HomebrewSubclass>) => void;
  onRemove: () => void;
  onAddFeature: () => void;
  onUpdateFeature: (
    featureIndex: number,
    updates: Partial<SubclassFeature>
  ) => void;
  onRemoveFeature: (featureIndex: number) => void;
}

export function SubclassFormCard({
  subclass,
  index,
  canRemove,
  onUpdate,
  onRemove,
  onAddFeature,
  onUpdateFeature,
  onRemoveFeature,
}: SubclassFormCardProps) {
  return (
    <div className="bg-muted/30 space-y-4 rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <h5 className="font-medium">Subclass {index + 1}</h5>
        {canRemove && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="text-destructive hover:text-destructive"
          >
            🗑️ Remove
          </Button>
        )}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Subclass Name</Label>
          <Input
            placeholder="Enter subclass name..."
            value={subclass.name}
            onChange={e => onUpdate({ name: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Spellcast Trait (optional)</Label>
          <Select
            value={subclass.spellcastTrait ?? 'none'}
            onValueChange={v =>
              onUpdate({ spellcastTrait: v === 'none' ? undefined : v })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select trait" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="Agility">Agility</SelectItem>
              <SelectItem value="Strength">Strength</SelectItem>
              <SelectItem value="Finesse">Finesse</SelectItem>
              <SelectItem value="Instinct">Instinct</SelectItem>
              <SelectItem value="Presence">Presence</SelectItem>
              <SelectItem value="Knowledge">Knowledge</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          placeholder="Describe this subclass..."
          value={subclass.description}
          onChange={e => onUpdate({ description: e.target.value })}
          rows={2}
        />
      </div>

      {/* Subclass Features */}
      <div className="space-y-3 border-t border-dashed pt-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>⭐</span>
            <Label className="text-sm font-medium">Subclass Features</Label>
            <Badge variant="secondary" className="text-xs">
              {subclass.features.length}
            </Badge>
          </div>
          <Button variant="outline" size="sm" onClick={onAddFeature}>
            ➕ Add Feature
          </Button>
        </div>

        {subclass.features.length === 0 ? (
          <p className="text-muted-foreground text-sm italic">
            No features yet. Add foundation, specialization, or mastery
            features.
          </p>
        ) : (
          <div className="space-y-3">
            {subclass.features.map((feature, featureIndex) => (
              <SubclassFeatureItem
                key={featureIndex}
                feature={feature}
                featureIndex={featureIndex}
                onUpdate={updates => onUpdateFeature(featureIndex, updates)}
                onRemove={() => onRemoveFeature(featureIndex)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
