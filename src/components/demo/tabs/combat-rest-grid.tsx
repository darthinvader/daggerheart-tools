import { DamageCalculator } from '@/components/damage-calculator';
import type { DamageResult } from '@/components/damage-calculator/types';
import { RestManagement } from '@/components/rest-management';
import type { RestEffects, RestType } from '@/components/rest-management/types';

import type { DemoState } from '../demo-types';

interface CombatRestGridProps {
  state: DemoState;
  onDamage: (result: DamageResult) => void;
  onRest: (type: RestType, effects: RestEffects) => void;
}

export function CombatRestGrid({
  state,
  onDamage,
  onRest,
}: CombatRestGridProps) {
  return (
    <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
      <DamageCalculator
        armor={state.resources.armorScore}
        health={{
          current: state.resources.hp.current,
          max: state.resources.hp.max,
          thresholds: {
            major: state.thresholds.values.major,
            severe: state.thresholds.values.severe,
            critical: state.thresholds.values.critical,
          },
          enableCritical: state.thresholds.enableCritical,
        }}
        onApplyDamage={onDamage}
      />
      <RestManagement
        restState={state.restState}
        resources={{
          hope: {
            current: state.hopeWithScars.current,
            max: state.hopeWithScars.max,
          },
          stress: state.resources.stress,
          hp: state.resources.hp,
          armor: state.resources.armorScore,
        }}
        onRest={onRest}
      />
    </div>
  );
}
