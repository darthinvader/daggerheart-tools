import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, User } from '@/lib/icons';
import type { HomebrewContent } from '@/lib/schemas/homebrew';
import type { HomebrewCommunity } from '@/lib/schemas/identity';
import { cn } from '@/lib/utils';

interface HomebrewCommunityCardProps {
  content: HomebrewContent;
  isSelected: boolean;
  onClick: () => void;
}

export function HomebrewCommunityCard({
  content,
  isSelected,
  onClick,
}: HomebrewCommunityCardProps) {
  // Content is already filtered to 'community' type by the parent component
  const community = content.content as unknown as HomebrewCommunity;

  return (
    <Card
      className={cn(
        'cursor-pointer transition-all hover:shadow-md',
        isSelected && 'ring-primary ring-2'
      )}
      onClick={onClick}
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
      <CardContent className="pt-0">
        {community.description && (
          <p className="text-muted-foreground line-clamp-2 text-sm">
            {community.description}
          </p>
        )}
        {community.feature && (
          <div className="mt-2 flex flex-wrap gap-1">
            <Badge variant="secondary" className="text-xs">
              {community.feature.name}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
