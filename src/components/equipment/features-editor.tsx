import { Plus, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface Feature {
  name: string;
  description: string;
}

interface FeaturesEditorProps {
  features: Feature[];
  onChange: (features: Feature[]) => void;
  maxFeatures?: number;
}

export function FeaturesEditor({
  features,
  onChange,
  maxFeatures = 5,
}: FeaturesEditorProps) {
  const handleAdd = () => {
    if (features.length < maxFeatures) {
      onChange([...features, { name: '', description: '' }]);
    }
  };

  const handleUpdate = (
    index: number,
    field: 'name' | 'description',
    value: string
  ) => {
    const newFeatures = [...features];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    onChange(newFeatures);
  };

  const handleRemove = (index: number) => {
    onChange(features.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium">✨ Features</span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAdd}
          disabled={features.length >= maxFeatures}
          className="h-7 text-xs"
        >
          <Plus className="mr-1 h-3 w-3" />
          Add Feature
        </Button>
      </div>

      {features.length === 0 && (
        <p className="text-muted-foreground py-2 text-center text-xs">
          No features yet. Add one to give your item special abilities.
        </p>
      )}

      <div className="space-y-2">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className="bg-muted/30 flex flex-col gap-2 rounded-md border p-2"
          >
            <div className="flex items-center gap-2">
              <Input
                value={feature.name}
                onChange={e => handleUpdate(idx, 'name', e.target.value)}
                placeholder="Feature name"
                className="h-7 flex-1 text-xs"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleRemove(idx)}
                className="text-destructive hover:bg-destructive/10 h-7 w-7"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
            <Textarea
              value={feature.description}
              onChange={e => handleUpdate(idx, 'description', e.target.value)}
              placeholder="Describe what this feature does..."
              className="min-h-[50px] resize-none text-xs"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
