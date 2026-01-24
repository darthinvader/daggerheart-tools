import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SmartTooltip } from '@/components/ui/smart-tooltip';
import { Theater } from '@/lib/icons';

interface SubclassCardProps {
  subclassName: string;
  description?: string;
  spellcastTrait?: string;
}

export function SubclassInfoCard({
  subclassName,
  description,
  spellcastTrait,
}: SubclassCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex min-w-0 items-center gap-2 text-sm">
          <Theater className="size-4 shrink-0" />
          <span className="truncate">Subclass: {subclassName}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {description && (
          <p className="text-muted-foreground text-sm">{description}</p>
        )}

        {spellcastTrait && (
          <div className="flex items-center gap-2">
            <SmartTooltip
              content={<p>Use {spellcastTrait} for Spellcast Rolls</p>}
            >
              <Badge variant="outline" className="cursor-help">
                ✨ Spellcast: {spellcastTrait}
              </Badge>
            </SmartTooltip>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
