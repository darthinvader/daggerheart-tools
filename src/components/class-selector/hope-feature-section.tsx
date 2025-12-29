import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface HopeFeature {
  name: string;
  hopeCost: number;
  description: string;
}

interface HopeFeatureSectionProps {
  hopeFeature: HopeFeature;
  onUpdate: (updates: Partial<HopeFeature>) => void;
}

export function HopeFeatureSection({
  hopeFeature,
  onUpdate,
}: HopeFeatureSectionProps) {
  return (
    <div className="space-y-4 border-t pt-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">✨ Hope Feature</h4>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="hope-name">Feature Name</Label>
          <Input
            id="hope-name"
            placeholder="e.g., Inspiring Presence"
            value={hopeFeature.name}
            onChange={e => onUpdate({ name: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="hope-cost">Hope Cost</Label>
          <Input
            id="hope-cost"
            type="number"
            min={1}
            max={6}
            value={hopeFeature.hopeCost}
            onChange={e => onUpdate({ hopeCost: Number(e.target.value) })}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="hope-desc">Description</Label>
        <Textarea
          id="hope-desc"
          placeholder="Describe the hope feature effect..."
          value={hopeFeature.description}
          onChange={e => onUpdate({ description: e.target.value })}
          rows={2}
        />
      </div>
    </div>
  );
}
