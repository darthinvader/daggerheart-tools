import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, User } from '@/lib/icons';
import type { HomebrewContent } from '@/lib/schemas/homebrew';
import type { HomebrewAncestry } from '@/lib/schemas/identity';
import { cn } from '@/lib/utils';

interface HomebrewAncestryCardProps {
  content: HomebrewContent;
  isSelected: boolean;
  onClick: () => void;
}

export function HomebrewAncestryCard({
  content,
  isSelected,
  onClick,
}: HomebrewAncestryCardProps) {
  // Content is already filtered to 'ancestry' type by the parent component
  const ancestry = content.content as unknown as HomebrewAncestry;

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
      <CardContent className="pt-0">
        {ancestry.description && (
          <p className="text-muted-foreground line-clamp-2 text-sm">
            {ancestry.description}
          </p>
        )}
        <div className="mt-2 flex flex-wrap gap-1">
          {ancestry.primaryFeature && (
            <Badge variant="secondary" className="text-xs">
              {ancestry.primaryFeature.name}
            </Badge>
          )}
          {ancestry.secondaryFeature && (
            <Badge variant="secondary" className="text-xs">
              {ancestry.secondaryFeature.name}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
