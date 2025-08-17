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
  onTitleClick?: () => void;
};

// Shared header presenter for character cards: title on left, optional actions on right
export function CharacterCardHeader({
  title,
  subtitle,
  actions,
  className,
  titleClassName,
  subtitleClassName,
  onTitleClick,
}: CharacterCardHeaderProps) {
  return (
    <CardHeader
      className={cn(
        'flex-row items-center justify-between space-y-0',
        className
      )}
    >
      <div className="min-w-0">
        {onTitleClick ? (
          <button
            type="button"
            aria-label={
              typeof title === 'string' ? `Open ${title} editor` : 'Open editor'
            }
            onClick={onTitleClick}
            className={cn(
              'line-clamp-1 block max-w-full cursor-pointer text-left hover:underline',
              titleClassName
            )}
            title={typeof title === 'string' ? title : undefined}
          >
            <CardTitle className="inline text-inherit">{title}</CardTitle>
          </button>
        ) : (
          <CardTitle className={titleClassName}>{title}</CardTitle>
        )}
        {subtitle ? (
          onTitleClick ? (
            <button
              type="button"
              onClick={onTitleClick}
              className={cn(
                'text-muted-foreground text-xs hover:underline',
                subtitleClassName
              )}
            >
              {subtitle}
            </button>
          ) : (
            <div
              className={cn('text-muted-foreground text-xs', subtitleClassName)}
            >
              {subtitle}
            </div>
          )
        ) : null}
      </div>
      {actions ? (
        <div className="flex items-center gap-2">{actions}</div>
      ) : null}
    </CardHeader>
  );
}
