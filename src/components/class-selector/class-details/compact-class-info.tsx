import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SmartTooltip } from '@/components/ui/smart-tooltip';
import {
  CLASS_BG_COLORS,
  CLASS_COLORS,
  CLASS_EMOJIS,
} from '@/lib/schemas/class-selection';
import { DOMAIN_COLORS, DOMAIN_EMOJIS } from '@/lib/schemas/loadout';
import { cn } from '@/lib/utils';

import { CollapsibleDescription } from './collapsible-description';
import type { ClassDetailsData } from './types';

interface CompactClassInfoProps {
  data: ClassDetailsData;
}

export function CompactClassInfo({ data }: CompactClassInfoProps) {
  const emoji = CLASS_EMOJIS[data.className] ?? '⚔️';
  const colorClass = CLASS_COLORS[data.className] ?? 'text-foreground';
  const bgColorClass = CLASS_BG_COLORS[data.className] ?? '';

  return (
    <Card className={cn('overflow-hidden', bgColorClass)}>
      <CardHeader className="pb-2">
        <CardTitle className="flex flex-wrap items-center gap-2 text-base">
          <span className="shrink-0 text-xl">{emoji}</span>
          <span className={cn('font-semibold', colorClass)}>
            {data.className}
          </span>
          <span className="text-muted-foreground font-normal">•</span>
          <span className="text-muted-foreground text-sm font-normal">
            {data.subclassName}
          </span>
          {data.isHomebrew && (
            <Badge variant="secondary" className="shrink-0 text-xs">
              🛠️ Homebrew
            </Badge>
          )}
        </CardTitle>

        {data.domains && data.domains.length > 0 && (
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            {data.domains.map(domain => (
              <Badge
                key={domain}
                variant="outline"
                className={cn(
                  'text-xs',
                  DOMAIN_COLORS[domain] ?? 'text-foreground'
                )}
              >
                {DOMAIN_EMOJIS[domain] ?? '📜'} {domain}
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        {data.description && (
          <CollapsibleDescription label="Class Description">
            <p className="text-muted-foreground mt-2 text-sm">
              {data.description}
            </p>
          </CollapsibleDescription>
        )}

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
          {data.spellcastTrait && (
            <SmartTooltip
              content={<p>Use {data.spellcastTrait} for Spellcast Rolls</p>}
            >
              <div className="flex cursor-help items-center gap-1.5">
                <span>✨</span>
                <span className="text-muted-foreground">Spellcast:</span>
                <span className="font-medium">{data.spellcastTrait}</span>
              </div>
            </SmartTooltip>
          )}

          {data.startingHitPoints && (
            <div className="flex items-center gap-1.5">
              <span>❤️</span>
              <span className="text-muted-foreground">HP:</span>
              <span className="font-medium">{data.startingHitPoints}</span>
            </div>
          )}

          {data.startingEvasion && (
            <div className="flex items-center gap-1.5">
              <span>🛡️</span>
              <span className="text-muted-foreground">Evasion:</span>
              <span className="font-medium">{data.startingEvasion}</span>
            </div>
          )}
        </div>

        {data.subclassDescription && (
          <CollapsibleDescription label={`🎭 ${data.subclassName} Description`}>
            <div className="bg-muted/30 mt-2 rounded-md p-2">
              <p className="text-muted-foreground text-xs">
                {data.subclassDescription}
              </p>
            </div>
          </CollapsibleDescription>
        )}
      </CardContent>
    </Card>
  );
}
