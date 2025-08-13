import type { UseFormReturn } from 'react-hook-form';

import * as React from 'react';

import { useEquipmentFilters } from '@/components/characters/equipment-drawer/hooks/use-equipment-filters';
import { ArmorPanel } from '@/components/characters/equipment-drawer/panels/armor-panel';
import { PrimaryPanel } from '@/components/characters/equipment-drawer/panels/primary-panel';
import { SecondaryPanel } from '@/components/characters/equipment-drawer/panels/secondary-panel';
import { DrawerScaffold } from '@/components/drawers/drawer-scaffold';
import { Form } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { EquipmentDraft } from '@/features/characters/storage';

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
  // Filters/search state via hook (initialized after homebrew state below)
  // Items moved to Inventory drawer (no state here)

  // Homebrew lists scoped to drawer session
  type MinimalWeapon = {
    name: string;
    tier?: string | number;
    trait?: string;
    range?: string | number;
    burden?: string | number;
  } & Record<string, unknown>;
  type MinimalArmor = { name: string } & Record<string, unknown>;
  const [homebrewPrimary, setHomebrewPrimary] = React.useState<MinimalWeapon[]>(
    []
  );
  const [homebrewSecondary, setHomebrewSecondary] = React.useState<
    MinimalWeapon[]
  >([]);
  const [homebrewArmor, setHomebrewArmor] = React.useState<MinimalArmor[]>([]);
  // no-op
  // Initialize filters now that homebrew state exists
  const filters = useEquipmentFilters({
    homebrewPrimary,
    homebrewSecondary,
    homebrewArmor,
  });
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

  // Sources and counts computed in the hook
  // Items library source (static lists)
  // Items removed: handled in Inventory drawer

  // Visible counts for source options
  // Counts now provided by the hook

  // Filtered lists now provided by the hook
  // Default active tab based on requested section
  const defaultTab = section ?? 'primary';
  const currentPrimary = form.watch('primaryWeapon');
  const currentSecondary = form.watch('secondaryWeapon');
  const currentArmor = form.watch('armor');
  // items are managed via Inventory drawer
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

            <TabsContent value="primary">
              <PrimaryPanel
                current={currentPrimary as never}
                onClear={() =>
                  form.setValue('primaryWeapon', undefined, {
                    shouldDirty: true,
                  })
                }
                sourceFilter={filters.primary.sourceFilter}
                counts={filters.primary.counts}
                onSourceFilterChange={filters.primary.setSourceFilter}
                q={filters.primary.q}
                onQChange={filters.primary.setQ}
                tier={filters.primary.tier}
                onTierChange={filters.primary.setTier}
                burden={filters.primary.burden}
                onBurdenChange={filters.primary.setBurden}
                items={filters.primary.items as never}
                isSelected={w =>
                  currentPrimary?.name === (w as { name: string }).name
                }
                onSelect={ww =>
                  form.setValue('primaryWeapon', ww as never, {
                    shouldDirty: true,
                  })
                }
                onAddHomebrew={w => {
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

            <TabsContent value="secondary">
              <SecondaryPanel
                current={currentSecondary as never}
                onClear={() =>
                  form.setValue('secondaryWeapon', undefined, {
                    shouldDirty: true,
                  })
                }
                sourceFilter={filters.secondary.sourceFilter}
                counts={filters.secondary.counts}
                onSourceFilterChange={filters.secondary.setSourceFilter}
                q={filters.secondary.q}
                onQChange={filters.secondary.setQ}
                tier={filters.secondary.tier}
                onTierChange={filters.secondary.setTier}
                burden={filters.secondary.burden}
                onBurdenChange={filters.secondary.setBurden}
                items={filters.secondary.items as never}
                isSelected={w =>
                  currentSecondary?.name === (w as { name: string }).name
                }
                onSelect={ww =>
                  form.setValue('secondaryWeapon', ww as never, {
                    shouldDirty: true,
                  })
                }
                onAddHomebrew={w => {
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
              />
            </TabsContent>

            <TabsContent value="armor">
              <ArmorPanel
                current={currentArmor as never}
                currentArmorType={currentArmorType}
                onClear={() =>
                  form.setValue('armor', undefined, { shouldDirty: true })
                }
                q={filters.armor.q}
                onQChange={filters.armor.setQ}
                kind={filters.armor.kind}
                onKindChange={filters.armor.setKind}
                tier={filters.armor.tier}
                onTierChange={filters.armor.setTier}
                withEvasionMod={filters.armor.withEvasionMod}
                onWithEvasionModChange={filters.armor.setWithEvasionMod}
                withAgilityMod={filters.armor.withAgilityMod}
                onWithAgilityModChange={filters.armor.setWithAgilityMod}
                items={filters.armor.items as never}
                isSelected={a =>
                  currentArmor?.name === (a as { name: string }).name
                }
                onSelect={aa =>
                  form.setValue('armor', aa as never, { shouldDirty: true })
                }
                onAddHomebrew={a => {
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
