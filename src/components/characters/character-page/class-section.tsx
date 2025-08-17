import * as React from 'react';

import { ClassCardLazy } from '@/components/characters/cards-lazy';
import { deriveFeatureUnlocks } from '@/features/characters/logic/features';

type Props = {
  classDraft: { className: string; subclass: string };
  level: number;
  featureSelections: Record<string, string | number | boolean>;
  customFeatures: Array<{
    name: string;
    description?: string;
    type?: string;
    tags?: string[];
    level?: number;
    tier?: string | number;
    unlockCondition?: string;
  }>;
  onEdit: () => void;
};

export function ClassSection({
  classDraft,
  level,
  featureSelections,
  customFeatures,
  onEdit,
}: Props) {
  const features = React.useMemo(() => {
    const derived = deriveFeatureUnlocks(
      classDraft.className,
      classDraft.subclass
    );
    const custom = customFeatures.map(cf => ({
      name: cf.name,
      description: cf.description ?? '',
      type: (cf.type ?? 'feature') as string,
      tags: cf.tags ?? [],
      level: cf.level ?? 0,
      tier: (cf.tier as never) ?? ('' as never),
      unlockCondition: cf.unlockCondition ?? '',
      source: 'custom' as const,
    }));
    return [...derived, ...custom].sort((a, b) =>
      (a.level ?? 0) === (b.level ?? 0)
        ? a.name.localeCompare(b.name)
        : (a.level ?? 0) - (b.level ?? 0)
    );
  }, [classDraft.className, classDraft.subclass, customFeatures]);

  return (
    <section
      id="class"
      aria-label="Class & Subclass"
      className="mt-4 scroll-mt-24 md:scroll-mt-28"
    >
      <React.Suspense
        fallback={
          <div className="text-muted-foreground p-2 text-sm">
            Loading class…
          </div>
        }
      >
        <ClassCardLazy
          onEdit={onEdit}
          selectedClass={classDraft.className}
          selectedSubclass={classDraft.subclass}
          level={level}
          features={features as never}
          selections={featureSelections}
        />
      </React.Suspense>
    </section>
  );
}
