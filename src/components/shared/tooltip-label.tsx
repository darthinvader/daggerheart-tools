import type * as React from 'react';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export interface TooltipLabelProps {
  label: string;
  tooltip: string;
  className?: string;
  labelIcon?: React.ComponentType<{ className?: string }>;
}

export function TooltipLabel({
  label,
  tooltip,
  className,
  labelIcon: LabelIcon,
}: TooltipLabelProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className={`cursor-help underline decoration-dotted underline-offset-2 ${className ?? ''}`}
        >
          {LabelIcon && <LabelIcon className="mr-1 inline-block size-3" />}
          {label}:
        </span>
      </TooltipTrigger>
      <TooltipContent sideOffset={6}>{tooltip}</TooltipContent>
    </Tooltip>
  );
}
