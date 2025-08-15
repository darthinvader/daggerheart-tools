import type { UseFormReturn } from 'react-hook-form';

import * as React from 'react';

import { useDrawerAutosaveOnClose } from '@/components/characters/hooks/use-drawer-autosave';
import { HomebrewItemForm } from '@/components/characters/inventory-drawer/homebrew-item-form';
import { useInventoryLibrary } from '@/components/characters/inventory-drawer/hooks/use-inventory-library';
// CategoryFilter type consumed via hook result; no direct import needed here
import { type LibraryItem } from '@/components/characters/inventory-drawer/library-results-list';
import { LibrarySection } from '@/components/characters/inventory-drawer/library-section';
import { DrawerScaffold } from '@/components/drawers/drawer-scaffold';
import { Form } from '@/components/ui/form';
import {
  addItemToSlots,
  incrementQuantity,
  removeAtIndex,
} from '@/features/characters/logic/inventory';
import type { InventoryDraft } from '@/features/characters/storage';
import type { InventorySlot } from '@/lib/schemas/equipment';

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
  // compact selected section; no row expansion needed

  const slots = form.watch('slots');

  const setSlots = React.useCallback(
    (updater: (prev: InventorySlot[]) => InventorySlot[]) => {
      const prev = form.getValues('slots');
      const next = updater(prev ?? []);
      form.setValue('slots', next, { shouldDirty: true, shouldValidate: true });
    },
    [form]
  );

  // Centralized library building and filters
  const {
    results: libraryResults,
    getByName,
    query: libQuery,
    setQuery: setLibQuery,
    category: categoryFilter,
    setCategory: setCategoryFilter,
    rarity: rarityFilter,
    setRarity: setRarityFilter,
    tier: tierFilter,
    setTier: setTierFilter,
  } = useInventoryLibrary();

  const addFromLibrary = React.useCallback(
    (name: string | null) => {
      if (!name) return;
      const item = name ? getByName(name) : undefined;
      if (!item) return;
      setSlots(prev => addItemToSlots(prev, item as never));
    },
    [getByName, setSlots]
  );
  const removeOneFromLibrary = React.useCallback(
    (name: string) => {
      setSlots(prev => {
        const idx = prev.findIndex(s => s.item.name === name);
        if (idx < 0) return prev;
        return incrementQuantity(prev, idx, -1);
      });
    },
    [setSlots]
  );
  const removeAllFromLibrary = React.useCallback(
    (name: string) => {
      setSlots(prev => {
        const idx = prev.findIndex(s => s.item.name === name);
        if (idx < 0) return prev;
        return removeAtIndex(prev, idx);
      });
    },
    [setSlots]
  );

  // map of selected state by name to feed stateless list component
  const selectedByName = React.useMemo(() => {
    const m: Record<
      string,
      { quantity: number; isEquipped?: boolean; location?: string } | undefined
    > = {};
    for (const s of slots ?? []) {
      m[s.item.name] = {
        quantity: s.quantity ?? 1,
        isEquipped: s.isEquipped,
        location: s.location,
      };
    }
    return m;
  }, [slots]);

  // quantity helpers handled inline in list rows
  useDrawerAutosaveOnClose({
    open,
    trigger: () => form.trigger(),
    submit: () => submit(),
    skipRef,
  });
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
          {/* Homebrew item creation */}
          <HomebrewItemForm
            onAdd={item =>
              setSlots(prev => addItemToSlots(prev, item as never))
            }
          />

          {/* Add from library */}
          <LibrarySection
            query={libQuery}
            onQueryChange={setLibQuery}
            category={categoryFilter}
            onCategoryChange={setCategoryFilter}
            rarity={rarityFilter}
            onRarityChange={setRarityFilter}
            tier={tierFilter}
            onTierChange={setTierFilter}
            items={libraryResults as LibraryItem[]}
            selectedByName={selectedByName}
            onAdd={name => addFromLibrary(name)}
            onDecrement={name => removeOneFromLibrary(name)}
            onRemoveAll={name => removeAllFromLibrary(name)}
            onToggleEquipped={name => {
              setSlots(prev => {
                const idx = prev.findIndex(s => s.item.name === name);
                if (idx < 0) return prev;
                const cur = prev[idx];
                const nextEquipped = !(
                  cur.isEquipped || cur.location === 'equipped'
                );
                const copy = prev.slice();
                copy[idx] = {
                  ...cur,
                  isEquipped: nextEquipped,
                  location: nextEquipped
                    ? 'equipped'
                    : cur.location && cur.location !== 'equipped'
                      ? cur.location
                      : 'backpack',
                } as InventorySlot;
                return copy;
              });
            }}
          />
        </form>
      </Form>
    </DrawerScaffold>
  );
}

export const InventoryDrawer = React.memo(InventoryDrawerImpl);
