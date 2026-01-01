import { useCallback } from 'react';

import type { ResourcesState } from '@/components/resources';
import { NumberControl } from '@/components/shared/labeled-counter/number-control';
import { cn } from '@/lib/utils';

interface QuickResourcesInfoProps {
  resources: ResourcesState;
  onChange?: (resources: ResourcesState) => void;
  className?: string;
}

interface QuickResourceProps {
  label: string;
  emoji: string;
  current: number;
  max: number;
  onChange?: (value: number) => void;
  colorClass?: string;
}

function QuickResource({
  label,
  emoji,
  current,
  max,
  onChange,
  colorClass = 'text-foreground',
}: QuickResourceProps) {
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

export function QuickResourcesInfo({
  resources,
  onChange,
  className,
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
      onChange?.({
        ...resources,
        stress: { ...resources.stress, current: value },
      });
    },
    [resources, onChange]
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
        emoji="❤️"
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
        emoji="🛡️"
        current={resources.armorScore.current}
        max={resources.armorScore.max}
        onChange={onChange ? handleArmorChange : undefined}
        colorClass="text-blue-400"
      />
      <div className="bg-border hidden h-8 w-px sm:block" />
      <QuickResource
        label="Stress"
        emoji="😰"
        current={resources.stress.current}
        max={resources.stress.max}
        onChange={onChange ? handleStressChange : undefined}
        colorClass="text-purple-400"
      />
    </div>
  );
}
