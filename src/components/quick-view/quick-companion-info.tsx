import { useCallback } from 'react';

import type { CompanionState } from '@/components/companion';
import { NumberControl } from '@/components/shared/labeled-counter/number-control';
import { Badge } from '@/components/ui/badge';
import { PawPrint } from '@/lib/icons';
import { cn } from '@/lib/utils';

interface QuickCompanionInfoProps {
  companion: CompanionState | undefined;
  onChange?: (companion: CompanionState | undefined) => void;
  className?: string;
}

/** Visual stress pip: filled or empty circle */
function StressPip({ filled }: { filled: boolean }) {
  return (
    <span
      className={cn(
        'quick-companion-stress-pip',
        filled && 'quick-companion-stress-pip-filled'
      )}
    />
  );
}

/** Training badge labels */
const TRAINING_LABELS: {
  key: keyof CompanionState['training'];
  label: string;
  format: (v: number | boolean) => string | null;
}[] = [
  {
    key: 'intelligent',
    label: 'Intelligent',
    format: v => (typeof v === 'number' && v > 0 ? `+${v}` : null),
  },
  {
    key: 'lightInTheDark',
    label: 'Light in the Dark',
    format: v => (v ? '✦' : null),
  },
  {
    key: 'creatureComfort',
    label: 'Creature Comfort',
    format: v => (v ? '✦' : null),
  },
  { key: 'armored', label: 'Armored', format: v => (v ? '✦' : null) },
  {
    key: 'vicious',
    label: 'Vicious',
    format: v => (typeof v === 'number' && v > 0 ? `+${v}` : null),
  },
  {
    key: 'resilient',
    label: 'Resilient',
    format: v => (typeof v === 'number' && v > 0 ? `+${v}` : null),
  },
  { key: 'bonded', label: 'Bonded', format: v => (v ? '✦' : null) },
  {
    key: 'aware',
    label: 'Aware',
    format: v => (typeof v === 'number' && v > 0 ? `+${v * 2} Eva` : null),
  },
];

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
        'quick-companion-card',
        isOutOfScene && 'quick-companion-out',
        className
      )}
    >
      {/* Header */}
      <div className="quick-companion-header">
        <div className="quick-companion-identity">
          <PawPrint className="size-4 text-emerald-500" />
          <span className="quick-companion-name">
            {companion.name || 'Companion'}
          </span>
          {companion.type && (
            <span className="text-muted-foreground text-[11px]">
              ({companion.type})
            </span>
          )}
        </div>
        {isOutOfScene && (
          <Badge variant="destructive" className="text-[10px]">
            Out of Scene
          </Badge>
        )}
      </div>

      {/* Stats row */}
      <div className="quick-companion-stats">
        <div className="quick-companion-stat">
          <span className="quick-companion-stat-label">Evasion</span>
          <span className="quick-companion-stat-value">{effectiveEvasion}</span>
        </div>
        <div className="quick-companion-stat">
          <span className="quick-companion-stat-label">Attack</span>
          <span className="quick-companion-stat-value">
            {companion.standardAttack}
          </span>
          <span className="text-muted-foreground text-[10px]">
            {companion.damageDie}, {companion.range}
          </span>
        </div>
        <div className="quick-companion-stat">
          <span className="quick-companion-stat-label">Stress</span>
          <div className="quick-companion-stress-slots">
            {Array.from({ length: totalStressSlots }, (_, i) => (
              <StressPip key={i} filled={i < companion.markedStress} />
            ))}
          </div>
          <div className="flex items-center gap-1">
            {onChange ? (
              <NumberControl
                value={companion.markedStress}
                onChange={handleStressChange}
                min={0}
                max={totalStressSlots}
                size="sm"
              />
            ) : (
              <span className="quick-companion-stat-value">
                {companion.markedStress}
              </span>
            )}
            <span className="text-muted-foreground text-[10px]">
              / {totalStressSlots}
            </span>
          </div>
        </div>
      </div>

      {/* Experiences */}
      {companion.experiences.filter(e => e.name).length > 0 && (
        <div className="quick-companion-experiences">
          {companion.experiences
            .filter(e => e.name)
            .map((exp, i) => (
              <Badge key={i} variant="outline" className="text-[10px]">
                {exp.name} +{exp.bonus}
              </Badge>
            ))}
        </div>
      )}

      {/* Training badges */}
      {(() => {
        const activeBadges = TRAINING_LABELS.map(t => ({
          ...t,
          display: t.format(companion.training[t.key] as never),
        })).filter(t => t.display !== null);
        if (activeBadges.length === 0) return null;
        return (
          <div className="quick-companion-training">
            {activeBadges.map(t => (
              <span key={t.key} className="quick-companion-training-badge">
                {t.label}
                {t.display !== '✦' && (
                  <span className="text-primary">{t.display}</span>
                )}
              </span>
            ))}
          </div>
        );
      })()}
    </div>
  );
}
