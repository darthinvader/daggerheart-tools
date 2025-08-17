import type { UseFormReturn } from 'react-hook-form';

import * as React from 'react';

import { InventoryCardLazy } from '@/components/characters/cards-lazy';
import { InventoryDrawerLazy } from '@/components/characters/drawers-lazy';
import type { InventoryDraft } from '@/features/characters/storage';

export function InventoryBlock({
  value,
  open,
  onOpenChange,
  form,
  submit,
  incQty,
  setQty,
  removeAt,
  setLocation,
}: {
  value: InventoryDraft;
  open: boolean;
  onOpenChange: (next: boolean) => void;
  form: UseFormReturn<InventoryDraft>;
  submit: () => void;
  incQty: (index: number, delta: number) => void;
  setQty: (index: number, qty: number) => void;
  removeAt: (index: number) => void;
  setLocation: (
    index: number,
    loc: 'backpack' | 'belt' | 'equipped' | 'stored' | (string & {})
  ) => void;
}) {
  React.useEffect(() => {
    if (open) form.reset(value);
  }, [open, value, form]);

  return (
    <section
      id="inventory"
      aria-label="Inventory"
      className="mt-4 scroll-mt-24 md:scroll-mt-28"
    >
      <React.Suspense
        fallback={
          <div className="text-muted-foreground p-2 text-sm">
            Loading inventory…
          </div>
        }
      >
        <InventoryCardLazy
          inventory={value as unknown as InventoryDraft}
          onEdit={() => onOpenChange(true)}
          incQty={incQty}
          setQty={setQty}
          removeAt={removeAt}
          setLocation={setLocation}
        />
      </React.Suspense>
      <React.Suspense fallback={null}>
        <InventoryDrawerLazy
          open={open}
          onOpenChange={onOpenChange}
          form={form as never}
          submit={() => {
            submit();
            onOpenChange(false);
          }}
          onCancel={() => onOpenChange(false)}
        />
      </React.Suspense>
    </section>
  );
}
