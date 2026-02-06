import { Footprints, Target } from 'lucide-react';

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
    <div className={cn('quick-core-scores-card', className)}>
      <div className="quick-core-score">
        <div className="quick-core-score-icon-wrap evasion">
          <Footprints className="size-4 sm:size-5" />
        </div>
        <div className="quick-core-score-data">
          <span className="quick-core-score-value">{scores.evasion}</span>
          <span className="quick-core-score-label">Evasion</span>
        </div>
      </div>
      <div className="quick-core-scores-divider" />
      <div className="quick-core-score">
        <div className="quick-core-score-icon-wrap proficiency">
          <Target className="size-4 sm:size-5" />
        </div>
        <div className="quick-core-score-data">
          <span className="quick-core-score-value">+{scores.proficiency}</span>
          <span className="quick-core-score-label">Proficiency</span>
        </div>
      </div>
    </div>
  );
}
