import type { UseFormReturn } from 'react-hook-form';

import type { BaseSyntheticEvent } from 'react';
import * as React from 'react';

// Virtual list is used via AvailableCardsSection
import { AvailableCardsSection } from '@/components/characters/domains-drawer/available-cards-section';
import { CreationCompleteToggle } from '@/components/characters/domains-drawer/creation-complete-toggle';
import { DomainsFilterBar } from '@/components/characters/domains-drawer/domains-filter-bar';
import { getLoadoutLimits } from '@/components/characters/domains-drawer/loadout-limits';
import { LoadoutList } from '@/components/characters/domains-drawer/loadout-list';
import { TabsHeader } from '@/components/characters/domains-drawer/tabs-header';
import { TypeSummaryChips } from '@/components/characters/domains-drawer/type-summary-chips';
import { useAfterOpenFlag } from '@/components/characters/domains-drawer/use-after-open';
import { useClosingFreeze } from '@/components/characters/domains-drawer/use-closing-freeze';
import { useDomainCardsLoader } from '@/components/characters/domains-drawer/use-domain-cards-loader';
import { useDomainFilters } from '@/components/characters/domains-drawer/use-domain-filters';
import { useHomebrewForm } from '@/components/characters/domains-drawer/use-homebrew-form';
import { useLoadoutLists } from '@/components/characters/domains-drawer/use-loadout-lists';
import { VaultList } from '@/components/characters/domains-drawer/vault-list';
import { useBaselineSnapshot } from '@/components/characters/hooks/use-baseline-snapshot';
import { useDrawerAutosaveOnClose } from '@/components/characters/hooks/use-drawer-autosave';
import { DrawerScaffold } from '@/components/drawers/drawer-scaffold';
import { Button } from '@/components/ui/button';
import { Form, FormField } from '@/components/ui/form';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { filterCards as filterCardsShared } from '@/features/characters/logic';
import { useCoarsePointer } from '@/hooks/use-coarse-pointer';
import { useMeasureReady } from '@/hooks/use-measure-ready';
// Using CSS dynamic viewport units (dvh) for correct keyboard interactions
import type { DomainCard } from '@/lib/schemas/domains';

const HomebrewCardFormLazy = React.lazy(() =>
  import('@/components/characters/domains-drawer/homebrew-card-form').then(
    m => ({ default: m.HomebrewCardForm })
  )
);

// import { cn } from '@/lib/utils';

export type DomainsFormValues = {
  loadout: DomainCard[];
  vault: DomainCard[];
  creationComplete?: boolean;
};

export type DomainsDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<DomainsFormValues>;
  allCards?: DomainCard[];
  accessibleDomains: string[]; // Domain names allowed
  submit: (e?: BaseSyntheticEvent) => void | Promise<void>;
  onCancel: () => void;
  startingLimit?: number; // hard limit during creation
  softLimit?: number; // guidance after creation
};

function DomainsDrawerImpl({
  open,
  onOpenChange,
  form,
  allCards,
  accessibleDomains,
  submit,
  onCancel,
  startingLimit = 3,
  softLimit = 6,
}: DomainsDrawerProps) {
  // Track when the drawer is closing to temporarily freeze heavy work & scrolling
  const { closing, startClosing, clearClosing } = useClosingFreeze();
  const [activeTab, setActiveTab] = React.useState<
    'filtered' | 'any' | 'homebrew'
  >('filtered');
  // Debounced search + filters via shared hook
  // Replace local filter/search state with shared hook
  const {
    domainFilter,
    levelFilter,
    typeFilter,
    search,
    debouncedSearch,
    setDomainFilter,
    setLevelFilter,
    setTypeFilter,
    setSearch,
  } = useDomainFilters({
    domainFilter: 'All',
    levelFilter: 'All',
    typeFilter: 'All',
    search: '',
  });
  // Homebrew minimal fields; description carries the "what it does" text
  const { state: hb, setState: setHb, clear: clearHb } = useHomebrewForm();

  // Track baseline form values when the drawer opens so we can Reset to it.
  const baselineRef = useBaselineSnapshot(open, () => form.getValues());
  // When Cancel/Save is pressed, we skip auto-save on close to avoid double-save.
  const skipAutoSaveRef = React.useRef(false);

  // After-open flag: wait a couple of RAFs so CSS animations start before heavy work.
  const afterOpen = useAfterOpenFlag(open);

  // Cleanup any pending close timers on unmount
  // cleanup handled in useClosingFreeze

  const { cards, isLoadingCards } = useDomainCardsLoader(
    open,
    allCards ?? null
  );

  // Centralized list management
  const {
    currentLoadout,
    currentVault,
    inLoadout,
    addToLoadout,
    removeFromLoadout,
    removeFromVault,
  } = useLoadoutLists(form as never);

  // Use shared helpers for filtering
  const filterCards = React.useCallback(
    (cardsList: DomainCard[], restrictToAccessible: boolean) =>
      filterCardsShared(cardsList, {
        allowedDomains: restrictToAccessible ? accessibleDomains : undefined,
        domain: domainFilter,
        level: levelFilter,
        type: typeFilter,
        search: debouncedSearch,
      }),
    [accessibleDomains, domainFilter, levelFilter, typeFilter, debouncedSearch]
  );

  // Only compute the active tab's list to reduce CPU work.
  const activeList = React.useMemo(() => {
    if (!open || !afterOpen) return [] as DomainCard[];
    if (activeTab === 'filtered') return filterCards(cards, true);
    if (activeTab === 'any') return filterCards(cards, false);
    return [] as DomainCard[];
  }, [activeTab, cards, filterCards, open, afterOpen]);

  // Defer large list rendering to keep interactions responsive.
  const deferredList = React.useDeferredValue(activeList);

  const measureReady = useMeasureReady(open);

  const virtualOverscan = useCoarsePointer() ? 1 : 3;

  // Virtualized list for large collections to improve performance.
  // Virtualized list extracted into a dedicated component for clarity

  // (moved above)
  const creationComplete = form.watch('creationComplete') ?? false;

  // Auto-save on any close path, guarded by validation & limits.
  useDrawerAutosaveOnClose({
    open,
    trigger: () => form.trigger(),
    creationComplete,
    currentLoadoutCount: currentLoadout.length,
    startingLimit,
    submit: () => submit(),
    skipRef: skipAutoSaveRef,
  });

  // Handlers provided by hook

  const { disableAdd } = getLoadoutLimits(
    creationComplete,
    currentLoadout.length,
    startingLimit,
    softLimit
  );

  // Compute recall-cost budget used (read-only for now). Costs may be undefined; treat missing as 0.
  const recallBudgetUsed = React.useMemo(
    () => currentLoadout.reduce((sum, c) => sum + (c.recallCost ?? 0), 0),
    [currentLoadout]
  );

  return (
    <DrawerScaffold
      open={open}
      onOpenChange={next => {
        // Transition into a temporary "closing" state to freeze scrolling/measurement
        if (!next && open) startClosing(450);
        else if (next) clearClosing();
        onOpenChange(next);
      }}
      title="Manage Domains & Loadout"
      onCancel={() => {
        skipAutoSaveRef.current = true;
        onCancel();
      }}
      onSubmit={() => {
        skipAutoSaveRef.current = true;
        return submit();
      }}
      footer={
        <div className="flex w-full items-center justify-between gap-2">
          <div className="text-muted-foreground text-xs">
            {/* * REVIEW: Final budget TBD. Showing read-only Recall Cost used. */}
            Recall used: <span className="font-medium">{recallBudgetUsed}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                if (baselineRef.current) {
                  form.reset(baselineRef.current);
                }
              }}
            >
              Reset
            </Button>
            <Button
              type="submit"
              onClick={() => {
                skipAutoSaveRef.current = true;
              }}
              disabled={!form.formState.isValid}
            >
              Save
            </Button>
          </div>
        </div>
      }
    >
      {/* Wrap content to suppress interactions while closing */}
      <div
        className={
          closing ? 'pointer-events-none touch-none select-none' : undefined
        }
      >
        <Form {...form}>
          <form className="space-y-4" onSubmit={submit} noValidate>
            <Tabs
              value={activeTab}
              onValueChange={v => setActiveTab(v as typeof activeTab)}
              // Don’t mount inactive panels to reduce DOM & measurement during open
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
                  disableAdd={disableAdd}
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
                  <div className="text-sm font-medium">
                    Available Cards (All)
                  </div>
                  {/* Summary chips by type to mirror visible list */}
                  {activeTab === 'any' && (
                    <TypeSummaryChips items={deferredList} />
                  )}
                  <AvailableCardsSection
                    title="Available Cards (All)"
                    visible={activeTab === 'any'}
                    isLoading={isLoadingCards}
                    items={deferredList}
                    measure={afterOpen && measureReady && !closing}
                    closing={closing}
                    virtualOverscan={virtualOverscan}
                    inLoadout={inLoadout}
                    disableAdd={disableAdd}
                    addToLoadout={addToLoadout}
                    removeFromLoadout={removeFromLoadout}
                  />
                </div>
              </TabsContent>

              <TabsContent value="homebrew" className="space-y-3">
                <React.Suspense fallback={null}>
                  <HomebrewCardFormLazy
                    hbName={hb.hbName}
                    hbDomain={hb.hbDomain}
                    hbType={hb.hbType}
                    hbLevel={hb.hbLevel}
                    hbDescription={hb.hbDescription}
                    hbHopeCost={hb.hbHopeCost}
                    hbRecallCost={hb.hbRecallCost}
                    disableAdd={disableAdd}
                    onChange={next => {
                      const mapped = {
                        hbName:
                          'hbName' in next
                            ? String(next.hbName ?? '')
                            : undefined,
                        hbDomain:
                          'hbDomain' in next
                            ? String(next.hbDomain ?? '')
                            : undefined,
                        hbType:
                          'hbType' in next
                            ? String(next.hbType ?? '')
                            : undefined,
                        hbLevel:
                          'hbLevel' in next
                            ? Number(next.hbLevel ?? 1)
                            : undefined,
                        hbDescription:
                          'hbDescription' in next
                            ? String(next.hbDescription ?? '')
                            : undefined,
                        hbHopeCost:
                          'hbHopeCost' in next
                            ? ((next.hbHopeCost as number | '') ?? '')
                            : undefined,
                        hbRecallCost:
                          'hbRecallCost' in next
                            ? ((next.hbRecallCost as number | '') ?? '')
                            : undefined,
                      };
                      setHb(mapped);
                    }}
                    onAdd={addToLoadout}
                    onClear={clearHb}
                  />
                </React.Suspense>
              </TabsContent>
            </Tabs>

            {/* * REVIEW: Limits and costs TBD — earlier count-based guidance removed. */}
            <CreationCompleteToggle form={form as never} />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control as never}
                name="loadout"
                render={() => (
                  <LoadoutList
                    items={currentLoadout}
                    afterOpen={afterOpen}
                    onRemove={removeFromLoadout}
                  />
                )}
              />
              <FormField
                control={form.control as never}
                name="vault"
                render={() => (
                  <VaultList
                    items={currentVault}
                    afterOpen={afterOpen}
                    inLoadout={inLoadout}
                    disableAdd={disableAdd}
                    onAdd={addToLoadout}
                    onRemoveFromLoadout={removeFromLoadout}
                    onRemoveFromVault={removeFromVault}
                  />
                )}
              />
            </div>
          </form>
        </Form>
        {/* Lightweight, ephemeral blocker to absorb touch/scroll during close on mobile */}
        {closing ? (
          <div className="fixed inset-0 z-10" aria-hidden="true" />
        ) : null}
      </div>
    </DrawerScaffold>
  );
}
export const DomainsDrawer = React.memo(DomainsDrawerImpl);
