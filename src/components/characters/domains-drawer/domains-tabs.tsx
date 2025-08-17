import * as React from 'react';

import { DomainSimpleList } from '@/components/characters/domains-drawer/DomainSimpleList';
import { AvailableCardsSection } from '@/components/characters/domains-drawer/available-cards-section';
import { DomainsFilterBar } from '@/components/characters/domains-drawer/domains-filter-bar';
import { TabsHeader } from '@/components/characters/domains-drawer/tabs-header';
import { TypeSummaryChips } from '@/components/characters/domains-drawer/type-summary-chips';
import type { HomebrewState } from '@/components/characters/domains-drawer/use-homebrew-form';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import type { DomainCard } from '@/lib/schemas/domains';

const HomebrewCardFormLazy = React.lazy(() =>
  import('@/components/characters/domains-drawer/homebrew-card-form').then(
    m => ({ default: m.HomebrewCardForm })
  )
);

export type DomainsTabsProps = {
  open: boolean;
  afterOpen: boolean;
  measureReady: boolean;
  closing: boolean;
  virtualOverscan: number;
  accessibleDomains: string[];
  cards: DomainCard[];
  isLoadingCards: boolean;
  inLoadout: (c: DomainCard) => boolean;
  isSelected: (c: DomainCard) => boolean;
  disableAdd: boolean;
  addToLoadout: (c: DomainCard) => void;
  removeFromLoadout: (c: DomainCard) => void;
  // Filters
  domainFilter: string;
  levelFilter: string;
  typeFilter: string;
  search: string;
  debouncedSearch: string;
  setDomainFilter: (v: string) => void;
  setLevelFilter: (v: string) => void;
  setTypeFilter: (v: string) => void;
  setSearch: (v: string) => void;
  filterCards: (cards: DomainCard[], restrict: boolean) => DomainCard[];
  // Homebrew tab state + handlers
  hb: Partial<HomebrewState>;
  onHomebrewChange: (next: Partial<HomebrewState>) => void;
  onHomebrewAdd: (c: DomainCard) => void;
  onHomebrewClear: () => void;
};

export function DomainsTabs(props: DomainsTabsProps) {
  const {
    open,
    afterOpen,
    measureReady,
    closing,
    virtualOverscan,
    accessibleDomains,
    cards,
    isLoadingCards,
    inLoadout,
    isSelected,
    addToLoadout,
    removeFromLoadout,
    domainFilter,
    levelFilter,
    typeFilter,
    search,
    setDomainFilter,
    setLevelFilter,
    setTypeFilter,
    setSearch,
    filterCards,
    hb,
    onHomebrewChange,
    onHomebrewAdd,
    onHomebrewClear,
  } = props;

  const [activeTab, setActiveTab] = React.useState<
    'filtered' | 'any' | 'simple' | 'homebrew'
  >('filtered');

  const activeList = React.useMemo(() => {
    if (!open || !afterOpen) return [] as DomainCard[];
    if (activeTab === 'filtered') return filterCards(cards, true);
    if (activeTab === 'any' || activeTab === 'simple')
      return filterCards(cards, false);
    return [] as DomainCard[];
  }, [activeTab, cards, filterCards, open, afterOpen]);

  const deferredList = React.useDeferredValue(activeList);
  const disableAddFlag = props.disableAdd;

  return (
    <Tabs
      value={activeTab}
      onValueChange={v => setActiveTab(v as typeof activeTab)}
      defaultValue="filtered"
      activationMode="manual"
    >
      <TabsHeader />

      <TabsContent value="filtered" className="space-y-3" forceMount>
        <DomainsFilterBar
          domainFilter={domainFilter}
          levelFilter={levelFilter}
          typeFilter={typeFilter}
          search={search}
          onDomainChange={setDomainFilter}
          onLevelChange={setLevelFilter}
          onTypeChange={setTypeFilter}
          onSearchChange={setSearch}
          accessibleDomains={accessibleDomains}
        />
        <AvailableCardsSection
          title="Available Cards"
          visible={activeTab === 'filtered'}
          isLoading={isLoadingCards}
          items={deferredList}
          measure={afterOpen && measureReady && !closing}
          closing={closing}
          virtualOverscan={virtualOverscan}
          inLoadout={inLoadout}
          isSelected={isSelected}
          disableAdd={disableAddFlag}
          addToLoadout={addToLoadout}
          removeFromLoadout={removeFromLoadout}
        />
      </TabsContent>

      <TabsContent value="any" className="space-y-3">
        <DomainsFilterBar
          domainFilter={domainFilter}
          levelFilter={levelFilter}
          typeFilter={typeFilter}
          search={search}
          onDomainChange={setDomainFilter}
          onLevelChange={setLevelFilter}
          onTypeChange={setTypeFilter}
          onSearchChange={setSearch}
          cardsForAnyTab={cards}
        />
        <div className="space-y-2">
          <div className="text-sm font-medium">Available Cards (All)</div>
          {activeTab === 'any' && <TypeSummaryChips items={deferredList} />}
          <AvailableCardsSection
            title="Available Cards (All)"
            visible={activeTab === 'any'}
            isLoading={isLoadingCards}
            items={deferredList}
            measure={afterOpen && measureReady && !closing}
            closing={closing}
            virtualOverscan={virtualOverscan}
            inLoadout={inLoadout}
            isSelected={isSelected}
            disableAdd={disableAddFlag}
            addToLoadout={addToLoadout}
            removeFromLoadout={removeFromLoadout}
          />
        </div>
      </TabsContent>

      <TabsContent value="simple" className="space-y-3">
        <div className="space-y-2">
          <div className="text-sm font-medium">Simple List</div>
          <DomainSimpleList
            items={deferredList}
            inLoadout={inLoadout}
            disableAdd={disableAddFlag}
            addToLoadout={addToLoadout}
            removeFromLoadout={removeFromLoadout}
          />
        </div>
      </TabsContent>

      <TabsContent value="homebrew" className="space-y-3">
        <React.Suspense fallback={null}>
          <HomebrewCardFormLazy
            hbName={hb.hbName ?? ''}
            hbDomain={hb.hbDomain ?? ''}
            hbType={hb.hbType ?? 'Spell'}
            hbLevel={hb.hbLevel ?? 1}
            hbDescription={hb.hbDescription ?? ''}
            hbHopeCost={hb.hbHopeCost ?? ''}
            hbRecallCost={hb.hbRecallCost ?? ''}
            disableAdd={disableAddFlag}
            onChange={next => {
              type HBChange = Partial<
                Record<
                  | 'hbName'
                  | 'hbDomain'
                  | 'hbType'
                  | 'hbLevel'
                  | 'hbDescription'
                  | 'hbHopeCost'
                  | 'hbRecallCost',
                  string | number | ''
                >
              >;
              const n = next as HBChange;
              const mapped: Partial<HomebrewState> = {};
              if ('hbName' in n) mapped.hbName = String(n.hbName ?? '');
              if ('hbDomain' in n) mapped.hbDomain = String(n.hbDomain ?? '');
              if ('hbType' in n) mapped.hbType = String(n.hbType ?? 'Spell');
              if ('hbLevel' in n)
                mapped.hbLevel =
                  typeof n.hbLevel === 'number'
                    ? n.hbLevel
                    : Number(n.hbLevel ?? 1) || 1;
              if ('hbDescription' in n)
                mapped.hbDescription = String(n.hbDescription ?? '');
              if ('hbHopeCost' in n) {
                const v = n.hbHopeCost;
                mapped.hbHopeCost = v === '' ? '' : Math.max(0, Number(v));
              }
              if ('hbRecallCost' in n) {
                const v = n.hbRecallCost;
                mapped.hbRecallCost = v === '' ? '' : Math.max(0, Number(v));
              }
              onHomebrewChange(mapped);
            }}
            onAdd={onHomebrewAdd}
            onClear={onHomebrewClear}
          />
        </React.Suspense>
      </TabsContent>
    </Tabs>
  );
}
