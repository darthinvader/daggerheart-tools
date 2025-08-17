import * as React from 'react';

import { AncestryCard } from '@/components/characters/ancestry-card';
import { AncestryDrawerLazy } from '@/components/characters/drawers-lazy';
import type { IdentityDraft } from '@/features/characters/storage';

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
          form={null as never}
          submit={() => onSubmit(value)}
          onCancel={() => onOpenChange(false)}
        />
      </React.Suspense>
    </section>
  );
}
