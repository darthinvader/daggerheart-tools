import type { UseFormReturn } from 'react-hook-form';

import * as React from 'react';

import type { EquipmentDraft } from '@/features/characters/storage';

export type MinimalWeapon = {
  name: string;
  tier?: string | number;
  trait?: string;
  range?: string | number;
  burden?: string | number;
} & Record<string, unknown>;

export type MinimalArmor = { name: string } & Record<string, unknown>;

export function useHomebrewMeta(
  form: UseFormReturn<EquipmentDraft>,
  open: boolean
) {
  type EquipmentMeta = {
    homebrew?: {
      primary?: MinimalWeapon[];
      secondary?: MinimalWeapon[];
      armor?: MinimalArmor[];
    };
  } & Record<string, unknown>;

  const [primary, setPrimary] = React.useState<MinimalWeapon[]>([]);
  const [secondary, setSecondary] = React.useState<MinimalWeapon[]>([]);
  const [armor, setArmor] = React.useState<MinimalArmor[]>([]);

  React.useEffect(() => {
    if (!open) return;
    const key = 'metadata' as unknown as keyof EquipmentDraft;
    const meta = (form.getValues(key) as unknown as EquipmentMeta) || {};
    const hb = (meta.homebrew || {}) as NonNullable<EquipmentMeta['homebrew']>;
    setPrimary(hb.primary || []);
    setSecondary(hb.secondary || []);
    setArmor(hb.armor || []);
  }, [open, form]);

  const write = React.useCallback(
    (next: Partial<NonNullable<EquipmentMeta['homebrew']>>) => {
      const key = 'metadata' as unknown as keyof EquipmentDraft;
      const prev = (form.getValues(key) as unknown as EquipmentMeta) || {};
      const hb = (prev.homebrew || {}) as NonNullable<
        EquipmentMeta['homebrew']
      >;
      const updated: EquipmentMeta = { ...prev, homebrew: { ...hb, ...next } };
      form.setValue(
        key,
        updated as unknown as EquipmentDraft[keyof EquipmentDraft],
        { shouldDirty: true }
      );
    },
    [form]
  );

  const addPrimary = React.useCallback(
    (w: MinimalWeapon) => {
      const next = [...primary, w];
      setPrimary(next);
      write({ primary: next });
    },
    [primary, write]
  );

  const addSecondary = React.useCallback(
    (w: MinimalWeapon) => {
      const next = [...secondary, w];
      setSecondary(next);
      write({ secondary: next });
    },
    [secondary, write]
  );

  const addArmor = React.useCallback(
    (a: MinimalArmor) => {
      const next = [...armor, a];
      setArmor(next);
      write({ armor: next });
    },
    [armor, write]
  );

  return {
    homebrew: { primary, secondary, armor },
    addPrimary,
    addSecondary,
    addArmor,
  } as const;
}
