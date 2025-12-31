import { useCallback, useState } from 'react';

export type SwapMode = {
  source: 'active' | 'vault';
  cardName: string;
} | null;

interface UseSwapModeParams {
  isVaultFull: boolean;
  isActiveFull: boolean;
  onMoveToVault: (cardName: string) => void;
  onMoveToActive: (cardName: string) => void;
  onSwapCards: (activeCardName: string, vaultCardName: string) => void;
}

export function useSwapMode({
  isVaultFull,
  isActiveFull,
  onMoveToVault,
  onMoveToActive,
  onSwapCards,
}: UseSwapModeParams) {
  const [swapMode, setSwapMode] = useState<SwapMode>(null);

  const handleInitiateSwap = useCallback(
    (source: 'active' | 'vault', cardName: string) => {
      setSwapMode({ source, cardName });
    },
    []
  );

  const handleCancelSwap = useCallback(() => {
    setSwapMode(null);
  }, []);

  const handleSelectSwapTarget = useCallback(
    (targetCardName: string) => {
      if (!swapMode) return;

      if (swapMode.source === 'active') {
        onSwapCards(swapMode.cardName, targetCardName);
      } else {
        onSwapCards(targetCardName, swapMode.cardName);
      }
      setSwapMode(null);
    },
    [swapMode, onSwapCards]
  );

  const handleMoveFromActive = useCallback(
    (cardName: string) => {
      if (isVaultFull) {
        handleInitiateSwap('active', cardName);
      } else {
        onMoveToVault(cardName);
      }
    },
    [isVaultFull, handleInitiateSwap, onMoveToVault]
  );

  const handleMoveFromVault = useCallback(
    (cardName: string) => {
      if (isActiveFull) {
        handleInitiateSwap('vault', cardName);
      } else {
        onMoveToActive(cardName);
      }
    },
    [isActiveFull, handleInitiateSwap, onMoveToActive]
  );

  return {
    swapMode,
    handleCancelSwap,
    handleSelectSwapTarget,
    handleMoveFromActive,
    handleMoveFromVault,
  };
}
