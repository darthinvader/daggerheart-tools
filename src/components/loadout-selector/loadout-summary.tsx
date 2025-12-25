import { useCallback, useState } from 'react';

import { Button } from '@/components/ui/button';
import type { DomainCardLite, LoadoutRules } from '@/lib/schemas/loadout';

import { LoadoutSection } from './loadout-section';

type SwapMode = {
  source: 'active' | 'vault';
  cardName: string;
} | null;

interface LoadoutSummaryProps {
  activeCards: DomainCardLite[];
  vaultCards: DomainCardLite[];
  rules: LoadoutRules;
  onRemoveActive: (cardName: string) => void;
  onRemoveVault: (cardName: string) => void;
  onMoveToVault: (cardName: string) => void;
  onMoveToActive: (cardName: string) => void;
  onSwapCards: (activeCardName: string, vaultCardName: string) => void;
}

function SwapModeBanner({
  swapMode,
  onCancel,
}: {
  swapMode: SwapMode;
  onCancel: () => void;
}) {
  if (!swapMode) return null;

  return (
    <div className="flex items-center justify-between rounded-lg border border-amber-500/30 bg-amber-500/10 p-3">
      <div className="flex items-center gap-2">
        <span className="text-lg">🔄</span>
        <span className="text-sm">
          <strong>Swap Mode:</strong> Select a card from{' '}
          <strong>{swapMode.source === 'active' ? 'Vault' : 'Active'}</strong>{' '}
          to swap with <strong>{swapMode.cardName}</strong>
        </span>
      </div>
      <Button variant="outline" size="sm" onClick={onCancel}>
        Cancel
      </Button>
    </div>
  );
}

export function LoadoutSummary({
  activeCards,
  vaultCards,
  rules,
  onRemoveActive,
  onRemoveVault,
  onMoveToVault,
  onMoveToActive,
  onSwapCards,
}: LoadoutSummaryProps) {
  const [swapMode, setSwapMode] = useState<SwapMode>(null);

  const hasVaultLimit = rules.maxVaultCards !== undefined;
  const isVaultFull =
    hasVaultLimit && vaultCards.length >= (rules.maxVaultCards ?? Infinity);
  const isActiveFull = activeCards.length >= rules.maxActiveCards;

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

  return (
    <div className="space-y-4">
      <SwapModeBanner swapMode={swapMode} onCancel={handleCancelSwap} />

      <div className="grid gap-4 md:grid-cols-2">
        <LoadoutSection
          title="Active Loadout"
          emoji="⚡"
          cards={activeCards}
          location="active"
          maxCards={rules.maxActiveCards}
          hasLimit={true}
          isFull={isActiveFull}
          isSwapTarget={swapMode?.source === 'vault'}
          swapSourceCard={swapMode?.cardName ?? null}
          swapSourceLocation={swapMode?.source ?? null}
          targetIsFull={isVaultFull}
          borderClass="border-green-500/30"
          bgClass="bg-green-500/5"
          fullTextClass="text-green-600"
          onMove={handleMoveFromActive}
          onRemove={onRemoveActive}
          onSelectSwapTarget={handleSelectSwapTarget}
          tooltipContent={`Cards in your loadout are active and can be used during play. You can have up to ${rules.maxActiveCards} active cards.`}
        />

        <LoadoutSection
          title="Vault"
          emoji="📦"
          cards={vaultCards}
          location="vault"
          maxCards={rules.maxVaultCards ?? 0}
          hasLimit={hasVaultLimit}
          isFull={isVaultFull}
          isSwapTarget={swapMode?.source === 'active'}
          swapSourceCard={swapMode?.cardName ?? null}
          swapSourceLocation={swapMode?.source ?? null}
          targetIsFull={isActiveFull}
          borderClass="border-blue-500/30"
          bgClass="bg-blue-500/5"
          fullTextClass="text-blue-600"
          onMove={handleMoveFromVault}
          onRemove={onRemoveVault}
          onSelectSwapTarget={handleSelectSwapTarget}
          tooltipContent="Your vault holds inactive domain cards. Swap cards into your loadout during a rest, or pay the Recall Cost (in Stress) to swap immediately."
        />
      </div>
    </div>
  );
}
