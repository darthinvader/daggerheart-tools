import * as React from 'react';

import { Button } from '@/components/ui/button';
import type { CustomFeature } from '@/features/characters/storage';

export type CustomFeaturesListProps = {
  list: CustomFeature[];
  onEdit: (index: number, feature: CustomFeature) => void;
  onRemove: (index: number) => void;
};

function displayTier(t?: CustomFeature['tier']) {
  return t === '1'
    ? 'Tier 1'
    : t === '2-4'
      ? 'Tier 2'
      : t === '5-7'
        ? 'Tier 3'
        : t === '8-10'
          ? 'Tier 4'
          : undefined;
}

function CustomFeaturesListImpl({
  list,
  onEdit,
  onRemove,
}: CustomFeaturesListProps) {
  if (list.length === 0) {
    return (
      <div className="text-muted-foreground text-sm">
        No custom features yet
      </div>
    );
  }
  return (
    <ul className="mb-2 space-y-2">
      {list.map((cf, idx) => (
        <li key={`${cf.name}:${idx}`} className="rounded-md border p-2">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 whitespace-normal">
                <span className="bg-secondary text-secondary-foreground inline-flex rounded px-2 py-0.5 text-[10px] tracking-wide uppercase">
                  L{cf.level}
                </span>
                <span className="font-medium break-words">{cf.name}</span>
                {cf.type && (
                  <span className="inline-flex rounded border px-2 py-0.5 text-[10px]">
                    {cf.type}
                  </span>
                )}
              </div>
              {cf.description && (
                <div className="text-muted-foreground mt-1 text-xs break-words">
                  {cf.description}
                </div>
              )}
              {(cf.tier || cf.unlockCondition) && (
                <div className="text-muted-foreground mt-1 text-[10px]">
                  {cf.tier ? displayTier(cf.tier) : ''}
                  {cf.tier && cf.unlockCondition ? ' · ' : ''}
                  {cf.unlockCondition ?? ''}
                </div>
              )}
              {cf.tags && cf.tags.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-1">
                  {(cf.tags ?? []).map(t => (
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
            <div className="flex items-center gap-1">
              <Button size="sm" variant="ghost" onClick={() => onEdit(idx, cf)}>
                Edit
              </Button>
              <Button size="sm" variant="ghost" onClick={() => onRemove(idx)}>
                Remove
              </Button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export const CustomFeaturesList = React.memo(CustomFeaturesListImpl);
