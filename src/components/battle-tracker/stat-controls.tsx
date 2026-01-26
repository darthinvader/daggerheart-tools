import { Minus, Plus } from 'lucide-react';
import type { ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

import { toNumber } from './utils';

interface StatMiniProps {
  label: string;
  value: number;
  max: number;
  onChange: (v: number) => void;
  colorClass?: string;
  icon?: ReactNode;
}

export function StatMini({
  label,
  value,
  max,
  onChange,
  colorClass,
  icon,
}: StatMiniProps) {
  return (
    <div className="bg-muted/30 flex items-center gap-1 rounded border px-2 py-1">
      <span
        className={cn(
          'flex items-center gap-1 text-xs',
          colorClass ?? 'text-muted-foreground'
        )}
      >
        {icon}
        {label}
      </span>
      <div className="ml-auto flex items-center gap-0.5">
        <Button
          size="icon"
          variant="ghost"
          className="size-5"
          onClick={() => onChange(Math.max(0, value - 1))}
        >
          <Minus className="size-3" />
        </Button>
        <Input
          type="number"
          value={value}
          onChange={e => onChange(toNumber(e.target.value, value, { max }))}
          className="h-6 w-10 border-0 bg-transparent p-0 text-center text-sm"
        />
        <span className="text-muted-foreground text-xs">/{max}</span>
        <Button
          size="icon"
          variant="ghost"
          className="size-5"
          onClick={() => onChange(Math.min(max, value + 1))}
        >
          <Plus className="size-3" />
        </Button>
      </div>
    </div>
  );
}

interface CountdownControlProps {
  value: number;
  onChange: (v: number) => void;
}

export function CountdownControl({ value, onChange }: CountdownControlProps) {
  return (
    <div className="bg-muted/50 flex items-center gap-2 rounded border px-2 py-1">
      <span className="text-muted-foreground text-xs">Countdown</span>
      <div className="ml-auto flex items-center gap-1">
        <Button
          size="icon"
          variant="ghost"
          className="size-5"
          onClick={() => onChange(Math.max(0, value - 1))}
        >
          <Minus className="size-3" />
        </Button>
        <span className="w-6 text-center text-sm font-medium">{value}</span>
        <Button
          size="icon"
          variant="ghost"
          className="size-5"
          onClick={() => onChange(value + 1)}
        >
          <Plus className="size-3" />
        </Button>
      </div>
    </div>
  );
}
