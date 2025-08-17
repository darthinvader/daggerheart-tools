import * as React from 'react';

import { Input } from '@/components/ui/input';
import { COMMUNITIES } from '@/lib/data/characters/communities';

export type CommunityListProps = {
  query: string;
  onQueryChange: (q: string) => void;
  selectedName: string;
  onSelect: (name: string) => void;
};

export function CommunityList({
  query,
  onQueryChange,
  selectedName,
  onSelect,
}: CommunityListProps) {
  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COMMUNITIES;
    return COMMUNITIES.filter(
      c =>
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        (c.commonTraits?.some((t: string) => t.toLowerCase().includes(q)) ??
          false) ||
        c.feature.name.toLowerCase().includes(q) ||
        c.feature.description.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="space-y-3">
      <Input
        value={query}
        onChange={e => onQueryChange(e.target.value)}
        placeholder="Search communities…"
        aria-label="Search communities"
      />
      <div className="flex max-h-[40vh] flex-col gap-1 overflow-auto rounded-md border p-1">
        {filtered.length === 0 && (
          <div className="text-muted-foreground p-3 text-sm">
            No communities match your search.
          </div>
        )}
        {filtered.map(c => {
          const isSelected = c.name === selectedName;
          return (
            <button
              type="button"
              key={c.name}
              onClick={() => onSelect(c.name)}
              className={`hover:bg-accent/50 focus-visible:ring-ring w-full rounded text-left transition-colors focus:outline-none focus-visible:ring-2 ${isSelected ? 'bg-accent/30 ring-ring ring-1' : ''}`}
            >
              <div className="p-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <span aria-hidden>🏘️</span>
                    <span>{c.name}</span>
                  </div>
                </div>
                {isSelected && (
                  <div className="bg-accent/10 mt-2 rounded-md border p-2 text-xs">
                    <div className="text-muted-foreground text-[10px] uppercase">
                      Feature
                    </div>
                    <div className="font-medium">{c.feature.name}</div>
                    <div className="text-muted-foreground">{c.description}</div>
                    <div className="text-muted-foreground">
                      {c.feature.description}
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
