import { Plus, RotateCcw, Trash2, Zap } from 'lucide-react';

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

import type { AdversaryFeatureOverride } from './types';

export function AdversaryFeaturesEditor({
  features,
  sourceFeatureCount,
  newFeatureName,
  newFeatureType,
  newFeatureDesc,
  onNewFeatureNameChange,
  onNewFeatureTypeChange,
  onNewFeatureDescChange,
  onAddFeature,
  onRemoveFeature,
  onResetAll,
}: {
  features: AdversaryFeatureOverride[];
  sourceFeatureCount: number;
  newFeatureName: string;
  newFeatureType: string;
  newFeatureDesc: string;
  onNewFeatureNameChange: (value: string) => void;
  onNewFeatureTypeChange: (value: string) => void;
  onNewFeatureDescChange: (value: string) => void;
  onAddFeature: () => void;
  onRemoveFeature: (id: string) => void;
  onResetAll: () => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-2 text-sm font-medium">
          <Zap className="size-4 text-purple-500" />
          Features
        </Label>
        {features.length !== sourceFeatureCount && (
          <Button
            size="sm"
            variant="ghost"
            className="h-6 text-xs"
            onClick={onResetAll}
          >
            <RotateCcw className="mr-1 size-3" />
            Reset All
          </Button>
        )}
      </div>

      <AdversaryFeaturesList
        features={features}
        onRemoveFeature={onRemoveFeature}
      />

      <AdversaryFeatureForm
        newFeatureName={newFeatureName}
        newFeatureType={newFeatureType}
        newFeatureDesc={newFeatureDesc}
        onNewFeatureNameChange={onNewFeatureNameChange}
        onNewFeatureTypeChange={onNewFeatureTypeChange}
        onNewFeatureDescChange={onNewFeatureDescChange}
        onAddFeature={onAddFeature}
      />
    </div>
  );
}

function AdversaryFeaturesList({
  features,
  onRemoveFeature,
}: {
  features: AdversaryFeatureOverride[];
  onRemoveFeature: (id: string) => void;
}) {
  if (features.length === 0) {
    return (
      <p className="text-muted-foreground text-sm italic">
        No features. Add one below.
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {features.map(feature => (
        <li
          key={feature.id}
          className="bg-muted/30 flex items-start justify-between gap-2 rounded-md p-3"
        >
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium">{feature.name}</span>
              {feature.type && (
                <Badge variant="outline" className="text-xs">
                  {feature.type}
                </Badge>
              )}
              {feature.isCustom && (
                <Badge variant="secondary" className="text-xs">
                  Custom
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground mt-1 text-sm">
              {feature.description}
            </p>
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="text-destructive hover:text-destructive size-7 shrink-0"
            onClick={() => onRemoveFeature(feature.id)}
          >
            <Trash2 className="size-4" />
          </Button>
        </li>
      ))}
    </ul>
  );
}

function AdversaryFeatureForm({
  newFeatureName,
  newFeatureType,
  newFeatureDesc,
  onNewFeatureNameChange,
  onNewFeatureTypeChange,
  onNewFeatureDescChange,
  onAddFeature,
}: {
  newFeatureName: string;
  newFeatureType: string;
  newFeatureDesc: string;
  onNewFeatureNameChange: (value: string) => void;
  onNewFeatureTypeChange: (value: string) => void;
  onNewFeatureDescChange: (value: string) => void;
  onAddFeature: () => void;
}) {
  return (
    <div className="bg-muted/20 space-y-3 rounded-md border border-dashed p-3">
      <Label className="text-xs font-medium">Add New Feature</Label>
      <div className="grid gap-2 sm:grid-cols-2">
        <Input
          value={newFeatureName}
          onChange={event => onNewFeatureNameChange(event.target.value)}
          placeholder="Feature name"
          className="text-sm"
        />
        <Select value={newFeatureType} onValueChange={onNewFeatureTypeChange}>
          <SelectTrigger className="text-sm">
            <SelectValue placeholder="Type (optional)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="action">Action</SelectItem>
            <SelectItem value="passive">Passive</SelectItem>
            <SelectItem value="reaction">Reaction</SelectItem>
            <SelectItem value="experience">Experience</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <textarea
        className="border-input bg-background w-full rounded-md border p-2 text-sm"
        rows={2}
        value={newFeatureDesc}
        onChange={event => onNewFeatureDescChange(event.target.value)}
        placeholder="Feature description..."
      />
      <Button
        size="sm"
        variant="secondary"
        onClick={onAddFeature}
        disabled={!newFeatureName.trim() || !newFeatureDesc.trim()}
        className="w-full"
      >
        <Plus className="mr-1 size-4" />
        Add Feature
      </Button>
    </div>
  );
}
