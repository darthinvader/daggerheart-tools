import { useMemo, useState } from 'react';

import { SearchInput } from '@/components/shared';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useHomebrewForCharacter } from '@/features/homebrew/use-homebrew-query';
import type { HomebrewAncestry as HomebrewAncestryContent } from '@/lib/schemas/homebrew';
import type { Ancestry } from '@/lib/schemas/identity';
import { ANCESTRIES } from '@/lib/schemas/identity';

import { AncestryCard } from './ancestry-card';

interface StandardAncestryListProps {
  selectedAncestry: Ancestry | null;
  onSelect: (ancestry: Ancestry) => void;
  campaignId?: string;
}

/**
 * Convert homebrew ancestry content to standard Ancestry format
 */
function homebrewToAncestry(homebrew: HomebrewAncestryContent): Ancestry {
  return {
    name: `${homebrew.content.name} (Homebrew)`,
    description: homebrew.content.description,
    heightRange: homebrew.content.heightRange,
    lifespan: homebrew.content.lifespan,
    physicalCharacteristics: homebrew.content.physicalCharacteristics,
    primaryFeature: {
      name: homebrew.content.primaryFeature.name,
      description: homebrew.content.primaryFeature.description,
      type: 'primary',
    },
    secondaryFeature: {
      name: homebrew.content.secondaryFeature.name,
      description: homebrew.content.secondaryFeature.description,
      type: 'secondary',
    },
  };
}

export function StandardAncestryList({
  selectedAncestry,
  onSelect,
  campaignId,
}: StandardAncestryListProps) {
  const [search, setSearch] = useState('');

  // Fetch homebrew ancestries if character is in a campaign
  const { data: homebrewAncestries } = useHomebrewForCharacter(
    'ancestry',
    campaignId
  );

  const allAncestries = useMemo(() => {
    const ancestries = [...ANCESTRIES];

    // Add homebrew ancestries
    if (homebrewAncestries && homebrewAncestries.length > 0) {
      for (const homebrew of homebrewAncestries) {
        if (homebrew.contentType === 'ancestry') {
          ancestries.push(
            homebrewToAncestry(homebrew as HomebrewAncestryContent)
          );
        }
      }
    }

    return ancestries;
  }, [homebrewAncestries]);

  const filteredAncestries = useMemo(() => {
    if (!search.trim()) return allAncestries;

    const term = search.toLowerCase();
    return allAncestries.filter(
      ancestry =>
        ancestry.name.toLowerCase().includes(term) ||
        ancestry.primaryFeature.name.toLowerCase().includes(term) ||
        ancestry.secondaryFeature.name.toLowerCase().includes(term) ||
        ancestry.description.toLowerCase().includes(term)
    );
  }, [search, allAncestries]);

  return (
    <div className="space-y-4">
      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Search ancestries..."
      />

      <ScrollArea className="h-125 pr-4">
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
    </div>
  );
}
