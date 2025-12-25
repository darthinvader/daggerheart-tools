import { memo, useCallback, useMemo } from 'react';

import type { DomainCard } from '@/lib/schemas/domains';
import type { DomainCardLite } from '@/lib/schemas/loadout';

import { DomainCardDisplay } from './domain-card-display';

interface CardGridProps {
  cards: DomainCard[];
  activeCards: DomainCardLite[];
  vaultCards: DomainCardLite[];
  onToggleActive: (card: DomainCard) => void;
  onToggleVault: (card: DomainCard) => void;
  maxActiveCards: number;
  maxVaultCards?: number;
  activeCardNames?: Set<string>;
  vaultCardNames?: Set<string>;
}

function CardGridComponent({
  cards,
  activeCards,
  vaultCards,
  onToggleActive,
  onToggleVault,
  maxActiveCards,
  maxVaultCards,
  activeCardNames: providedActiveNames,
  vaultCardNames: providedVaultNames,
}: CardGridProps) {
  const activeCardNames = useMemo(
    () => providedActiveNames ?? new Set(activeCards.map(c => c.name)),
    [providedActiveNames, activeCards]
  );
  const vaultCardNames = useMemo(
    () => providedVaultNames ?? new Set(vaultCards.map(c => c.name)),
    [providedVaultNames, vaultCards]
  );

  const hasVaultLimit = maxVaultCards !== undefined;
  const isActiveFull = activeCards.length >= maxActiveCards;
  const isVaultFull = hasVaultLimit && vaultCards.length >= maxVaultCards;

  const getSelectionType = useCallback(
    (card: DomainCard): 'active' | 'vault' | null => {
      if (activeCardNames.has(card.name)) return 'active';
      if (vaultCardNames.has(card.name)) return 'vault';
      return null;
    },
    [activeCardNames, vaultCardNames]
  );

  const handleToggle = useCallback(
    (card: DomainCard) => {
      const inActive = activeCardNames.has(card.name);
      const inVault = vaultCardNames.has(card.name);

      if (inActive) {
        onToggleActive(card);
      } else if (inVault) {
        onToggleVault(card);
      } else if (!isActiveFull) {
        onToggleActive(card);
      } else if (!isVaultFull) {
        onToggleVault(card);
      }
    },
    [
      activeCardNames,
      vaultCardNames,
      isActiveFull,
      isVaultFull,
      onToggleActive,
      onToggleVault,
    ]
  );

  const isDisabledCheck = useCallback(
    (card: DomainCard) =>
      !activeCardNames.has(card.name) &&
      !vaultCardNames.has(card.name) &&
      isActiveFull &&
      isVaultFull,
    [activeCardNames, vaultCardNames, isActiveFull, isVaultFull]
  );

  if (cards.length === 0) {
    return (
      <div className="text-muted-foreground py-12 text-center">
        <span className="mb-2 block text-4xl">📭</span>
        <p>No cards available for the selected filters.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="text-muted-foreground flex items-center justify-between px-1 text-sm">
        <span>
          📚 {cards.length} card{cards.length !== 1 ? 's' : ''} available
        </span>
        {isActiveFull && !isVaultFull && (
          <span className="text-xs text-amber-600">
            ⚠️ Active full — cards go to vault
          </span>
        )}
      </div>
      <div className="bg-muted/20 max-h-[500px] overflow-y-auto rounded-lg border p-4">
        <div className="grid grid-cols-[minmax(0,1fr)] gap-4 sm:grid-cols-[repeat(2,minmax(0,1fr))] lg:grid-cols-[repeat(3,minmax(0,1fr))]">
          {cards.map(card => {
            const selType = getSelectionType(card);
            return (
              <div key={`${card.domain}-${card.name}`} className="min-w-0">
                <DomainCardDisplay
                  card={card}
                  isSelected={selType !== null}
                  selectionType={selType}
                  onToggle={handleToggle}
                  isDisabled={isDisabledCheck(card)}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export const CardGrid = memo(CardGridComponent);
