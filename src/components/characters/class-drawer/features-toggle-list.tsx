import * as React from 'react';

import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import type { FeatureView } from '@/features/characters/logic';

type Selections = Record<string, string | number | boolean>;

export type FeaturesToggleListProps = {
  features: FeatureView[];
  selections: Selections;
  setSelections: React.Dispatch<React.SetStateAction<Selections>>;
  level: number;
};

function displayTier(t?: FeatureView['tier']) {
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

function FeaturesToggleListImpl({
  features,
  selections,
  setSelections,
  level,
}: FeaturesToggleListProps) {
  return (
    <div>
      <div className="text-muted-foreground mb-2 text-xs font-medium">
        Features (current level: L{level})
      </div>
      <ul className="space-y-2">
        {features.map(f => (
          <li key={`${f.source}:${f.name}`} className="text-sm">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex flex-wrap items-center gap-2 font-medium whitespace-normal">
                  <span className="break-words">{f.name}</span>
                  {f.type && (
                    <span className="inline-flex rounded border px-2 py-0.5 text-[10px]">
                      {f.type}
                    </span>
                  )}
                </div>
                <div className="text-muted-foreground text-xs">
                  L{f.level} · {f.source}
                  {f.tier ? ` · ${displayTier(f.tier)}` : ''}
                  {f.unlockCondition ? ` · ${f.unlockCondition}` : ''}
                </div>
                {f.description && (
                  <div className="text-muted-foreground mt-1 text-xs break-words">
                    {f.description}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Label
                  htmlFor={`toggle-${f.source}-${f.name}`}
                  className="text-muted-foreground text-xs"
                >
                  Enabled
                </Label>
                <Switch
                  id={`toggle-${f.source}-${f.name}`}
                  checked={Boolean(
                    (selections as Record<string, unknown>)[
                      `enabled:${f.source}:${f.name}`
                    ] ?? f.level === 1
                  )}
                  onCheckedChange={val =>
                    setSelections(prev => ({
                      ...prev,
                      [`enabled:${f.source}:${f.name}`]: Boolean(val),
                    }))
                  }
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export const FeaturesToggleList = React.memo(FeaturesToggleListImpl);
