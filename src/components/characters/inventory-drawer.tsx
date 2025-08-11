import type { UseFormReturn } from 'react-hook-form';

import * as React from 'react';

import { SlotRow } from '@/components/characters/inventory/slot-row';
import { DrawerScaffold } from '@/components/drawers/drawer-scaffold';
import { Button } from '@/components/ui/button';
import { Combobox, type ComboboxItem } from '@/components/ui/combobox';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  addItemToSlots,
  incrementQuantity,
  removeAtIndex,
  setEquipped,
  setLocation,
} from '@/features/characters/logic/inventory';
import type { InventoryDraft } from '@/features/characters/storage';
import {
  ALL_ARMOR_MODIFICATIONS,
  ALL_CONSUMABLES,
  ALL_POTIONS,
  ALL_RECIPES,
  ALL_RELICS,
  ALL_UTILITY_ITEMS,
  ALL_WEAPON_MODIFICATIONS,
} from '@/lib/data/equipment';
import type {
  ArmorModification,
  Consumable,
  InventorySlot,
  Potion,
  Recipe,
  Relic,
  UtilityItem,
  WeaponModification,
} from '@/lib/schemas/equipment';

export type InventoryDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<InventoryDraft>;
  submit: () => void | Promise<void>;
  onCancel: () => void;
};

function InventoryDrawerImpl({
  open,
  onOpenChange,
  form,
  submit,
  onCancel,
}: InventoryDrawerProps) {
  const skipRef = React.useRef(false);
  const [newName, setNewName] = React.useState('');
  const [libValue, setLibValue] = React.useState<string | null>(null);
  const [expanded, setExpanded] = React.useState<Record<number, boolean>>({});

  const slots = form.watch('slots');

  const setSlots = React.useCallback(
    (updater: (prev: InventorySlot[]) => InventorySlot[]) => {
      const prev = form.getValues('slots');
      const next = updater(prev ?? []);
      form.setValue('slots', next, { shouldDirty: true, shouldValidate: true });
    },
    [form]
  );

  // Build library index for quick lookup by name across categories we support adding
  type LibraryItem =
    | UtilityItem
    | Consumable
    | Potion
    | Relic
    | WeaponModification
    | ArmorModification
    | Recipe;
  const libraryItems: LibraryItem[] = React.useMemo(
    () =>
      [
        ...ALL_UTILITY_ITEMS,
        ...ALL_CONSUMABLES,
        ...ALL_POTIONS,
        ...ALL_RELICS,
        ...ALL_WEAPON_MODIFICATIONS,
        ...ALL_ARMOR_MODIFICATIONS,
        ...ALL_RECIPES,
      ] as LibraryItem[],
    []
  );

  const libraryComboboxItems: ComboboxItem[] = React.useMemo(
    () =>
      libraryItems.map(i => ({
        value: i.name,
        label: `${i.name} \u2022 ${i.category} \u2022 ${i.rarity} \u2022 T${i.tier}`,
      })),
    [libraryItems]
  );
  const [libQuery, setLibQuery] = React.useState('');
  const filteredLibraryItems = React.useMemo(() => {
    const q = libQuery.trim().toLowerCase();
    if (!q) return libraryComboboxItems;
    return libraryComboboxItems.filter(it =>
      it.label.toLowerCase().includes(q)
    );
  }, [libraryComboboxItems, libQuery]);

  const addFromLibrary = React.useCallback(
    (name: string | null) => {
      if (!name) return;
      const item = libraryItems.find(i => i.name === name);
      if (!item) return;
      setSlots(prev => addItemToSlots(prev, item));
      setLibValue(null);
    },
    [libraryItems, setSlots]
  );

  const addByName = React.useCallback(() => {
    const name = newName.trim();
    if (!name) return;
    setSlots(prev => {
      const idx = prev.findIndex(s => s.item.name === name);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], quantity: (copy[idx].quantity ?? 1) + 1 };
        return copy;
      }
      const newItem: InventorySlot['item'] = {
        name,
        tier: '1',
        rarity: 'Common',
        description: '',
        features: [],
        tags: [],
        metadata: {},
        isConsumable: false,
        maxQuantity: 99,
      };
      const newSlot: InventorySlot = {
        item: newItem,
        quantity: 1,
        isEquipped: false,
        location: 'backpack',
      };
      return [...prev, newSlot];
    });
    setNewName('');
  }, [newName, setSlots]);

  const incQty = (index: number, delta: number) => {
    setSlots(prev => incrementQuantity(prev, index, delta));
  };

  const removeAt = (index: number) => {
    setSlots(prev => removeAtIndex(prev, index));
  };
  return (
    <DrawerScaffold
      open={open}
      onOpenChange={next => {
        onOpenChange(next);
      }}
      title="Manage Inventory"
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
          {/* Add-by-name */}
          <div className="flex items-center gap-2">
            <Input
              placeholder="Add item by name"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addByName();
                }
              }}
            />
            <Button
              type="button"
              onClick={addByName}
              disabled={!newName.trim()}
            >
              Add
            </Button>
          </div>

          {/* Add from library */}
          <div className="space-y-1">
            <div className="text-sm font-medium">Add from library</div>
            <Input
              placeholder="Search items"
              value={libQuery}
              onChange={e => setLibQuery(e.target.value)}
              inputMode="search"
              enterKeyHint="search"
            />
            <Combobox
              items={filteredLibraryItems}
              value={libValue}
              onChange={v => {
                setLibValue(v);
                addFromLibrary(v);
              }}
              placeholder="Search items..."
            />
          </div>

          {/* Slots list */}
          <div className="space-y-2">
            {slots?.length ? (
              slots.map((s, idx) => (
                <SlotRow
                  key={`${s.item.name}-${idx}`}
                  slot={s}
                  index={idx}
                  expanded={!!expanded[idx]}
                  onToggleExpanded={i =>
                    setExpanded(prev => ({ ...prev, [i]: !prev[i] }))
                  }
                  onIncQty={(i, d) => incQty(i, d)}
                  onToggleEquipped={(i, checked) =>
                    setSlots(prev => setEquipped(prev, i, !!checked))
                  }
                  onChangeLocation={(i, loc) =>
                    setSlots(prev => setLocation(prev, i, loc))
                  }
                  onRemove={i => removeAt(i)}
                />
              ))
            ) : (
              <div className="text-muted-foreground text-sm">No items yet.</div>
            )}
          </div>
        </form>
      </Form>
    </DrawerScaffold>
  );
}

export const InventoryDrawer = React.memo(InventoryDrawerImpl);
