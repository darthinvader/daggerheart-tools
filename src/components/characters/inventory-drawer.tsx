import type { UseFormReturn } from 'react-hook-form';

import * as React from 'react';

import { HomebrewItemForm } from '@/components/characters/inventory-drawer/homebrew-item-form';
import {
  type CategoryFilter,
  InventoryFiltersToolbar,
} from '@/components/characters/inventory-drawer/inventory-filters-toolbar';
import {
  type LibraryItem,
  LibraryResultsList,
} from '@/components/characters/inventory-drawer/library-results-list';
import { DrawerScaffold } from '@/components/drawers/drawer-scaffold';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  addItemToSlots,
  incrementQuantity,
  removeAtIndex,
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

  // Build library index for quick lookup by name across categories we support adding
  type LibraryItemLocal = LibraryItem;
  const libraryItems: LibraryItemLocal[] = React.useMemo(() => {
    // Merge and deduplicate by name to avoid duplicates (e.g., potions present in both CONSUMABLES and POTIONS)
    const merged: LibraryItemLocal[] = [
      ...ALL_UTILITY_ITEMS,
      ...ALL_CONSUMABLES,
      ...ALL_POTIONS,
      ...ALL_RELICS,
      ...ALL_WEAPON_MODIFICATIONS,
      ...ALL_ARMOR_MODIFICATIONS,
      ...ALL_RECIPES,
    ] as LibraryItemLocal[];
    const byName = new Map<string, LibraryItemLocal>();
    for (const it of merged) {
      if (!byName.has(it.name)) byName.set(it.name, it);
    }
    return Array.from(byName.values());
  }, []);

  const [libQuery, setLibQuery] = React.useState('');
  // Filters similar to equipment drawer: category, rarity, tier
  type CategoryFilterLocal = CategoryFilter;
  const [categoryFilter, setCategoryFilter] =
    React.useState<CategoryFilterLocal>('');
  const [rarityFilter, setRarityFilter] = React.useState<
    '' | 'Common' | 'Uncommon' | 'Rare' | 'Legendary'
  >('');
  const [tierFilter, setTierFilter] = React.useState<
    '' | '1' | '2' | '3' | '4'
  >('');
  // Direct item matches for a browsable results list with full details
  const libraryResults: LibraryItemLocal[] = React.useMemo(() => {
    const q = libQuery.trim().toLowerCase();
    return libraryItems.filter(i => {
      // text search
      const text =
        `${i.name} ${(i as { category?: string }).category ?? ''} ${(i as { rarity?: string }).rarity ?? ''} ${String((i as { tier?: string | number }).tier ?? '')} ${(i as { description?: string }).description ?? ''}`.toLowerCase();
      if (q && !text.includes(q)) return false;
      // category filter (Potion is a Consumable sub-type)
      if (categoryFilter) {
        const cat = (i as { category?: string }).category;
        if (categoryFilter === 'Potion') {
          const potionish =
            (i as unknown as { potionType?: unknown; subcategory?: string })
              .potionType != null ||
            (i as unknown as { subcategory?: string }).subcategory === 'Potion';
          if (!potionish) return false;
        } else if (cat !== categoryFilter) {
          return false;
        }
      }
      // rarity filter
      if (rarityFilter && (i as { rarity?: string }).rarity !== rarityFilter)
        return false;
      // tier filter
      if (tierFilter) {
        const rawTier = (i as { tier?: string | number | undefined }).tier;
        const itemTier =
          rawTier == null || rawTier === '' ? '' : String(Number(rawTier));
        if (itemTier !== tierFilter) return false;
      }
      return true;
    });
  }, [libQuery, libraryItems, categoryFilter, rarityFilter, tierFilter]);

  const addFromLibrary = React.useCallback(
    (name: string | null) => {
      if (!name) return;
      const item = libraryItems.find(i => i.name === name);
      if (!item) return;
      setSlots(prev => addItemToSlots(prev, item as never));
    },
    [libraryItems, setSlots]
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
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="button" variant="ghost" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button type="button" onClick={() => submit()}>
            Save
          </Button>
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
          {/* Homebrew item creation */}
          <HomebrewItemForm
            onAdd={item =>
              setSlots(prev => addItemToSlots(prev, item as never))
            }
          />

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
            {/* Filters */}
            <InventoryFiltersToolbar
              category={categoryFilter}
              onCategoryChange={setCategoryFilter}
              rarity={rarityFilter}
              onRarityChange={setRarityFilter}
              tier={tierFilter}
              onTierChange={setTierFilter}
              className="grid grid-cols-1 gap-2 sm:grid-cols-3"
            />
            {/* Browsable results list with accents */}
            <div className="max-h-[45dvh] overflow-auto rounded border">
              <LibraryResultsList
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
            </div>
          </div>
        </form>
      </Form>
    </DrawerScaffold>
  );
}

export const InventoryDrawer = React.memo(InventoryDrawerImpl);
