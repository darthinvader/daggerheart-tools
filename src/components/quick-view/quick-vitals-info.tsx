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

function getHpColors(current: number, max: number) {
  const percent = max > 0 ? current / max : 1;
  if (percent <= 0.25) return { bar: 'bg-red-500', text: 'text-red-500' };
  if (percent <= 0.5) return { bar: 'bg-yellow-500', text: 'text-yellow-500' };
  return { bar: 'bg-emerald-500', text: 'text-emerald-500' };
}

interface CompanionHopeToggleProps {
  filled: boolean;
  onToggle: () => void;
  disabled: boolean;
}

function CompanionHopeToggle({
  filled,
  onToggle,
  disabled,
}: CompanionHopeToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        'mt-1.5 flex items-center gap-1 self-end text-[11px] transition-colors',
        filled
          ? 'text-emerald-500'
          : 'text-muted-foreground hover:text-emerald-500'
      )}
      disabled={disabled}
    >
      <PawPrint className="size-3" />
      <span className="flex items-center gap-0.5">
        Companion Hope: {filled ? <Check className="size-3" /> : <span>○</span>}
      </span>
    </button>
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

  const hpColors = getHpColors(resources.hp.current, resources.hp.max);

  const vitalBars: VitalBarProps[] = [
    {
      label: 'HP',
      icon: Heart,
      current: resources.hp.current,
      max: resources.hp.max,
      onChange: onResourcesChange ? handleHpChange : undefined,
      barColorClass: hpColors.bar,
      textColorClass: hpColors.text,
    },
    {
      label: 'Armor',
      icon: Shield,
      current: resources.armorScore.current,
      max: resources.armorScore.max,
      onChange: onResourcesChange ? handleArmorChange : undefined,
      barColorClass: 'bg-blue-500',
      textColorClass: 'text-blue-400',
    },
    {
      label: 'Stress',
      icon: HeartCrack,
      current: resources.stress.current,
      max: resources.stress.max,
      onChange: onResourcesChange ? handleStressChange : undefined,
      barColorClass: 'bg-purple-500',
      textColorClass: 'text-purple-400',
    },
    {
      label: 'Hope',
      icon: Sparkles,
      current: hopeState.current,
      max: effectiveMax,
      onChange: onHopeChange ? handleHopeChange : undefined,
      barColorClass: 'bg-amber-500',
      textColorClass: 'text-amber-400',
    },
  ];

  return (
    <div className={cn('quick-vitals-card', className)}>
      <div className="quick-vitals-grid">
        {vitalBars.map(bar => (
          <VitalBar key={bar.label} {...bar} />
        ))}
      </div>

      {bonusHopeSlots > 0 && (
        <CompanionHopeToggle
          filled={companionHopeFilled}
          onToggle={handleCompanionHopeToggle}
          disabled={!onHopeChange}
        />
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
