import type { CoreScoresState } from '@/components/core-scores';
import { cn } from '@/lib/utils';

interface QuickCoreScoresInfoProps {
  scores: CoreScoresState;
  className?: string;
}

export function QuickCoreScoresInfo({
  scores,
  className,
}: QuickCoreScoresInfoProps) {
  return (
    <div
      className={cn(
        'bg-card flex items-center justify-center gap-6 rounded-lg border p-3',
        className
      )}
    >
      <div className="flex flex-col items-center">
        <span className="text-muted-foreground text-xs">Evasion</span>
        <span className="text-xl font-bold">{scores.evasion}</span>
      </div>
      <div className="bg-border h-8 w-px" />
      <div className="flex flex-col items-center">
        <span className="text-muted-foreground text-xs">Proficiency</span>
        <span className="text-xl font-bold">+{scores.proficiency}</span>
      </div>
    </div>
  );
}
