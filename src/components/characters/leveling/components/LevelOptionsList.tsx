import * as React from 'react';

import { LevelOptionRow } from '@/components/characters/leveling/components/LevelOptionRow';
import {
  computeGatedDisabled,
  isMulticlassKey,
  isSubclassUpgradeKey,
} from '@/features/characters/logic/leveling-ui';

export type LevelOptionsListProps = {
  options: Record<string, { cost: number; maxSelections: number }>;
  selections?: Record<string, number>;
  priorTaken: Record<string, number>;
  priorTierFlags: {
    hadSubclassUpgradeInTier: boolean;
    hadMulticlassInTier: boolean;
    hadMulticlassEver: boolean;
  };
  onChange: (key: string, value: number) => void;
};

export function LevelOptionsList({
  options,
  selections,
  priorTaken,
  priorTierFlags,
  onChange,
}: LevelOptionsListProps) {
  const { selectedMulticlassThisLevel, selectedSubclassThisLevel } =
    React.useMemo(() => {
      const entries = Object.entries(selections || {});
      const selectedMulticlass = entries.some(
        ([k, v]) => isMulticlassKey(k) && (Number(v) || 0) > 0
      );
      const selectedSubclass = entries.some(
        ([k, v]) => isSubclassUpgradeKey(k) && (Number(v) || 0) > 0
      );
      return {
        selectedMulticlassThisLevel: selectedMulticlass,
        selectedSubclassThisLevel: selectedSubclass,
      };
    }, [selections]);

  return (
    <div className="space-y-3">
      {Object.entries(options).map(([key, def]) => {
        const cur = (selections?.[key] ?? 0) as number;
        const already = priorTaken[key] ?? 0;
        const remainingAllTime = Math.max(0, def.maxSelections - already);
        const isMulticlass = isMulticlassKey(key);
        const gatedDisabled = computeGatedDisabled(
          key,
          { selectedMulticlassThisLevel, selectedSubclassThisLevel },
          priorTierFlags
        );

        return (
          <LevelOptionRow
            key={key}
            optionKey={key}
            def={def}
            currentValue={cur}
            alreadyTaken={already}
            remainingAllTime={remainingAllTime}
            gatedDisabled={gatedDisabled}
            isMulticlass={isMulticlass}
            onChange={val => onChange(key, val)}
          />
        );
      })}
    </div>
  );
}
