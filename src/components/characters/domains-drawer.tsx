import type { UseFormReturn } from 'react-hook-form';

import type { BaseSyntheticEvent } from 'react';
import * as React from 'react';

import { useVirtualizer } from '@tanstack/react-virtual';

import { DomainCardItem } from '@/components/characters/domain-card-item';
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
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
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
  const [closing, setClosing] = React.useState(false);
  const closeTimerRef = React.useRef<number | null>(null);

  const [domainFilter, setDomainFilter] = React.useState<string>('All');
  const [levelFilter, setLevelFilter] = React.useState<string>('All');
  const [typeFilter, setTypeFilter] = React.useState<string>('All');
  const [activeTab, setActiveTab] = React.useState<
    'filtered' | 'any' | 'homebrew'
  >('filtered');
  const [search, setSearch] = React.useState('');
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
  const [afterOpen, setAfterOpen] = React.useState(false);
  React.useEffect(() => {
    let raf1 = 0;
    let raf2 = 0;
    if (open) {
      raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => setAfterOpen(true));
      });
    } else {
      setAfterOpen(false);
    }
    return () => {
      if (raf1) cancelAnimationFrame(raf1);
      if (raf2) cancelAnimationFrame(raf2);
    };
  }, [open]);

  // Cleanup any pending close timers on unmount
  React.useEffect(() => {
    return () => {
      if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    };
  }, []);

  // Lazy-load domain data when the drawer opens if not provided by parent
  const [cardsLocal, setCardsLocal] = React.useState<DomainCard[] | null>(
    allCards ? allCards : null
  );
  React.useEffect(() => {
    if (!open) return;
    if (allCards) return;
    if (cardsLocal !== null) return;
    let cancelled = false;
    const load = async () => {
      const mod = await import('@/lib/data/domains');
      const keys = Object.keys(mod).filter(k => k.endsWith('_DOMAIN_CARDS'));
      const flat = keys.flatMap(
        k => (mod as Record<string, unknown>)[k] as DomainCard[]
      );
      if (!cancelled) setCardsLocal(flat as DomainCard[]);
    };
    load().catch(() => {
      if (!cancelled) setCardsLocal([]);
    });
    return () => {
      cancelled = true;
    };
  }, [open, allCards, cardsLocal]);

  const cards: DomainCard[] = React.useMemo(
    () => allCards ?? cardsLocal ?? [],
    [allCards, cardsLocal]
  );
  const isLoadingCards = !allCards && open && cardsLocal === null;

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
      const q = search.trim().toLowerCase();
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
    [accessibleDomains, domainFilter, levelFilter, typeFilter, search]
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

  // Virtualized list for large collections to improve performance.
  function VirtualCardList({
    items,
    measure = true,
  }: {
    items: DomainCard[];
    measure?: boolean;
  }) {
    const parentRef = React.useRef<HTMLDivElement | null>(null);
    const rowVirtualizer = useVirtualizer({
      // Disable observers/virtualization during close to avoid layout work interfering with the close animation
      enabled: !!measure && !closing,
      count: items.length,
      getScrollElement: () => parentRef.current,
      estimateSize: () => 120,
      // Keep overscan low to minimize render work during drawer animations
      overscan: 3,
      // Wrap ResizeObserver measurements in rAF to align with paint frames
      useAnimationFrameWithResizeObserver: true,
      getItemKey: index =>
        `${items[index]?.domain ?? 'x'}:${items[index]?.name ?? index}`,
    });

    if (items.length === 0) {
      return (
        <div className="text-muted-foreground p-3 text-sm">No cards found.</div>
      );
    }

    return (
      <div
        ref={parentRef}
        className={cn(
          'max-h-[60dvh] overflow-y-auto',
          closing && 'pointer-events-none touch-none overflow-hidden'
        )}
        // While closing, remove the vaul-scrollable marker to prevent momentum scroll from blocking close
        data-vaul-scrollable={closing ? undefined : true}
        aria-busy={closing || undefined}
      >
        <div
          style={{
            height: rowVirtualizer.getTotalSize(),
            position: 'relative',
          }}
        >
          {rowVirtualizer
            .getVirtualItems()
            .map((vRow: { index: number; start: number }) => {
              const card = items[vRow.index];
              return (
                <div
                  key={`${card.domain}:${card.name}`}
                  ref={
                    measure && !closing
                      ? rowVirtualizer.measureElement
                      : undefined
                  }
                  data-index={vRow.index}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    transform: `translateY(${vRow.start}px)`,
                  }}
                >
                  <DomainCardItem
                    card={card}
                    context="available"
                    inLoadout={inLoadout(card)}
                    disableAdd={disableAdd}
                    onAddToLoadout={addToLoadout}
                    onRemoveFromLoadout={removeFromLoadout}
                  />
                </div>
              );
            })}
        </div>
      </div>
    );
  }

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
        if (!next && open) {
          setClosing(true);
          if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
          // Allow time for the close animation to finish before re-enabling
          closeTimerRef.current = window.setTimeout(() => {
            setClosing(false);
            closeTimerRef.current = null;
          }, 450);
        } else if (next) {
          // Reopened, ensure closing flag is cleared
          setClosing(false);
        }
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
            >
              <TabsList>
                <TabsTrigger value="filtered">Filtered</TabsTrigger>
                <TabsTrigger value="any">Any</TabsTrigger>
                <TabsTrigger value="homebrew">Homebrew</TabsTrigger>
              </TabsList>

              <TabsContent value="filtered" className="space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  <FormItem>
                    <FormLabel>Domain</FormLabel>
                    <FormControl>
                      <Select
                        value={domainFilter}
                        onValueChange={setDomainFilter}
                      >
                        <SelectTrigger size="sm" className="min-w-28">
                          <SelectValue placeholder="All" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All">All</SelectItem>
                          {accessibleDomains.map(d => (
                            <SelectItem key={d} value={d}>
                              {d}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                  <FormItem>
                    <FormLabel>Level</FormLabel>
                    <FormControl>
                      <Select
                        value={levelFilter}
                        onValueChange={setLevelFilter}
                      >
                        <SelectTrigger size="sm" className="min-w-28">
                          <SelectValue placeholder="All" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All">All</SelectItem>
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(l => (
                            <SelectItem key={l} value={String(l)}>
                              {l}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <FormControl>
                      <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger size="sm" className="min-w-28">
                          <SelectValue placeholder="All" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All">All</SelectItem>
                          <SelectItem value="Spell">Spell</SelectItem>
                          <SelectItem value="Ability">Ability</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                </div>
                <div>
                  <FormItem>
                    <FormLabel>Search</FormLabel>
                    <FormControl>
                      <Input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search by name, domain, type, text"
                      />
                    </FormControl>
                  </FormItem>
                </div>

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
                          measure={afterOpen}
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
                <div className="grid grid-cols-3 gap-2">
                  <FormItem>
                    <FormLabel>Domain</FormLabel>
                    <FormControl>
                      <Select
                        value={domainFilter}
                        onValueChange={setDomainFilter}
                      >
                        <SelectTrigger size="sm" className="min-w-28">
                          <SelectValue placeholder="All" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All">All</SelectItem>
                          {[...new Set(cards.map(c => String(c.domain)))].map(
                            d => (
                              <SelectItem key={d} value={d}>
                                {d}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                  <FormItem>
                    <FormLabel>Level</FormLabel>
                    <FormControl>
                      <Select
                        value={levelFilter}
                        onValueChange={setLevelFilter}
                      >
                        <SelectTrigger size="sm" className="min-w-28">
                          <SelectValue placeholder="All" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All">All</SelectItem>
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(l => (
                            <SelectItem key={l} value={String(l)}>
                              {l}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <FormControl>
                      <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger size="sm" className="min-w-28">
                          <SelectValue placeholder="All" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All">All</SelectItem>
                          <SelectItem value="Spell">Spell</SelectItem>
                          <SelectItem value="Ability">Ability</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                </div>
                <div>
                  <FormItem>
                    <FormLabel>Search</FormLabel>
                    <FormControl>
                      <Input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search all cards"
                      />
                    </FormControl>
                  </FormItem>
                </div>
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
                          measure={afterOpen}
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
                <div className="grid grid-cols-2 gap-2">
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <Input
                      value={hbName}
                      onChange={e => setHbName(e.target.value)}
                      placeholder="Custom card name"
                    />
                  </FormItem>
                  <FormItem>
                    <FormLabel>Domain</FormLabel>
                    <Input
                      value={hbDomain}
                      onChange={e => setHbDomain(e.target.value)}
                      placeholder="Any text (e.g., Homebrew)"
                    />
                  </FormItem>
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Input
                      value={hbType}
                      onChange={e => setHbType(e.target.value)}
                      placeholder="Spell or Ability"
                    />
                  </FormItem>
                  <FormItem>
                    <FormLabel>Level</FormLabel>
                    <Input
                      type="number"
                      min={1}
                      max={10}
                      value={hbLevel}
                      onChange={e => setHbLevel(Number(e.target.value) || 1)}
                    />
                  </FormItem>
                </div>
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    value={hbDescription}
                    onChange={e => setHbDescription(e.target.value)}
                    placeholder="Rules text, effects, costs, etc."
                  />
                </FormItem>
                <div className="grid grid-cols-2 gap-2">
                  <FormItem>
                    <FormLabel>Hope Cost</FormLabel>
                    <Input
                      type="number"
                      min={0}
                      value={hbHopeCost}
                      onChange={e => {
                        const n = Number(e.target.value);
                        setHbHopeCost(Number.isFinite(n) ? n : '');
                      }}
                      placeholder="e.g. 1"
                    />
                  </FormItem>
                  <FormItem>
                    <FormLabel>Recall Cost</FormLabel>
                    <Input
                      type="number"
                      min={0}
                      value={hbRecallCost}
                      onChange={e => {
                        const n = Number(e.target.value);
                        setHbRecallCost(Number.isFinite(n) ? n : '');
                      }}
                      placeholder="e.g. 1"
                    />
                  </FormItem>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const trimmed = hbName.trim();
                      if (!trimmed) return;
                      const newCard: DomainCard = {
                        name: trimmed,
                        level: Math.max(1, Math.min(10, hbLevel)),
                        domain: hbDomain.trim() || 'Homebrew',
                        type: hbType.trim() || 'Spell',
                        description: hbDescription.trim() || '',
                        hopeCost:
                          hbHopeCost === ''
                            ? undefined
                            : Math.max(0, Number(hbHopeCost)),
                        recallCost:
                          hbRecallCost === ''
                            ? undefined
                            : Math.max(0, Number(hbRecallCost)),
                        metadata: { homebrew: true },
                      } as DomainCard;
                      addToLoadout(newCard);
                    }}
                    disabled={disableAdd}
                  >
                    Add to Loadout
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setHbName('');
                      setHbDomain('');
                      setHbType('Spell');
                      setHbLevel(1);
                      setHbDescription('');
                      setHbHopeCost('');
                      setHbRecallCost('');
                    }}
                  >
                    Clear
                  </Button>
                </div>
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
                  <FormItem>
                    <FormLabel>Loadout ({currentLoadout.length})</FormLabel>
                    <div className="divide-border rounded-md border">
                      {!afterOpen ? (
                        <div className="text-muted-foreground p-3 text-sm">
                          Preparing…
                        </div>
                      ) : currentLoadout.length === 0 ? (
                        <div className="text-muted-foreground p-3 text-sm">
                          No active cards
                        </div>
                      ) : (
                        currentLoadout.map(card => (
                          <DomainCardItem
                            key={`loadout:${card.name}`}
                            card={card}
                            context="loadout"
                            onRemoveFromLoadout={removeFromLoadout}
                          />
                        ))
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control as never}
                name="vault"
                render={() => (
                  <FormItem>
                    <FormLabel>Vault ({currentVault.length})</FormLabel>
                    <div className="divide-border rounded-md border">
                      {!afterOpen ? (
                        <div className="text-muted-foreground p-3 text-sm">
                          Preparing…
                        </div>
                      ) : currentVault.length === 0 ? (
                        <div className="text-muted-foreground p-3 text-sm">
                          No owned cards
                        </div>
                      ) : (
                        currentVault.map(card => (
                          <DomainCardItem
                            key={`vault:${card.name}`}
                            card={card}
                            context="vault"
                            inLoadout={inLoadout(card)}
                            disableAdd={disableAdd}
                            onAddToLoadout={addToLoadout}
                            onRemoveFromLoadout={removeFromLoadout}
                            onRemoveFromVault={removeFromVault}
                          />
                        ))
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
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
