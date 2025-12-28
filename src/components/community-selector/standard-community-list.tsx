import { useMemo, useState } from 'react';

import { SearchInput } from '@/components/shared';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Community } from '@/lib/schemas/identity';
import { COMMUNITIES } from '@/lib/schemas/identity';

import { CommunityCard } from './community-card';

interface StandardCommunityListProps {
  selectedCommunity: Community | null;
  onSelect: (community: Community) => void;
}

export function StandardCommunityList({
  selectedCommunity,
  onSelect,
}: StandardCommunityListProps) {
  const [search, setSearch] = useState('');

  const filteredCommunities = useMemo(() => {
    if (!search.trim()) return COMMUNITIES;

    const term = search.toLowerCase();
    return COMMUNITIES.filter(
      community =>
        community.name.toLowerCase().includes(term) ||
        community.feature.name.toLowerCase().includes(term) ||
        community.description.toLowerCase().includes(term) ||
        community.commonTraits.some(trait => trait.toLowerCase().includes(term))
    );
  }, [search]);

  return (
    <div className="space-y-4">
      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Search communities..."
      />

      <ScrollArea className="h-125 pr-4">
        <div className="space-y-2">
          {filteredCommunities.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">
              No communities found matching "{search}"
            </p>
          ) : (
            filteredCommunities.map(community => (
              <CommunityCard
                key={community.name}
                community={community}
                isSelected={selectedCommunity?.name === community.name}
                onSelect={onSelect}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
