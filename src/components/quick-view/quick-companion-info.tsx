import { useCallback } from 'react';

import type { CompanionState } from '@/components/companion';
import { NumberControl } from '@/components/shared/labeled-counter/number-control';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface QuickCompanionInfoProps {
  companion: CompanionState | undefined;
  onChange?: (companion: CompanionState | undefined) => void;
  className?: string;
}

export function QuickCompanionInfo({
  companion,
  onChange,
  className,
}: QuickCompanionInfoProps) {
  const handleStressChange = useCallback(
    (value: number) => {
      if (!onChange || !companion) return;
      onChange({ ...companion, markedStress: value });
    },
    [companion, onChange]
  );

  if (!companion) {
    return null;
  }

  const totalStressSlots =
    companion.stressSlots + (companion.training.resilient ?? 0);
  const isOutOfScene = companion.markedStress >= totalStressSlots;
  const effectiveEvasion =
    companion.evasion + (companion.training.aware ?? 0) * 2;

  return (
    <div
      className={cn(
        'bg-card rounded-lg border p-3',
        isOutOfScene && 'opacity-60',
        className
      )}
    >
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">🐾</span>
          <span className="font-semibold">{companion.name || 'Companion'}</span>
          {companion.type && (
            <span className="text-muted-foreground text-sm">
              ({companion.type})
            </span>
          )}
        </div>
        {isOutOfScene && (
          <Badge variant="destructive" className="text-xs">
            Out of Scene
          </Badge>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-4 text-sm">
        {/* Stats */}
        <div className="flex items-center gap-1">
          <span className="text-muted-foreground">Evasion:</span>
          <span className="font-medium">{effectiveEvasion}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-muted-foreground">Attack:</span>
          <span className="font-medium">{companion.standardAttack}</span>
          <span className="text-muted-foreground text-xs">
            ({companion.damageDie}, {companion.range})
          </span>
        </div>

        {/* Stress control */}
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Stress:</span>
          {onChange ? (
            <NumberControl
              value={companion.markedStress}
              onChange={handleStressChange}
              min={0}
              max={totalStressSlots}
              size="sm"
            />
          ) : (
            <span className="font-medium">{companion.markedStress}</span>
          )}
          <span className="text-muted-foreground">/ {totalStressSlots}</span>
        </div>
      </div>

      {/* Experiences */}
      {companion.experiences.filter(e => e.name).length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {companion.experiences
            .filter(e => e.name)
            .map((exp, i) => (
              <Badge key={i} variant="outline" className="text-xs">
                {exp.name} +{exp.bonus}
              </Badge>
            ))}
        </div>
      )}
    </div>
  );
}
