import type { UseFormReturn } from 'react-hook-form';

import * as React from 'react';

import { ArmorFiltersToolbar } from '@/components/characters/equipment-drawer/armor-filters-toolbar';
import { ArmorResultsList } from '@/components/characters/equipment-drawer/armor-results-list';
import { CurrentSelectionStrip } from '@/components/characters/equipment-drawer/current-selection-strip';
import { HomebrewArmorForm } from '@/components/characters/equipment-drawer/homebrew-armor-form';
import { HomebrewWeaponForm } from '@/components/characters/equipment-drawer/homebrew-weapon-form';
import { SourceFilterToggle } from '@/components/characters/equipment-drawer/source-filter-toggle';
import { WeaponsFiltersToolbar } from '@/components/characters/equipment-drawer/weapons-filters-toolbar';
import { WeaponsResultsList } from '@/components/characters/equipment-drawer/weapons-results-list';
import { DrawerScaffold } from '@/components/drawers/drawer-scaffold';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { EquipmentDraft } from '@/features/characters/storage';
import {
  ALL_ARMOR,
  ALL_PRIMARY_WEAPONS,
  ALL_SECONDARY_WEAPONS,
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
  // no-op
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
  type MinimalArmor = (typeof ALL_ARMOR)[number];
  const [homebrewPrimary, setHomebrewPrimary] = React.useState<MinimalWeapon[]>(
    []
  );
  const [homebrewSecondary, setHomebrewSecondary] = React.useState<
    MinimalWeapon[]
  >([]);
  const [homebrewArmor, setHomebrewArmor] = React.useState<MinimalArmor[]>([]);
  // no-op
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
    () => ALL_ARMOR.concat(homebrewArmor),
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
          ALL_ARMOR.map(a =>
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
                <CurrentSelectionStrip
                  kind="primary"
                  name={currentPrimary.name}
                  onClear={() =>
                    form.setValue('primaryWeapon', undefined, {
                      shouldDirty: true,
                    })
                  }
                  tags={[
                    { label: currentPrimary.trait, icon: 'trait' },
                    { label: String(currentPrimary.range), icon: 'range' },
                    {
                      label: `${currentPrimary.damage.count}d${currentPrimary.damage.diceType}${currentPrimary.damage.modifier ? `+${currentPrimary.damage.modifier}` : ''} ${currentPrimary.damage.type}`,
                      icon: 'damage',
                    },
                    { label: String(currentPrimary.burden), icon: 'burden' },
                    ...(currentPrimary.domainAffinity
                      ? [{ label: currentPrimary.domainAffinity }]
                      : []),
                  ]}
                />
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
              <WeaponsFiltersToolbar
                tier={primaryTier}
                onTierChange={v => setPrimaryTier(v)}
                burden={primaryBurden}
                onBurdenChange={v => setPrimaryBurden(v)}
              />
              <WeaponsResultsList
                items={filteredPrimary as never}
                isSelected={w =>
                  currentPrimary?.name === (w as { name: string }).name
                }
                onSelect={ww =>
                  form.setValue('primaryWeapon', ww as never, {
                    shouldDirty: true,
                  })
                }
              />
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
                <CurrentSelectionStrip
                  kind="secondary"
                  name={currentSecondary.name}
                  onClear={() =>
                    form.setValue('secondaryWeapon', undefined, {
                      shouldDirty: true,
                    })
                  }
                  tags={[
                    { label: currentSecondary.trait, icon: 'trait' },
                    { label: String(currentSecondary.range), icon: 'range' },
                    {
                      label: `${currentSecondary.damage.count}d${currentSecondary.damage.diceType}${currentSecondary.damage.modifier ? `+${currentSecondary.damage.modifier}` : ''} ${currentSecondary.damage.type}`,
                      icon: 'damage',
                    },
                    { label: String(currentSecondary.burden), icon: 'burden' },
                    ...(currentSecondary.domainAffinity
                      ? [{ label: currentSecondary.domainAffinity }]
                      : []),
                  ]}
                />
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
              <WeaponsFiltersToolbar
                tier={secondaryTier}
                onTierChange={v => setSecondaryTier(v)}
                burden={secondaryBurden}
                onBurdenChange={v => setSecondaryBurden(v)}
              />
              <WeaponsResultsList
                items={filteredSecondary as never}
                isSelected={w =>
                  currentSecondary?.name === (w as { name: string }).name
                }
                onSelect={ww =>
                  form.setValue('secondaryWeapon', ww as never, {
                    shouldDirty: true,
                  })
                }
              />
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
                <CurrentSelectionStrip
                  kind="armor"
                  name={currentArmor.name}
                  onClear={() =>
                    form.setValue('armor', undefined, { shouldDirty: true })
                  }
                  tags={[
                    { label: `Base ${currentArmor.baseScore}` },
                    {
                      label: `M${currentArmor.baseThresholds.major}/S${currentArmor.baseThresholds.severe}`,
                    },
                    ...(currentArmor.evasionModifier
                      ? [
                          {
                            label: `Evasion ${
                              currentArmor.evasionModifier >= 0
                                ? `+${currentArmor.evasionModifier}`
                                : currentArmor.evasionModifier
                            }`,
                          },
                        ]
                      : []),
                    ...(currentArmor.agilityModifier
                      ? [
                          {
                            label: `Agility ${
                              currentArmor.agilityModifier >= 0
                                ? `+${currentArmor.agilityModifier}`
                                : currentArmor.agilityModifier
                            }`,
                          },
                        ]
                      : []),
                    ...(currentArmorType ? [{ label: currentArmorType }] : []),
                  ]}
                />
              ) : null}
              <Input
                placeholder="Search armor"
                value={qArmor}
                onChange={e => setQArmor(e.target.value)}
                inputMode="search"
                enterKeyHint="search"
              />
              {/* Armor filters */}
              <ArmorFiltersToolbar
                armorType={armorTypeFilter}
                onArmorTypeChange={v => setArmorTypeFilter(v)}
                armorTypes={armorTypes}
              />
              <ArmorResultsList
                items={filteredArmor as never}
                isSelected={a =>
                  currentArmor?.name === (a as { name: string }).name
                }
                onSelect={aa =>
                  form.setValue('armor', aa as never, { shouldDirty: true })
                }
              />
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
