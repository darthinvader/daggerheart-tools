import type { UseFormReturn } from 'react-hook-form';

import * as React from 'react';

import { CommunityCard } from '@/components/characters/community-card';
import { CommunityDrawerLazy } from '@/components/characters/drawers-lazy';
import type { IdentityDraft } from '@/features/characters/storage';

export function CommunityBlock({
  value,
  open,
  onOpenChange,
  submit,
  form,
}: {
  value: IdentityDraft;
  open: boolean;
  onOpenChange: (next: boolean) => void;
  submit: () => void;
  form: UseFormReturn<IdentityDraft>;
}) {
  React.useEffect(() => {
    if (open) form.reset(value);
  }, [open, value, form]);

  return (
    <section
      id="community"
      aria-label="Community"
      className="mt-4 scroll-mt-24 md:scroll-mt-28"
    >
      <CommunityCard
        community={value.community}
        communityDetails={value.communityDetails as never}
        onEdit={() => onOpenChange(true)}
      />
      <React.Suspense fallback={null}>
        <CommunityDrawerLazy
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
