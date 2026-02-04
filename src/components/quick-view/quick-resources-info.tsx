import { type ReactNode, useCallback } from 'react';

import type { ConditionsState } from '@/components/conditions';
import type { ResourcesState } from '@/components/resources';
import { NumberControl } from '@/components/shared/labeled-counter/number-control';
import { AlertTriangle, Heart, Shield } from '@/lib/icons';
import {
  applyStressWithOverflow,
  shouldAddVulnerableFromStress,
} from '@/lib/mechanics';
import { cn } from '@/lib/utils';

interface QuickResourcesInfoProps {
  resources: ResourcesState;
  onChange?: (resources: ResourcesState) => void;
  className?: string;
  /** Current conditions for auto-Vulnerable on full stress */
  conditions?: ConditionsState;
  /** Callback when conditions should change (for auto-Vulnerable) */
  onConditionsChange?: (conditions: ConditionsState) => void;
}

interface QuickResourceProps {
  label: string;
  icon: ReactNode;
  current: number;
  max: number;
  onChange?: (value: number) => void;
  colorClass?: string;
}

function QuickResource({
  label,
  icon,
  current,
  max,
  onChange,
  colorClass = 'text-foreground',
}: QuickResourceProps) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-muted-foreground text-xs">{label}</span>
      <div className="flex items-center gap-1">
        <span className="text-muted-foreground">{icon}</span>
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

export function QuickResourcesInfo({
  resources,
  onChange,
  className,
  conditions,
  onConditionsChange,
}: QuickResourcesInfoProps) {
  const handleHpChange = useCallback(
    (value: number) => {
      onChange?.({
        ...resources,
        hp: { ...resources.hp, current: value },
      });
    },
    [resources, onChange]
  );

  const handleArmorChange = useCallback(
    (value: number) => {
      onChange?.({
        ...resources,
        armorScore: { ...resources.armorScore, current: value },
      });
    },
    [resources, onChange]
  );

  const handleStressChange = useCallback(
    (value: number) => {
      if (!onChange) return;

      // Per SRD: stress overflow marks HP, full stress = Vulnerable
      const result = applyStressWithOverflow(
        resources.stress.current,
        resources.stress.max,
        resources.hp.current,
        value
      );

      onChange({
        ...resources,
        stress: { ...resources.stress, current: result.newStress },
        hp: { ...resources.hp, current: result.newHp },
      });

      // Auto-add Vulnerable condition when stress is full
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
    [resources, onChange, conditions, onConditionsChange]
  );

  return (
    <div
      className={cn(
        'bg-card flex flex-wrap items-center justify-center gap-4 rounded-lg border p-3',
        className
      )}
    >
      <QuickResource
        label="HP"
        icon={<Heart className="size-4" />}
        current={resources.hp.current}
        max={resources.hp.max}
        onChange={onChange ? handleHpChange : undefined}
        colorClass={
          resources.hp.current <= resources.hp.max * 0.25
            ? 'text-red-500'
            : resources.hp.current <= resources.hp.max * 0.5
              ? 'text-yellow-500'
              : 'text-green-500'
        }
      />
      <div className="bg-border hidden h-8 w-px sm:block" />
      <QuickResource
        label="Armor"
        icon={<Shield className="size-4" />}
        current={resources.armorScore.current}
        max={resources.armorScore.max}
        onChange={onChange ? handleArmorChange : undefined}
        colorClass="text-blue-400"
      />
      <div className="bg-border hidden h-8 w-px sm:block" />
      <QuickResource
        label="Stress"
        icon={<AlertTriangle className="size-4" />}
        current={resources.stress.current}
        max={resources.stress.max}
        onChange={onChange ? handleStressChange : undefined}
        colorClass="text-purple-400"
      />
    </div>
  );
}
