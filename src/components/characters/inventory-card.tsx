import * as React from 'react';

// Presentational badges and chips now handled inside presenters
import { EquippedList } from '@/components/characters/inventory/equipped-list';
import { InventoryList } from '@/components/characters/inventory/presenters/InventoryList';
import { InventorySummaryChips } from '@/components/characters/inventory/presenters/InventorySummaryChips';
import { CharacterCardHeader } from '@/components/characters/presenters/card-header';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
// Title becomes tappable; no separate header icon
import { Card, CardContent } from '@/components/ui/card';
import { useInventorySummary } from '@/features/characters/logic';
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
  const {
    slots,
    totalItems,
    isEquippedDerived,
    equipped,
    remaining,
    counts,
    getEmoji,
  } = useInventorySummary(inventory);
  // removal confirm dialog state
  const [removeIdx, setRemoveIdx] = React.useState<number | null>(null);
  // presentational badges and cost chips moved to separate components
  const isInteractive = (t: EventTarget | null) => {
    if (!(t instanceof HTMLElement)) return false;
    return !!t.closest(
      'button, a, input, textarea, select, [role="button"], [role="link"], [contenteditable="true"], [data-no-open]'
    );
  };

  return (
    <Card>
      <CharacterCardHeader
        title="Inventory"
        subtitle="Tap the title to edit"
        titleClassName="text-lg sm:text-xl"
        onTitleClick={onEdit}
      />
      <CardContent
        role={onEdit ? 'button' : undefined}
        tabIndex={onEdit ? 0 : undefined}
        onClick={e => {
          if (!onEdit || isInteractive(e.target)) return;
          onEdit();
        }}
        onKeyDown={e => {
          if (!onEdit || isInteractive(e.target)) return;
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onEdit();
          }
        }}
        className="hover:bg-accent/30 focus-visible:ring-ring cursor-pointer space-y-3 rounded-md transition-colors focus-visible:ring-2 focus-visible:outline-none"
      >
        {/* Quick summary chips */}
        <InventorySummaryChips
          slotsCount={slots.length}
          totalItems={totalItems}
          freeRemaining={inventory?.maxItems ? remaining : null}
          counts={counts}
        />

        {/* Detailed items list (scrollable) */}
        <InventoryList
          slots={slots}
          isEquippedDerived={isEquippedDerived}
          getEmoji={getEmoji}
          onDecQty={
            incQty
              ? index => {
                  const q = slots[index]?.quantity ?? 1;
                  if (q <= 1) setRemoveIdx(index);
                  else incQty(index, -1);
                }
              : undefined
          }
          onIncQty={incQty ? index => incQty(index, +1) : undefined}
          onSetQty={
            setQty
              ? (index, v) => {
                  if (v === 0) setRemoveIdx(index);
                  else setQty(index, v);
                }
              : undefined
          }
          onCycleLocation={
            setLocation
              ? index => {
                  const s = slots[index]!;
                  const order: Array<
                    'backpack' | 'belt' | 'equipped' | 'stored'
                  > = ['backpack', 'belt', 'equipped', 'stored'];
                  const cur =
                    (s.location as
                      | 'backpack'
                      | 'belt'
                      | 'equipped'
                      | 'stored') ?? 'backpack';
                  const next = order[(order.indexOf(cur) + 1) % order.length];
                  setLocation(index, next);
                }
              : undefined
          }
          onToggleEquipped={
            setLocation
              ? index => {
                  const s = slots[index]!;
                  const currentlyEq = isEquippedDerived(s);
                  const fallback =
                    s.location && s.location !== 'equipped'
                      ? (s.location as 'backpack' | 'belt' | 'stored')
                      : 'backpack';
                  setLocation(index, currentlyEq ? fallback : 'equipped');
                }
              : undefined
          }
          onRemove={removeAt ? index => removeAt(index) : undefined}
          setRemoveIdx={setRemoveIdx}
        />

        <div className="mt-3 border-t pt-2">
          <EquippedList
            items={equipped as Array<{ item: Item }>}
            getEmoji={getEmoji}
          />
        </div>
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
