import * as React from 'react';

import { FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ANCESTRIES } from '@/lib/data/characters/ancestries';

export type MixedListProps = {
  label: string;
  selectedName: string;
  onSelect: (name: string) => void;
  featureType: 'primary' | 'secondary';
};

export const MixedList = React.memo(function MixedList({
  label,
  selectedName,
  onSelect,
  featureType,
}: MixedListProps) {
  const [query, setQuery] = React.useState('');
  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ANCESTRIES;
    return ANCESTRIES.filter(a => {
      const feat =
        featureType === 'primary' ? a.primaryFeature : a.secondaryFeature;
      return (
        a.name.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        feat.name.toLowerCase().includes(q) ||
        feat.description.toLowerCase().includes(q)
      );
    });
  }, [query, featureType]);

  return (
    <div className="space-y-2">
      <FormLabel>{label}</FormLabel>
      <Input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder={`Search ${label.toLowerCase()}…`}
        aria-label={`Search ${label.toLowerCase()}`}
      />
      <div className="flex max-h-[35vh] flex-col gap-1 overflow-auto rounded-md border p-1">
        {filtered.length === 0 && (
          <div className="text-muted-foreground p-3 text-sm">
            No ancestries match your search.
          </div>
        )}
        {filtered.map(a => {
          const isSelected = a.name === selectedName;
          const feat =
            featureType === 'primary' ? a.primaryFeature : a.secondaryFeature;
          return (
            <button
              type="button"
              key={`${a.name}-${featureType}`}
              onClick={() => {
                if (a.name !== selectedName) onSelect(a.name);
              }}
              className={`hover:bg-accent/50 focus-visible:ring-ring w-full rounded text-left transition-colors focus:outline-none focus-visible:ring-2 ${isSelected ? 'bg-accent/30' : ''}`}
            >
              <div className="p-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-sm font-medium">🧬 {a.name}</div>
                  {isSelected && (
                    <span className="text-muted-foreground text-[11px]">
                      Selected
                    </span>
                  )}
                </div>
                {/* Intentionally hide ancestry description in Mixed mode for compactness */}
                <div className="mt-2 text-xs">
                  <div className="text-muted-foreground text-[10px] uppercase">
                    {featureType === 'primary'
                      ? '⭐ Primary Feature'
                      : '✨ Secondary Feature'}
                  </div>
                  <div className="font-medium">{feat.name}</div>
                  <div className="text-muted-foreground">
                    {feat.description}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
});
