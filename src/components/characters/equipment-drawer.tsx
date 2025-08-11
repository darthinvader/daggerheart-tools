import { CheckIcon, Dice5, Hand, Ruler, Tag } from 'lucide-react';
import type { UseFormReturn } from 'react-hook-form';

import * as React from 'react';

import { DrawerScaffold } from '@/components/drawers/drawer-scaffold';
import { Badge } from '@/components/ui/badge';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import type { EquipmentDraft } from '@/features/characters/storage';
import {
  ALL_PRIMARY_WEAPONS,
  ALL_SECONDARY_WEAPONS,
  ALL_STANDARD_ARMOR,
} from '@/lib/data/equipment';
import { cn } from '@/lib/utils';

export type EquipmentDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<EquipmentDraft>;
  submit: () => void | Promise<void>;
  onCancel: () => void;
  section?: 'primary' | 'secondary' | 'armor';
};

function EquipmentDrawerImpl({
  open,
  onOpenChange,
  form,
  submit,
  onCancel,
  section,
}: EquipmentDrawerProps) {
  const skipRef = React.useRef(false);
  type EquipmentMeta = {
    homebrew?: {
      primary?: MinimalWeapon[];
      secondary?: MinimalWeapon[];
      armor?: MinimalArmor[];
    };
  } & Record<string, unknown>;
  // Source filters per weapon tab
  type SourceFilter = 'default' | 'homebrew' | 'all';
  const [primarySourceFilter, setPrimarySourceFilter] =
    React.useState<SourceFilter>('default');
  const [secondarySourceFilter, setSecondarySourceFilter] =
    React.useState<SourceFilter>('default');
  // Local search state per section for filtering; defaults empty to show all
  const [qPrimary, setQPrimary] = React.useState('');
  const [qSecondary, setQSecondary] = React.useState('');
  const [qArmor, setQArmor] = React.useState('');
  // Simple filters per tab
  const [primaryTier, setPrimaryTier] = React.useState<string>('');
  const [primaryBurden, setPrimaryBurden] = React.useState<string>('');
  const [secondaryTier, setSecondaryTier] = React.useState<string>('');
  const [secondaryBurden, setSecondaryBurden] = React.useState<string>('');
  const [armorTypeFilter, setArmorTypeFilter] = React.useState<string>('');

  // Homebrew lists scoped to drawer session
  type MinimalWeapon = (typeof ALL_PRIMARY_WEAPONS)[number];
  type MinimalArmor = (typeof ALL_STANDARD_ARMOR)[number];
  const [homebrewPrimary, setHomebrewPrimary] = React.useState<MinimalWeapon[]>(
    []
  );
  const [homebrewSecondary, setHomebrewSecondary] = React.useState<
    MinimalWeapon[]
  >([]);
  const [homebrewArmor, setHomebrewArmor] = React.useState<MinimalArmor[]>([]);
  // Initialize homebrew lists from form metadata when opened
  React.useEffect(() => {
    if (!open) return;
    const key = 'metadata' as unknown as keyof EquipmentDraft;
    const meta = (form.getValues(key) as unknown as EquipmentMeta) || {};
    const hb = (
      meta as unknown as {
        homebrew?: {
          primary?: MinimalWeapon[];
          secondary?: MinimalWeapon[];
          armor?: MinimalArmor[];
        };
      }
    ).homebrew;
    if (hb) {
      setHomebrewPrimary(hb.primary || []);
      setHomebrewSecondary(hb.secondary || []);
      setHomebrewArmor(hb.armor || []);
    } else {
      setHomebrewPrimary([]);
      setHomebrewSecondary([]);
      setHomebrewArmor([]);
    }
  }, [open, form]);

  const primarySource = React.useMemo(() => {
    if (primarySourceFilter === 'homebrew') return [...homebrewPrimary];
    if (primarySourceFilter === 'all') {
      return [
        ...ALL_PRIMARY_WEAPONS,
        ...ALL_SECONDARY_WEAPONS,
        ...homebrewPrimary,
        ...homebrewSecondary,
      ];
    }
    // default
    return [...ALL_PRIMARY_WEAPONS];
  }, [primarySourceFilter, homebrewPrimary, homebrewSecondary]);
  const secondarySource = React.useMemo(() => {
    if (secondarySourceFilter === 'homebrew') return [...homebrewSecondary];
    if (secondarySourceFilter === 'all') {
      return [
        ...ALL_SECONDARY_WEAPONS,
        ...ALL_PRIMARY_WEAPONS,
        ...homebrewPrimary,
        ...homebrewSecondary,
      ];
    }
    // default
    return [...ALL_SECONDARY_WEAPONS];
  }, [secondarySourceFilter, homebrewPrimary, homebrewSecondary]);
  const armorSource = React.useMemo(
    () => ALL_STANDARD_ARMOR.concat(homebrewArmor),
    [homebrewArmor]
  );

  // Visible counts for source options
  const primaryCounts = React.useMemo(
    () => ({
      default: ALL_PRIMARY_WEAPONS.length,
      homebrew: homebrewPrimary.length,
      all:
        ALL_PRIMARY_WEAPONS.length +
        ALL_SECONDARY_WEAPONS.length +
        homebrewPrimary.length +
        homebrewSecondary.length,
    }),
    [homebrewPrimary, homebrewSecondary]
  );
  const secondaryCounts = React.useMemo(
    () => ({
      default: ALL_SECONDARY_WEAPONS.length,
      homebrew: homebrewSecondary.length,
      all:
        ALL_SECONDARY_WEAPONS.length +
        ALL_PRIMARY_WEAPONS.length +
        homebrewPrimary.length +
        homebrewSecondary.length,
    }),
    [homebrewPrimary, homebrewSecondary]
  );

  const filteredPrimary = React.useMemo(
    () =>
      primarySource.filter(w => {
        const matchesText = (qPrimary || '')
          .split(/\s+/)
          .every(t =>
            t
              ? `${w.name} ${w.trait} ${w.range} ${w.burden}`
                  .toLowerCase()
                  .includes(t.toLowerCase())
              : true
          );
        const matchesTier = primaryTier ? String(w.tier) === primaryTier : true;
        const matchesBurden = primaryBurden
          ? String(w.burden) === primaryBurden
          : true;
        return matchesText && matchesTier && matchesBurden;
      }),
    [primarySource, qPrimary, primaryTier, primaryBurden]
  );
  const filteredSecondary = React.useMemo(
    () =>
      secondarySource.filter(w => {
        const matchesText = (qSecondary || '')
          .split(/\s+/)
          .every(t =>
            t
              ? `${w.name} ${w.trait} ${w.range} ${w.burden}`
                  .toLowerCase()
                  .includes(t.toLowerCase())
              : true
          );
        const matchesTier = secondaryTier
          ? String(w.tier) === secondaryTier
          : true;
        const matchesBurden = secondaryBurden
          ? String(w.burden) === secondaryBurden
          : true;
        return matchesText && matchesTier && matchesBurden;
      }),
    [secondarySource, qSecondary, secondaryTier, secondaryBurden]
  );
  const armorTypes = React.useMemo(
    () =>
      Array.from(
        new Set(
          ALL_STANDARD_ARMOR.map(a =>
            String((a as unknown as { armorType?: string }).armorType || '')
          )
        )
      ).filter(Boolean) as string[],
    []
  );
  const filteredArmor = React.useMemo(
    () =>
      armorSource.filter(a => {
        const aType = String(
          (a as unknown as { armorType?: string }).armorType || ''
        );
        const matchesText = (qArmor || '')
          .split(/\s+/)
          .every(t =>
            t
              ? `${a.name} ${aType}`.toLowerCase().includes(t.toLowerCase())
              : true
          );
        const matchesType = armorTypeFilter ? aType === armorTypeFilter : true;
        return matchesText && matchesType;
      }),
    [armorSource, qArmor, armorTypeFilter]
  );
  // Default active tab based on requested section
  const defaultTab = section ?? 'primary';
  const currentPrimary = form.watch('primaryWeapon');
  const currentSecondary = form.watch('secondaryWeapon');
  const currentArmor = form.watch('armor');
  const currentArmorType = (
    currentArmor as unknown as { armorType?: string } | undefined
  )?.armorType;
  // Watching entire values not necessary for list selection; form.setValue commits selection.
  return (
    <DrawerScaffold
      open={open}
      onOpenChange={next => {
        onOpenChange(next);
      }}
      title="Manage Equipment"
      onCancel={() => {
        skipRef.current = true;
        onCancel();
      }}
      onSubmit={() => {
        skipRef.current = true;
        return submit();
      }}
    >
      <Form {...form}>
        <form
          className="space-y-4"
          onSubmit={e => {
            e.preventDefault();
            void submit();
          }}
          noValidate
        >
          {/* Source filter is per-tab below */}

          <Tabs defaultValue={defaultTab} className="space-y-3">
            <TabsList>
              <TabsTrigger value="primary">Primary</TabsTrigger>
              <TabsTrigger value="secondary">Secondary</TabsTrigger>
              <TabsTrigger value="armor">Armor</TabsTrigger>
            </TabsList>

            <TabsContent value="primary" className="space-y-2">
              {currentPrimary ? (
                <div className="bg-muted/30 rounded-md border px-3 py-2 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0 truncate">
                      <span className="font-medium">Current:</span>{' '}
                      <span className="truncate align-middle">
                        {currentPrimary.name}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="text-muted-foreground hover:text-foreground underline underline-offset-2"
                      onClick={() =>
                        form.setValue('primaryWeapon', undefined, {
                          shouldDirty: true,
                        })
                      }
                    >
                      Clear
                    </button>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-1">
                    <Badge variant="outline" className="px-1 py-0 text-[10px]">
                      <Tag className="mr-1 inline size-3" aria-hidden />
                      {currentPrimary.trait}
                    </Badge>
                    <Badge variant="outline" className="px-1 py-0 text-[10px]">
                      <Ruler className="mr-1 inline size-3" aria-hidden />
                      {currentPrimary.range}
                    </Badge>
                    <Badge variant="outline" className="px-1 py-0 text-[10px]">
                      <Dice5 className="mr-1 inline size-3" aria-hidden />
                      {`${currentPrimary.damage.count}d${currentPrimary.damage.diceType}${currentPrimary.damage.modifier ? `+${currentPrimary.damage.modifier}` : ''} ${currentPrimary.damage.type}`}
                    </Badge>
                    <Badge variant="outline" className="px-1 py-0 text-[10px]">
                      <Hand className="mr-1 inline size-3" aria-hidden />
                      {currentPrimary.burden}
                    </Badge>
                    {currentPrimary.domainAffinity ? (
                      <Badge
                        variant="outline"
                        className="px-1 py-0 text-[10px]"
                      >
                        {currentPrimary.domainAffinity}
                      </Badge>
                    ) : null}
                  </div>
                </div>
              ) : null}
              {/* Source filter */}
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Source:</span>
                <ToggleGroup
                  type="single"
                  aria-label="Source filter"
                  variant="outline"
                  size="lg"
                  value={primarySourceFilter}
                  onValueChange={v =>
                    v && setPrimarySourceFilter(v as SourceFilter)
                  }
                >
                  <ToggleGroupItem value="default">
                    Default ({primaryCounts.default})
                  </ToggleGroupItem>
                  <ToggleGroupItem value="homebrew">
                    Homebrew ({primaryCounts.homebrew})
                  </ToggleGroupItem>
                  <ToggleGroupItem value="all">
                    All ({primaryCounts.all})
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
              <Input
                placeholder="Search primary weapons"
                value={qPrimary}
                onChange={e => setQPrimary(e.target.value)}
                inputMode="search"
                enterKeyHint="search"
              />
              {/* Filters: Tier and Burden */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <span className="text-muted-foreground">Tier:</span>
                  <ToggleGroup
                    type="single"
                    value={primaryTier}
                    onValueChange={v => setPrimaryTier(v)}
                  >
                    <ToggleGroupItem value="">All</ToggleGroupItem>
                    <ToggleGroupItem value="1">1</ToggleGroupItem>
                    <ToggleGroupItem value="2">2</ToggleGroupItem>
                    <ToggleGroupItem value="3">3</ToggleGroupItem>
                    <ToggleGroupItem value="4">4</ToggleGroupItem>
                  </ToggleGroup>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-muted-foreground">Burden:</span>
                  <ToggleGroup
                    type="single"
                    value={primaryBurden}
                    onValueChange={v => setPrimaryBurden(v)}
                  >
                    <ToggleGroupItem value="">All</ToggleGroupItem>
                    <ToggleGroupItem value="One-Handed">1H</ToggleGroupItem>
                    <ToggleGroupItem value="Two-Handed">2H</ToggleGroupItem>
                  </ToggleGroup>
                </div>
              </div>
              <div className="max-h-72 overflow-auto rounded border">
                {filteredPrimary.map(w => (
                  <button
                    key={w.name}
                    type="button"
                    aria-selected={currentPrimary?.name === w.name}
                    className={cn(
                      'hover:bg-muted/50 w-full text-left',
                      currentPrimary?.name === w.name &&
                        'bg-accent/30 ring-ring ring-1'
                    )}
                    onClick={() =>
                      form.setValue('primaryWeapon', w, { shouldDirty: true })
                    }
                  >
                    <div className="grid grid-cols-[1fr_auto] items-start gap-1 px-3 py-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 truncate font-medium">
                          {w.name}
                          {(
                            w as unknown as {
                              metadata?: { homebrew?: boolean };
                            }
                          ).metadata?.homebrew ? (
                            <Badge
                              variant="outline"
                              className="px-1 py-0 text-[10px]"
                            >
                              Homebrew
                            </Badge>
                          ) : null}
                          {currentPrimary?.name === w.name ? (
                            <Badge
                              variant="secondary"
                              className="px-1 py-0 text-[10px]"
                            >
                              Selected
                            </Badge>
                          ) : null}
                        </div>
                        <div className="text-muted-foreground mt-0.5 flex flex-wrap gap-1 text-xs">
                          <Badge
                            variant="outline"
                            className="px-1 py-0 text-[10px]"
                          >
                            {w.trait}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="px-1 py-0 text-[10px]"
                          >
                            {w.range}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="px-1 py-0 text-[10px]"
                          >{`${w.damage.count}d${w.damage.diceType}${w.damage.modifier ? `+${w.damage.modifier}` : ''} ${w.damage.type}`}</Badge>
                          <Badge
                            variant="outline"
                            className="px-1 py-0 text-[10px]"
                          >
                            {w.burden}
                          </Badge>
                          {w.domainAffinity ? (
                            <Badge
                              variant="outline"
                              className="px-1 py-0 text-[10px]"
                            >
                              {w.domainAffinity}
                            </Badge>
                          ) : null}
                        </div>
                        {w.features?.length ? (
                          <ul className="text-muted-foreground mt-1 list-disc space-y-0.5 pl-5 text-[11px]">
                            {w.features.map((f, i) => (
                              <li key={i}>
                                <span className="font-medium">{f.name}:</span>{' '}
                                {f.description}
                              </li>
                            ))}
                          </ul>
                        ) : null}
                        {w.description ? (
                          <div className="text-muted-foreground mt-1 text-[11px]">
                            {w.description}
                          </div>
                        ) : null}
                      </div>
                      <div className="text-muted-foreground flex items-start gap-2 text-right text-[11px]">
                        <span>T{w.tier}</span>
                        {currentPrimary?.name === w.name ? (
                          <CheckIcon
                            className="text-primary size-4"
                            aria-hidden
                          />
                        ) : null}
                      </div>
                    </div>
                  </button>
                ))}
                {filteredPrimary.length === 0 ? (
                  <div className="text-muted-foreground p-3 text-xs">
                    No items match. Try switching Source or clearing filters.
                  </div>
                ) : null}
              </div>
              {/* Homebrew creation (Primary tab) */}
              <HomebrewWeaponForm
                slotLabel="Primary"
                onAdd={w => {
                  const next = [...homebrewPrimary, w as never];
                  setHomebrewPrimary(next);
                  const key = 'metadata' as unknown as keyof EquipmentDraft;
                  const meta =
                    (form.getValues(key) as unknown as EquipmentMeta) || {};
                  const hb = (meta.homebrew || {}) as NonNullable<
                    EquipmentMeta['homebrew']
                  >;
                  const updated: EquipmentMeta = {
                    ...meta,
                    homebrew: { ...hb, primary: next },
                  };
                  form.setValue(
                    key,
                    updated as unknown as EquipmentDraft[keyof EquipmentDraft],
                    { shouldDirty: true }
                  );
                }}
              />
            </TabsContent>

            <TabsContent value="secondary" className="space-y-2">
              {currentSecondary ? (
                <div className="bg-muted/30 rounded-md border px-3 py-2 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0 truncate">
                      <span className="font-medium">Current:</span>{' '}
                      <span className="truncate align-middle">
                        {currentSecondary.name}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="text-muted-foreground hover:text-foreground underline underline-offset-2"
                      onClick={() =>
                        form.setValue('secondaryWeapon', undefined, {
                          shouldDirty: true,
                        })
                      }
                    >
                      Clear
                    </button>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-1">
                    <Badge variant="outline" className="px-1 py-0 text-[10px]">
                      <Tag className="mr-1 inline size-3" aria-hidden />
                      {currentSecondary.trait}
                    </Badge>
                    <Badge variant="outline" className="px-1 py-0 text-[10px]">
                      <Ruler className="mr-1 inline size-3" aria-hidden />
                      {currentSecondary.range}
                    </Badge>
                    <Badge variant="outline" className="px-1 py-0 text-[10px]">
                      <Dice5 className="mr-1 inline size-3" aria-hidden />
                      {`${currentSecondary.damage.count}d${currentSecondary.damage.diceType}${currentSecondary.damage.modifier ? `+${currentSecondary.damage.modifier}` : ''} ${currentSecondary.damage.type}`}
                    </Badge>
                    <Badge variant="outline" className="px-1 py-0 text-[10px]">
                      <Hand className="mr-1 inline size-3" aria-hidden />
                      {currentSecondary.burden}
                    </Badge>
                    {currentSecondary.domainAffinity ? (
                      <Badge
                        variant="outline"
                        className="px-1 py-0 text-[10px]"
                      >
                        {currentSecondary.domainAffinity}
                      </Badge>
                    ) : null}
                  </div>
                </div>
              ) : null}
              {/* Source filter */}
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Source:</span>
                <ToggleGroup
                  type="single"
                  aria-label="Source filter"
                  variant="outline"
                  size="lg"
                  value={secondarySourceFilter}
                  onValueChange={v =>
                    v && setSecondarySourceFilter(v as SourceFilter)
                  }
                >
                  <ToggleGroupItem value="default">
                    Default ({secondaryCounts.default})
                  </ToggleGroupItem>
                  <ToggleGroupItem value="homebrew">
                    Homebrew ({secondaryCounts.homebrew})
                  </ToggleGroupItem>
                  <ToggleGroupItem value="all">
                    All ({secondaryCounts.all})
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
              <Input
                placeholder="Search secondary weapons"
                value={qSecondary}
                onChange={e => setQSecondary(e.target.value)}
                inputMode="search"
                enterKeyHint="search"
              />
              {/* Filters: Tier and Burden */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <span className="text-muted-foreground">Tier:</span>
                  <ToggleGroup
                    type="single"
                    value={secondaryTier}
                    onValueChange={v => setSecondaryTier(v)}
                  >
                    <ToggleGroupItem value="">All</ToggleGroupItem>
                    <ToggleGroupItem value="1">1</ToggleGroupItem>
                    <ToggleGroupItem value="2">2</ToggleGroupItem>
                    <ToggleGroupItem value="3">3</ToggleGroupItem>
                    <ToggleGroupItem value="4">4</ToggleGroupItem>
                  </ToggleGroup>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-muted-foreground">Burden:</span>
                  <ToggleGroup
                    type="single"
                    value={secondaryBurden}
                    onValueChange={v => setSecondaryBurden(v)}
                  >
                    <ToggleGroupItem value="">All</ToggleGroupItem>
                    <ToggleGroupItem value="One-Handed">1H</ToggleGroupItem>
                    <ToggleGroupItem value="Two-Handed">2H</ToggleGroupItem>
                  </ToggleGroup>
                </div>
              </div>
              <div className="max-h-72 overflow-auto rounded border">
                {filteredSecondary.map(w => (
                  <button
                    key={w.name}
                    type="button"
                    aria-selected={currentSecondary?.name === w.name}
                    className={cn(
                      'hover:bg-muted/50 w-full text-left',
                      currentSecondary?.name === w.name &&
                        'bg-accent/30 ring-ring ring-1'
                    )}
                    onClick={() =>
                      form.setValue('secondaryWeapon', w, { shouldDirty: true })
                    }
                  >
                    <div className="grid grid-cols-[1fr_auto] items-start gap-1 px-3 py-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 truncate font-medium">
                          {w.name}
                          {(
                            w as unknown as {
                              metadata?: { homebrew?: boolean };
                            }
                          ).metadata?.homebrew ? (
                            <Badge
                              variant="outline"
                              className="px-1 py-0 text-[10px]"
                            >
                              Homebrew
                            </Badge>
                          ) : null}
                          {currentSecondary?.name === w.name ? (
                            <Badge
                              variant="secondary"
                              className="px-1 py-0 text-[10px]"
                            >
                              Selected
                            </Badge>
                          ) : null}
                        </div>
                        <div className="text-muted-foreground mt-0.5 flex flex-wrap gap-1 text-xs">
                          <Badge
                            variant="outline"
                            className="px-1 py-0 text-[10px]"
                          >
                            {w.trait}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="px-1 py-0 text-[10px]"
                          >
                            {w.range}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="px-1 py-0 text-[10px]"
                          >{`${w.damage.count}d${w.damage.diceType}${w.damage.modifier ? `+${w.damage.modifier}` : ''} ${w.damage.type}`}</Badge>
                          <Badge
                            variant="outline"
                            className="px-1 py-0 text-[10px]"
                          >
                            {w.burden}
                          </Badge>
                          {w.domainAffinity ? (
                            <Badge
                              variant="outline"
                              className="px-1 py-0 text-[10px]"
                            >
                              {w.domainAffinity}
                            </Badge>
                          ) : null}
                        </div>
                        {w.features?.length ? (
                          <ul className="text-muted-foreground mt-1 list-disc space-y-0.5 pl-5 text-[11px]">
                            {w.features.map((f, i) => (
                              <li key={i}>
                                <span className="font-medium">{f.name}:</span>{' '}
                                {f.description}
                              </li>
                            ))}
                          </ul>
                        ) : null}
                        {w.description ? (
                          <div className="text-muted-foreground mt-1 text-[11px]">
                            {w.description}
                          </div>
                        ) : null}
                      </div>
                      <div className="text-muted-foreground flex items-start gap-2 text-right text-[11px]">
                        <span>T{w.tier}</span>
                        {currentSecondary?.name === w.name ? (
                          <CheckIcon
                            className="text-primary size-4"
                            aria-hidden
                          />
                        ) : null}
                      </div>
                    </div>
                  </button>
                ))}
                {filteredSecondary.length === 0 ? (
                  <div className="text-muted-foreground p-3 text-xs">
                    No items match. Try switching Source or clearing filters.
                  </div>
                ) : null}
              </div>
              {/* Homebrew creation (Secondary tab) */}
              <HomebrewWeaponForm
                slotLabel="Secondary"
                onAdd={w => {
                  const next = [...homebrewSecondary, w as never];
                  setHomebrewSecondary(next);
                  const key = 'metadata' as unknown as keyof EquipmentDraft;
                  const meta =
                    (form.getValues(key) as unknown as EquipmentMeta) || {};
                  const hb = (meta.homebrew || {}) as NonNullable<
                    EquipmentMeta['homebrew']
                  >;
                  const updated: EquipmentMeta = {
                    ...meta,
                    homebrew: { ...hb, secondary: next },
                  };
                  form.setValue(
                    key,
                    updated as unknown as EquipmentDraft[keyof EquipmentDraft],
                    { shouldDirty: true }
                  );
                }}
                defaultType="Secondary"
              />
            </TabsContent>

            <TabsContent value="armor" className="space-y-2">
              {currentArmor ? (
                <div className="bg-muted/30 rounded-md border px-3 py-2 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0 truncate">
                      <span className="font-medium">Current:</span>{' '}
                      <span className="truncate align-middle">
                        {currentArmor.name}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="text-muted-foreground hover:text-foreground underline underline-offset-2"
                      onClick={() =>
                        form.setValue('armor', undefined, { shouldDirty: true })
                      }
                    >
                      Clear
                    </button>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-1">
                    <Badge variant="outline" className="px-1 py-0 text-[10px]">
                      Base {currentArmor.baseScore}
                    </Badge>
                    <Badge variant="outline" className="px-1 py-0 text-[10px]">
                      M{currentArmor.baseThresholds.major}/S
                      {currentArmor.baseThresholds.severe}
                    </Badge>
                    {currentArmor.evasionModifier ? (
                      <Badge
                        variant="outline"
                        className="px-1 py-0 text-[10px]"
                      >
                        Evasion{' '}
                        {currentArmor.evasionModifier >= 0
                          ? `+${currentArmor.evasionModifier}`
                          : currentArmor.evasionModifier}
                      </Badge>
                    ) : null}
                    {currentArmor.agilityModifier ? (
                      <Badge
                        variant="outline"
                        className="px-1 py-0 text-[10px]"
                      >
                        Agility{' '}
                        {currentArmor.agilityModifier >= 0
                          ? `+${currentArmor.agilityModifier}`
                          : currentArmor.agilityModifier}
                      </Badge>
                    ) : null}
                    {currentArmorType ? (
                      <Badge
                        variant="outline"
                        className="px-1 py-0 text-[10px]"
                      >
                        {currentArmorType}
                      </Badge>
                    ) : null}
                  </div>
                </div>
              ) : null}
              <Input
                placeholder="Search armor"
                value={qArmor}
                onChange={e => setQArmor(e.target.value)}
                inputMode="search"
                enterKeyHint="search"
              />
              {/* Armor filters */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <span className="text-muted-foreground">Type:</span>
                  <ToggleGroup
                    type="single"
                    value={armorTypeFilter}
                    onValueChange={v => setArmorTypeFilter(v)}
                  >
                    <ToggleGroupItem value="">All</ToggleGroupItem>
                    {armorTypes.map(t => (
                      <ToggleGroupItem key={t} value={t}>
                        {t}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </div>
              </div>
              <div className="max-h-72 overflow-auto rounded border">
                {filteredArmor.map(a => (
                  <button
                    key={a.name}
                    type="button"
                    aria-selected={currentArmor?.name === a.name}
                    className={cn(
                      'hover:bg-muted/50 w-full text-left',
                      currentArmor?.name === a.name &&
                        'bg-accent/30 ring-ring ring-1'
                    )}
                    onClick={() =>
                      form.setValue('armor', a, { shouldDirty: true })
                    }
                  >
                    <div className="grid grid-cols-[1fr_auto] items-start gap-1 px-3 py-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 truncate font-medium">
                          {a.name}
                          {(
                            a as unknown as {
                              metadata?: { homebrew?: boolean };
                            }
                          ).metadata?.homebrew ? (
                            <Badge
                              variant="outline"
                              className="px-1 py-0 text-[10px]"
                            >
                              Homebrew
                            </Badge>
                          ) : null}
                          {currentArmor?.name === a.name ? (
                            <Badge
                              variant="secondary"
                              className="px-1 py-0 text-[10px]"
                            >
                              Selected
                            </Badge>
                          ) : null}
                        </div>
                        <div className="text-muted-foreground mt-0.5 flex flex-wrap gap-1 text-xs">
                          <Badge
                            variant="outline"
                            className="px-1 py-0 text-[10px]"
                          >
                            Base {a.baseScore}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="px-1 py-0 text-[10px]"
                          >
                            M{a.baseThresholds.major}/S{a.baseThresholds.severe}
                          </Badge>
                          {a.evasionModifier ? (
                            <Badge
                              variant="outline"
                              className="px-1 py-0 text-[10px]"
                            >
                              Evasion{' '}
                              {a.evasionModifier >= 0
                                ? `+${a.evasionModifier}`
                                : a.evasionModifier}
                            </Badge>
                          ) : null}
                          {a.agilityModifier ? (
                            <Badge
                              variant="outline"
                              className="px-1 py-0 text-[10px]"
                            >
                              Agility{' '}
                              {a.agilityModifier >= 0
                                ? `+${a.agilityModifier}`
                                : a.agilityModifier}
                            </Badge>
                          ) : null}
                          {a['armorType'] ? (
                            <Badge
                              variant="outline"
                              className="px-1 py-0 text-[10px]"
                            >
                              {String(a['armorType'])}
                            </Badge>
                          ) : null}
                        </div>
                        {a.features?.length ? (
                          <ul className="text-muted-foreground mt-1 list-disc space-y-0.5 pl-5 text-[11px]">
                            {a.features.map((f, i) => (
                              <li key={i}>
                                <span className="font-medium">{f.name}:</span>{' '}
                                {f.description}
                              </li>
                            ))}
                          </ul>
                        ) : null}
                        {a.description ? (
                          <div className="text-muted-foreground mt-1 text-[11px]">
                            {a.description}
                          </div>
                        ) : null}
                      </div>
                      <div className="text-muted-foreground flex items-start gap-2 text-right text-[11px]">
                        <span>T{a.tier}</span>
                        {currentArmor?.name === a.name ? (
                          <CheckIcon
                            className="text-primary size-4"
                            aria-hidden
                          />
                        ) : null}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              {/* Homebrew creation (Armor tab) */}
              <HomebrewArmorForm
                onAdd={a => {
                  const next = [...homebrewArmor, a as never];
                  setHomebrewArmor(next);
                  const key = 'metadata' as unknown as keyof EquipmentDraft;
                  const meta =
                    (form.getValues(key) as unknown as EquipmentMeta) || {};
                  const hb = (meta.homebrew || {}) as NonNullable<
                    EquipmentMeta['homebrew']
                  >;
                  const updated: EquipmentMeta = {
                    ...meta,
                    homebrew: { ...hb, armor: next },
                  };
                  form.setValue(
                    key,
                    updated as unknown as EquipmentDraft[keyof EquipmentDraft],
                    { shouldDirty: true }
                  );
                }}
              />
            </TabsContent>
          </Tabs>
        </form>
      </Form>
    </DrawerScaffold>
  );
}

// ----------------------------------------
// Homebrew forms (inline, minimal fields)
// ----------------------------------------

type HomebrewWeaponFormProps = {
  slotLabel: 'Primary' | 'Secondary';
  onAdd: (w: unknown) => void;
  defaultType?: 'Primary' | 'Secondary';
};

function HomebrewWeaponForm({
  slotLabel,
  onAdd,
  defaultType,
}: HomebrewWeaponFormProps) {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState('');
  const [tier, setTier] = React.useState<'1' | '2' | '3' | '4'>('1');
  const [trait, setTrait] = React.useState('Strength');
  const [range, setRange] = React.useState('Melee');
  const [damageCount, setDamageCount] = React.useState(1);
  const [damageDice, setDamageDice] = React.useState(6);
  const [damageMod, setDamageMod] = React.useState(0);
  const [damageType, setDamageType] = React.useState<'phy' | 'mag'>('phy');
  const [burden, setBurden] = React.useState<'One-Handed' | 'Two-Handed'>(
    'One-Handed'
  );
  const [description, setDescription] = React.useState('');

  const add = () => {
    if (!name.trim()) return;
    const weapon = {
      name: name.trim(),
      tier,
      type: defaultType ?? slotLabel,
      trait,
      range,
      damage: {
        diceType: damageDice,
        count: damageCount,
        modifier: damageMod,
        type: damageType,
      },
      burden,
      description: description.trim() || undefined,
      features: [],
      metadata: { homebrew: true, createdAt: Date.now() },
    } as const;
    onAdd(weapon);
    // reset minimal
    setOpen(false);
    setName('');
    setTier('1');
    setTrait('Strength');
    setRange('Melee');
    setDamageCount(1);
    setDamageDice(6);
    setDamageMod(0);
    setDamageType('phy');
    setBurden('One-Handed');
    setDescription('');
  };

  return (
    <div className="mt-3 rounded-md border p-2">
      <button
        type="button"
        className="text-xs font-medium underline underline-offset-2"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-controls={`homebrew-${slotLabel.toLowerCase()}-form`}
      >
        {open
          ? 'Hide custom weapon'
          : `Add custom ${slotLabel.toLowerCase()} weapon`}
      </button>
      {open ? (
        <div
          id={`homebrew-${slotLabel.toLowerCase()}-form`}
          className="mt-2 grid grid-cols-2 gap-2 text-xs md:grid-cols-3"
        >
          <label className="col-span-2 flex flex-col gap-1">
            <span className="text-muted-foreground">Name</span>
            <input
              className="rounded border px-2 py-1"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-muted-foreground">Tier</span>
            <select
              className="rounded border px-2 py-1"
              value={tier}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setTier(e.target.value as '1' | '2' | '3' | '4')
              }
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-muted-foreground">Trait</span>
            <select
              className="rounded border px-2 py-1"
              value={trait}
              onChange={e => setTrait(e.target.value)}
            >
              {[
                'Agility',
                'Strength',
                'Finesse',
                'Instinct',
                'Presence',
                'Knowledge',
                'Spellcast',
              ].map(t => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-muted-foreground">Range</span>
            <select
              className="rounded border px-2 py-1"
              value={range}
              onChange={e => setRange(e.target.value)}
            >
              {['Melee', 'Very Close', 'Close', 'Far', 'Very Far'].map(r => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-muted-foreground">Damage</span>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min={1}
                className="w-16 rounded border px-2 py-1"
                value={damageCount}
                onChange={e =>
                  setDamageCount(parseInt(e.target.value || '1', 10))
                }
                aria-label="Damage dice count"
              />
              <span>d</span>
              <input
                type="number"
                min={4}
                max={20}
                step={2}
                className="w-16 rounded border px-2 py-1"
                value={damageDice}
                onChange={e =>
                  setDamageDice(parseInt(e.target.value || '6', 10))
                }
                aria-label="Damage dice type"
              />
              <span>+</span>
              <input
                type="number"
                className="w-16 rounded border px-2 py-1"
                value={damageMod}
                onChange={e =>
                  setDamageMod(parseInt(e.target.value || '0', 10))
                }
                aria-label="Damage modifier"
              />
              <select
                className="rounded border px-2 py-1"
                value={damageType}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setDamageType(e.target.value as 'phy' | 'mag')
                }
                aria-label="Damage type"
              >
                <option value="phy">phy</option>
                <option value="mag">mag</option>
              </select>
            </div>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-muted-foreground">Burden</span>
            <select
              className="rounded border px-2 py-1"
              value={burden}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setBurden(e.target.value as 'One-Handed' | 'Two-Handed')
              }
            >
              <option value="One-Handed">One-Handed</option>
              <option value="Two-Handed">Two-Handed</option>
            </select>
          </label>
          <label className="col-span-2 flex flex-col gap-1 md:col-span-3">
            <span className="text-muted-foreground">
              Description (optional)
            </span>
            <textarea
              className="min-h-16 rounded border px-2 py-1"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </label>
          <div className="col-span-2 flex items-center gap-2 md:col-span-3">
            <button
              type="button"
              className="bg-primary text-primary-foreground rounded border px-2 py-1 text-xs"
              onClick={add}
            >
              Add to list
            </button>
            <span className="text-muted-foreground">
              New item will appear in the list above with a Homebrew badge.
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );
}

type HomebrewArmorFormProps = {
  onAdd: (a: unknown) => void;
};

function HomebrewArmorForm({ onAdd }: HomebrewArmorFormProps) {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState('');
  const [tier, setTier] = React.useState<'1' | '2' | '3' | '4'>('1');
  const [baseScore, setBaseScore] = React.useState(10);
  const [major, setMajor] = React.useState(1);
  const [severe, setSevere] = React.useState(2);
  const [evasionMod, setEvasionMod] = React.useState(0);
  const [agilityMod, setAgilityMod] = React.useState(0);
  const [armorType, setArmorType] = React.useState('Gambeson');
  const [description, setDescription] = React.useState('');

  const add = () => {
    if (!name.trim()) return;
    const armor = {
      name: name.trim(),
      tier,
      baseScore,
      baseThresholds: { major, severe },
      evasionModifier: evasionMod,
      agilityModifier: agilityMod,
      armorType,
      isStandard: true,
      description: description.trim() || undefined,
      features: [],
      metadata: { homebrew: true, createdAt: Date.now() },
    } as const;
    onAdd(armor);
    setOpen(false);
    setName('');
    setTier('1');
    setBaseScore(10);
    setMajor(1);
    setSevere(2);
    setEvasionMod(0);
    setAgilityMod(0);
    setArmorType('Gambeson');
    setDescription('');
  };

  return (
    <div className="mt-3 rounded-md border p-2">
      <button
        type="button"
        className="text-xs font-medium underline underline-offset-2"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-controls="homebrew-armor-form"
      >
        {open ? 'Hide custom armor' : 'Add custom armor'}
      </button>
      {open ? (
        <div
          id="homebrew-armor-form"
          className="mt-2 grid grid-cols-2 gap-2 text-xs md:grid-cols-3"
        >
          <label className="col-span-2 flex flex-col gap-1">
            <span className="text-muted-foreground">Name</span>
            <input
              className="rounded border px-2 py-1"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-muted-foreground">Tier</span>
            <select
              className="rounded border px-2 py-1"
              value={tier}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setTier(e.target.value as '1' | '2' | '3' | '4')
              }
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-muted-foreground">Armor type</span>
            <input
              className="rounded border px-2 py-1"
              value={armorType}
              onChange={e => setArmorType(e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-muted-foreground">Base score</span>
            <input
              type="number"
              className="rounded border px-2 py-1"
              value={baseScore}
              onChange={e => setBaseScore(parseInt(e.target.value || '0', 10))}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-muted-foreground">Thresholds (M/S)</span>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min={0}
                className="w-20 rounded border px-2 py-1"
                value={major}
                onChange={e => setMajor(parseInt(e.target.value || '0', 10))}
                aria-label="Major threshold"
              />
              <input
                type="number"
                min={0}
                className="w-20 rounded border px-2 py-1"
                value={severe}
                onChange={e => setSevere(parseInt(e.target.value || '0', 10))}
                aria-label="Severe threshold"
              />
            </div>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-muted-foreground">Evasion mod</span>
            <input
              type="number"
              className="rounded border px-2 py-1"
              value={evasionMod}
              onChange={e => setEvasionMod(parseInt(e.target.value || '0', 10))}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-muted-foreground">Agility mod</span>
            <input
              type="number"
              className="rounded border px-2 py-1"
              value={agilityMod}
              onChange={e => setAgilityMod(parseInt(e.target.value || '0', 10))}
            />
          </label>
          <label className="col-span-2 flex flex-col gap-1 md:col-span-3">
            <span className="text-muted-foreground">
              Description (optional)
            </span>
            <textarea
              className="min-h-16 rounded border px-2 py-1"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </label>
          <div className="col-span-2 flex items-center gap-2 md:col-span-3">
            <button
              type="button"
              className="bg-primary text-primary-foreground rounded border px-2 py-1 text-xs"
              onClick={add}
            >
              Add to list
            </button>
            <span className="text-muted-foreground">
              New item will appear in the list above with a Homebrew badge.
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export const EquipmentDrawer = React.memo(EquipmentDrawerImpl);
