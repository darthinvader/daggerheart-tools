import { Button } from '@/components/ui/button';
import { ArrowLeftRight, ICON_SIZE_MD, Package, Zap } from '@/lib/icons';
import type { DomainCardLite, LoadoutRules } from '@/lib/schemas/loadout';

import { LoadoutSection } from './loadout-section';
import { type SwapMode, useSwapMode } from './use-swap-mode';

interface LoadoutSummaryProps {
  activeCards: DomainCardLite[];
  vaultCards: DomainCardLite[];
  rules: LoadoutRules;
  onRemoveActive: (cardName: string) => void;
  onRemoveVault: (cardName: string) => void;
  onMoveToVault: (cardName: string) => void;
  onMoveToActive: (cardName: string) => void;
  onSwapCards: (activeCardName: string, vaultCardName: string) => void;
  onChangeMaxActiveCards?: (delta: number) => void;
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
        <ArrowLeftRight size={ICON_SIZE_MD} />
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
  onChangeMaxActiveCards,
}: LoadoutSummaryProps) {
  const safeActiveCards = activeCards ?? [];
  const safeVaultCards = vaultCards ?? [];

  const hasVaultLimit = rules.maxVaultCards !== undefined;
  const isVaultFull =
    hasVaultLimit && safeVaultCards.length >= (rules.maxVaultCards ?? Infinity);
  const isActiveFull = safeActiveCards.length >= rules.maxActiveCards;

  const {
    swapMode,
    handleCancelSwap,
    handleSelectSwapTarget,
    handleMoveFromActive,
    handleMoveFromVault,
  } = useSwapMode({
    isVaultFull,
    isActiveFull,
    onMoveToVault,
    onMoveToActive,
    onSwapCards,
  });

  // Pre-compute swap mode derived values
  const swapSourceCard = swapMode?.cardName ?? null;
  const swapSourceLocation = swapMode?.source ?? null;
  const isActiveSwapTarget = swapSourceLocation === 'vault';
  const isVaultSwapTarget = swapSourceLocation === 'active';
  const canAdjustMax = !!onChangeMaxActiveCards;
  const vaultMaxCards = rules.maxVaultCards ?? 0;

  return (
    <div className="space-y-4">
      <SwapModeBanner swapMode={swapMode} onCancel={handleCancelSwap} />

      <div className="grid min-w-0 gap-4 md:grid-cols-2">
        <div className="min-w-0">
          <LoadoutSection
            title="Active Loadout"
            icon={<Zap size={ICON_SIZE_MD} />}
            cards={safeActiveCards}
            location="active"
            maxCards={rules.maxActiveCards}
            hasLimit={true}
            isFull={isActiveFull}
            isSwapTarget={isActiveSwapTarget}
            swapSourceCard={swapSourceCard}
            swapSourceLocation={swapSourceLocation}
            targetIsFull={isVaultFull}
            borderClass="border-green-500/30"
            bgClass="bg-green-500/5"
            fullTextClass="text-green-600"
            onMove={handleMoveFromActive}
            onRemove={onRemoveActive}
            onSelectSwapTarget={handleSelectSwapTarget}
            tooltipContent={`Cards in your loadout are active and can be used during play. You can have up to ${rules.maxActiveCards} active cards.`}
            canAdjustMax={canAdjustMax}
            onDecreaseMax={() => onChangeMaxActiveCards?.(-1)}
            onIncreaseMax={() => onChangeMaxActiveCards?.(1)}
          />
        </div>

        <div className="min-w-0">
          <LoadoutSection
            title="Vault"
            icon={<Package size={ICON_SIZE_MD} />}
            cards={safeVaultCards}
            location="vault"
            maxCards={vaultMaxCards}
            hasLimit={hasVaultLimit}
            isFull={isVaultFull}
            isSwapTarget={isVaultSwapTarget}
            swapSourceCard={swapSourceCard}
            swapSourceLocation={swapSourceLocation}
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
    </div>
  );
}
