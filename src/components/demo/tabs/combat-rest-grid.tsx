import { RestManagement } from '@/components/rest-management';
import type { RestEffects, RestType } from '@/components/rest-management/types';

import type { DemoState } from '../demo-types';

interface RestGridProps {
  state: DemoState;
  onRest: (type: RestType, effects: RestEffects) => void;
}

export function RestGrid({ state, onRest }: RestGridProps) {
  return (
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
  );
}
