import type { UseFormReturn } from 'react-hook-form';

import * as React from 'react';

import { EquipmentCardLazy } from '@/components/characters/cards-lazy';
import { EquipmentDrawerLazy } from '@/components/characters/drawers-lazy';
import type { EquipmentDraft } from '@/features/characters/storage';

export function EquipmentBlock({
  value,
  open,
  onOpenChange,
  form,
  submit,
  onEdit,
  section,
}: {
  value: EquipmentDraft;
  open: boolean;
  onOpenChange: (next: boolean) => void;
  form: UseFormReturn<EquipmentDraft>;
  submit: () => void;
  onEdit: (section?: 'primary' | 'secondary' | 'armor') => void;
  section?: 'primary' | 'secondary' | 'armor';
}) {
  React.useEffect(() => {
    if (open) form.reset(value);
  }, [open, value, form]);

  return (
    <section
      id="equipment"
      aria-label="Equipment"
      className="mt-4 scroll-mt-24 md:scroll-mt-28"
    >
      <React.Suspense
        fallback={
          <div className="text-muted-foreground p-2 text-sm">
            Loading equipment…
          </div>
        }
      >
        <EquipmentCardLazy
          equipment={value as unknown as EquipmentDraft}
          onEdit={onEdit}
        />
      </React.Suspense>
      <React.Suspense fallback={null}>
        <EquipmentDrawerLazy
          open={open}
          onOpenChange={onOpenChange}
          form={form as never}
          submit={() => {
            submit();
            onOpenChange(false);
          }}
          onCancel={() => onOpenChange(false)}
          section={section}
        />
      </React.Suspense>
    </section>
  );
}
