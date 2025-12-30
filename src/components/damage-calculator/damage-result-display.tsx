import { AlertTriangle, ArrowDown, Heart, Shield, Zap } from 'lucide-react';

import { cn } from '@/lib/utils';

import { SEVERITY_LEVELS } from './constants';
import { getDamageSeverity } from './damage-utils';
import type { DamageResult, HealthState } from './types';

interface DamageResultDisplayProps {
  result: DamageResult;
  thresholds: HealthState['thresholds'];
}

export function DamageResultDisplay({
  result,
  thresholds,
}: DamageResultDisplayProps) {
  const severity = getDamageSeverity(result.hpDamage, thresholds);
  const severityInfo = SEVERITY_LEVELS.find(s => s.threshold === severity);

  return (
    <div className="space-y-4">
      {/* Damage Flow */}
      <div className="space-y-2">
        {/* Incoming */}
        <div className="bg-muted flex items-center justify-between rounded-lg p-3">
          <span>Incoming Damage</span>
          <span className="text-xl font-bold">{result.incoming}</span>
        </div>

        {/* Armor Absorption */}
        {result.absorbed > 0 && (
          <>
            <div className="flex justify-center">
              <ArrowDown className="text-muted-foreground h-4 w-4" />
            </div>
            <div className="flex items-center justify-between rounded-lg bg-slate-500/10 p-3">
              <span className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Absorbed by Armor
              </span>
              <span className="text-lg font-semibold text-slate-500">
                -{result.absorbed}
              </span>
            </div>
          </>
        )}

        {/* HP Damage */}
        <div className="flex justify-center">
          <ArrowDown className="text-muted-foreground h-4 w-4" />
        </div>
        <div
          className={cn(
            'flex items-center justify-between rounded-lg p-3',
            severityInfo?.bg ?? 'bg-green-500/10'
          )}
        >
          <span className="flex items-center gap-2">
            <Heart
              className={cn('h-4 w-4', severityInfo?.color ?? 'text-green-500')}
            />
            HP Damage
          </span>
          <span
            className={cn(
              'text-xl font-bold',
              severityInfo?.color ?? 'text-green-500'
            )}
          >
            {result.hpDamage}
          </span>
        </div>
      </div>

      {/* Stress */}
      {result.stressGained > 0 && (
        <div className="flex items-center justify-between rounded-lg bg-amber-500/10 p-3">
          <span className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-500" />
            Stress Gained ({severity} damage)
          </span>
          <span className="text-lg font-semibold text-amber-500">
            +{result.stressGained}
          </span>
        </div>
      )}

      {/* Deadly Warning */}
      {result.isDeadly && (
        <div className="bg-destructive/10 text-destructive flex items-center gap-2 rounded-lg p-3">
          <AlertTriangle className="h-5 w-5" />
          <div>
            <div className="font-semibold">Deadly Damage!</div>
            <div className="text-sm">
              This would reduce HP to 0 or below. Death move required.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
