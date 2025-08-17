import type { UseFormReturn } from 'react-hook-form';

import * as React from 'react';

import { DomainsCardLazy } from '@/components/characters/cards-lazy';
import { DomainsDrawerLazy } from '@/components/characters/drawers-lazy';
import {
  countByType,
  groupByDomain,
} from '@/features/characters/logic/domains';
import type { DomainsDraft } from '@/features/characters/storage';
import type { DomainCard } from '@/lib/schemas/domains';

export function DomainsBlock({
  value,
  open,
  onOpenChange,
  form,
  submit,
  loadout,
  accessibleDomains,
}: {
  value: DomainsDraft;
  open: boolean;
  onOpenChange: (next: boolean) => void;
  form: UseFormReturn<DomainsDraft>;
  submit: () => void;
  loadout: DomainCard[];
  accessibleDomains: string[];
}) {
  React.useEffect(() => {
    if (open) form.reset(value);
  }, [open, value, form]);

  const summary = React.useMemo(
    () => ({
      total: loadout.length,
      byDomain: groupByDomain(loadout).filter(g =>
        accessibleDomains.includes(g.domain)
      ),
      byType: countByType(loadout),
      sample: loadout.slice(0, 3).map(c => c.name),
    }),
    [loadout, accessibleDomains]
  );

  const recallUsed = React.useMemo(
    () => loadout.reduce((sum, c) => sum + (c.recallCost ?? 0), 0),
    [loadout]
  );

  return (
    <section
      id="domains"
      aria-label="Domains"
      className="mt-4 scroll-mt-24 md:scroll-mt-28"
    >
      <React.Suspense
        fallback={
          <div className="text-muted-foreground p-2 text-sm">
            Loading domains…
          </div>
        }
      >
        <DomainsCardLazy
          onEdit={() => onOpenChange(true)}
          summary={summary as never}
          recallUsed={recallUsed}
          loadout={loadout as never}
        />
      </React.Suspense>
      <React.Suspense fallback={null}>
        <DomainsDrawerLazy
          open={open}
          onOpenChange={onOpenChange}
          form={form as never}
          accessibleDomains={accessibleDomains as string[]}
          submit={() => {
            submit();
            onOpenChange(false);
          }}
          onCancel={() => onOpenChange(false)}
          startingLimit={3}
          softLimit={6}
        />
      </React.Suspense>
    </section>
  );
}
