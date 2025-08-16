import type { ReactNode } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// Simple card scaffold used by identity-related cards; now renders actions in the header
export function CardScaffold({
  title,
  subtitle,
  actions,
  children,
  className,
  onTitleClick,
}: {
  title: string;
  subtitle?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  onTitleClick?: () => void;
}) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div className="min-w-0">
          {onTitleClick ? (
            <button
              type="button"
              aria-label={`Open ${title} editor`}
              onClick={onTitleClick}
              className="line-clamp-1 max-w-full cursor-pointer text-left hover:underline"
              title={title}
            >
              <CardTitle className="inline text-inherit">{title}</CardTitle>
            </button>
          ) : (
            <CardTitle>{title}</CardTitle>
          )}
          {subtitle ? (
            <div className="text-muted-foreground text-xs">{subtitle}</div>
          ) : null}
        </div>
        {actions ? (
          <div className="flex items-center gap-2">{actions}</div>
        ) : null}
      </CardHeader>
      <CardContent className={cn('min-w-0', className)}>{children}</CardContent>
    </Card>
  );
}
