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
          isDead: false,
          deathMovePending: false,
          lastDeathMoveResult: result,
        });
        return result;
      } else {
        // Per SRD: Critical success occurs when both duality dice show matching results
        const isCritical = hopeDie === fearDie;
        const survived = isCritical || hopeDie > fearDie;
        result = {
          moveType,
          survived,
          gainedScar: false,
          hopeDieRoll: hopeDie,
          fearDieRoll: fearDie,
          // For critical success, clear all; for non-critical, allocation handled by UI
          hpCleared: isCritical ? resources.hp.max : undefined,
          stressCleared: isCritical ? resources.stress.max : undefined,
          clearingValue: survived && !isCritical ? hopeDie : undefined,
          needsAllocation: survived && !isCritical,
          description: isCritical
            ? `Critical Success! (${hopeDie}/${fearDie}) You clear all HP and Stress!`
            : survived
              ? `Hope wins! (${hopeDie}/${fearDie}) Divide ${hopeDie} between HP and Stress.`
              : `Fear wins... (${hopeDie}/${fearDie}) You cross through the veil of death.`,
        };
        if (isCritical) {
          // Only auto-apply for critical success; non-critical needs allocation
          setResources(prev => ({
            ...prev,
            hp: {
              ...prev.hp,
              current: prev.hp.max,
            },
            stress: {
              ...prev.stress,
              current: 0,
            },
          }));
        }
      }

      setDeathState({
        ...deathState,
        isUnconscious: result.survived ? false : false,
        isDead: !result.survived,
        deathMovePending: false,
        lastDeathMoveResult: result,
      });
      return result;
    },
    [deathState, resources, progressionLevel, setDeathState, setResources]
  );
}
