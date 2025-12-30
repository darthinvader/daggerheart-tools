import { useCallback } from 'react';

import type { DeathMoveState } from '@/components/death-move';
import type { ResourcesState } from '@/components/resources';

interface DeathMoveHandlerParams {
  deathState: DeathMoveState;
  resources: ResourcesState;
  progressionLevel: number;
  setDeathState: (state: DeathMoveState) => void;
  setResources: (updater: (prev: ResourcesState) => ResourcesState) => void;
}

export function useDeathMoveHandler({
  deathState,
  resources,
  progressionLevel,
  setDeathState,
  setResources,
}: DeathMoveHandlerParams) {
  return useCallback(
    (moveType: 'blaze_of_glory' | 'avoid_death' | 'risk_it_all') => {
      const hopeDie = Math.floor(Math.random() * 12) + 1;
      const fearDie = Math.floor(Math.random() * 12) + 1;
      const level = progressionLevel;

      type DeathMoveResult = NonNullable<DeathMoveState['lastDeathMoveResult']>;
      let result: DeathMoveResult;

      if (moveType === 'blaze_of_glory') {
        result = {
          moveType,
          survived: false,
          gainedScar: false,
          description:
            'You embrace death in a blaze of glory. Your final action critically succeeds.',
        };
      } else if (moveType === 'avoid_death') {
        const gainedScar = hopeDie <= level;
        result = {
          moveType,
          survived: true,
          gainedScar,
          hopeDieRoll: hopeDie,
          description: gainedScar
            ? `You avoid death but gain a scar (rolled ${hopeDie}, level ${level}).`
            : `You avoid death without a scar (rolled ${hopeDie}, level ${level}).`,
        };
        setDeathState({
          ...deathState,
          isUnconscious: true,
          deathMovePending: false,
          lastDeathMoveResult: result,
        });
        return result;
      } else {
        const survived = hopeDie > fearDie;
        const isCritical = hopeDie === 12;
        result = {
          moveType,
          survived,
          gainedScar: false,
          hopeDieRoll: hopeDie,
          fearDieRoll: fearDie,
          hpCleared: isCritical ? resources.hp.max : survived ? hopeDie : 0,
          stressCleared: isCritical ? resources.stress.max : 0,
          description: isCritical
            ? `Critical Success! (${hopeDie}/${fearDie}) You clear all HP and Stress!`
            : survived
              ? `Hope wins! (${hopeDie}/${fearDie}) Clear ${hopeDie} HP or Stress.`
              : `Fear wins... (${hopeDie}/${fearDie}) You cross through the veil of death.`,
        };
        if (survived) {
          const hpToRestore = isCritical ? resources.hp.max : hopeDie;
          setResources(prev => ({
            ...prev,
            hp: {
              ...prev.hp,
              current: Math.min(prev.hp.max, hpToRestore),
            },
          }));
        }
      }

      setDeathState({
        ...deathState,
        isUnconscious: !result.survived,
        deathMovePending: false,
        lastDeathMoveResult: result,
      });
      return result;
    },
    [deathState, resources, progressionLevel, setDeathState, setResources]
  );
}
