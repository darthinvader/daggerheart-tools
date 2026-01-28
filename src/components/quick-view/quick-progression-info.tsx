import { BarChart3 } from 'lucide-react';

import type { ProgressionState } from '@/components/shared/progression-display';
import { cn } from '@/lib/utils';

interface QuickProgressionInfoProps {
  progression: ProgressionState;
  className?: string;
}

export function QuickProgressionInfo({
  progression,
  className,
}: QuickProgressionInfoProps) {
  return (
    <div
      className={cn(
        'bg-card flex items-center gap-2 rounded-lg border p-2 sm:gap-4 sm:p-3',
        className
      )}
    >
      <BarChart3 className="size-4 sm:size-5" />
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="text-muted-foreground text-xs sm:text-sm">
            Level
          </span>
          <span className="text-base font-bold sm:text-lg">
            {progression.currentLevel}
          </span>
        </div>
        <div className="bg-border h-3 w-px sm:h-4" />
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="text-muted-foreground text-xs sm:text-sm">Tier</span>
          <span className="text-base font-bold sm:text-lg">
            {progression.currentTier}
          </span>
        </div>
      </div>
    </div>
  );
}
