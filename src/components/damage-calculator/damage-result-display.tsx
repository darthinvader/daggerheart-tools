import { AlertTriangle, ArrowDown, Heart, Shield } from 'lucide-react';

import { cn } from '@/lib/utils';

import { SEVERITY_LEVELS } from './constants';
import type { DamageResult, HealthState } from './types';

interface DamageResultDisplayProps {
  result: DamageResult;
  thresholds: HealthState['thresholds'];
}

export function DamageResultDisplay({ result }: DamageResultDisplayProps) {
  const severityInfo = SEVERITY_LEVELS.find(
    s => s.threshold === result.severity
  );

  return (
    <div className="space-y-4">
      {/* Damage Flow */}
      <div className="space-y-2">
        {/* Incoming */}
        <div className="bg-muted flex items-center justify-between rounded-lg p-3">
          <span>Incoming Damage</span>
          <span className="text-xl font-bold">{result.incoming}</span>
        </div>

        {/* Severity Classification */}
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
            <span className={cn('font-medium capitalize', severityInfo?.color)}>
              {result.severity} Damage
            </span>
          </span>
          <span
            className={cn(
              'text-sm font-medium',
              severityInfo?.color ?? 'text-green-500'
            )}
          >
            Base HP loss: {result.hpLost + result.armorSlotsSacrificed}
          </span>
        </div>

        {/* Armor Reduction */}
        {result.armorSlotsSacrificed > 0 && (
          <>
            <div className="flex justify-center">
              <ArrowDown className="text-muted-foreground h-4 w-4" />
            </div>
            <div className="flex items-center justify-between rounded-lg bg-slate-500/10 p-3">
              <span className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Armor Slots Sacrificed
              </span>
              <span className="text-lg font-semibold text-slate-500">
                -{result.armorSlotsSacrificed} HP
              </span>
            </div>
          </>
        )}

        {/* Final HP Loss */}
        <div className="flex justify-center">
          <ArrowDown className="text-muted-foreground h-4 w-4" />
        </div>
        <div
          className={cn(
            'flex items-center justify-between rounded-lg p-3',
            result.isDeadly ? 'bg-red-500/20' : 'bg-red-500/10'
          )}
        >
          <span className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-red-500" />
            HP Lost
          </span>
          <span className="text-xl font-bold text-red-500">
            {result.hpLost}
          </span>
        </div>
      </div>

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
