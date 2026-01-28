import { useMemo, useState } from 'react';

import { SearchInput } from '@/components/shared';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useHomebrewForCharacter } from '@/features/homebrew/use-homebrew-query';
import type { HomebrewCommunity as HomebrewCommunityContent } from '@/lib/schemas/homebrew';
import type { Community } from '@/lib/schemas/identity';
import { COMMUNITIES } from '@/lib/schemas/identity';

import { CommunityCard } from './community-card';

interface StandardCommunityListProps {
  selectedCommunity: Community | null;
  onSelect: (community: Community) => void;
  campaignId?: string;
}

/**
 * Convert homebrew community content to standard Community format
 */
function homebrewToCommunity(homebrew: HomebrewCommunityContent): Community {
  return {
    name: `${homebrew.content.name} (Homebrew)`,
    description: homebrew.content.description,
    commonTraits: homebrew.content.commonTraits,
    feature: {
      name: homebrew.content.feature.name,
      description: homebrew.content.feature.description,
    },
  };
}

export function StandardCommunityList({
  selectedCommunity,
  onSelect,
  campaignId,
}: StandardCommunityListProps) {
  const [search, setSearch] = useState('');

  // Fetch homebrew communities if character is in a campaign
  const { data: homebrewCommunities } = useHomebrewForCharacter(
    'community',
    campaignId
  );

  const allCommunities = useMemo(() => {
    const communities = [...COMMUNITIES];

    // Add homebrew communities
    if (homebrewCommunities && homebrewCommunities.length > 0) {
      for (const homebrew of homebrewCommunities) {
        if (homebrew.contentType === 'community') {
          communities.push(
            homebrewToCommunity(homebrew as HomebrewCommunityContent)
          );
        }
      }
    }

    return communities;
  }, [homebrewCommunities]);

  const filteredCommunities = useMemo(() => {
    if (!search.trim()) return allCommunities;

    const term = search.toLowerCase();
    return allCommunities.filter(
      community =>
        community.name.toLowerCase().includes(term) ||
        community.feature.name.toLowerCase().includes(term) ||
        community.description.toLowerCase().includes(term) ||
        community.commonTraits.some(trait => trait.toLowerCase().includes(term))
    );
  }, [search, allCommunities]);

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
