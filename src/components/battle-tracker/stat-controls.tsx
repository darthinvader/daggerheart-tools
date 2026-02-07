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
  onChange?: (v: number) => void;
  colorClass?: string;
  icon?: ReactNode;
  /** If true, shows as read-only display without controls */
  readOnly?: boolean;
}

export function StatMini({
  label,
  value,
  max,
  onChange,
  colorClass,
  icon,
  readOnly,
}: StatMiniProps) {
  // Read-only display (for linked player characters)
  if (readOnly) {
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
          <span className={cn('text-sm font-medium', colorClass)}>{value}</span>
          <span className="text-muted-foreground text-xs">/{max}</span>
        </div>
      </div>
    );
  }

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
          className="size-5 min-h-[44px] min-w-[44px]"
          aria-label={`Decrease ${label}`}
          onClick={() => onChange?.(Math.max(0, value - 1))}
        >
          <Minus className="size-3" />
        </Button>
        <Input
          type="number"
          value={value}
          onChange={e => onChange?.(toNumber(e.target.value, value, { max }))}
          className="h-6 w-10 border-0 bg-transparent p-0 text-center text-sm"
        />
        <span className="text-muted-foreground text-xs">/{max}</span>
        <Button
          size="icon"
          variant="ghost"
          className="size-5 min-h-[44px] min-w-[44px]"
          aria-label={`Increase ${label}`}
          onClick={() => onChange?.(Math.min(max, value + 1))}
        >
          <Plus className="size-3" />
        </Button>
      </div>
    </div>
  );
}

interface CountdownControlProps {
  value: number;
  enabled: boolean;
  onChange: (v: number) => void;
  onEnabledChange: (enabled: boolean) => void;
}

export function CountdownControl({
  value,
  enabled,
  onChange,
  onEnabledChange,
}: CountdownControlProps) {
  const isZero = value === 0 && enabled;

  return (
    <div
      className={cn(
        'bg-muted/50 flex items-center gap-2 rounded border px-2 py-1 transition-all',
        isZero && 'animate-pulse border-amber-500 bg-amber-500/20',
        !enabled && 'opacity-50'
      )}
    >
      <button
        onClick={() => onEnabledChange(!enabled)}
        className={cn(
          'flex size-4 items-center justify-center rounded-sm border transition-colors',
          enabled
            ? 'border-primary bg-primary text-primary-foreground'
            : 'border-muted-foreground'
        )}
        title={enabled ? 'Disable countdown' : 'Enable countdown'}
      >
        {enabled && <span className="text-[10px]">✓</span>}
      </button>
      <span
        className={cn(
          'text-xs',
          enabled ? 'text-foreground' : 'text-muted-foreground'
        )}
      >
        Countdown
      </span>
      <div className="ml-auto flex items-center gap-1">
        <Button
          size="icon"
          variant="ghost"
          className="size-5 min-h-[44px] min-w-[44px]"
          aria-label="Decrease countdown"
          onClick={() => onChange(Math.max(0, value - 1))}
          disabled={!enabled}
        >
          <Minus className="size-3" />
        </Button>
        <span
          className={cn(
            'w-6 text-center text-sm font-medium',
            isZero && 'text-amber-500'
          )}
        >
          {value}
        </span>
        <Button
          size="icon"
          variant="ghost"
          className="size-5 min-h-[44px] min-w-[44px]"
          aria-label="Increase countdown"
          onClick={() => onChange(value + 1)}
          disabled={!enabled}
        >
          <Plus className="size-3" />
        </Button>
      </div>
    </div>
  );
}
