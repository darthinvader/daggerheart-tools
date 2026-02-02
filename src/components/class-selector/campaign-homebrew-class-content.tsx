import { useMemo } from 'react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useHomebrewForCharacter } from '@/features/homebrew/use-homebrew-query';
import { Check, Library, User } from '@/lib/icons';
import type { HomebrewClass } from '@/lib/schemas/class-selection';
import { cn } from '@/lib/utils';

interface CampaignHomebrewClassContentProps {
  campaignId: string;
  selectedClass: HomebrewClass | null;
  onSelect: (homebrewClass: HomebrewClass, contentId?: string) => void;
}

export function CampaignHomebrewClassContent({
  campaignId,
  selectedClass,
  onSelect,
}: CampaignHomebrewClassContentProps) {
  const { data: homebrewClasses, isLoading } = useHomebrewForCharacter(
    'class',
    campaignId
  );

  // Convert homebrew content to HomebrewClass format
  const availableClasses = useMemo(() => {
    if (!homebrewClasses) return [];

    return homebrewClasses.map(hc => {
      // Content is already filtered to 'class' type by the hook
      const content = hc.content as unknown as HomebrewClass & {
        isHomebrew: true;
      };
      return {
        id: hc.id,
        name: content.name,
        description: content.description,
        content,
      };
    });
  }, [homebrewClasses]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (availableClasses.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-8 text-center">
          <Library className="text-muted-foreground mx-auto mb-3 size-12" />
          <h3 className="mb-2 font-semibold">No Campaign Homebrew Classes</h3>
          <p className="text-muted-foreground text-sm">
            No homebrew classes have been linked to this campaign yet. Ask your
            GM to add homebrew content to the campaign.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground text-sm">
        Select a homebrew class that has been linked to your campaign by the GM.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {availableClasses.map(cls => {
          const isSelected = selectedClass?.name === cls.content.name;

          return (
            <Card
              key={cls.id}
              className={cn(
                'cursor-pointer transition-all hover:shadow-md',
                isSelected && 'ring-primary ring-2'
              )}
              onClick={() => onSelect(cls.content, cls.id)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base">{cls.name}</CardTitle>
                  {isSelected && (
                    <Badge variant="default" className="shrink-0">
                      <Check className="mr-1 size-3" /> Selected
                    </Badge>
                  )}
                </div>
                <div className="text-muted-foreground flex items-center gap-1 text-xs">
                  <User className="size-3" />
                  <span>Homebrew Class</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {cls.description && (
                  <p className="text-muted-foreground line-clamp-2 text-sm">
                    {cls.description}
                  </p>
                )}
                <div className="flex flex-wrap gap-1">
                  {cls.content.domains?.map(domain => (
                    <Badge key={domain} variant="secondary" className="text-xs">
                      {domain}
                    </Badge>
                  ))}
                </div>
                {cls.content.subclasses?.length > 0 && (
                  <div className="text-muted-foreground text-xs">
                    {cls.content.subclasses.length} subclass
                    {cls.content.subclasses.length !== 1 ? 'es' : ''} available
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
