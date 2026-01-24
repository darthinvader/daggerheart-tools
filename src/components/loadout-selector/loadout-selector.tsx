import { useCallback, useState } from 'react';

import { Package, Scroll, Zap } from '@/lib/icons';
import type { DomainCard } from '@/lib/schemas/domains';
import type {
  HomebrewDomainCard,
  LoadoutSelection,
} from '@/lib/schemas/loadout';

import { CardGrid } from './card-grid';
import { DomainFilter } from './domain-filter';
import { HomebrewCardForm } from './homebrew-card-form';
import { HomebrewFromCardModal } from './homebrew-from-card-modal';
import { LoadoutModeTabs } from './loadout-mode-tabs';
import { useLoadoutState } from './use-loadout-state';

interface LoadoutSelectorProps {
  value?: LoadoutSelection;
  onChange?: (selection: LoadoutSelection) => void;
  onComplete?: (selection: LoadoutSelection) => void;
  classDomains: string[];
  tier?: string;
  hideHeader?: boolean;
}

export function LoadoutSelector({
  value,
  onChange,
  onComplete,
  classDomains,
  tier = '1',
  hideHeader = false,
}: LoadoutSelectorProps) {
  const state = useLoadoutState({
    value,
    onChange,
    onComplete,
    classDomains,
    tier,
  });

  const [homebrewEditCard, setHomebrewEditCard] = useState<DomainCard | null>(
    null
  );

  const handleHomebrewSave = useCallback(
    (card: HomebrewDomainCard, destination: 'loadout' | 'vault') => {
      state.handleAddHomebrew(card);
      if (destination === 'loadout' && !state.isActiveFull) {
        state.handleAddHomebrewToLoadout(card);
      } else if (destination === 'vault' && !state.isVaultFull) {
        state.handleAddHomebrewToVault(card);
      }
      setHomebrewEditCard(null);
    },
    [state]
  );

  return (
    <div className="space-y-6">
      {!hideHeader && (
        <div className="space-y-4">
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <Scroll size={20} />
            <span>Build Your Domain Loadout</span>
          </h2>
          <p className="text-muted-foreground">
            Select cards for your active loadout (
            <Zap size={14} className="inline-block" />) and vault (
            <Package size={14} className="inline-block" />
            ). You can equip up to <strong>
              {state.rules.maxActiveCards}
            </strong>{' '}
            active cards and store <strong>{state.rules.maxVaultCards}</strong>{' '}
            in your vault.
          </p>
        </div>
      )}

      <LoadoutModeTabs
        activeMode={state.mode}
        onModeChange={state.handleModeChange}
        classDomains={classDomains}
      />

      {state.mode === 'homebrew' && (
        <HomebrewCardForm
          onAdd={state.handleAddHomebrew}
          onAddToLoadout={state.handleAddHomebrewToLoadout}
          onAddToVault={state.handleAddHomebrewToVault}
          isLoadoutFull={state.isActiveFull}
          isVaultFull={state.isVaultFull}
        />
      )}

      {state.mode !== 'homebrew' && (
        <>
          <DomainFilter
            domains={state.domainsToShow}
            selectedDomains={state.selectedDomains}
            onToggle={state.handleToggleDomain}
            onSelectAll={state.handleSelectAllDomains}
            onClearAll={state.handleClearDomains}
          />

          <CardGrid
            cards={state.availableCards}
            activeCards={state.activeCards}
            vaultCards={state.vaultCards}
            onToggleActive={state.handleToggleActive}
            onToggleVault={state.handleToggleVault}
            maxActiveCards={state.rules.maxActiveCards}
            maxVaultCards={state.rules.maxVaultCards}
            activeCardNames={state.activeCardNames}
            vaultCardNames={state.vaultCardNames}
            maxLevel={state.rules.maxCardLevel}
            filters={state.cardFilters}
            onFiltersChange={state.setCardFilters}
            onHomebrewEdit={setHomebrewEditCard}
          />
        </>
      )}

      <HomebrewFromCardModal
        card={homebrewEditCard}
        onClose={() => setHomebrewEditCard(null)}
        onSave={handleHomebrewSave}
        isLoadoutFull={state.isActiveFull}
        isVaultFull={state.isVaultFull}
      />
    </div>
  );
}
