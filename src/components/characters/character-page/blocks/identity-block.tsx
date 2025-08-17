import type { UseFormReturn } from 'react-hook-form';

import * as React from 'react';

import { IdentityDrawerLazy } from '@/components/characters/drawers-lazy';
import { IdentityCard } from '@/components/characters/identity-card';
import type { IdentityDraft } from '@/features/characters/storage';

export function IdentityBlock({
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
      id="identity"
      aria-label="Identity"
      className="mt-4 scroll-mt-24 md:scroll-mt-28"
    >
      <IdentityCard
        identity={{
          name: value.name,
          pronouns: value.pronouns,
          description: value.description,
          calling: value.calling,
          connections: Array.isArray(
            (value as Record<string, unknown>).connections
          )
            ? (
                value as unknown as {
                  connections: { prompt: string; answer: string }[];
                }
              ).connections
            : [],
        }}
        onEdit={() => onOpenChange(true)}
      />
      <React.Suspense
        fallback={
          <div className="text-muted-foreground p-4 text-sm">Loading…</div>
        }
      >
        <IdentityDrawerLazy
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
