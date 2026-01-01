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
        'bg-card flex items-center gap-4 rounded-lg border p-3',
        className
      )}
    >
      <span className="text-lg">📊</span>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-sm">Level</span>
          <span className="text-lg font-bold">{progression.currentLevel}</span>
        </div>
        <div className="bg-border h-4 w-px" />
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-sm">Tier</span>
          <span className="text-lg font-bold">{progression.currentTier}</span>
        </div>
      </div>
    </div>
  );
}
