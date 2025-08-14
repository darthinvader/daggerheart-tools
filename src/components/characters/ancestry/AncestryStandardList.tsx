import * as React from 'react';

import { Input } from '@/components/ui/input';

export function AncestryStandardList({
  selected,
  onSelect,
  filterAncestries,
}: {
  selected: string;
  onSelect: (name: string) => void;
  filterAncestries: (q: string) => Array<{
    name: string;
    description: string;
    heightRange?: string;
    lifespan?: string;
    physicalCharacteristics: string[];
    primaryFeature: { name: string; description: string };
    secondaryFeature: { name: string; description: string };
  }>;
}) {
  const [query, setQuery] = React.useState('');
  const filtered = React.useMemo(
    () => filterAncestries(query),
    [query, filterAncestries]
  );

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-2">
        <Input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search ancestries…"
          aria-label="Search ancestries"
        />
      </div>
      <div className="flex max-h-[45vh] flex-col gap-1 overflow-auto rounded-md border p-1">
        {filtered.length === 0 && (
          <div className="text-muted-foreground p-3 text-sm">
            No ancestries match your search.
          </div>
        )}
        {filtered.map(a => {
          const isSelected = a.name === selected;
          return (
            <button
              type="button"
              key={a.name}
              onClick={() => {
                onSelect(a.name);
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
                <div className="text-muted-foreground mt-0.5 line-clamp-1 text-xs">
                  {a.description}
                </div>
                {isSelected && (
                  <div className="mt-2 text-xs">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <div className="text-muted-foreground text-[10px] uppercase">
                          🧍 Height
                        </div>
                        <div>{a.heightRange}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground text-[10px] uppercase">
                          ⏳ Lifespan
                        </div>
                        <div>{a.lifespan}</div>
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="text-muted-foreground text-[10px] uppercase">
                        🧪 Physical Traits
                      </div>
                      <ul className="ml-4 list-disc">
                        {a.physicalCharacteristics.map((c: string) => (
                          <li key={c}>{c}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <div>
                        <div className="font-medium">
                          ⭐ {a.primaryFeature.name}
                        </div>
                        <div className="text-muted-foreground">
                          {a.primaryFeature.description}
                        </div>
                      </div>
                      <div>
                        <div className="font-medium">
                          ✨ {a.secondaryFeature.name}
                        </div>
                        <div className="text-muted-foreground">
                          {a.secondaryFeature.description}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
