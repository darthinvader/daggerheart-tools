import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { DescriptionIcon, HeightIcon, LifespanIcon } from './ancestry-icons';

interface HomebrewBasicFieldsProps {
  name: string;
  heightRange: string;
  lifespan: string;
  description: string;
  onNameChange: (value: string) => void;
  onHeightChange: (value: string) => void;
  onLifespanChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

export function HomebrewBasicFields({
  name,
  heightRange,
  lifespan,
  description,
  onNameChange,
  onHeightChange,
  onLifespanChange,
  onDescriptionChange,
}: HomebrewBasicFieldsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="hb-name">Ancestry Name *</Label>
          <Input
            id="hb-name"
            value={name}
            onChange={e => onNameChange(e.target.value)}
            placeholder="Your custom ancestry name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="hb-height" className="flex items-center gap-2">
            <HeightIcon />
            Height Range
          </Label>
          <Input
            id="hb-height"
            value={heightRange}
            onChange={e => onHeightChange(e.target.value)}
            placeholder="e.g., 4 to 6 feet"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="hb-lifespan" className="flex items-center gap-2">
            <LifespanIcon />
            Lifespan
          </Label>
          <Input
            id="hb-lifespan"
            value={lifespan}
            onChange={e => onLifespanChange(e.target.value)}
            placeholder="e.g., Approximately 150 years"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="hb-desc" className="flex items-center gap-2">
          <DescriptionIcon />
          Description
        </Label>
        <Textarea
          id="hb-desc"
          value={description}
          onChange={e => onDescriptionChange(e.target.value)}
          placeholder="Describe your ancestry's appearance, culture, and notable traits..."
          className="min-h-45"
        />
      </div>
    </div>
  );
}
