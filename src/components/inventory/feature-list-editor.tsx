import { Plus, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface Feature {
  name: string;
  description: string;
}

interface FeatureListEditorProps {
  features: Feature[];
  onAdd: () => void;
  onUpdate: (idx: number, field: keyof Feature, value: string) => void;
  onRemove: (idx: number) => void;
}

export function FeatureListEditor({
  features,
  onAdd,
  onUpdate,
  onRemove,
}: FeatureListEditorProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">✨ Features</span>
        <Button type="button" variant="outline" size="sm" onClick={onAdd}>
          <Plus className="mr-1 h-4 w-4" />
          Add Feature
        </Button>
      </div>

      {features.length === 0 && (
        <p className="text-muted-foreground text-center text-sm">
          No features yet. Add one to give your item special abilities!
        </p>
      )}

      {features.map((feature, idx) => (
        <div key={idx} className="bg-muted/50 space-y-2 rounded-lg border p-3">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Feature name..."
              value={feature.name}
              onChange={e => onUpdate(idx, 'name', e.target.value)}
              className="flex-1"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-red-500 hover:bg-red-100"
              onClick={() => onRemove(idx)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <Textarea
            placeholder="Feature description..."
            value={feature.description}
            onChange={e => onUpdate(idx, 'description', e.target.value)}
            rows={2}
          />
        </div>
      ))}
    </div>
  );
}
