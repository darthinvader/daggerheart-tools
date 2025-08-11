import { Dice5, Hand, Ruler, Tag } from 'lucide-react';
import type { UseFormReturn } from 'react-hook-form';

import * as React from 'react';

import { ArmorListItem } from '@/components/characters/equipment-drawer/armor-list-item';
import { HomebrewArmorForm } from '@/components/characters/equipment-drawer/homebrew-armor-form';
import { HomebrewWeaponForm } from '@/components/characters/equipment-drawer/homebrew-weapon-form';
import { SourceFilterToggle } from '@/components/characters/equipment-drawer/source-filter-toggle';
import { WeaponListItem } from '@/components/characters/equipment-drawer/weapon-list-item';
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
              <SourceFilterToggle
                value={primarySourceFilter}
                counts={primaryCounts}
                onChange={v => setPrimarySourceFilter(v)}
              />
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
                  <WeaponListItem
                    key={w.name}
                    weapon={w as never}
                    selected={currentPrimary?.name === w.name}
                    onSelect={ww =>
                      form.setValue('primaryWeapon', ww as never, {
                        shouldDirty: true,
                      })
                    }
                  />
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
              <SourceFilterToggle
                value={secondarySourceFilter}
                counts={secondaryCounts}
                onChange={v => setSecondarySourceFilter(v)}
              />
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
                  <WeaponListItem
                    key={w.name}
                    weapon={w as never}
                    selected={currentSecondary?.name === w.name}
                    onSelect={ww =>
                      form.setValue('secondaryWeapon', ww as never, {
                        shouldDirty: true,
                      })
                    }
                  />
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
                  <ArmorListItem
                    key={a.name}
                    armor={a as never}
                    selected={currentArmor?.name === a.name}
                    onSelect={aa =>
                      form.setValue('armor', aa as never, { shouldDirty: true })
                    }
                  />
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

export const EquipmentDrawer = React.memo(EquipmentDrawerImpl);
