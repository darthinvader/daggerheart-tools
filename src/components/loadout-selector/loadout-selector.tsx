import { useCallback, useMemo, useState } from 'react';

import { useHomebrewForCharacter } from '@/features/homebrew/use-homebrew-query';
import { Package, Scroll, Zap } from '@/lib/icons';
import type { DomainCard } from '@/lib/schemas/domains';
import type { HomebrewDomainCard as HomebrewDomainCardContent } from '@/lib/schemas/homebrew';
import type {
  HomebrewDomainCard,
  LoadoutSelection,
} from '@/lib/schemas/loadout';

import { CampaignHomebrewCardGrid } from './campaign-homebrew-card-grid';
import { CardGrid } from './card-grid';
import { DomainFilter } from './domain-filter';
import { HomebrewCardForm } from './homebrew-card-form';
import { HomebrewFromCardModal } from './homebrew-from-card-modal';
import { LoadoutModeTabs } from './loadout-mode-tabs';
import { campaignHomebrewToDomainCard } from './loadout-utils';
import { useLoadoutState } from './use-loadout-state';

interface LoadoutSelectorProps {
  value?: LoadoutSelection;
  onChange?: (selection: LoadoutSelection) => void;
  onComplete?: (selection: LoadoutSelection) => void;
  classDomains: string[];
  /** @deprecated Use `level` instead for accurate domain card restrictions per SRD */
  tier?: string;
  /** Character level (1-10). Used to restrict domain card selection per SRD. */
  level?: number;
  hideHeader?: boolean;
  campaignId?: string;
}

export function LoadoutSelector({
  value,
  onChange,
  onComplete,
  classDomains,
  tier = '1',
  level,
  hideHeader = false,
  campaignId,
}: LoadoutSelectorProps) {
  // Compute effective level: prefer explicit level prop, fallback to tier-based estimate
  const effectiveLevel = level ?? (tier ? parseInt(tier, 10) : 1);

  // Fetch campaign homebrew domain cards
  const { data: campaignHomebrew } = useHomebrewForCharacter(
    'domain_card',
    campaignId
  );

  // Convert campaign homebrew to DomainCard format
  const campaignHomebrewCards = useMemo(() => {
    if (!campaignHomebrew || campaignHomebrew.length === 0) return [];
    return campaignHomebrew
      .filter(h => h.contentType === 'domain_card')
      .map(h => campaignHomebrewToDomainCard(h as HomebrewDomainCardContent));
  }, [campaignHomebrew]);

  const state = useLoadoutState({
    value,
    onChange,
    onComplete,
    classDomains,
    level: effectiveLevel,
    campaignHomebrewCards,
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

      {/* Custom mode: Player-created cards on the fly */}
      {state.mode === 'custom' && (
        <HomebrewCardForm
          onAdd={state.handleAddHomebrew}
          onAddToLoadout={state.handleAddHomebrewToLoadout}
          onAddToVault={state.handleAddHomebrewToVault}
          isLoadoutFull={state.isActiveFull}
          isVaultFull={state.isVaultFull}
        />
      )}

      {/* Homebrew mode: Browse homebrew cards from all sources */}
      {state.mode === 'homebrew' && (
        <CampaignHomebrewCardGrid
          campaignId={campaignId}
          activeCards={state.activeCards}
          vaultCards={state.vaultCards}
          onToggleActive={state.handleToggleActive}
          onToggleVault={state.handleToggleVault}
          maxActiveCards={state.rules.maxActiveCards}
          maxVaultCards={state.rules.maxVaultCards}
          activeCardNames={state.activeCardNames}
          vaultCardNames={state.vaultCardNames}
        />
      )}

      {/* Standard modes: Class domains or all domains */}
      {(state.mode === 'class-domains' || state.mode === 'all-domains') && (
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
