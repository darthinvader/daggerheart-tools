import type { CoreScoresState } from '@/components/core-scores';
import { cn } from '@/lib/utils';

interface QuickCoreScoresInfoProps {
  scores: CoreScoresState;
  className?: string;
}

/**
 * Display core scores (evasion/proficiency) in QuickView.
 *
 * NOTE: scores.evasion and scores.proficiency are already the final calculated
 * values when auto-calculate is enabled. They include class base + armor + equipment
 * modifiers. We simply display them as-is without adding extra modifiers.
 */
export function QuickCoreScoresInfo({
  scores,
  className,
}: QuickCoreScoresInfoProps) {
  return (
    <div
      className={cn(
        'bg-card flex items-center justify-center gap-4 rounded-lg border p-2 sm:gap-6 sm:p-3',
        className
      )}
    >
      <div className="flex flex-col items-center">
        <span className="text-muted-foreground text-[10px] sm:text-xs">
          Evasion
        </span>
        <span className="text-lg font-bold sm:text-xl">{scores.evasion}</span>
      </div>
      <div className="bg-border h-6 w-px sm:h-8" />
      <div className="flex flex-col items-center">
        <span className="text-muted-foreground text-[10px] sm:text-xs">
          Proficiency
        </span>
        <span className="text-lg font-bold sm:text-xl">
          +{scores.proficiency}
        </span>
      </div>
    </div>
  );
}
