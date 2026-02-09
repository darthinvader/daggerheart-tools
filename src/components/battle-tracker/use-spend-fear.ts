import { useCallback } from 'react';
import { toast } from 'sonner';

interface SpendFearState {
  fearPool: number;
}

interface SpendFearActions {
  spendFear: (amount: number) => boolean;
  setFearPool: (value: number) => void;
}

export function useSpendFear(
  rosterState: SpendFearState,
  rosterActions: SpendFearActions
) {
  return useCallback(
    (amount: number, featureName: string) => {
      const previousFear = rosterState.fearPool;
      if (rosterActions.spendFear(amount)) {
        toast.success(`Spent ${amount} Fear — ${featureName}`, {
          description: `${previousFear - amount} Fear remaining`,
          action: {
            label: 'Undo',
            onClick: () => rosterActions.setFearPool(previousFear),
          },
          duration: 5000,
        });
      } else {
        toast.warning(
          `Not enough Fear (need ${amount}, have ${rosterState.fearPool})`,
          { description: featureName }
        );
      }
    },
    [rosterState.fearPool, rosterActions]
  );
}
