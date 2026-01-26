import { Focus, Trash2 } from 'lucide-react';
import type React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { SmartTooltip } from '@/components/ui/smart-tooltip';
import { cn } from '@/lib/utils';

import { toNumber } from './utils';

export function EmptyStateCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="text-muted-foreground flex flex-col items-center gap-2 rounded-lg border border-dashed p-6 text-center text-sm">
      <div className="bg-muted text-foreground flex h-12 w-12 items-center justify-center rounded-full">
        {icon}
      </div>
      <div>
        <p className="text-foreground font-semibold">{title}</p>
        <p>{description}</p>
      </div>
    </div>
  );
}

export function RosterCard({
  title,
  subtitle,
  badgeLabel,
  badgeTone,
  isSpotlight = false,
  isSelected,
  onSelect,
  onRemove,
  onSpotlight,
  children,
}: {
  title: string;
  subtitle: string;
  badgeLabel: string;
  badgeTone: string;
  isSpotlight?: boolean;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
  onSpotlight: () => void;
  children: React.ReactNode;
}) {
  return (
    <Card
      className={cn(
        'hover:border-primary/40 transition-colors',
        isSelected && 'border-primary/60 bg-primary/5'
      )}
    >
      <CardContent className="space-y-3 p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-base font-semibold">{title}</p>
            <p className="text-muted-foreground text-xs">{subtitle}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={cn('text-xs', badgeTone)}>{badgeLabel}</Badge>
            {isSpotlight && (
              <Badge variant="secondary" className="gap-1 text-xs">
                <Focus className="size-3" /> Spotlight
              </Badge>
            )}
            <SmartTooltip content="Set spotlight">
              <Button size="icon" variant="outline" onClick={onSpotlight}>
                <Focus className="size-4" />
              </Button>
            </SmartTooltip>
            <SmartTooltip content="Remove from battle">
              <Button size="icon" variant="ghost" onClick={onRemove}>
                <Trash2 className="size-4" />
              </Button>
            </SmartTooltip>
          </div>
        </div>
        <button
          className="text-left"
          onClick={onSelect}
          aria-label={`Select ${title}`}
        >
          {children}
        </button>
      </CardContent>
    </Card>
  );
}

export function StatChip({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="bg-muted text-muted-foreground flex items-center gap-1 rounded-full px-2 py-1 text-xs">
      {icon} {label}
    </div>
  );
}

export function StatCounter({
  label,
  value,
  max,
  icon,
  onChange,
}: {
  label: string;
  value: number;
  max: number;
  icon: React.ReactNode;
  onChange: (next: number) => void;
}) {
  return (
    <div className="space-y-2 rounded-md border p-3">
      <div className="text-muted-foreground flex items-center justify-between text-xs">
        <span className="flex items-center gap-1">
          {icon} {label}
        </span>
        <span>
          {value}/{max}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onChange(Math.max(value - 1, 0))}
        >
          -
        </Button>
        <Input
          type="number"
          value={value}
          onChange={event =>
            onChange(toNumber(event.target.value, value, { max }))
          }
        />
        <Button
          size="sm"
          variant="outline"
          onClick={() => onChange(Math.min(value + 1, max))}
        >
          +
        </Button>
      </div>
    </div>
  );
}

export function StatInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (next: number) => void;
}) {
  return (
    <div className="space-y-2 rounded-md border p-3">
      <div className="text-muted-foreground text-xs">{label}</div>
      <Input
        type="number"
        value={value}
        onChange={event => onChange(toNumber(event.target.value, value))}
      />
    </div>
  );
}
