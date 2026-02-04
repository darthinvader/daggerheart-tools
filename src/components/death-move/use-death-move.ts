import { useCallback, useState } from 'react';

import { checkForScar, resolveRiskItAll, rollD12 } from './death-move-utils';
import type { DeathMoveResult, DeathMoveState, DeathMoveType } from './types';

interface UseDeathMoveProps {
  characterLevel: number;
  onDeathMoveComplete?: (result: DeathMoveResult) => void;
}

interface UseDeathMoveReturn {
  state: DeathMoveState;
  executeDeathMove: (moveType: DeathMoveType) => DeathMoveResult;
  triggerDeathMove: () => void;
  resetDeathState: () => void;
  setUnconscious: (value: boolean) => void;
}

export function useDeathMove({
  characterLevel,
  onDeathMoveComplete,
}: UseDeathMoveProps): UseDeathMoveReturn {
  const [state, setState] = useState<DeathMoveState>({
    isUnconscious: false,
    deathMovePending: false,
    isDead: false,
  });

  const triggerDeathMove = useCallback(() => {
    setState(prev => ({ ...prev, deathMovePending: true }));
  }, []);

  const resetDeathState = useCallback(() => {
    setState({
      isUnconscious: false,
      isDead: false,
      deathMovePending: false,
    });
  }, []);

  const setUnconscious = useCallback((value: boolean) => {
    setState(prev => ({ ...prev, isUnconscious: value }));
  }, []);

  const executeDeathMove = useCallback(
    (moveType: DeathMoveType): DeathMoveResult => {
      let result: DeathMoveResult;

      switch (moveType) {
        case 'blaze_of_glory': {
          result = {
            moveType,
            survived: false,
            gainedScar: false,
            description:
              'You embrace death in a blaze of glory. Your final action critically succeeds.',
          };
          setState({
            isUnconscious: false,
            isDead: true,
            deathMovePending: false,
            lastDeathMoveResult: result,
          });
          break;
        }

        case 'avoid_death': {
          const hopeDieRoll = rollD12();
          const gainedScar = checkForScar(hopeDieRoll, characterLevel);
          result = {
            moveType,
            survived: true,
            gainedScar,
            hopeDieRoll,
            description: gainedScar
              ? `You avoid death but gain a scar (rolled ${hopeDieRoll}, level ${characterLevel}).`
              : `You avoid death without a scar (rolled ${hopeDieRoll}, level ${characterLevel}).`,
          };
          setState({
            isUnconscious: true,
            isDead: false,
            deathMovePending: false,
            lastDeathMoveResult: result,
          });
          break;
        }

        case 'risk_it_all': {
          const hopeDie = rollD12();
          const fearDie = rollD12();
          const riskResult = resolveRiskItAll(hopeDie, fearDie);

          result = {
            moveType,
            survived: riskResult.survived,
            gainedScar: false,
            hopeDieRoll: hopeDie,
            fearDieRoll: fearDie,
            // For critical success, clear all; for non-critical, player allocates
            hpCleared: riskResult.isCritical ? 999 : undefined,
            stressCleared: riskResult.isCritical ? 999 : undefined,
            clearingValue: riskResult.clearingValue,
            needsAllocation: riskResult.needsAllocation,
            description: riskResult.isCritical
              ? `Critical Success! (${hopeDie}/${fearDie}) You clear all HP and Stress!`
              : riskResult.survived
                ? `Hope wins! (${hopeDie}/${fearDie}) Divide ${hopeDie} between HP and Stress.`
                : `Fear wins... (${hopeDie}/${fearDie}) You cross through the veil of death.`,
          };
          setState({
            isUnconscious: false,
            isDead: !riskResult.survived,
            deathMovePending: false,
            lastDeathMoveResult: result,
          });
          break;
        }
      }

      onDeathMoveComplete?.(result);
      return result;
    },
    [characterLevel, onDeathMoveComplete]
  );

  return {
    state,
    executeDeathMove,
    triggerDeathMove,
    resetDeathState,
    setUnconscious,
  };
}
