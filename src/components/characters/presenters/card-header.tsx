import * as React from 'react';

import { CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export type CharacterCardHeaderProps = {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
};

// Shared header presenter for character cards: title on left, optional actions on right
export function CharacterCardHeader({
  title,
  subtitle,
  actions,
  className,
  titleClassName,
  subtitleClassName,
}: CharacterCardHeaderProps) {
  return (
    <CardHeader
      className={cn(
        'flex-row items-center justify-between space-y-0',
        className
      )}
    >
      <div className="min-w-0">
        <CardTitle className={titleClassName}>{title}</CardTitle>
        {subtitle ? (
          <div
            className={cn('text-muted-foreground text-xs', subtitleClassName)}
          >
            {subtitle}
          </div>
        ) : null}
      </div>
      {actions ? (
        <div className="flex items-center gap-2">{actions}</div>
      ) : null}
    </CardHeader>
  );
}
