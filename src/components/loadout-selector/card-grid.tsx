import { memo } from 'react';

import { SearchInput } from '@/components/shared';
import type { DomainCard } from '@/lib/schemas/domains';
import type { DomainCardLite } from '@/lib/schemas/loadout';

import { CardFilters } from './card-filters';
import {
  type CardFiltersState,
  createDefaultFilters,
} from './card-filters-utils';
import { DomainCardDisplay } from './domain-card-display';
import { useCardGridState } from './use-card-grid-state';

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
  maxLevel?: number;
  filters?: CardFiltersState;
  onFiltersChange?: (filters: CardFiltersState) => void;
  onHomebrewEdit?: (card: DomainCard) => void;
}

function CardGridComponent(props: CardGridProps) {
  const {
    cards,
    maxLevel = 10,
    filters = createDefaultFilters(maxLevel),
    onFiltersChange,
    onHomebrewEdit,
  } = props;
  const state = useCardGridState({ ...props, filters });

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
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <SearchInput
            value={state.search}
            onChange={state.setSearch}
            placeholder="Search cards by name, domain, type..."
            className="flex-1 sm:max-w-md"
          />
          {onFiltersChange && (
            <CardFilters
              filters={filters}
              onFiltersChange={onFiltersChange}
              maxLevel={maxLevel}
            />
          )}
        </div>
        <CardCountLabel
          filtered={state.filteredCards.length}
          total={cards.length}
          hasSearch={Boolean(state.search)}
          isActiveFull={state.isActiveFull}
          isVaultFull={state.isVaultFull}
        />
      </div>
      {state.filteredCards.length === 0 ? (
        <NoMatchMessage search={state.search} />
      ) : (
        <div className="bg-muted/20 max-h-125 overflow-y-auto rounded-lg border p-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {state.filteredCards.map(card => (
              <div key={`${card.domain}-${card.name}`} className="min-w-0">
                <DomainCardDisplay
                  card={card}
                  isSelected={state.getSelectionType(card) !== null}
                  selectionType={state.getSelectionType(card)}
                  onToggle={state.handleToggle}
                  isDisabled={state.isDisabled(card)}
                  onHomebrewEdit={onHomebrewEdit}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CardCountLabel({
  filtered,
  total,
  hasSearch,
  isActiveFull,
  isVaultFull,
}: {
  filtered: number;
  total: number;
  hasSearch: boolean;
  isActiveFull: boolean;
  isVaultFull: boolean;
}) {
  return (
    <div className="text-muted-foreground flex items-center gap-2 px-1 text-sm">
      <span>
        📚 {filtered}
        {hasSearch && ` of ${total}`} card{filtered !== 1 ? 's' : ''}
        {hasSearch ? ' found' : ' available'}
      </span>
      {isActiveFull && !isVaultFull && (
        <span className="text-xs text-amber-600">
          ⚠️ Active full — cards go to vault
        </span>
      )}
    </div>
  );
}

function NoMatchMessage({ search }: { search: string }) {
  return (
    <div className="text-muted-foreground py-12 text-center">
      <span className="mb-2 block text-4xl">🔍</span>
      <p>No cards match "{search}"</p>
    </div>
  );
}

export const CardGrid = memo(CardGridComponent);
