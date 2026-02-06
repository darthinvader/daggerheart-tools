import type { ReactElement } from 'react';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ConditionalTooltipProps {
  content: string | undefined;
  children: ReactElement;
}

/** Wraps children in a Tooltip when content is defined; renders children directly otherwise. */
export function ConditionalTooltip({
  content,
  children,
}: ConditionalTooltipProps) {
  if (!content) {
    return children;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>{content}</TooltipContent>
    </Tooltip>
  );
}
