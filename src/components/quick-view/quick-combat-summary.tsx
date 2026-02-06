import { Footprints, Shield, Swords, Target, Zap } from 'lucide-react';

import type { CoreScoresState } from '@/components/core-scores';
import type { ThresholdsSettings } from '@/lib/schemas/character-state';
import { cn } from '@/lib/utils';

interface QuickCombatSummaryProps {
  coreScores: CoreScoresState;
  thresholds: ThresholdsSettings;
  className?: string;
}

/**
 * Single-line combat stat summary for at-a-glance reference.
 * Shows Evasion · Proficiency · Major · Severe inline.
 */
export function QuickCombatSummary({
  coreScores,
  thresholds,
  className,
}: QuickCombatSummaryProps) {
  return (
    <div className={cn('quick-combat-summary', className)}>
      <div className="quick-combat-summary-item">
        <Footprints className="size-3 text-blue-400" />
        <span className="quick-combat-summary-value">{coreScores.evasion}</span>
        <span className="quick-combat-summary-label">Evasion</span>
      </div>
      <span className="quick-combat-summary-dot">·</span>
      <div className="quick-combat-summary-item">
        <Target className="size-3 text-emerald-400" />
        <span className="quick-combat-summary-value">
          +{coreScores.proficiency}
        </span>
        <span className="quick-combat-summary-label">Prof</span>
      </div>
      <span className="quick-combat-summary-dot">·</span>
      <div className="quick-combat-summary-item">
        <Swords className="size-3 text-yellow-400" />
        <span className="quick-combat-summary-value">
          {thresholds.values.major}+
        </span>
        <span className="quick-combat-summary-label">Major</span>
      </div>
      <span className="quick-combat-summary-dot">·</span>
      <div className="quick-combat-summary-item">
        <Shield className="size-3 text-orange-400" />
        <span className="quick-combat-summary-value">
          {thresholds.values.severe}+
        </span>
        <span className="quick-combat-summary-label">Severe</span>
      </div>
      {thresholds.enableCritical && (
        <>
          <span className="quick-combat-summary-dot">·</span>
          <div className="quick-combat-summary-item">
            <Zap className="size-3 text-red-400" />
            <span className="quick-combat-summary-value">
              {thresholds.values.critical ?? '—'}+
            </span>
            <span className="quick-combat-summary-label">Crit</span>
          </div>
        </>
      )}
    </div>
  );
}
