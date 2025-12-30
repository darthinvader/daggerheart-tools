import { Minus, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

interface CounterTrainingProps {
  label: string;
  description: string;
  value: number;
  max?: number;
  onChange: (delta: number) => void;
}

export function CounterTraining({
  label,
  description,
  value,
  max = 3,
  onChange,
}: CounterTrainingProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border p-2">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-muted-foreground text-xs">{description}</p>
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7"
          onClick={() => onChange(-1)}
          disabled={value <= 0}
        >
          <Minus className="h-3 w-3" />
        </Button>
        <span className="w-6 text-center text-sm">
          {value}/{max}
        </span>
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7"
          onClick={() => onChange(1)}
          disabled={value >= max}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}

interface CheckboxTrainingProps {
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: () => void;
}

export function CheckboxTraining({
  label,
  description,
  checked,
  onCheckedChange,
}: CheckboxTrainingProps) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-lg border p-2">
      <Checkbox
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="mt-0.5"
      />
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-muted-foreground text-xs">{description}</p>
      </div>
    </label>
  );
}
