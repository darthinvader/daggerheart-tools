import { useCallback } from 'react';

import type { ResourcesState } from '@/components/resources';
import type { HopeWithScarsState } from '@/components/scars';
import { NumberControl } from '@/components/shared/labeled-counter/number-control';
import type { Scar } from '@/lib/schemas/session-state';
import { cn } from '@/lib/utils';

interface QuickVitalsInfoProps {
  resources: ResourcesState;
  hopeState: HopeWithScarsState;
  onResourcesChange?: (resources: ResourcesState) => void;
  onHopeChange?: (state: HopeWithScarsState) => void;
  bonusHopeSlots?: number;
  className?: string;
}

interface VitalProps {
  label: string;
  emoji: string;
  current: number;
  max: number;
  onChange?: (value: number) => void;
  colorClass?: string;
}

function Vital({
  label,
  emoji,
  current,
  max,
  onChange,
  colorClass = 'text-foreground',
}: VitalProps) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-muted-foreground text-xs">{label}</span>
      <div className="flex items-center gap-1">
        <span className="text-sm">{emoji}</span>
        {onChange ? (
          <NumberControl
            value={current}
            onChange={onChange}
            min={0}
            max={max}
            size="sm"
          />
        ) : (
          <span className={cn('font-bold', colorClass)}>{current}</span>
        )}
        <span className="text-muted-foreground text-xs">/ {max}</span>
      </div>
    </div>
  );
}

function ScarItem({ scar }: { scar: Scar }) {
  return (
    <span className="text-destructive text-xs">💀 {scar.description}</span>
  );
}

// eslint-disable-next-line max-lines-per-function
export function QuickVitalsInfo({
  resources,
  hopeState,
  onResourcesChange,
  onHopeChange,
  bonusHopeSlots = 0,
  className,
}: QuickVitalsInfoProps) {
  const extraSlots = hopeState.extraSlots ?? 0;
  const effectiveMax = hopeState.max + extraSlots;
  const scars = hopeState.scars ?? [];
  const companionHopeFilled = hopeState.companionHopeFilled ?? false;

  const handleHpChange = useCallback(
    (value: number) => {
      onResourcesChange?.({
        ...resources,
        hp: { ...resources.hp, current: value },
      });
    },
    [resources, onResourcesChange]
  );

  const handleArmorChange = useCallback(
    (value: number) => {
      onResourcesChange?.({
        ...resources,
        armorScore: { ...resources.armorScore, current: value },
      });
    },
    [resources, onResourcesChange]
  );

  const handleStressChange = useCallback(
    (value: number) => {
      onResourcesChange?.({
        ...resources,
        stress: { ...resources.stress, current: value },
      });
    },
    [resources, onResourcesChange]
  );

  const handleHopeChange = useCallback(
    (value: number) => {
      onHopeChange?.({ ...hopeState, current: value });
    },
    [hopeState, onHopeChange]
  );

  const handleCompanionHopeToggle = useCallback(() => {
    if (!onHopeChange || bonusHopeSlots === 0) return;
    onHopeChange({ ...hopeState, companionHopeFilled: !companionHopeFilled });
  }, [hopeState, onHopeChange, bonusHopeSlots, companionHopeFilled]);

  return (
    <div className={cn('bg-card rounded-lg border p-3', className)}>
      <div className="flex flex-wrap items-center justify-center gap-4">
        {/* HP */}
        <Vital
          label="HP"
          emoji="❤️"
          current={resources.hp.current}
          max={resources.hp.max}
          onChange={onResourcesChange ? handleHpChange : undefined}
          colorClass={
            resources.hp.current <= resources.hp.max * 0.25
              ? 'text-red-500'
              : resources.hp.current <= resources.hp.max * 0.5
                ? 'text-yellow-500'
                : 'text-green-500'
          }
        />
        <div className="bg-border hidden h-8 w-px sm:block" />

        {/* Armor */}
        <Vital
          label="Armor"
          emoji="🛡️"
          current={resources.armorScore.current}
          max={resources.armorScore.max}
          onChange={onResourcesChange ? handleArmorChange : undefined}
          colorClass="text-blue-400"
        />
        <div className="bg-border hidden h-8 w-px sm:block" />

        {/* Stress */}
        <Vital
          label="Stress"
          emoji="😰"
          current={resources.stress.current}
          max={resources.stress.max}
          onChange={onResourcesChange ? handleStressChange : undefined}
          colorClass="text-purple-400"
        />
        <div className="bg-border hidden h-8 w-px sm:block" />

        {/* Hope */}
        <Vital
          label="Hope"
          emoji="✨"
          current={hopeState.current}
          max={effectiveMax}
          onChange={onHopeChange ? handleHopeChange : undefined}
          colorClass="text-amber-400"
        />

        {/* Companion bonus hope slot */}
        {bonusHopeSlots > 0 && (
          <button
            type="button"
            onClick={handleCompanionHopeToggle}
            className={cn(
              'flex items-center gap-1 text-xs transition-colors',
              companionHopeFilled
                ? 'text-emerald-500'
                : 'text-muted-foreground hover:text-emerald-500'
            )}
            disabled={!onHopeChange}
          >
            <span>🐾</span>
            <span>{companionHopeFilled ? '✓' : '○'}</span>
          </button>
        )}
      </div>

      {/* Scars display (read-only) */}
      {scars.length > 0 && (
        <div className="mt-2 flex flex-wrap justify-center gap-2">
          {scars.map(scar => (
            <ScarItem key={scar.id} scar={scar} />
          ))}
        </div>
      )}
    </div>
  );
}
