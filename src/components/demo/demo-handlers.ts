import type { CompanionState } from '@/components/companion';
import type { DamageResult } from '@/components/damage-calculator';
import type { DeathMoveState } from '@/components/death-move';
import type { ResourcesState } from '@/components/resources';
import type { RestEffects, RestState } from '@/components/rest-management';
import type { HopeWithScarsState } from '@/components/scars';

interface RestHandlerParams {
  resources: ResourcesState;
  hopeWithScars: HopeWithScarsState;
  companion: CompanionState | undefined;
  restState: RestState;
  setResources: (v: ResourcesState) => void;
  setHopeWithScars: (v: HopeWithScarsState) => void;
  setCompanion: (v: CompanionState | undefined) => void;
  setRestState: (v: RestState) => void;
}

export function createRestHandler(params: RestHandlerParams) {
  const {
    resources,
    hopeWithScars,
    companion,
    restState,
    setResources,
    setHopeWithScars,
    setCompanion,
    setRestState,
  } = params;

  return (restType: 'short' | 'long', effects: RestEffects) => {
    setResources({
      ...resources,
      hp: {
        ...resources.hp,
        current: Math.min(
          resources.hp.max,
          resources.hp.current + effects.hpRecovered
        ),
      },
      stress: {
        ...resources.stress,
        current: Math.max(0, resources.stress.current - effects.stressCleared),
      },
    });
    setHopeWithScars({
      ...hopeWithScars,
      current: Math.min(
        hopeWithScars.max,
        hopeWithScars.current + effects.hopeRecovered
      ),
    });

    if (companion) {
      const companionStressCleared =
        restType === 'long' ? companion.markedStress : effects.stressCleared;
      setCompanion({
        ...companion,
        markedStress: Math.max(
          0,
          companion.markedStress - companionStressCleared
        ),
      });
    }

    const now = new Date().toISOString();
    setRestState({
      ...restState,
      lastShortRest: restType === 'short' ? now : restState.lastShortRest,
      lastLongRest: restType === 'long' ? now : restState.lastLongRest,
      shortRestsToday: restType === 'short' ? restState.shortRestsToday + 1 : 0,
    });
  };
}

interface DamageHandlerParams {
  resources: ResourcesState;
  deathState: DeathMoveState;
  setResources: (v: ResourcesState) => void;
  setDeathState: (v: DeathMoveState) => void;
}

export function createDamageHandler(params: DamageHandlerParams) {
  const { resources, deathState, setResources, setDeathState } = params;

  return (result: DamageResult) => {
    // Reduce armor by the number of slots sacrificed
    const newArmorCurrent = Math.max(
      0,
      resources.armorScore.current - result.armorSlotsSacrificed
    );
    // Apply HP loss
    const newHp = Math.max(0, resources.hp.current - result.hpLost);

    setResources({
      ...resources,
      hp: { ...resources.hp, current: newHp },
      armorScore: { ...resources.armorScore, current: newArmorCurrent },
    });

    // Trigger death move if HP drops to 0
    if (newHp <= 0) {
      setDeathState({
        ...deathState,
        deathMovePending: true,
      });
    }
  };
}
