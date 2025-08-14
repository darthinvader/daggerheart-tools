import type { ReactNode } from 'react';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export type FeatureBlockProps = {
  label?: string;
  icon?: ReactNode;
  name: string;
  description?: string;
  tone?: 'default' | 'accent';
  className?: string;
  id?: string;
  labelId?: string;
};

export function FeatureBlock({
  label = 'Feature',
  icon,
  name,
  description,
  tone = 'accent',
  className,
  id,
  labelId,
}: FeatureBlockProps) {
  const headingId = labelId ?? (id ? `${id}-label` : undefined);
  return (
    <div
      className={cn(
        'rounded-md border p-2',
        tone === 'accent' ? 'bg-accent/10' : undefined,
        className
      )}
      role="group"
      aria-labelledby={headingId}
      id={id}
    >
      <div className="text-muted-foreground flex items-center gap-1 text-[10px] uppercase">
        <span id={headingId}>{label}</span>
        <Badge variant="outline">
          <span aria-hidden="true">{icon ?? '\u2728'}</span>
        </Badge>
      </div>
      <div className="font-medium">{name}</div>
      {description ? (
        <div className="text-muted-foreground text-xs">{description}</div>
      ) : null}
    </div>
  );
}
