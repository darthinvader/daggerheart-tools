import type { CompanionState } from '@/components/companion';
import type { DamageResult } from '@/components/damage-calculator';
import type { DeathMoveState } from '@/components/death-move';
import type { ResourcesState } from '@/components/resources';
import type { RestResult, RestState } from '@/components/rest';
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

  return (result: RestResult) => {
    // Aggregate effects from all move results
    let hpRecovered = 0;
    let stressCleared = 0;
    let armorRepaired = 0;
    let hopeGained = 0;

    for (const moveResult of result.moveResults) {
      // Map move categories to resources
      if (
        moveResult.moveId.includes('wounds') ||
        moveResult.moveId.includes('hp')
      ) {
        hpRecovered += moveResult.amount;
      } else if (moveResult.moveId.includes('stress')) {
        stressCleared += moveResult.amount;
      } else if (moveResult.moveId.includes('armor')) {
        armorRepaired += moveResult.amount;
      } else if (
        moveResult.moveId.includes('prepare') ||
        moveResult.moveId.includes('hope')
      ) {
        hopeGained += moveResult.amount;
      }
    }

    setResources({
      ...resources,
      hp: {
        ...resources.hp,
        current: Math.min(resources.hp.max, resources.hp.current + hpRecovered),
      },
      stress: {
        ...resources.stress,
        current: Math.max(0, resources.stress.current - stressCleared),
      },
      armorScore: {
        ...resources.armorScore,
        current: Math.max(0, resources.armorScore.current - armorRepaired),
      },
    });
    setHopeWithScars({
      ...hopeWithScars,
      current: Math.min(hopeWithScars.max, hopeWithScars.current + hopeGained),
    });

    if (companion) {
      const companionStressCleared =
        result.restType === 'long'
          ? companion.markedStress
          : Math.min(stressCleared, 1);
      setCompanion({
        ...companion,
        markedStress: Math.max(
          0,
          companion.markedStress - companionStressCleared
        ),
      });
    }

    setRestState({
      ...restState,
      lastShortRest:
        result.restType === 'short'
          ? result.timestamp
          : restState.lastShortRest,
      lastLongRest:
        result.restType === 'long' ? result.timestamp : restState.lastLongRest,
      shortRestsToday:
        result.restType === 'short' ? restState.shortRestsToday + 1 : 0,
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
