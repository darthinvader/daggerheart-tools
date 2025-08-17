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
  titleClassName,
  onTitleClick,
}: {
  title: string;
  subtitle?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  titleClassName?: string;
  onTitleClick?: () => void;
}) {
  const isInteractive = (t: EventTarget | null) => {
    if (!(t instanceof HTMLElement)) return false;
    return !!t.closest(
      'button, a, input, textarea, select, [role="button"], [role="link"], [contenteditable="true"], [data-no-open]'
    );
  };
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div className="min-w-0">
          {onTitleClick ? (
            <button
              type="button"
              aria-label={`Open ${title} editor`}
              onClick={onTitleClick}
              className={cn(
                'line-clamp-1 max-w-full cursor-pointer text-left hover:underline',
                titleClassName
              )}
              title={title}
            >
              <CardTitle className={cn('inline text-inherit', titleClassName)}>
                {title}
              </CardTitle>
            </button>
          ) : (
            <CardTitle className={titleClassName}>{title}</CardTitle>
          )}
          {subtitle ? (
            onTitleClick ? (
              <button
                type="button"
                onClick={onTitleClick}
                className="text-muted-foreground text-xs hover:underline"
              >
                {subtitle}
              </button>
            ) : (
              <div className="text-muted-foreground text-xs">{subtitle}</div>
            )
          ) : null}
        </div>
        {actions ? (
          <div className="flex items-center gap-2">{actions}</div>
        ) : null}
      </CardHeader>
      {onTitleClick ? (
        <CardContent
          role="button"
          tabIndex={0}
          onClick={e => {
            if (isInteractive(e.target)) return;
            onTitleClick();
          }}
          onKeyDown={e => {
            if (isInteractive(e.target)) return;
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onTitleClick();
            }
          }}
          className={cn(
            'hover:bg-accent/30 focus-visible:ring-ring min-w-0 cursor-pointer rounded-md transition-colors focus-visible:ring-2 focus-visible:outline-none',
            className
          )}
        >
          {children}
        </CardContent>
      ) : (
        <CardContent className={cn('min-w-0', className)}>
          {children}
        </CardContent>
      )}
    </Card>
  );
}
