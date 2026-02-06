import {
  Check,
  Heart,
  HeartCrack,
  type LucideIcon,
  PawPrint,
  Shield,
  Skull,
  Sparkles,
} from 'lucide-react';
import { useCallback } from 'react';

import type { ConditionsState } from '@/components/conditions';
import type { ResourcesState } from '@/components/resources';
import type { HopeWithScarsState } from '@/components/scars';
import { NumberControl } from '@/components/shared/labeled-counter/number-control';
import {
  applyStressWithOverflow,
  shouldAddVulnerableFromStress,
} from '@/lib/mechanics';
import type { Scar } from '@/lib/schemas/session-state';
import { cn } from '@/lib/utils';

interface QuickVitalsInfoProps {
  resources: ResourcesState;
  hopeState: HopeWithScarsState;
  onResourcesChange?: (resources: ResourcesState) => void;
  onHopeChange?: (state: HopeWithScarsState) => void;
  bonusHopeSlots?: number;
  className?: string;
  /** Current conditions for auto-Vulnerable on full stress */
  conditions?: ConditionsState;
  /** Callback when conditions should change (for auto-Vulnerable) */
  onConditionsChange?: (conditions: ConditionsState) => void;
}

interface VitalBarProps {
  label: string;
  icon: LucideIcon;
  current: number;
  max: number;
  onChange?: (value: number) => void;
  barColorClass: string;
  textColorClass: string;
}

function VitalBar({
  label,
  icon: Icon,
  current,
  max,
  onChange,
  barColorClass,
  textColorClass,
}: VitalBarProps) {
  const percent = max > 0 ? Math.min((current / max) * 100, 100) : 0;

  return (
    <div className="quick-vital-bar">
      <div className="quick-vital-bar-header">
        <div className="quick-vital-bar-label">
          <Icon className={cn('size-3.5', textColorClass)} />
          <span className="text-[11px] font-semibold tracking-wide uppercase">
            {label}
          </span>
        </div>
        <div className="quick-vital-bar-value">
          {onChange ? (
            <NumberControl
              value={current}
              onChange={onChange}
              min={0}
              max={max}
              size="sm"
            />
          ) : (
            <span className={cn('text-sm font-bold', textColorClass)}>
              {current}
            </span>
          )}
          <span className="text-muted-foreground text-[10px]">/ {max}</span>
        </div>
      </div>
      <div className="quick-vital-bar-track">
        <div
          className={cn('quick-vital-bar-fill', barColorClass)}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

function ScarItem({ scar }: { scar: Scar }) {
  return (
    <span className="text-destructive flex items-center gap-1 text-[11px]">
      <Skull className="size-2.5" /> {scar.description}
    </span>
  );
}

export function QuickVitalsInfo({
  resources,
  hopeState,
  onResourcesChange,
  onHopeChange,
  bonusHopeSlots = 0,
  className,
  conditions,
  onConditionsChange,
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
      if (!onResourcesChange) return;

      const result = applyStressWithOverflow(
        resources.stress.current,
        resources.stress.max,
        resources.hp.current,
        value
      );

      onResourcesChange({
        ...resources,
        stress: { ...resources.stress, current: result.newStress },
        hp: { ...resources.hp, current: result.newHp },
      });

      if (
        result.shouldBecomeVulnerable &&
        conditions &&
        onConditionsChange &&
        shouldAddVulnerableFromStress(
          result.newStress,
          resources.stress.max,
          conditions.items
        )
      ) {
        onConditionsChange({
          ...conditions,
          items: [...conditions.items, 'Vulnerable'],
        });
      }
    },
    [resources, onResourcesChange, conditions, onConditionsChange]
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

  // Determine HP bar color based on percentage
  const hpPercent =
    resources.hp.max > 0 ? resources.hp.current / resources.hp.max : 1;
  const hpBarColor =
    hpPercent <= 0.25
      ? 'bg-red-500'
      : hpPercent <= 0.5
        ? 'bg-yellow-500'
        : 'bg-emerald-500';
  const hpTextColor =
    hpPercent <= 0.25
      ? 'text-red-500'
      : hpPercent <= 0.5
        ? 'text-yellow-500'
        : 'text-emerald-500';

  return (
    <div className={cn('quick-vitals-card', className)}>
      <div className="quick-vitals-grid">
        {/* HP */}
        <VitalBar
          label="HP"
          icon={Heart}
          current={resources.hp.current}
          max={resources.hp.max}
          onChange={onResourcesChange ? handleHpChange : undefined}
          barColorClass={hpBarColor}
          textColorClass={hpTextColor}
        />

        {/* Armor */}
        <VitalBar
          label="Armor"
          icon={Shield}
          current={resources.armorScore.current}
          max={resources.armorScore.max}
          onChange={onResourcesChange ? handleArmorChange : undefined}
          barColorClass="bg-blue-500"
          textColorClass="text-blue-400"
        />

        {/* Stress */}
        <VitalBar
          label="Stress"
          icon={HeartCrack}
          current={resources.stress.current}
          max={resources.stress.max}
          onChange={onResourcesChange ? handleStressChange : undefined}
          barColorClass="bg-purple-500"
          textColorClass="text-purple-400"
        />

        {/* Hope */}
        <VitalBar
          label="Hope"
          icon={Sparkles}
          current={hopeState.current}
          max={effectiveMax}
          onChange={onHopeChange ? handleHopeChange : undefined}
          barColorClass="bg-amber-500"
          textColorClass="text-amber-400"
        />
      </div>

      {/* Companion bonus hope */}
      {bonusHopeSlots > 0 && (
        <button
          type="button"
          onClick={handleCompanionHopeToggle}
          className={cn(
            'mt-1.5 flex items-center gap-1 self-end text-[11px] transition-colors',
            companionHopeFilled
              ? 'text-emerald-500'
              : 'text-muted-foreground hover:text-emerald-500'
          )}
          disabled={!onHopeChange}
        >
          <PawPrint className="size-3" />
          <span className="flex items-center gap-0.5">
            Companion Hope:{' '}
            {companionHopeFilled ? (
              <Check className="size-3" />
            ) : (
              <span>○</span>
            )}
          </span>
        </button>
      )}

      {/* Scars */}
      {scars.length > 0 && (
        <div className="quick-vitals-scars">
          {scars.map(scar => (
            <ScarItem key={scar.id} scar={scar} />
          ))}
        </div>
      )}
    </div>
  );
}
