import type { UseFormReturn } from 'react-hook-form';

import type { BaseSyntheticEvent } from 'react';
import * as React from 'react';

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
  const [selectedCard, setSelectedCard] = React.useState<DomainCard | null>(
    null
  );
  const [search, setSearch] = React.useState('');
  // Homebrew minimal fields; description carries the "what it does" text
  const [hbName, setHbName] = React.useState('');
  const [hbDomain, setHbDomain] = React.useState('');
  const [hbType, setHbType] = React.useState('Spell');
  const [hbLevel, setHbLevel] = React.useState(1);
  const [hbDescription, setHbDescription] = React.useState('');

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

  // No external dropdown lookups required

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

  // No separate quick-add dropdown; the list below acts as the quick add without closing anything

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
                        filtered.map(card => {
                          const selected = inLoadout(card);
                          return (
                            <div
                              key={`${card.domain}:${card.name}`}
                              className={cn(
                                'flex items-center justify-between gap-3 p-3',
                                'border-b last:border-b-0'
                              )}
                              onClick={() => setSelectedCard(card)}
                              role="button"
                            >
                              <div className="min-w-0">
                                <div className="truncate text-sm font-medium">
                                  {card.name}
                                </div>
                                <div className="text-muted-foreground text-xs">
                                  {String(card.domain)} • L{card.level} •{' '}
                                  <span
                                    className={cn(
                                      'ml-1 inline-flex items-center rounded px-1 py-0.5',
                                      card.type === 'Ability'
                                        ? 'bg-amber-100 text-amber-900 dark:bg-amber-500/20 dark:text-amber-200'
                                        : 'bg-blue-100 text-blue-900 dark:bg-blue-500/20 dark:text-blue-200'
                                    )}
                                  >
                                    {card.type}
                                  </span>
                                  {typeof card.hopeCost === 'number' && (
                                    <span> • Hope {card.hopeCost}</span>
                                  )}
                                  {typeof card.recallCost === 'number' && (
                                    <span> • Recall {card.recallCost}</span>
                                  )}
                                  {Array.isArray(card.tags) &&
                                    card.tags.length > 0 && (
                                      <span> • {card.tags.join(', ')}</span>
                                    )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {selected ? (
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    onClick={() => removeFromLoadout(card)}
                                  >
                                    Remove
                                  </Button>
                                ) : (
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    onClick={() => addToLoadout(card)}
                                    disabled={disableAdd}
                                  >
                                    Add
                                  </Button>
                                )}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="any" className="space-y-3">
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
                      {anyFiltered.length === 0 ? (
                        <div className="text-muted-foreground p-3 text-sm">
                          No cards found.
                        </div>
                      ) : (
                        anyFiltered.map(card => {
                          const selected = inLoadout(card);
                          return (
                            <div
                              key={`${card.domain}:${card.name}`}
                              className={cn(
                                'flex items-center justify-between gap-3 p-3',
                                'border-b last:border-b-0'
                              )}
                              onClick={() => setSelectedCard(card)}
                              role="button"
                            >
                              <div className="min-w-0">
                                <div className="truncate text-sm font-medium">
                                  {card.name}
                                </div>
                                <div className="text-muted-foreground text-xs">
                                  {String(card.domain)} • L{card.level} •{' '}
                                  <span
                                    className={cn(
                                      'ml-1 inline-flex items-center rounded px-1 py-0.5',
                                      card.type === 'Ability'
                                        ? 'bg-amber-100 text-amber-900 dark:bg-amber-500/20 dark:text-amber-200'
                                        : 'bg-blue-100 text-blue-900 dark:bg-blue-500/20 dark:text-blue-200'
                                    )}
                                  >
                                    {card.type}
                                  </span>
                                  {typeof card.hopeCost === 'number' && (
                                    <span> • Hope {card.hopeCost}</span>
                                  )}
                                  {typeof card.recallCost === 'number' && (
                                    <span> • Recall {card.recallCost}</span>
                                  )}
                                  {Array.isArray(card.tags) &&
                                    card.tags.length > 0 && (
                                      <span> • {card.tags.join(', ')}</span>
                                    )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {selected ? (
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    onClick={() => removeFromLoadout(card)}
                                  >
                                    Remove
                                  </Button>
                                ) : (
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    onClick={() => addToLoadout(card)}
                                    disabled={disableAdd}
                                  >
                                    Add
                                  </Button>
                                )}
                              </div>
                            </div>
                          );
                        })
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
                          hopeCost: undefined,
                          recallCost: undefined,
                          metadata: { homebrew: true },
                        } as DomainCard;
                        // Add to loadout (and vault) using existing helpers
                        addToLoadout(newCard);
                        // Keep inputs for adding more; do not close any dropdowns
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
                      }}
                    >
                      Clear
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Creation toggle and notes */}
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

              {/* Preview of last selected card */}
              {selectedCard ? (
                <div className="rounded-md border p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold">
                        {selectedCard.name}
                      </div>
                      <div className="text-muted-foreground text-xs">
                        {String(selectedCard.domain)} • L{selectedCard.level} •{' '}
                        {selectedCard.type}
                        {typeof selectedCard.hopeCost === 'number' && (
                          <span> • Hope {selectedCard.hopeCost}</span>
                        )}
                        {typeof selectedCard.recallCost === 'number' && (
                          <span> • Recall {selectedCard.recallCost}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!inLoadout(selectedCard) ? (
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => addToLoadout(selectedCard)}
                          disabled={disableAdd}
                        >
                          Add
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => removeFromLoadout(selectedCard)}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>
                  {selectedCard.description ? (
                    <div className="mt-2 text-sm whitespace-pre-wrap">
                      {selectedCard.description}
                    </div>
                  ) : null}
                  <div className="text-muted-foreground mt-2 text-xs">
                    <span
                      className={cn(
                        'inline-flex items-center rounded px-1 py-0.5',
                        selectedCard.type === 'Ability'
                          ? 'bg-amber-100 text-amber-900 dark:bg-amber-500/20 dark:text-amber-200'
                          : 'bg-blue-100 text-blue-900 dark:bg-blue-500/20 dark:text-blue-200'
                      )}
                    >
                      {selectedCard.type}
                    </span>
                    {typeof selectedCard.hopeCost === 'number' && (
                      <span> • Hope {selectedCard.hopeCost}</span>
                    )}
                    {typeof selectedCard.recallCost === 'number' && (
                      <span> • Recall {selectedCard.recallCost}</span>
                    )}
                  </div>
                  {Array.isArray(selectedCard.tags) &&
                  selectedCard.tags.length > 0 ? (
                    <div className="text-muted-foreground mt-2 text-xs">
                      Tags: {selectedCard.tags.join(', ')}
                    </div>
                  ) : null}
                </div>
              ) : null}

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
                            <div
                              key={`loadout:${card.name}`}
                              className="flex items-center justify-between gap-3 border-b p-3 last:border-b-0"
                              onClick={() => setSelectedCard(card)}
                            >
                              <div className="min-w-0">
                                <div className="truncate text-sm font-medium">
                                  {card.name}
                                </div>
                                <div className="text-muted-foreground text-xs">
                                  {String(card.domain)} • L{card.level}
                                </div>
                              </div>
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => removeFromLoadout(card)}
                              >
                                Remove
                              </Button>
                            </div>
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
                            <div
                              key={`vault:${card.name}`}
                              className="flex items-center justify-between gap-3 border-b p-3 last:border-b-0"
                              onClick={() => setSelectedCard(card)}
                            >
                              <div className="min-w-0">
                                <div className="truncate text-sm font-medium">
                                  {card.name}
                                </div>
                                <div className="text-muted-foreground text-xs">
                                  {String(card.domain)} • L{card.level}
                                </div>
                              </div>
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => removeFromVault(card)}
                              >
                                Remove
                              </Button>
                            </div>
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
                    <Button type="button" variant="outline" onClick={onCancel}>
                      Cancel
                    </Button>
                    <Button
                      type="submit"
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
