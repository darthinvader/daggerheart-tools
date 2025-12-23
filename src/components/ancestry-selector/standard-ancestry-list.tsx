import { useMemo, useState } from 'react';

import { ScrollArea } from '@/components/ui/scroll-area';
import type { Ancestry } from '@/lib/schemas/identity';
import { ANCESTRIES } from '@/lib/schemas/identity';

import { AncestryCard } from './ancestry-card';
import { AncestryDetail } from './ancestry-detail';
import { AncestrySearch } from './ancestry-search';

interface StandardAncestryListProps {
  selectedAncestry: Ancestry | null;
  onSelect: (ancestry: Ancestry) => void;
}

export function StandardAncestryList({
  selectedAncestry,
  onSelect,
}: StandardAncestryListProps) {
  const [search, setSearch] = useState('');

  const filteredAncestries = useMemo(() => {
    if (!search.trim()) return ANCESTRIES;

    const term = search.toLowerCase();
    return ANCESTRIES.filter(
      ancestry =>
        ancestry.name.toLowerCase().includes(term) ||
        ancestry.primaryFeature.name.toLowerCase().includes(term) ||
        ancestry.secondaryFeature.name.toLowerCase().includes(term) ||
        ancestry.description.toLowerCase().includes(term)
    );
  }, [search]);

  return (
    <div className="space-y-4">
      <AncestrySearch value={search} onChange={setSearch} />

      <div className="grid gap-4 lg:grid-cols-2">
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-2">
            {filteredAncestries.length === 0 ? (
              <p className="text-muted-foreground py-8 text-center">
                No ancestries found matching "{search}"
              </p>
            ) : (
              filteredAncestries.map(ancestry => (
                <AncestryCard
                  key={ancestry.name}
                  ancestry={ancestry}
                  isSelected={selectedAncestry?.name === ancestry.name}
                  onSelect={onSelect}
                />
              ))
            )}
          </div>
        </ScrollArea>

        <div className="hidden h-[500px] lg:block">
          {selectedAncestry ? (
            <ScrollArea className="h-full">
              <AncestryDetail ancestry={selectedAncestry} />
            </ScrollArea>
          ) : (
            <div className="text-muted-foreground bg-muted/20 flex h-full items-center justify-center rounded-lg border">
              <p>Select an ancestry to view details</p>
            </div>
          )}
        </div>
      </div>

      {selectedAncestry && (
        <div className="lg:hidden">
          <AncestryDetail ancestry={selectedAncestry} />
        </div>
      )}
    </div>
  );
}
