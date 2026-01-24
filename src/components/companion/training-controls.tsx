import type { LucideProps } from 'lucide-react';
import { Minus, Plus } from 'lucide-react';
import type { ComponentType } from 'react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

interface CounterTrainingProps {
  label: string;
  description: string;
  value: number;
  max?: number;
  onChange: (delta: number) => void;
  Icon?: ComponentType<LucideProps>;
  color?: string;
}

export function CounterTraining({
  label,
  description,
  value,
  max = 3,
  onChange,
  Icon,
  color = 'border-primary/20',
}: CounterTrainingProps) {
  const isActive = value > 0;
  return (
    <div
      className={`flex items-center justify-between rounded-lg border-2 p-3 transition-all ${
        isActive ? `${color} bg-primary/5` : 'border-border'
      }`}
    >
      <div className="flex items-center gap-2">
        {Icon && <Icon className="size-5" />}
        <div>
          <p className="text-sm font-medium">{label}</p>
          <p className="text-muted-foreground text-xs">{description}</p>
        </div>
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
        <span className="w-6 text-center text-sm font-bold">
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
  Icon?: ComponentType<LucideProps>;
  color?: string;
}

export function CheckboxTraining({
  label,
  description,
  checked,
  onCheckedChange,
  Icon,
  color = 'border-primary/20',
}: CheckboxTrainingProps) {
  return (
    <label
      className={`flex cursor-pointer items-start gap-3 rounded-lg border-2 p-3 transition-all ${
        checked ? `${color} bg-primary/5` : 'border-border'
      }`}
    >
      <Checkbox
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="mt-0.5"
      />
      <div className="flex items-center gap-2">
        {Icon && <Icon className="size-5" />}
        <div>
          <p className="text-sm font-medium">{label}</p>
          <p className="text-muted-foreground text-xs">{description}</p>
        </div>
      </div>
    </label>
  );
}
