import { Plus, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export interface Feature {
  name: string;
  description: string;
}

export interface FeaturesEditorProps {
  features: Feature[];
  onChange: (features: Feature[]) => void;
  maxFeatures?: number;
  label?: string;
}

export function FeaturesEditor({
  features,
  onChange,
  maxFeatures = 5,
  label = '✨ Features',
}: FeaturesEditorProps) {
  const handleAdd = () => {
    if (features.length < maxFeatures) {
      onChange([...features, { name: '', description: '' }]);
    }
  };

  const handleUpdate = (index: number, field: keyof Feature, value: string) => {
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
        <span className="text-sm font-medium">{label}</span>
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
        </div>
      ))}
    </div>
  );
}
