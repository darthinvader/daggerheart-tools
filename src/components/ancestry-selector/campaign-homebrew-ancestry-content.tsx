import { useMemo } from 'react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useHomebrewForCharacter } from '@/features/homebrew/use-homebrew-query';
import { Check, Library, User } from '@/lib/icons';
import type { HomebrewAncestry } from '@/lib/schemas/identity';
import { cn } from '@/lib/utils';

interface CampaignHomebrewAncestryContentProps {
  campaignId: string;
  selectedAncestry: HomebrewAncestry | null;
  onSelect: (ancestry: HomebrewAncestry, contentId?: string) => void;
}

export function CampaignHomebrewAncestryContent({
  campaignId,
  selectedAncestry,
  onSelect,
}: CampaignHomebrewAncestryContentProps) {
  const { data: homebrewAncestries, isLoading } = useHomebrewForCharacter(
    'ancestry',
    campaignId
  );

  // Convert homebrew content to ancestry format
  const availableAncestries = useMemo(() => {
    if (!homebrewAncestries) return [];

    return homebrewAncestries.map(ha => {
      const content = ha.content as HomebrewAncestry;
      return {
        id: ha.id,
        name: content.name,
        description: content.description,
        content,
      };
    });
  }, [homebrewAncestries]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (availableAncestries.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-8 text-center">
          <Library className="text-muted-foreground mx-auto mb-3 size-12" />
          <h3 className="mb-2 font-semibold">
            No Campaign Homebrew Ancestries
          </h3>
          <p className="text-muted-foreground text-sm">
            No homebrew ancestries have been linked to this campaign yet. Ask
            your GM to add homebrew content to the campaign.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground text-sm">
        Select a homebrew ancestry that has been linked to your campaign by the
        GM.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {availableAncestries.map(ancestry => {
          const isSelected = selectedAncestry?.name === ancestry.content.name;

          return (
            <Card
              key={ancestry.id}
              className={cn(
                'cursor-pointer transition-all hover:shadow-md',
                isSelected && 'ring-primary ring-2'
              )}
              onClick={() => onSelect(ancestry.content, ancestry.id)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base">{ancestry.name}</CardTitle>
                  {isSelected && (
                    <Badge variant="default" className="shrink-0">
                      <Check className="mr-1 size-3" /> Selected
                    </Badge>
                  )}
                </div>
                <div className="text-muted-foreground flex items-center gap-1 text-xs">
                  <User className="size-3" />
                  <span>Homebrew Ancestry</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {ancestry.description && (
                  <p className="text-muted-foreground line-clamp-2 text-sm">
                    {ancestry.description}
                  </p>
                )}
                <div className="flex flex-wrap gap-1">
                  {ancestry.content.primaryFeature && (
                    <Badge variant="secondary" className="text-xs">
                      {ancestry.content.primaryFeature.name}
                    </Badge>
                  )}
                  {ancestry.content.secondaryFeature && (
                    <Badge variant="outline" className="text-xs">
                      {ancestry.content.secondaryFeature.name}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
