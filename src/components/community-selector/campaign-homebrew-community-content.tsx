import { useMemo } from 'react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useHomebrewForCharacter } from '@/features/homebrew/use-homebrew-query';
import { Check, Library, User } from '@/lib/icons';
import type { HomebrewCommunity } from '@/lib/schemas/identity';
import { cn } from '@/lib/utils';

interface CampaignHomebrewCommunityContentProps {
  campaignId: string;
  selectedCommunity: HomebrewCommunity | null;
  onSelect: (community: HomebrewCommunity, contentId?: string) => void;
}

export function CampaignHomebrewCommunityContent({
  campaignId,
  selectedCommunity,
  onSelect,
}: CampaignHomebrewCommunityContentProps) {
  const { data: homebrewCommunities, isLoading } = useHomebrewForCharacter(
    'community',
    campaignId
  );

  // Convert homebrew content to community format
  const availableCommunities = useMemo(() => {
    if (!homebrewCommunities) return [];

    return homebrewCommunities.map(hc => {
      const content = hc.content as HomebrewCommunity;
      return {
        id: hc.id,
        name: content.name,
        description: content.description,
        content,
      };
    });
  }, [homebrewCommunities]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (availableCommunities.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-8 text-center">
          <Library className="text-muted-foreground mx-auto mb-3 size-12" />
          <h3 className="mb-2 font-semibold">
            No Campaign Homebrew Communities
          </h3>
          <p className="text-muted-foreground text-sm">
            No homebrew communities have been linked to this campaign yet. Ask
            your GM to add homebrew content to the campaign.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground text-sm">
        Select a homebrew community that has been linked to your campaign by the
        GM.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {availableCommunities.map(community => {
          const isSelected = selectedCommunity?.name === community.content.name;

          return (
            <Card
              key={community.id}
              className={cn(
                'cursor-pointer transition-all hover:shadow-md',
                isSelected && 'ring-primary ring-2'
              )}
              onClick={() => onSelect(community.content, community.id)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base">{community.name}</CardTitle>
                  {isSelected && (
                    <Badge variant="default" className="shrink-0">
                      <Check className="mr-1 size-3" /> Selected
                    </Badge>
                  )}
                </div>
                <div className="text-muted-foreground flex items-center gap-1 text-xs">
                  <User className="size-3" />
                  <span>Homebrew Community</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {community.description && (
                  <p className="text-muted-foreground line-clamp-2 text-sm">
                    {community.description}
                  </p>
                )}
                {community.content.feature && (
                  <Badge variant="secondary" className="text-xs">
                    {community.content.feature.name}
                  </Badge>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
