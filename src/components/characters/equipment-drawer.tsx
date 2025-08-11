import type { UseFormReturn } from 'react-hook-form';

import * as React from 'react';

import { DrawerScaffold } from '@/components/drawers/drawer-scaffold';
import { Button } from '@/components/ui/button';
import { Combobox, type ComboboxItem } from '@/components/ui/combobox';
import { Form } from '@/components/ui/form';
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
};

function EquipmentDrawerImpl({
  open,
  onOpenChange,
  form,
  submit,
  onCancel,
}: EquipmentDrawerProps) {
  const skipRef = React.useRef(false);
  type EquipmentMeta = { mode?: 'pack' | 'free' } & Record<string, unknown>;
  const readMode = (): 'pack' | 'free' => {
    const meta =
      (form.getValues(
        'metadata' as unknown as keyof EquipmentDraft
      ) as unknown as EquipmentMeta) || {};
    return (meta.mode as 'pack' | 'free') || 'free';
  };
  const setMode = (next: 'pack' | 'free') => {
    const key = 'metadata' as unknown as keyof EquipmentDraft;
    const meta = (form.getValues(key) as unknown as EquipmentMeta) || {};
    const updated: EquipmentMeta = { ...meta, mode: next };
    form.setValue(
      key,
      updated as unknown as EquipmentDraft[keyof EquipmentDraft],
      {
        shouldDirty: true,
      }
    );
  };
  // Build items for comboboxes (simple name lists)
  const primaryItems: ComboboxItem[] = React.useMemo(
    () => ALL_PRIMARY_WEAPONS.map(w => ({ value: w.name, label: w.name })),
    []
  );
  const secondaryItems: ComboboxItem[] = React.useMemo(
    () => ALL_SECONDARY_WEAPONS.map(w => ({ value: w.name, label: w.name })),
    []
  );
  const armorItems: ComboboxItem[] = React.useMemo(
    () => ALL_STANDARD_ARMOR.map(a => ({ value: a.name, label: a.name })),
    []
  );
  const findPrimary = React.useCallback(
    (name: string | null) =>
      ALL_PRIMARY_WEAPONS.find(w => w.name === name) || null,
    []
  );
  const findSecondary = React.useCallback(
    (name: string | null) =>
      ALL_SECONDARY_WEAPONS.find(w => w.name === name) || null,
    []
  );
  const findArmor = React.useCallback(
    (name: string | null) =>
      ALL_STANDARD_ARMOR.find(a => a.name === name) || null,
    []
  );
  const selectedPrimary = form.watch('primaryWeapon') ?? undefined;
  const selectedSecondary = form.watch('secondaryWeapon') ?? undefined;
  const selectedArmor = form.watch('armor') ?? undefined;
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
      footer={
        <div className="flex w-full items-center justify-end gap-2">
          <Button type="button" variant="ghost" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button type="submit">Save</Button>
        </div>
      }
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
          {/* Mode toggle */}
          <div className="space-y-2">
            <div className="text-sm font-medium">Mode</div>
            <ToggleGroup
              type="single"
              value={readMode()}
              onValueChange={v => setMode((v as 'pack' | 'free') || 'free')}
            >
              <ToggleGroupItem value="pack" aria-label="Pack">
                Pack
              </ToggleGroupItem>
              <ToggleGroupItem value="free" aria-label="Free-form">
                Free-form
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          {/* Placeholder content areas */}
          <div className="space-y-3">
            <div>
              <div className="text-sm font-medium">Primary weapon</div>
              <Combobox
                items={primaryItems}
                value={form.watch('primaryWeapon')?.name ?? null}
                onChange={v => {
                  const next = findPrimary(v);
                  form.setValue('primaryWeapon', next ?? undefined, {
                    shouldDirty: true,
                  });
                }}
                placeholder="Select primary weapon..."
              />
              {selectedPrimary ? (
                <div className="text-muted-foreground mt-1 space-x-2 text-xs">
                  <span>{selectedPrimary.trait}</span>
                  <span>• {selectedPrimary.range}</span>
                  <span>
                    • {selectedPrimary.damage.count}d
                    {selectedPrimary.damage.diceType}
                    {selectedPrimary.damage.modifier
                      ? `+${selectedPrimary.damage.modifier}`
                      : ''}
                    {` ${selectedPrimary.damage.type}`}
                  </span>
                  <span>• {selectedPrimary.burden}</span>
                  {selectedPrimary.domainAffinity ? (
                    <span>• {selectedPrimary.domainAffinity}</span>
                  ) : null}
                </div>
              ) : null}
            </div>
            <div>
              <div className="text-sm font-medium">Secondary weapon</div>
              <Combobox
                items={secondaryItems}
                value={form.watch('secondaryWeapon')?.name ?? null}
                onChange={v => {
                  const next = findSecondary(v);
                  form.setValue('secondaryWeapon', next ?? undefined, {
                    shouldDirty: true,
                  });
                }}
                placeholder="Select secondary weapon..."
              />
              {selectedSecondary ? (
                <div className="text-muted-foreground mt-1 space-x-2 text-xs">
                  <span>{selectedSecondary.trait}</span>
                  <span>• {selectedSecondary.range}</span>
                  <span>
                    • {selectedSecondary.damage.count}d
                    {selectedSecondary.damage.diceType}
                    {selectedSecondary.damage.modifier
                      ? `+${selectedSecondary.damage.modifier}`
                      : ''}
                    {` ${selectedSecondary.damage.type}`}
                  </span>
                  <span>• {selectedSecondary.burden}</span>
                  {selectedSecondary.domainAffinity ? (
                    <span>• {selectedSecondary.domainAffinity}</span>
                  ) : null}
                </div>
              ) : null}
            </div>
            <div>
              <div className="text-sm font-medium">Armor</div>
              <Combobox
                items={armorItems}
                value={form.watch('armor')?.name ?? null}
                onChange={v => {
                  const next = findArmor(v);
                  form.setValue('armor', next ?? undefined, {
                    shouldDirty: true,
                  });
                }}
                placeholder="Select armor..."
              />
              {selectedArmor ? (
                <div className="text-muted-foreground mt-1 space-x-2 text-xs">
                  <span>Base Armor {selectedArmor.baseScore}</span>
                  <span>
                    • Thresholds M{selectedArmor.baseThresholds.major}/S
                    {selectedArmor.baseThresholds.severe}
                  </span>
                  {selectedArmor.evasionModifier ? (
                    <span>
                      • Evasion{' '}
                      {selectedArmor.evasionModifier >= 0
                        ? `+${selectedArmor.evasionModifier}`
                        : selectedArmor.evasionModifier}
                    </span>
                  ) : null}
                  {selectedArmor.agilityModifier ? (
                    <span>
                      • Agility{' '}
                      {selectedArmor.agilityModifier >= 0
                        ? `+${selectedArmor.agilityModifier}`
                        : selectedArmor.agilityModifier}
                    </span>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        </form>
      </Form>
    </DrawerScaffold>
  );
}

export const EquipmentDrawer = React.memo(EquipmentDrawerImpl);
