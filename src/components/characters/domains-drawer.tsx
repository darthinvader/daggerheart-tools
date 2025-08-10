import type { UseFormReturn } from 'react-hook-form';

import type { BaseSyntheticEvent } from 'react';
import * as React from 'react';

import { DomainsFilterBar } from '@/components/characters/domains-drawer/domains-filter-bar';
import { HomebrewCardForm } from '@/components/characters/domains-drawer/homebrew-card-form';
import { LoadoutList } from '@/components/characters/domains-drawer/loadout-list';
import { useAfterOpenFlag } from '@/components/characters/domains-drawer/use-after-open';
import { useClosingFreeze } from '@/components/characters/domains-drawer/use-closing-freeze';
import { useDomainCardsLoader } from '@/components/characters/domains-drawer/use-domain-cards-loader';
import { useDomainFilters } from '@/components/characters/domains-drawer/use-domain-filters';
import { VaultList } from '@/components/characters/domains-drawer/vault-list';
import { VirtualCardList } from '@/components/characters/domains-drawer/virtual-card-list';
import { useBaselineSnapshot } from '@/components/characters/hooks/use-baseline-snapshot';
import { useDrawerAutosaveOnClose } from '@/components/characters/hooks/use-drawer-autosave';
import { DrawerScaffold } from '@/components/drawers/drawer-scaffold';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCoarsePointer } from '@/hooks/use-coarse-pointer';
import { useMeasureReady } from '@/hooks/use-measure-ready';
// Using CSS dynamic viewport units (dvh) for correct keyboard interactions
import type { DomainCard } from '@/lib/schemas/domains';
import { cn } from '@/lib/utils';

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
  const [hbName, setHbName] = React.useState('');
  const [hbDomain, setHbDomain] = React.useState('');
  const [hbType, setHbType] = React.useState('Spell');
  const [hbLevel, setHbLevel] = React.useState(1);
  const [hbDescription, setHbDescription] = React.useState('');
  const [hbHopeCost, setHbHopeCost] = React.useState<number | ''>('');
  const [hbRecallCost, setHbRecallCost] = React.useState<number | ''>('');

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

  // Watch current form lists once and derive everything from them
  const watchedLoadout = form.watch('loadout');
  const currentLoadout = React.useMemo(
    () => (Array.isArray(watchedLoadout) ? watchedLoadout : []),
    [watchedLoadout]
  );
  const watchedVault = form.watch('vault');
  const currentVault = React.useMemo(
    () => (Array.isArray(watchedVault) ? watchedVault : []),
    [watchedVault]
  );
  // Build a lookup for O(1) membership checks.
  const loadoutNames = React.useMemo(
    () => (open ? new Set(currentLoadout.map(c => c.name)) : new Set<string>()),
    [currentLoadout, open]
  );
  const inLoadout = (card: DomainCard) => loadoutNames.has(card.name);

  // Single filtering function used by both tabs to avoid duplicated work.
  const filterCards = React.useCallback(
    (cards: DomainCard[], restrictToAccessible: boolean) => {
      const allowed = restrictToAccessible
        ? new Set(accessibleDomains)
        : undefined;
      const q = debouncedSearch.trim().toLowerCase();
      const level = levelFilter === 'All' ? null : Number(levelFilter);
      const type = typeFilter === 'All' ? null : typeFilter;
      const domain = domainFilter === 'All' ? null : domainFilter;
      return cards.filter(c => {
        if (allowed && !allowed.has(String(c.domain))) return false;
        if (domain && String(c.domain) !== domain) return false;
        if (level !== null && c.level !== level) return false;
        if (type !== null && String(c.type) !== type) return false;
        if (!q) return true;
        const hay =
          `${c.name} ${String(c.domain)} ${c.type} ${c.description ?? ''}`.toLowerCase();
        return hay.includes(q);
      });
    },
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

  const addToLoadout = (card: DomainCard) => {
    const exists = inLoadout(card);
    if (exists) return;
    const next = [...currentLoadout, card];
    form.setValue('loadout', next, { shouldValidate: true });
    // Also ensure it's in vault (owned)
    if (!currentVault.some(c => c.name === card.name)) {
      form.setValue('vault', [...currentVault, card], {
        shouldValidate: false,
      });
    }
  };
  const removeFromLoadout = (card: DomainCard) => {
    const next = currentLoadout.filter(c => c.name !== card.name);
    form.setValue('loadout', next, { shouldValidate: true });
  };

  const removeFromVault = (card: DomainCard) => {
    // Removing from vault also removes from loadout if present
    form.setValue(
      'vault',
      currentVault.filter(c => c.name !== card.name),
      { shouldValidate: false }
    );
    form.setValue(
      'loadout',
      currentLoadout.filter(c => c.name !== card.name),
      { shouldValidate: true }
    );
  };

  const maxAllowed = creationComplete ? softLimit : startingLimit;
  const overHardLimit = currentLoadout.length > maxAllowed && !creationComplete;
  const disableAdd =
    !creationComplete && currentLoadout.length >= startingLimit;

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
          <div className={cn('text-xs', overHardLimit && 'text-destructive')}>
            Loadout: {currentLoadout.length}/{maxAllowed}{' '}
            {!creationComplete && '(creation limit)'}
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
              disabled={
                !form.formState.isValid ||
                (!creationComplete && currentLoadout.length > startingLimit)
              }
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
              <TabsList>
                <TabsTrigger value="filtered">Filtered</TabsTrigger>
                <TabsTrigger value="any">Any</TabsTrigger>
                <TabsTrigger value="homebrew">Homebrew</TabsTrigger>
              </TabsList>

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

                <div className="space-y-2">
                  <div className="text-sm font-medium">Available Cards</div>
                  <div className="divide-border rounded-md border">
                    {activeTab === 'filtered' &&
                      (isLoadingCards ? (
                        <div className="text-muted-foreground p-3 text-sm">
                          Loading cards…
                        </div>
                      ) : afterOpen ? (
                        <VirtualCardList
                          items={deferredList}
                          measure={afterOpen && measureReady && !closing}
                          closing={closing}
                          virtualOverscan={virtualOverscan}
                          inLoadout={inLoadout}
                          disableAdd={disableAdd}
                          addToLoadout={addToLoadout}
                          removeFromLoadout={removeFromLoadout}
                        />
                      ) : (
                        <div className="text-muted-foreground p-3 text-sm">
                          Preparing…
                        </div>
                      ))}
                  </div>
                </div>
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
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="rounded bg-blue-100 px-2 py-0.5 text-blue-900 dark:bg-blue-500/20 dark:text-blue-200">
                        Spell{' '}
                        {deferredList.filter(c => c.type === 'Spell').length}
                      </span>
                      <span className="rounded bg-amber-100 px-2 py-0.5 text-amber-900 dark:bg-amber-500/20 dark:text-amber-200">
                        Ability{' '}
                        {deferredList.filter(c => c.type === 'Ability').length}
                      </span>
                    </div>
                  )}
                  <div className="divide-border rounded-md border">
                    {activeTab === 'any' &&
                      (isLoadingCards ? (
                        <div className="text-muted-foreground p-3 text-sm">
                          Loading cards…
                        </div>
                      ) : afterOpen ? (
                        <VirtualCardList
                          items={deferredList}
                          measure={afterOpen && measureReady && !closing}
                          closing={closing}
                          virtualOverscan={virtualOverscan}
                          inLoadout={inLoadout}
                          disableAdd={disableAdd}
                          addToLoadout={addToLoadout}
                          removeFromLoadout={removeFromLoadout}
                        />
                      ) : (
                        <div className="text-muted-foreground p-3 text-sm">
                          Preparing…
                        </div>
                      ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="homebrew" className="space-y-3">
                <HomebrewCardForm
                  hbName={hbName}
                  hbDomain={hbDomain}
                  hbType={hbType}
                  hbLevel={hbLevel}
                  hbDescription={hbDescription}
                  hbHopeCost={hbHopeCost}
                  hbRecallCost={hbRecallCost}
                  disableAdd={disableAdd}
                  onChange={next => {
                    if ('hbName' in next) setHbName(String(next.hbName ?? ''));
                    if ('hbDomain' in next)
                      setHbDomain(String(next.hbDomain ?? ''));
                    if ('hbType' in next) setHbType(String(next.hbType ?? ''));
                    if ('hbLevel' in next)
                      setHbLevel(Number(next.hbLevel ?? 1));
                    if ('hbDescription' in next)
                      setHbDescription(String(next.hbDescription ?? ''));
                    if ('hbHopeCost' in next)
                      setHbHopeCost((next.hbHopeCost as number | '') ?? '');
                    if ('hbRecallCost' in next)
                      setHbRecallCost((next.hbRecallCost as number | '') ?? '');
                  }}
                  onAdd={addToLoadout}
                  onClear={() => {
                    setHbName('');
                    setHbDomain('');
                    setHbType('Spell');
                    setHbLevel(1);
                    setHbDescription('');
                    setHbHopeCost('');
                    setHbRecallCost('');
                  }}
                />
              </TabsContent>
            </Tabs>

            {!creationComplete && (
              <div className="text-muted-foreground text-xs">
                Starting limit {startingLimit} cards. After creation you can
                exceed this (soft cap {softLimit}).
              </div>
            )}
            <FormField
              control={form.control as never}
              name="creationComplete"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2 pt-1">
                  <FormControl>
                    <Checkbox
                      checked={!!field.value}
                      onCheckedChange={v => field.onChange(!!v)}
                    />
                  </FormControl>
                  <FormLabel className="!mt-0">Creation complete</FormLabel>
                </FormItem>
              )}
            />

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
