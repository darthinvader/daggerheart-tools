import * as React from 'react';

import {
  RarityBadge,
  TierBadge,
  WeightBadge,
} from '@/components/characters/inventory/badges';
import { CategoryInlineDetails } from '@/components/characters/inventory/category-inline-details';
import { CostChips } from '@/components/characters/inventory/cost-chips';
import { EquippedList } from '@/components/characters/inventory/equipped-list';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Inventory, Item } from '@/lib/schemas/equipment';

type Props = {
  inventory?: Inventory;
  onEdit?: () => void;
  incQty?: (index: number, delta: number) => void;
  setQty?: (index: number, value: number) => void;
  removeAt?: (index: number) => void;
  setLocation?: (
    index: number,
    loc: 'backpack' | 'belt' | 'equipped' | 'stored' | (string & {})
  ) => void;
};

export function InventoryCard({
  inventory,
  onEdit,
  incQty,
  setQty,
  removeAt,
  setLocation,
}: Props) {
  const slots = React.useMemo(() => inventory?.slots ?? [], [inventory?.slots]);
  const totalItems = slots.reduce((sum, s) => sum + (s.quantity ?? 1), 0);
  const isEquippedDerived = (s: { isEquipped?: boolean; location?: unknown }) =>
    !!s.isEquipped || s.location === 'equipped';
  const equipped = slots.filter(s => isEquippedDerived(s));
  const remaining = Math.max(0, (inventory?.maxItems ?? 0) - slots.length);
  // removal confirm dialog state
  const [removeIdx, setRemoveIdx] = React.useState<number | null>(null);
  // Category counts (runtime-safe guards; item may be a base ItemSchema without discriminators in types)
  const getString = (obj: unknown, key: 'category' | 'subcategory') => {
    if (typeof obj === 'object' && obj !== null) {
      const v = (obj as { category?: unknown; subcategory?: unknown })[key];
      return typeof v === 'string' ? v : undefined;
    }
    return undefined;
  };
  const counts = React.useMemo(() => {
    const acc = {
      utility: 0,
      consumables: 0,
      potions: 0,
      relics: 0,
      weaponMods: 0,
      armorMods: 0,
      recipes: 0,
    };
    for (const s of slots) {
      const it = s.item as unknown;
      const cat = getString(it, 'category');
      if (cat === 'Utility') acc.utility += s.quantity ?? 1;
      else if (cat === 'Consumable') {
        if (getString(it, 'subcategory') === 'Potion')
          acc.potions += s.quantity ?? 1;
        else acc.consumables += s.quantity ?? 1;
      } else if (cat === 'Relic') acc.relics += s.quantity ?? 1;
      else if (cat === 'Weapon Modification') acc.weaponMods += s.quantity ?? 1;
      else if (cat === 'Armor Modification') acc.armorMods += s.quantity ?? 1;
      else if (cat === 'Recipe') acc.recipes += s.quantity ?? 1;
    }
    return acc;
  }, [slots]);
  const getEmoji = (s: unknown): string => {
    const cat = (s as { category?: string } | undefined)?.category;
    if (cat === 'Utility') return '🧰';
    if (cat === 'Consumable') return '🍽️';
    if (cat === 'Relic') return '🗿';
    if (cat === 'Weapon Modification') return '🛠️';
    if (cat === 'Armor Modification') return '🛡️';
    if (cat === 'Recipe') return '📜';
    return '🎒';
  };
  // presentational badges and cost chips moved to separate components

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-2">
        <CardTitle>Inventory</CardTitle>
        <Button size="sm" variant="outline" onClick={onEdit}>
          Edit
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Quick summary chips */}
        <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-xs">
          <span className="mr-1">
            {slots.length} slots • {totalItems} items
            {inventory?.maxItems ? ` • ${remaining} free` : ''}
          </span>
          {counts.utility > 0 && (
            <span className="bg-muted rounded px-1 py-0.5">
              🧰 {counts.utility}
            </span>
          )}
          {counts.consumables > 0 && (
            <span className="bg-muted rounded px-1 py-0.5">
              🍽️ {counts.consumables}
            </span>
          )}
          {counts.potions > 0 && (
            <span className="bg-muted rounded px-1 py-0.5">
              🧪 {counts.potions}
            </span>
          )}
          {counts.relics > 0 && (
            <span className="bg-muted rounded px-1 py-0.5">
              🗿 {counts.relics}
            </span>
          )}
          {counts.weaponMods > 0 && (
            <span className="bg-muted rounded px-1 py-0.5">
              🛠️ {counts.weaponMods}
            </span>
          )}
          {counts.armorMods > 0 && (
            <span className="bg-muted rounded px-1 py-0.5">
              🛡️ {counts.armorMods}
            </span>
          )}
          {counts.recipes > 0 && (
            <span className="bg-muted rounded px-1 py-0.5">
              📜 {counts.recipes}
            </span>
          )}
        </div>

        {/* Detailed items list (scrollable) */}
        {slots.length ? (
          <div className="max-h-[45dvh] overflow-auto">
            <ul className="divide-border divide-y">
              {slots.map((s, i) => {
                const emoji = getEmoji(
                  s.item as unknown as { category?: string }
                );
                return (
                  <li key={`${s.item.name}-${i}`} className="py-2">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div className="order-2 min-w-0 flex-1 sm:order-1">
                        <div className="text-sm font-semibold break-words">
                          <span className="mr-1" aria-hidden>
                            {emoji}
                          </span>
                          {s.item.name}
                          <button
                            type="button"
                            className="bg-muted text-muted-foreground ml-2 rounded px-1 py-0.5 text-[11px]"
                            onClick={() => {
                              if (!setLocation) return;
                              const order: Array<
                                'backpack' | 'belt' | 'equipped' | 'stored'
                              > = ['backpack', 'belt', 'equipped', 'stored'];
                              const cur =
                                (s.location as
                                  | 'backpack'
                                  | 'belt'
                                  | 'equipped'
                                  | 'stored') ?? 'backpack';
                              const next =
                                order[(order.indexOf(cur) + 1) % order.length];
                              setLocation(i, next);
                            }}
                            aria-label="Cycle location"
                            title="Click to change location"
                          >
                            {isEquippedDerived(s)
                              ? 'equipped'
                              : (s.location ?? 'backpack')}
                          </button>
                          {s.quantity > 1 ? (
                            <span className="ml-2 rounded bg-blue-100 px-1 py-0.5 text-[11px] text-blue-900 dark:bg-blue-500/20 dark:text-blue-200">
                              x{s.quantity}
                            </span>
                          ) : null}
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-1 text-[11px]">
                          <TierBadge label={`Tier ${String(s.item.tier)}`} />
                          <RarityBadge label={String(s.item.rarity)} />
                          <CostChips item={s.item as Item} />
                          {s.item.weight ? (
                            <WeightBadge label={String(s.item.weight)} />
                          ) : null}
                        </div>
                        {s.item.description ? (
                          <div className="text-foreground/90 mt-2 text-xs whitespace-pre-wrap">
                            {s.item.description}
                          </div>
                        ) : null}
                        {Array.isArray(s.item.features) &&
                        s.item.features.length ? (
                          <div className="mt-1">
                            <div className="flex flex-wrap gap-1">
                              {s.item.features.map((f, i) => (
                                <span
                                  key={i}
                                  className="bg-muted text-muted-foreground rounded px-1 py-0.5 text-[11px]"
                                >
                                  {f.name}
                                </span>
                              ))}
                            </div>
                            <ul className="mt-1 list-disc pl-4 text-xs">
                              {s.item.features.map((f, i) => (
                                <li key={i}>
                                  <span className="font-medium">{f.name}:</span>{' '}
                                  {f.description}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : null}
                        {/* Category specific inline details */}
                        <CategoryInlineDetails item={s.item} />
                      </div>
                      <div className="order-1 flex items-center gap-1 sm:order-2">
                        <Button
                          type="button"
                          size="icon"
                          variant="outline"
                          className="h-6 w-6 text-xs"
                          onClick={() => {
                            if (!incQty) return;
                            const q = s.quantity ?? 1;
                            if (q <= 1) {
                              setRemoveIdx(i);
                            } else {
                              incQty(i, -1);
                            }
                          }}
                          aria-label="Decrease quantity"
                        >
                          –
                        </Button>
                        <input
                          aria-label="Quantity"
                          className="border-input bg-background h-6 w-10 rounded border px-1.5 text-center text-xs tabular-nums"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          value={s.quantity ?? 1}
                          onChange={e => {
                            if (!setQty) return;
                            const v = Math.max(
                              0,
                              Number(e.target.value.replace(/[^0-9]/g, '')) || 0
                            );
                            if (v === 0) {
                              // Use AlertDialog instead of blocking confirm()
                              setRemoveIdx(i);
                              return;
                            }
                            setQty(i, v);
                          }}
                        />
                        <Button
                          type="button"
                          size="icon"
                          variant="outline"
                          className="h-6 w-6 text-xs"
                          onClick={() => incQty && incQty(i, +1)}
                          aria-label="Increase quantity"
                        >
                          +
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant={isEquippedDerived(s) ? 'default' : 'outline'}
                          className="h-6 px-2 text-xs"
                          onClick={() => {
                            if (!setLocation) return;
                            const currentlyEq = isEquippedDerived(s);
                            const fallback =
                              s.location && s.location !== 'equipped'
                                ? (s.location as 'backpack' | 'belt' | 'stored')
                                : 'backpack';
                            setLocation(i, currentlyEq ? fallback : 'equipped');
                          }}
                          aria-label="Toggle equipped"
                          title="Toggle equipped"
                        >
                          {isEquippedDerived(s) ? 'Equipped' : 'Equip'}
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          className="h-6 px-2 text-xs"
                          onClick={() => setRemoveIdx(i)}
                          aria-label="Remove item"
                          title="Remove item"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : (
          <div className="text-muted-foreground text-sm">No items yet.</div>
        )}

        <EquippedList
          items={equipped as Array<{ item: Item }>}
          getEmoji={getEmoji}
        />
      </CardContent>
      {/* Removal confirmation dialog */}
      <AlertDialog
        open={removeIdx !== null}
        onOpenChange={open => !open && setRemoveIdx(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove item?</AlertDialogTitle>
            <AlertDialogDescription>
              {removeIdx !== null
                ? `Set ${slots[removeIdx]?.item.name} to 0 and remove it from your inventory?`
                : ''}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex items-center justify-end gap-2">
            <AlertDialogCancel onClick={() => setRemoveIdx(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (removeIdx !== null) removeAt?.(removeIdx);
                setRemoveIdx(null);
              }}
            >
              Remove
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
