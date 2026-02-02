import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, User } from '@/lib/icons';
import type { HomebrewClass } from '@/lib/schemas/class-selection';
import type { HomebrewContent } from '@/lib/schemas/homebrew';
import { cn } from '@/lib/utils';

interface HomebrewClassCardProps {
  content: HomebrewContent;
  isSelected: boolean;
  onClick: () => void;
}

export function HomebrewClassCard({
  content,
  isSelected,
  onClick,
}: HomebrewClassCardProps) {
  // Content is already filtered to 'class' type by the parent component
  const gameClass = content.content as unknown as HomebrewClass;

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
          <CardTitle className="text-base">{gameClass.name}</CardTitle>
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
      <CardContent className="pt-0">
        {gameClass.description && (
          <p className="text-muted-foreground line-clamp-2 text-sm">
            {gameClass.description}
          </p>
        )}
        <div className="mt-2 flex flex-wrap gap-1">
          {gameClass.domains && gameClass.domains.length > 0 && (
            <>
              {gameClass.domains.slice(0, 2).map((domain, i) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {domain}
                </Badge>
              ))}
              {gameClass.domains.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{gameClass.domains.length - 2} more
                </Badge>
              )}
            </>
          )}
          {gameClass.subclasses && gameClass.subclasses.length > 0 && (
            <Badge variant="outline" className="text-xs">
              {gameClass.subclasses.length} subclass
              {gameClass.subclasses.length > 1 ? 'es' : ''}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
