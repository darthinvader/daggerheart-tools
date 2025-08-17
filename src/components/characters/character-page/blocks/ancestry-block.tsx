import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import * as React from 'react';

import { AncestryCard } from '@/components/characters/ancestry-card';
import type { AncestryFormValues } from '@/components/characters/ancestry-drawer';
import { AncestryDrawerLazy } from '@/components/characters/drawers-lazy';
import type { IdentityDraft } from '@/features/characters/storage';
import { IdentityDraftSchema } from '@/features/characters/storage';

export function AncestryBlock({
  value,
  open,
  onOpenChange,
  onSubmit,
}: {
  value: IdentityDraft;
  open: boolean;
  onOpenChange: (next: boolean) => void;
  onSubmit: (v: IdentityDraft) => void;
}) {
  // Local form dedicated to ancestry editing. Keeps drawer logic consistent
  // with tests and prevents null form access.
  const form = useForm<AncestryFormValues>({
    resolver: zodResolver(
      IdentityDraftSchema.pick({ ancestry: true, ancestryDetails: true })
    ) as never,
    mode: 'onChange',
    defaultValues: {
      ancestry: value.ancestry,
      ancestryDetails: value.ancestryDetails as never,
    },
  });

  // When the drawer opens, sync the form with the latest persisted values
  React.useEffect(() => {
    if (open) {
      form.reset({
        ancestry: value.ancestry,
        ancestryDetails: value.ancestryDetails as never,
      });
    }
  }, [open, value.ancestry, value.ancestryDetails, form]);

  const submit = form.handleSubmit(vals => {
    onSubmit({
      ...value,
      ancestry: vals.ancestry,
      ancestryDetails: vals.ancestryDetails,
    } as IdentityDraft);
  });

  return (
    <section
      id="ancestry"
      aria-label="Ancestry"
      className="mt-4 scroll-mt-24 md:scroll-mt-28"
    >
      <AncestryCard
        ancestry={value.ancestry}
        ancestryDetails={value.ancestryDetails as never}
        onEdit={() => onOpenChange(true)}
      />
      <React.Suspense fallback={null}>
        <AncestryDrawerLazy
          open={open}
          onOpenChange={onOpenChange}
          form={form as never}
          submit={() => {
            void submit();
            onOpenChange(false);
          }}
          onCancel={() => onOpenChange(false)}
        />
      </React.Suspense>
    </section>
  );
}
