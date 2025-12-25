import { Minus, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface NumberControlProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'default';
  variant?: 'primary' | 'secondary';
  label?: string;
}

export function NumberControl({
  value,
  onChange,
  min = -Infinity,
  max = Infinity,
  size = 'default',
  variant = 'primary',
  label,
}: NumberControlProps) {
  const buttonSize = size === 'sm' ? 'icon-sm' : 'icon';
  const numberSize = size === 'sm' ? 'w-12 text-sm' : 'w-10 text-base';
  const buttonVariant = variant === 'primary' ? 'outline' : 'ghost';

  return (
    <div className="flex items-center gap-1">
      <Button
        variant={buttonVariant}
        size={buttonSize}
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Decrement"
      >
        <Minus className="size-4" />
      </Button>
      <span
        className={cn(
          'text-center font-mono font-semibold tabular-nums',
          numberSize
        )}
      >
        {label ? `${label}:${value}` : value}
      </span>
      <Button
        variant={buttonVariant}
        size={buttonSize}
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Increment"
      >
        <Plus className="size-4" />
      </Button>
    </div>
  );
}
