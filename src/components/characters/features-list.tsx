import * as React from 'react';

import type { FeatureView } from '@/features/characters/logic';

export type FeaturesListProps = {
  level: number;
  features: FeatureView[];
  selections?: Record<string, string | number | boolean>;
};

export function FeaturesList({
  level,
  features,
  selections,
}: FeaturesListProps) {
  const displayTier = (t: FeatureView['tier']) =>
    t === '1'
      ? 'Tier 1'
      : t === '2-4'
        ? 'Tier 2'
        : t === '5-7'
          ? 'Tier 3'
          : t === '8-10'
            ? 'Tier 4'
            : undefined;
  const isEnabled = (f: FeatureView) => {
    const key = `enabled:${f.source}:${f.name}`;
    const val = selections ? selections[key] : undefined;
    return val === undefined ? f.level === 1 : Boolean(val);
  };
  const visible = features.filter(isEnabled);
  const current = visible.filter(f => f.level <= level);
  const future = visible.filter(f => f.level > level);
  const merged = React.useMemo(() => {
    const all = [...current, ...future];
    const l1 = all.filter(f => f.level === 1);
    const rest = all
      .filter(f => f.level !== 1)
      .sort((a, b) =>
        a.level === b.level ? a.name.localeCompare(b.name) : a.level - b.level
      );
    l1.sort((a, b) => a.name.localeCompare(b.name));
    return [...l1, ...rest];
  }, [current, future]);

  if (merged.length === 0) {
    return <div className="text-muted-foreground text-sm">No features yet</div>;
  }

  return (
    <ul className="space-y-2">
      {merged.map(f => (
        <li
          key={`${f.source}:${f.name}`}
          className="max-w-full rounded-md border p-2 text-sm break-words"
        >
          <div className="flex items-start gap-2">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 whitespace-normal">
                <span className="bg-secondary text-secondary-foreground inline-flex rounded px-2 py-0.5 text-[10px] tracking-wide uppercase">
                  L{f.level}
                </span>
                <span className="font-medium break-words">{f.name}</span>
                <span className="text-muted-foreground text-xs">
                  ({f.source})
                </span>
                {f.type && (
                  <span className="inline-flex rounded border px-2 py-0.5 text-xs">
                    {f.type}
                  </span>
                )}
              </div>
              <div className="text-muted-foreground mt-1 text-xs break-words">
                {f.description}
              </div>
              {(f.tier || f.unlockCondition) && (
                <div className="text-muted-foreground mt-1 text-[10px]">
                  {f.tier ? displayTier(f.tier) : ''}
                  {f.tier && f.unlockCondition ? ' · ' : ''}
                  {f.unlockCondition ?? ''}
                </div>
              )}
              {f.tags && f.tags.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-1">
                  {f.tags.map(t => (
                    <span
                      key={t}
                      className="inline-flex rounded border px-2 py-0.5 text-[10px]"
                    >
                      🏷️ {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
