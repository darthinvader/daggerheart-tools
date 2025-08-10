import type { UseFormReturn } from 'react-hook-form';

import type { BaseSyntheticEvent } from 'react';
import * as React from 'react';

import { DomainCardItem } from '@/components/characters/domain-card-item';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
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
  allCards: DomainCard[];
  accessibleDomains: string[]; // Domain names allowed
  submit: (e?: BaseSyntheticEvent) => void | Promise<void>;
  onCancel: () => void;
  startingLimit?: number; // hard limit during creation
  softLimit?: number; // guidance after creation
};

export function DomainsDrawer({
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
  const baselineRef = React.useRef<DomainsFormValues | null>(null);
  // Track previous open state to detect open→close transitions.
  const prevOpenRef = React.useRef(open);
  // When Cancel/Save is pressed, we skip auto-save on close to avoid double-save.
  const skipAutoSaveRef = React.useRef(false);

  const filtered = React.useMemo(() => {
    const allowed = new Set(accessibleDomains);
    const q = search.trim().toLowerCase();
    return allCards.filter(c => {
      if (!allowed.has(String(c.domain))) return false;
      if (!(domainFilter === 'All' || String(c.domain) === domainFilter))
        return false;
      if (!(levelFilter === 'All' || c.level === Number(levelFilter)))
        return false;
      if (!(typeFilter === 'All' || String(c.type) === typeFilter))
        return false;
      if (!q) return true;
      const hay =
        `${c.name} ${String(c.domain)} ${c.type} ${c.description ?? ''}`.toLowerCase();
      return hay.includes(q);
    });
  }, [
    allCards,
    accessibleDomains,
    domainFilter,
    levelFilter,
    typeFilter,
    search,
  ]);

  const anyFiltered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return allCards;
    return allCards.filter(c => {
      const hay =
        `${c.name} ${String(c.domain)} ${c.type} ${c.description ?? ''}`.toLowerCase();
      return hay.includes(q);
    });
  }, [allCards, search]);

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
  const creationComplete = form.watch('creationComplete') ?? false;

  // Snapshot baseline on open; auto-save on close unless explicitly skipped.
  React.useEffect(() => {
    // Drawer just opened
    if (!prevOpenRef.current && open) {
      const vals = form.getValues();
      // Deep clone to decouple from RHF's internal structures
      try {
        baselineRef.current = JSON.parse(JSON.stringify(vals));
      } catch {
        // Fallback: assign directly if cloning fails
        baselineRef.current = vals as DomainsFormValues;
      }
    }

    // Drawer just closed
    if (prevOpenRef.current && !open) {
      const shouldSkip = skipAutoSaveRef.current;
      // reset for next open cycle
      skipAutoSaveRef.current = false;

      const isValid = form.formState.isValid;
      const withinLimit =
        creationComplete || currentLoadout.length <= startingLimit;
      if (!shouldSkip && isValid && withinLimit) {
        // Fire and forget; parent submit handles persistence/close flow
        void submit();
      }
    }
    prevOpenRef.current = open;
  }, [
    open,
    form,
    submit,
    creationComplete,
    currentLoadout.length,
    startingLimit,
  ]);

  const inLoadout = (card: DomainCard) =>
    currentLoadout.some(c => c.name === card.name);

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
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Manage Domains & Loadout</DrawerTitle>
        </DrawerHeader>
        <div className="overflow-y-auto px-4 pb-[max(8px,env(safe-area-inset-bottom))]">
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
                        <Select
                          value={typeFilter}
                          onValueChange={setTypeFilter}
                        >
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
                      {filtered.length === 0 ? (
                        <div className="text-muted-foreground p-3 text-sm">
                          No cards match the filters.
                        </div>
                      ) : (
                        filtered.map(card => (
                          <DomainCardItem
                            key={`${card.domain}:${card.name}`}
                            card={card}
                            context="available"
                            inLoadout={inLoadout(card)}
                            disableAdd={disableAdd}
                            onAddToLoadout={addToLoadout}
                            onRemoveFromLoadout={removeFromLoadout}
                          />
                        ))
                      )}
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
                            {[
                              ...new Set(allCards.map(c => String(c.domain))),
                            ].map(d => (
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
                        <Select
                          value={typeFilter}
                          onValueChange={setTypeFilter}
                        >
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
                    <div className="divide-border rounded-md border">
                      {anyFiltered
                        .filter(
                          c =>
                            domainFilter === 'All' ||
                            String(c.domain) === domainFilter
                        )
                        .filter(
                          c =>
                            levelFilter === 'All' ||
                            c.level === Number(levelFilter)
                        )
                        .filter(
                          c =>
                            typeFilter === 'All' ||
                            String(c.type) === typeFilter
                        ).length === 0 ? (
                        <div className="text-muted-foreground p-3 text-sm">
                          No cards found.
                        </div>
                      ) : (
                        anyFiltered
                          .filter(
                            c =>
                              domainFilter === 'All' ||
                              String(c.domain) === domainFilter
                          )
                          .filter(
                            c =>
                              levelFilter === 'All' ||
                              c.level === Number(levelFilter)
                          )
                          .filter(
                            c =>
                              typeFilter === 'All' ||
                              String(c.type) === typeFilter
                          )
                          .map(card => (
                            <DomainCardItem
                              key={`${card.domain}:${card.name}`}
                              card={card}
                              context="available"
                              inLoadout={inLoadout(card)}
                              disableAdd={disableAdd}
                              onAddToLoadout={addToLoadout}
                              onRemoveFromLoadout={removeFromLoadout}
                            />
                          ))
                      )}
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
                        {currentLoadout.length === 0 ? (
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
                        {currentVault.length === 0 ? (
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

              <DrawerFooter>
                <div className="flex items-center justify-between gap-2">
                  <div
                    className={cn(
                      'text-xs',
                      overHardLimit && 'text-destructive'
                    )}
                  >
                    Loadout: {currentLoadout.length}/{maxAllowed}{' '}
                    {!creationComplete && '(creation limit)'}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        // Explicit cancel: do not auto-save on ensuing close
                        skipAutoSaveRef.current = true;
                        onCancel();
                      }}
                    >
                      Cancel
                    </Button>
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
                        // Prevent auto-save on the close triggered by a manual save
                        skipAutoSaveRef.current = true;
                      }}
                      disabled={
                        !form.formState.isValid ||
                        (!creationComplete &&
                          currentLoadout.length > startingLimit)
                      }
                    >
                      Save
                    </Button>
                  </div>
                </div>
              </DrawerFooter>
            </form>
          </Form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
