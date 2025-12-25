import * as React from 'react';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useCoarsePointer } from '@/hooks/use-coarse-pointer';
import { cn } from '@/lib/utils';

type Side = 'top' | 'right' | 'bottom' | 'left';

interface SmartTooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  side?: Side;
  className?: string;
  asChild?: boolean;
}

/**
 * A tooltip that works on both desktop and mobile.
 * - Desktop (hover-capable): Uses standard Radix Tooltip (hover to show)
 * - Mobile (touch): Uses Popover (tap to toggle, with click propagation stopped)
 */
export function SmartTooltip({
  children,
  content,
  side = 'top',
  className,
  asChild = true,
}: SmartTooltipProps) {
  const isTouch = useCoarsePointer();

  if (isTouch) {
    const handleTriggerClick = (e: React.MouseEvent) => {
      e.stopPropagation();
    };

    return (
      <Popover>
        <PopoverTrigger asChild={asChild} onClick={handleTriggerClick}>
          {children}
        </PopoverTrigger>
        <PopoverContent
          side={side}
          collisionPadding={16}
          className={cn(
            'bg-foreground text-background w-auto max-w-[calc(100vw-32px)] border-0 p-2 text-xs',
            className
          )}
          onClick={e => e.stopPropagation()}
        >
          {content}
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild={asChild}>{children}</TooltipTrigger>
      <TooltipContent side={side} className={className}>
        {content}
      </TooltipContent>
    </Tooltip>
  );
}
